"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MessageCircle, Sparkles, Calendar } from "lucide-react";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";
import { openBookingModal } from "@/components/ServiceBookingModal";

const NAV_LINKS = [
  { name: "Founder", href: "#about" },
  { name: "Sanctuaries", href: "#services" },
  { name: "Tariffs", href: "#pricing" },
  { name: "Gallery", href: "#gallery" },
  { name: "Endorsements", href: "#testimonials" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Minimal Pill Nav */}
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-50 max-w-5xl mx-auto">
        <div
          className={`flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-[#FFF9F5]/95 backdrop-blur-xl border border-[#C9A66B]/40 shadow-[0_12px_32px_-6px_rgba(47,0,27,0.16)]"
              : "bg-[#FFF9F5]/90 backdrop-blur-md border border-[#C9A66B]/28 shadow-[0_8px_24px_-6px_rgba(47,0,27,0.1)]"
          }`}
        >
          {/* Logo & Brand Name */}
          <Link
            href="#hero"
            className="group flex items-center gap-2.5 focus:outline-none shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full overflow-hidden border border-[#C9A66B]/60 bg-black transition-transform group-hover:scale-105 shadow-xs">
              <Image
                src="/images/logo.webp"
                alt="Neelam Classic"
                width={36}
                height={36}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="font-serif text-[15px] sm:text-base font-semibold tracking-wide text-[#4A1330] group-hover:text-[#B76E79] transition-colors leading-none">
                Neelam Classic
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#7A6470] font-medium leading-none mt-1">
                Salon &amp; Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[12px] lg:text-[12.5px] font-medium tracking-[0.03em] text-[#3d2b33] hover:text-[#B76E79] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all after:duration-250"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Sleek Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* Minimal Phone Icon */}
            <a
              href={SALON_INFO.telLink}
              className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-full text-[#4A1330]/80 hover:text-[#4A1330] hover:bg-[#4A1330]/5 transition-colors"
              title={`Call ${SALON_INFO.phone}`}
              aria-label="Call salon"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
            </a>

            {/* Minimal WhatsApp Button */}
            <a
              href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/25 transition-all duration-200"
              title="Chat & book on WhatsApp"
              aria-label="Book on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Primary Booking Button */}
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-[11px] lg:text-[11.5px] font-semibold tracking-wider uppercase whitespace-nowrap shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Calendar className="w-3 h-3 text-[#C9A66B]" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Hamburger & Quick CTA */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4A1330] text-[#FFF9F5] shadow-xs"
              aria-label="Book Appointment"
              title="Book Appointment"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
            </button>

            <a
              href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-[#FFF9F5] shadow-xs"
              aria-label="Book on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-full bg-[#F8E8EC] text-[#4A1330] hover:bg-[#B76E79]/20 transition-colors focus:outline-none ml-0.5"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-sm bg-[#fef8f4] border-l border-[#C9A66B]/30 shadow-2xl p-6 flex flex-col justify-between md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header inside drawer */}
          <div className="flex items-center justify-between pb-5 border-b border-[#C9A66B]/25">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-md border border-[#C9A66B]/60 bg-black">
                <Image
                  src="/images/logo.webp"
                  alt="Neelam Classic Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="text-base font-semibold text-[#4A1330]">Neelam Classic</div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A6470]">
                  Salon &amp; Academy
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-[#F8E8EC] text-[#4A1330] hover:bg-[#B76E79]/20 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 py-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-2xl text-[15px] font-medium text-[#1d1b19] hover:bg-[#f3ede9] hover:text-[#4A1330] transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-5 border-t border-[#C9A66B]/25 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              openBookingModal();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#4A1330] text-[#FFF9F5] font-semibold text-xs tracking-wider shadow-md"
          >
            <Calendar className="w-4 h-4 text-[#C9A66B]" />
            <span>Book Appointment (Form)</span>
          </button>

          <a
            href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 text-[#FFF9F5] font-semibold text-xs tracking-wider shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
            <span>Book on WhatsApp</span>
          </a>

          <a
            href={SALON_INFO.telLink}
            onClick={handleLinkClick}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#f3ede9] text-[#4A1330] border border-[#C9A66B]/30 font-semibold text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>Call {SALON_INFO.phone}</span>
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A6470] mt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>135+ Curated Beauty Services</span>
          </div>
        </div>
      </div>
    </>
  );
}
