"use client";

import React from "react";
import Image from "next/image";
import { Phone, MapPin, ArrowUp, Calendar } from "lucide-react";
import { SALON_INFO } from "@/lib/utils";
import { openBookingModal } from "./ServiceBookingModal";

export default function Footer() {
  return (
    <footer className="bg-[#1f0012] text-[#FFF9F5] pt-16 pb-12 relative overflow-hidden border-t border-[#C9A66B]/30">
      {/* Decorative top gold hairline glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#C9A66B]/20">
          
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
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
                <span className="text-xl sm:text-2xl font-serif font-semibold text-[#FFF9F5]">
                  Neelam&apos;s Classic
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A66B] font-medium">
                  Salon &amp; Academy
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#f5f0ec]/75 leading-relaxed max-w-sm font-normal">
              The premier luxury bridal and cosmetological PMU salon in Mandideep &amp; Bhopal, offering over 135 bespoke services personally curated by Master Artist Neelam Chourasiya.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#C9A66B] pt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{SALON_INFO.address}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#f5f0ec]/75">
              <li><a href="#hero" className="hover:text-[#C9A66B] transition-colors">Home Atelier</a></li>
              <li><a href="#about" className="hover:text-[#C9A66B] transition-colors">Founder&apos;s Story</a></li>
              <li><a href="#services" className="hover:text-[#C9A66B] transition-colors">Signature Sanctuaries</a></li>
              <li><a href="#pricing" className="hover:text-[#C9A66B] transition-colors">Haute Tariffs</a></li>
              <li><a href="#gallery" className="hover:text-[#C9A66B] transition-colors">Curated Gallery</a></li>
              <li><a href="#testimonials" className="hover:text-[#C9A66B] transition-colors">Patron Endorsements</a></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Our Specialties
            </h4>
            <ul className="space-y-2 text-xs text-[#f5f0ec]/75">
              <li>Signature HD Bridal</li>
              <li>Airbrush Makeup</li>
              <li>Ombre Powder Brows</li>
              <li>Nanoplastia Hair Therapy</li>
              <li>Clinical Hydra-Facials</li>
              <li>Masterclass Mentorship</li>
            </ul>
          </div>

          {/* Concierge Column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-4">
              Concierge
            </h4>
            <p className="text-xs text-[#f5f0ec]/75">
              Open Daily: 10:00 AM – 08:30 PM<br />
              Prior appointment recommended.
            </p>

            <a
              href={SALON_INFO.telLink}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFF9F5] hover:text-[#C9A66B] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>+91 {SALON_INFO.phone}</span>
            </a>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#a85f6a] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md cursor-pointer"
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
