"use client";

import React from "react";
import Image from "next/image";
import { Phone, MapPin, ArrowUp, Calendar, MessageCircle } from "lucide-react";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";
import { openBookingModal } from "./ServiceBookingModal";

const SPECIALTIES = [
  {
    label: "Signature HD Bridal",
    serviceName: "Signature HD Bridal Makeup",
    price: "₹15,000",
    category: "Bridal Makeup",
  },
  {
    label: "Airbrush Makeup",
    serviceName: "Airbrush Bridal Artistry",
    price: "₹18,000",
    category: "Bridal Makeup",
  },
  {
    label: "Ombre Powder Brows",
    serviceName: "Ombre Powder Eyebrows",
    price: "₹10,000",
    category: "PMU",
  },
  {
    label: "Nanoplastia Hair Therapy",
    serviceName: "Nanoplastia Repair Treatment",
    price: "₹6,000",
    category: "Hair Care",
  },
  {
    label: "Clinical Hydra-Facials",
    serviceName: "Hydra-Facial Resurfacing & Derma Glow",
    price: "₹3,500",
    category: "Skin Care",
  },
  {
    label: "Masterclass Mentorship",
    serviceName: "Masterclass Mentorship & PMU Diploma",
    price: "Admissions Open",
    category: "Academy",
  },
];

export default function Footer() {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#1f0012] text-[#FFF9F5] pt-16 pb-12 relative overflow-hidden border-t border-[#C9A66B]/30">
      {/* Decorative top gold hairline glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#C9A66B]/20">
          
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="#hero"
              className="inline-flex items-center gap-3.5 group cursor-pointer focus:outline-none"
              title="Neelam's Classic Salon & Academy"
            >
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-lg border-[1.5px] border-[#C9A66B] bg-black group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/logo.png"
                  alt="Neelam Classic Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl sm:text-2xl font-serif font-semibold text-[#FFF9F5] group-hover:text-[#C9A66B] transition-colors">
                  Neelam&apos;s Classic
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A66B] font-medium">
                  Salon &amp; Academy
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-[13px] text-[#f5f0ec]/75 leading-relaxed max-w-sm font-normal">
              The premier luxury bridal and cosmetological PMU salon in Mandideep &amp; Bhopal, offering over 135 bespoke services personally curated by Master Artist Neelam Chourasiya.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Neelam+Classic+Salon+Ground+Floor+Main+Market+Mandideep+Bhopal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#C9A66B] hover:text-[#FFF9F5] transition-colors pt-1 group"
              title="Open Location in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform text-[#C9A66B]" />
              <span className="underline decoration-[#C9A66B]/40 hover:decoration-[#FFF9F5] underline-offset-2">
                {SALON_INFO.address}
              </span>
            </a>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#f5f0ec]/75">
              <li>
                <a
                  href="#hero"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Home Atelier</span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Founder&apos;s Story</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Signature Sanctuaries</span>
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Haute Tariffs</span>
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Curated Gallery</span>
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-[#C9A66B] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#C9A66B]/40 group-hover:bg-[#C9A66B] transition-colors" />
                  <span>Patron Endorsements</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Specialties Column with Working Booking Links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Our Specialties
            </h4>
            <ul className="space-y-2 text-xs text-[#f5f0ec]/75">
              {SPECIALTIES.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      openBookingModal({
                        serviceName: item.serviceName,
                        servicePrice: item.price,
                        categoryName: item.category,
                      })
                    }
                    className="w-full text-left hover:text-[#C9A66B] transition-colors cursor-pointer flex items-center justify-between group py-1"
                    title={`Book ${item.label}`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#C9A66B] opacity-0 group-hover:opacity-100 transition-opacity font-mono font-medium">
                      Book →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge Column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Concierge
            </h4>
            <p className="text-xs text-[#f5f0ec]/75 leading-relaxed">
              Open Daily: 10:00 AM – 08:30 PM<br />
              Prior appointment recommended.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={SALON_INFO.telLink}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FFF9F5] hover:text-[#C9A66B] transition-colors"
                title={`Call ${SALON_INFO.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                <span>+91 {SALON_INFO.phone}</span>
              </a>

              <div>
                <a
                  href={getWhatsAppUrl("Hi Neelam Classic Atelier, I would like to book a concierge consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="WhatsApp Concierge"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#a85f6a] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>BOOK DIRECT VISIT</span>
              </button>
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
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-1.5 text-[#C9A66B] hover:text-[#FFF9F5] transition-colors cursor-pointer"
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
