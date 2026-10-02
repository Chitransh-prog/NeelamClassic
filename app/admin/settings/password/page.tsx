"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

export default function ForcePasswordChangePage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const hasMinLen = newPassword.length >= 10;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLen && hasNumber && hasSymbol && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("A network error occurred while updating your password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center relative w-16 h-16 rounded-full overflow-hidden shadow-xl mb-4 border-2 border-[#C9A66B] bg-black">
            <Image
              src="/images/logo-icon.png"
              alt="Neelam Classic Monogram"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#4A1330]">
            Update Your Password
          </h1>
          <p className="text-sm text-[#7A6470] mt-1 max-w-md mx-auto">
            For initial account security, you must set a strong new password before accessing the admin dashboard.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-[#F8E8EC] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-[#4A1330]/5">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6470]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter initial seeded password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 text-sm text-[#2B1B24] placeholder-[#7A6470]/60 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] uppercase tracking-wider mb-2">
                New Strong Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6470]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 10 chars, 1 number, 1 symbol"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 text-sm text-[#2B1B24] placeholder-[#7A6470]/60 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6470]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 text-sm text-[#2B1B24] placeholder-[#7A6470]/60 outline-none transition"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-2 text-xs">
              <div className="font-semibold text-[#2B1B24] mb-1">Password Requirements:</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLen ? "text-emerald-600" : "text-[#7A6470]/40"}`} />
                <span className={hasMinLen ? "text-emerald-700 font-medium" : "text-[#7A6470]"}>
                  At least 10 characters in length
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? "text-emerald-600" : "text-[#7A6470]/40"}`} />
                <span className={hasNumber ? "text-emerald-700 font-medium" : "text-[#7A6470]"}>
                  At least one number (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasSymbol ? "text-emerald-600" : "text-[#7A6470]/40"}`} />
                <span className={hasSymbol ? "text-emerald-700 font-medium" : "text-[#7A6470]"}>
                  At least one symbol (!@#$%^&amp;*)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${passwordsMatch ? "text-emerald-600" : "text-[#7A6470]/40"}`} />
                <span className={passwordsMatch ? "text-emerald-700 font-medium" : "text-[#7A6470]"}>
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-[#FFF9F5] bg-gradient-to-r from-[#4A1330] to-[#2F001B] hover:opacity-95 transition shadow-lg shadow-[#4A1330]/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save Password &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
