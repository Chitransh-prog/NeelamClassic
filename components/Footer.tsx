import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Sparkles, ArrowUp } from "lucide-react";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";

const FOOTER_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "Services (135+)", href: "#services" },
  { name: "Makeup Price List", href: "#makeup" },
  { name: "Academy Courses", href: "#academy" },
  { name: "Portfolio Gallery", href: "#gallery" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact & Bookings", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2F001B] text-[#FFF9F5] pt-16 pb-12 relative overflow-hidden border-t border-[#C9A66B]/35">
      {/* Decorative top gold hairline glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C9A66B]/20">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-lg border-[1.5px] border-[#C9A66B] bg-black">
                <Image
                  src="/images/logo.png"
                  alt="Neelam Classic Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-[#FFF9F5]">
                    {SALON_INFO.shortName}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A66B] font-medium">
                  Salon &amp; Academy
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[14px] text-[#f5f0ec]/75 leading-relaxed max-w-sm font-normal">
              Premier destination for luxury bridal artistry, certified permanent makeup (PMU), advanced hair &amp; skin therapies, and professional beauty masterclasses founded by {SALON_INFO.owner}.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9F5]/10 border border-[#C9A66B]/35 text-xs text-[#C9A66B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>135+ Curated Beauty Services</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-[13px]">
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#f5f0ec]/75 hover:text-[#C9A66B] transition-colors py-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpline Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Studio Helpline
            </h4>
            <p className="text-xs text-[#f5f0ec]/75">
              Available 7 days a week for bookings &amp; consultations:
            </p>

            <a
              href={SALON_INFO.telLink}
              className="inline-flex items-center gap-2.5 text-lg font-bold text-[#FFF9F5] hover:text-[#C9A66B] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C9A66B]" />
              <span>{SALON_INFO.phone}</span>
            </a>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Hi Neelam Classic Salon & Academy, I would like to make an enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f5f0ec]/60">
          <div>
            &copy; {new Date().getFullYear()} Neelam Classic Salon and Academy. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#hero"
              className="inline-flex items-center gap-1.5 text-[#C9A66B] hover:text-[#FFF9F5] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
