"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Sparkles, Star, ChevronDown, Calendar } from "lucide-react";
import SafeImage from "./SafeImage";
import { getWhatsAppUrl } from "@/lib/utils";
import { openBookingModal } from "./ServiceBookingModal";

import { SiteSectionsData } from "@/lib/content";

export default function Hero({ content }: { content?: Partial<SiteSectionsData["hero"]> }) {
  const badge = content?.badge || "BESPOKE BRIDAL MAKEUP & ADVANCED PMU CLINIC";
  const titleLine1 = content?.titleLine1 || "The Architecture of";
  const titleHighlight = content?.titleHighlight || "Radiant Grace.";
  const description =
    content?.description ||
    "The definitive sanctuary of elevated bridal couture, micro-pigmentation artistry (PMU), and precision cosmetological hair trichology. Every distinguishing ritual is curated directly by Master Neelam Chourasiya.";
  const primaryBtnText = content?.primaryBtnText || "Book an Appointment";
  const secondaryBtnText = content?.secondaryBtnText || "Book with WA";
  const heroImage = content?.image || "/images/hero-bride.jpg";
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-b from-[#2F001B] via-[#3a0823] to-[#2F001B] text-[#FFF9F5]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[350px] bg-[#B76E79]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[400px] bg-[#C9A66B]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Editorial Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Editorial Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A1330] border border-[#C9A66B]/40 text-[#C9A66B] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
              <span>{badge}</span>
            </div>

            {/* Display Headline with elegant Playfair serif accent */}
            <h1 className="text-[38px] sm:text-[54px] md:text-[64px] lg:text-[70px] font-serif font-medium tracking-normal sm:tracking-[-0.01em] leading-[1.12] text-[#FFF9F5] mb-6">
              {titleLine1}{" "}
              <span className="font-serif italic font-normal bg-gradient-to-r from-[#B76E79] via-[#f5d0a9] to-[#C9A66B] bg-clip-text text-transparent block sm:inline">
                {titleHighlight}
              </span>
            </h1>

            {/* Body Editorial */}
            <p className="text-[15px] sm:text-[17px] text-[#f5f0ec]/85 max-w-xl mb-10 leading-[1.75] font-normal">
              {description}
            </p>

            {/* Action Buttons: Book with Form & WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="btn-rose-gold w-full sm:w-auto inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C9A66B]" />
                <span>{primaryBtnText}</span>
              </button>

              <a
                href={getWhatsAppUrl("Hi Neelam Classic Salon, I would like to book an appointment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-champagne-outline w-full sm:w-auto inline-flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{secondaryBtnText}</span>
              </a>
            </div>

            {/* Micro Trust Assurance */}
            <div className="mt-8 flex items-center gap-3 text-xs text-[#f5f0ec]/60">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Prior booking recommended • 100% Medical-grade hygiene protocols</span>
            </div>
          </motion.div>

          {/* Right Column: Architectural Vanity Arch Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[420px]">
              
              {/* Rose Gold Halo ambient glow */}
              <div className="absolute -inset-4 rounded-t-[220px] rounded-b-[32px] bg-gradient-to-tr from-[#B76E79]/30 via-[#C9A66B]/25 to-transparent blur-xl pointer-events-none" />

              {/* Outer Vanity Arch Frame */}
              <div className="relative vanity-arch p-2.5 bg-[#4A1330]/90 border-[1.5px] border-[#C9A66B] shadow-[0_24px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="relative aspect-[4/5] w-full vanity-arch overflow-hidden bg-[#370c22]">
                  <SafeImage
                    src={heroImage}
                    alt="Royal Bridal Makeup by Neelam Classic Salon"
                    placeholderTitle="Royal Bridal Glamour"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover"
                  />
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 sm:p-4 rounded-2xl bg-[#2F001B]/95 backdrop-blur-md border border-[#C9A66B]/40 shadow-xl flex items-center gap-3.5">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#C9A66B]/70 shadow-md bg-black">
                    <Image
                      src="/images/logo.png"
                      alt="Neelam Classic Emblem"
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-[#FFF9F5] uppercase tracking-wider">
                      Master Neelam Chourasiya
                    </h4>
                    <p className="text-[11px] text-[#C9A66B]">
                      Founder &amp; Bridal Maestro
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[#C9A66B]/25 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-serif font-semibold text-[#FFF9F5] tracking-normal">
              15+
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#C9A66B] mt-1 font-medium">
              Years of Master Mastery
            </div>
          </div>

          <div className="flex flex-col items-center sm:border-x border-[#C9A66B]/25 px-4">
            <div className="text-3xl sm:text-4xl font-serif font-semibold text-[#FFF9F5] tracking-normal flex items-center gap-1.5">
              4.9 <Star className="w-5 h-5 fill-[#C9A66B] text-[#C9A66B]" />
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#C9A66B] mt-1 font-medium">
              500+ Patron Reviews
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-serif font-semibold text-[#FFF9F5] tracking-normal">
              135+
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#C9A66B] mt-1 font-medium">
              Architectural Rituals
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 flex flex-col items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C9A66B]/80">
          <span>Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-[#C9A66B] animate-bounce" />
        </div>

      </div>
    </section>
  );
}
