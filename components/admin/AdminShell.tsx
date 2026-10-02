"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Palette,
  Sparkles,
  Images,
  MessageSquareQuote,
  GraduationCap,
  Inbox,
  Receipt,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface AdminShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings & Schedule", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Edit Website", href: "/admin/editor", icon: Palette, highlight: true },
  { label: "Services & Prices", href: "/admin/services", icon: Sparkles },
  { label: "Gallery & Media", href: "/admin/gallery", icon: Images },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Academy Courses", href: "/admin/courses", icon: GraduationCap },
  { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Skip shell on standalone auth pages
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/settings/password";

  useEffect(() => {
    // Check if there are draft changes to publish
    const checkDraftStatus = async () => {
      try {
        const res = await fetch("/api/admin/content/status");
        if (res.ok) {
          const data = await res.json();
          setHasUnsavedChanges(Boolean(data.hasUnpublishedChanges));
        }
      } catch {
        // ignore background status check error
      }
    };

    if (!isAuthPage) {
      checkDraftStatus();
    }
  }, [pathname, isAuthPage]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
      toast.success("Logged out successfully");
    } catch {
      router.push("/admin/login");
    }
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/content/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }
      setHasUnsavedChanges(false);
      toast.success("Published live! Website refreshed via ISR.", {
        icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish";
      toast.error(message, {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2B1B24] flex font-sans antialiased selection:bg-[#B76E79]/20 selection:text-[#4A1330]">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-[#4A1330] via-[#3d0f27] to-[#2F001B] text-[#FFF9F5] shrink-0 fixed inset-y-0 left-0 z-30 shadow-xl border-r border-[#B76E79]/20">
        {/* Salon Logo Branding */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden shadow-md border border-[#C9A66B]/60 bg-black transition-transform group-hover:scale-105">
              <Image
                src="/images/logo-icon.png"
                alt="Neelam Classic Monogram"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-[#FFF9F5] group-hover:text-[#C9A66B] transition-colors">
                Neelam Classic
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#C9A66B] font-medium">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition group ${
                  isActive
                    ? "bg-[#FFF9F5] text-[#4A1330] shadow-md shadow-black/10 font-semibold"
                    : "text-[#f5e6eb]/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive
                        ? "text-[#4A1330]"
                        : item.highlight
                        ? "text-[#C9A66B]"
                        : "text-[#B76E79] group-hover:text-[#FFF9F5]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-200 hover:bg-red-500/20 hover:text-white transition"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#F8E8EC] h-16 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          {/* Mobile brand & hamburger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-[#4A1330] hover:bg-[#F8E8EC] transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden border border-[#C9A66B]/60 bg-black">
                <Image
                  src="/images/logo-icon.png"
                  alt="Neelam Classic Logo"
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-semibold text-sm text-[#4A1330]">
                Neelam Classic
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6470]">
              Salon Operations
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F8E8EC] bg-[#FFF9F5] text-xs font-medium text-[#4A1330] hover:bg-[#F8E8EC] transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="hidden sm:inline">View live site</span>
            </a>

            {/* Publish Changes button with unsaved indicator */}
            <button
              onClick={handlePublishAll}
              disabled={isPublishing}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition shadow-sm ${
                hasUnsavedChanges
                  ? "bg-gradient-to-r from-amber-600 to-[#B76E79] text-white hover:opacity-95 shadow-amber-600/20"
                  : "bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] hover:opacity-90 shadow-[#4A1330]/20"
              } disabled:opacity-50`}
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{hasUnsavedChanges ? "Publish Changes *" : "Publish Live"}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>

      {/* 3. Mobile Hamburger Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#4A1330] text-[#FFF9F5] flex flex-col h-full z-10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border border-[#C9A66B]/60 bg-black">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Neelam Classic Logo"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-semibold text-xs tracking-tight text-white">Neelam Classic</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#C9A66B]">Admin Menu</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? "bg-[#FFF9F5] text-[#4A1330] font-semibold"
                        : "text-[#f5e6eb]/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#B76E79]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-200 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 text-red-300" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F8E8EC] z-30 flex items-center justify-around h-16 px-2 shadow-lg shadow-black/5">
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition ${
            pathname === "/admin" ? "text-[#4A1330] font-bold" : "text-[#7A6470]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/admin/editor"
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition ${
            pathname.startsWith("/admin/editor")
              ? "text-[#4A1330] font-bold"
              : "text-[#7A6470]"
          }`}
        >
          <Palette className="w-5 h-5 mb-0.5" />
          <span>Editor</span>
        </Link>

        <Link
          href="/admin/invoices"
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition ${
            pathname.startsWith("/admin/invoices")
              ? "text-[#4A1330] font-bold"
              : "text-[#7A6470]"
          }`}
        >
          <Receipt className="w-5 h-5 mb-0.5" />
          <span>Invoices</span>
        </Link>

        <Link
          href="/admin/enquiries"
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition ${
            pathname.startsWith("/admin/enquiries")
              ? "text-[#4A1330] font-bold"
              : "text-[#7A6470]"
          }`}
        >
          <Inbox className="w-5 h-5 mb-0.5" />
          <span>Enquiries</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-[#7A6470] hover:text-[#4A1330]"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
