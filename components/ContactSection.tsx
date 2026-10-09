"use client";

import React from "react";
import { MessageCircle, Calendar, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { openBookingModal } from "./ServiceBookingModal";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#fef8f4] relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#B76E79]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#C9A66B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Reservation Plum Curved Card */}
        <div className="rounded-[36px] bg-[#2F001B] text-[#FFF9F5] border border-[#C9A66B]/40 p-8 sm:p-12 lg:p-14 shadow-[0_24px_50px_-10px_rgba(47,0,27,0.4)] flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#370c22] border border-[#C9A66B]/40 text-[#C9A66B] text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#C9A66B]" />
              <span>RESERVE YOUR APPOINTMENT TODAY</span>
            </div>

            <h2 className="text-[28px] sm:text-[38px] md:text-[44px] font-serif font-semibold text-[#FFF9F5] leading-[1.18] tracking-normal sm:tracking-[-0.01em]">
              Book Your Haute Experience
            </h2>

            <p className="text-xs sm:text-[15px] text-[#f5f0ec]/80 leading-relaxed font-normal max-w-xl">
              Whether in our private bridal salon sanctuary or at your destination wedding venue, our master team is ready to curate your transformation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0 justify-center">
            <a
              href={getWhatsAppUrl("Hi Neelam Classic Salon & Academy, I would like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-[#FFF9F5] text-xs sm:text-sm font-semibold tracking-wider shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
              <span>BOOK ON WHATSAPP</span>
            </a>

            <button
              type="button"
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-[#FFF9F5] border border-[#C9A66B]/70 text-xs sm:text-sm font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C9A66B]" />
              <span>BOOK AN APPOINTMENT</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
