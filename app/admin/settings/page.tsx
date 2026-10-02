"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Phone,
  MessageCircle,
  Clock,
  Globe,
  Receipt,
  ShieldCheck,
  Save,
  Lock,
  Mail,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"business" | "invoice" | "security">("business");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Business settings
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hours, setHours] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  // Invoice settings
  const [terms, setTerms] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const [prefix, setPrefix] = useState("NCS");
  const [nextNumber, setNextNumber] = useState("1");
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate, setGstRate] = useState("18");
  const [gstin, setGstin] = useState("");

  // Account security
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, meRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/auth/me"),
        ]);

        if (settingsRes.ok) {
          const { settings } = await settingsRes.json();
          setPhone(settings.business_phone || "9826747023");
          setWhatsapp(settings.business_whatsapp || "9826747023");
          setHours(settings.business_hours || "Mon - Sun: 10:00 AM - 08:30 PM");
          setInstagram(settings.instagram_url || "");
          setFacebook(settings.facebook_url || "");
          setTerms(settings.invoice_terms || "");
          setFooterNote(settings.invoice_footer_note || "");
          setPrefix(settings.invoice_prefix || "NCS");
          setNextNumber(settings.invoice_next_number || "1");
          setGstEnabled(settings.gst_enabled === "true");
          setGstRate(settings.gst_rate || "18");
          setGstin(settings.gstin || "");
        }

        if (meRes.ok) {
          const { user } = await meRes.json();
          if (user) setAdminEmail(user.email);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_phone: phone,
          business_whatsapp: whatsapp,
          business_hours: hours,
          instagram_url: instagram,
          facebook_url: facebook,
          invoice_terms: terms,
          invoice_footer_note: footerNote,
          invoice_prefix: prefix,
          invoice_next_number: nextNumber,
          gst_enabled: String(gstEnabled),
          gst_rate: gstRate,
          gstin,
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!adminEmail) return;
    try {
      const res = await fetch("/api/admin/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success("Admin email updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating email");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Password change failed");
    }
  };

  const handleSignOutAll = async () => {
    if (!confirm("Sign out of all other active browser sessions?")) return;
    try {
      const res = await fetch("/api/admin/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign_out_all_devices" }),
      });
      if (res.ok) toast.success("Signed out of all other sessions");
    } catch {
      toast.error("Action failed");
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-xs text-[#7A6470]">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
          Salon Settings &amp; Configuration
        </h1>
        <p className="text-xs text-[#7A6470] mt-1">
          Configure business communication channels, invoice rules &amp; GST, and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F8E8EC] pb-2">
        <button
          onClick={() => setActiveTab("business")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "business"
              ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm"
              : "text-[#7A6470] hover:text-[#4A1330] hover:bg-white"
          }`}
        >
          Business Information
        </button>
        <button
          onClick={() => setActiveTab("invoice")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "invoice"
              ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm"
              : "text-[#7A6470] hover:text-[#4A1330] hover:bg-white"
          }`}
        >
          Invoice &amp; Billing
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "security"
              ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm"
              : "text-[#7A6470] hover:text-[#4A1330] hover:bg-white"
          }`}
        >
          Account &amp; Security
        </button>
      </div>

      {/* Tab: Business Info */}
      {activeTab === "business" && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-sm space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470] mb-2">
            Direct Contact &amp; Hours (Strictly No Maps or Addresses)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Calling Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                WhatsApp Booking Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
              Operating Hours &amp; Schedule
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330] hover:opacity-90 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Business Info"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Invoice & Billing */}
      {activeTab === "invoice" && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-sm space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470] mb-2">
            Invoice Numbering &amp; GST Configuration
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Invoice Prefix
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
              <span className="text-[10px] text-[#7A6470]">Formats as: NCS-2026-0001</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Next Sequence Number
              </label>
              <input
                type="number"
                value={nextNumber}
                onChange={(e) => setNextNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
            </div>
          </div>

          {/* GST Toggle */}
          <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#4A1330]">GST Tax Calculation</div>
                <div className="text-[11px] text-[#7A6470]">Enable GST calculation on invoices (Default: OFF)</div>
              </div>
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={(e) => setGstEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#4A1330]"
              />
            </div>

            {gstEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#F8E8EC] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Salon GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="e.g. 23AAAAA0000A1Z5"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#F8E8EC] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
              Standard Terms &amp; Conditions (Printed on PDF)
            </label>
            <textarea
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none leading-relaxed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
              Invoice Thank-You Note (Printed at Footer)
            </label>
            <input
              type="text"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330] hover:opacity-90 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Invoice Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Email Form */}
          <div className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-sm space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470]">
              Admin Account Email
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
              />
              <button
                type="button"
                onClick={handleUpdateEmail}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330] hover:opacity-90 transition"
              >
                Update Email
              </button>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-sm space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470]">
              Change Password
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  New Password (min 10 chars, 1 num, 1 sym)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330] hover:opacity-90 transition"
              >
                Save New Password
              </button>
            </div>
          </form>

          {/* Session Management */}
          <div className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#4A1330]">Session Management</div>
              <div className="text-[11px] text-[#7A6470] mt-0.5">
                Revoke all active tokens across mobile and other devices immediately.
              </div>
            </div>
            <button
              onClick={handleSignOutAll}
              className="px-4 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
            >
              Sign out all devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
