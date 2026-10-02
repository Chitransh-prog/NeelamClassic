import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  const adapter = new PrismaNeon({ connectionString });
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  return client;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

/**
 * Retries a database operation up to 2 times with a short backoff.
 * Useful for handling Neon scale-to-zero cold-starts seamlessly.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  backoffMs = 500
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error: unknown) {
      attempt++;
      if (attempt > retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
    }
  }
  throw new Error("Database operation failed after retries");
}

export default prisma;
