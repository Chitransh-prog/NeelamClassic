import { prisma, withDbRetry } from "./prisma";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): Promise<RateLimitResult> {
  const now = new Date();

  return await withDbRetry(async () => {
    const existing = await prisma.rateLimit.findUnique({
      where: { key },
    });

    if (!existing || existing.resetAt < now) {
      // Create or reset record
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { key },
        update: {
          attempts: 1,
          resetAt,
        },
        create: {
          key,
          attempts: 1,
          resetAt,
        },
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (existing.attempts >= maxAttempts) {
      const retryAfterSeconds = Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(retryAfterSeconds, 1),
      };
    }

    await prisma.rateLimit.update({
      where: { key },
      data: {
        attempts: { increment: 1 },
      },
    });

    return {
      allowed: true,
      remaining: maxAttempts - (existing.attempts + 1),
    };
  });
}

export async function resetRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimit.delete({
      where: { key },
    });
  } catch {
    // Record might not exist, ignore
  }
}
