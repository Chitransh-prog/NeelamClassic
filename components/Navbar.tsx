"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MessageCircle, Sparkles } from "lucide-react";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "Makeup", href: "#makeup" },
  { name: "Academy", href: "#academy" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
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
      {/* Floating Pill Nav suspended 24px from top */}
      <header className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 z-50 max-w-6xl mx-auto">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-[#fef8f4]/95 backdrop-blur-xl border border-[#C9A66B]/45 shadow-[0_16px_36px_-8px_rgba(74,19,48,0.18)]"
              : "bg-[#fef8f4]/90 backdrop-blur-md border border-[#C9A66B]/30 shadow-[0_10px_28px_-6px_rgba(74,19,48,0.1)]"
          }`}
        >
          {/* Logo & Brand Name */}
          <Link
            href="#hero"
            className="group flex items-center gap-2.5 sm:gap-3 focus:outline-none rounded-full p-0.5"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden shadow-sm border border-[#C9A66B]/60 bg-black transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Neelam Classic Monogram"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-semibold tracking-tight text-[#4A1330] group-hover:text-[#B76E79] transition-colors leading-none">
                  Neelam Classic
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase text-[#7A6470] mt-0.5">
                Salon &amp; Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-medium tracking-[0.02em] text-[#1d1b19] hover:text-[#B76E79] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all after:duration-250"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Phone & Rose-Gold Book Now Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={SALON_INFO.telLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A1330] hover:text-[#B76E79] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>{SALON_INFO.phone}</span>
            </a>

            <a
              href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#B76E79] text-[#FFF9F5] text-xs font-semibold tracking-[0.08em] shadow-[0_8px_20px_-4px_rgba(183,110,121,0.4)] hover:bg-[#a55e69] hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile Hamburger & Quick CTA */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-[#B76E79] text-[#FFF9F5] text-xs shadow-sm"
              aria-label="Book on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-[#F8E8EC] text-[#4A1330] hover:bg-[#B76E79]/20 transition-colors focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                  src="/images/logo.png"
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
          <a
            href={getWhatsAppUrl("Hi Neelam Classic, I'd like to book an appointment.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#B76E79] text-[#FFF9F5] font-semibold text-xs tracking-wider shadow-md"
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
