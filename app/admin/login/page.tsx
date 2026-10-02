"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles, ShieldCheck } from "lucide-react";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (data.mustChangePassword) {
        router.push("/admin/settings/password");
      } else {
        router.push(redirectTarget);
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      {/* Soft background ambient gradients */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-[#B76E79]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A66B]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Salon Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center relative w-20 h-20 rounded-full overflow-hidden shadow-2xl mb-4 border-2 border-[#C9A66B] bg-black">
            <Image
              src="/images/logo-icon.png"
              alt="Neelam Classic Monogram"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#4A1330]">
            Neelam Classic
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B76E79] font-medium mt-1">
            Salon &amp; Academy Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#F8E8EC] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-[#4A1330]/5">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#F8E8EC]">
            <ShieldCheck className="w-5 h-5 text-[#B76E79]" />
            <span className="text-sm font-medium text-[#2B1B24]">
              Secure Administrative Access
            </span>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#2B1B24] uppercase tracking-wider mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6470]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neelamclassicsalon.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 text-sm text-[#2B1B24] placeholder-[#7A6470]/60 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#2B1B24] uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6470]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 text-sm text-[#2B1B24] placeholder-[#7A6470]/60 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A6470] hover:text-[#4A1330] transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-medium text-sm text-[#FFF9F5] bg-gradient-to-r from-[#4A1330] via-[#5c183d] to-[#4A1330] hover:opacity-95 active:scale-[0.99] transition shadow-lg shadow-[#4A1330]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-[#7A6470] mt-6">
          Protected by encrypted JWT sessions and distributed rate-limiting.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center text-xs text-[#7A6470]">
          Loading admin portal...
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
