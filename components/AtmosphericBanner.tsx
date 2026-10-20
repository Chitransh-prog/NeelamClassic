"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import SafeImage from "./SafeImage";
import { getWhatsAppUrl } from "@/lib/utils";
import { openBookingModal } from "./ServiceBookingModal";

export default function AtmosphericBanner() {
  return (
    <section id="atelier" className="relative py-20 sm:py-28 bg-[#2F001B] text-[#FFF9F5] overflow-hidden border-y border-[#C9A66B]/35">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A1330]/60 via-[#2F001B] to-[#1a000f] pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-[600px] h-[350px] bg-[#C9A66B]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#B76E79]/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Architectural Arch Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* Outer Vanity Arch Frame */}
              <div className="relative vanity-arch p-2.5 bg-[#4A1330]/90 border-[1.5px] border-[#C9A66B] shadow-[0_24px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="relative aspect-[4/5] w-full vanity-arch overflow-hidden bg-[#370c22]">
                  <SafeImage
                    src="/images/bridal-arch.webp"
                    alt="Royal Bridal Transformation"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating button at bottom of image arch */}
                <div className="absolute bottom-5 left-5 right-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      openBookingModal({
                        serviceName: "Signature HD Bridal Makeup",
                        servicePrice: "₹15,000",
                      })
                    }
                    className="w-full py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[#FFF9F5] border border-[#C9A66B]/60 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Explore Bridal Suite
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Details & Options */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#370c22]/80 border border-[#C9A66B]/40 text-[#C9A66B] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
              <span>SIGNATURE BRIDAL ATELIER</span>
            </div>

            {/* Headline */}
            <h2 className="text-[30px] sm:text-[42px] md:text-[46px] font-serif font-semibold text-[#FFF9F5] leading-[1.18] tracking-normal sm:tracking-[-0.01em]">
              A Sacred Transformation,{" "}
              <span className="italic font-normal text-[#C9A66B]">Tailored to Your Heritage.</span>
            </h2>

            {/* Description */}
            <p className="text-[14px] sm:text-[16px] text-[#f5f0ec]/80 leading-relaxed font-normal">
              From royal traditional lehengas to contemporary reception ensembles, our bridal transformations honour centuries of Indian craftsmanship with modern cosmetological precision. Every detail is personally curated by Neelam Chourasiya.
            </p>

            {/* Two Cards: At Studio vs At Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/5 border border-[#C9A66B]/30 space-y-1.5 hover:border-[#C9A66B]/60 transition-colors">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-[#C9A66B]">
                  At Studio
                </div>
                <div className="text-base font-serif font-semibold text-[#FFF9F5]">
                  Private Bridal Suite
                </div>
                <p className="text-xs text-[#f5f0ec]/75 leading-relaxed">
                  Intimate climate-controlled sanctuary with customized lighting, vanity mirroring, and calming bridal refreshments.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-[#C9A66B]/30 space-y-1.5 hover:border-[#C9A66B]/60 transition-colors">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-[#C9A66B]">
                  At Destination
                </div>
                <div className="text-base font-serif font-semibold text-[#FFF9F5]">
                  On-Location Concierge
                </div>
                <p className="text-xs text-[#f5f0ec]/75 leading-relaxed">
                  Master artists on-site at your palace, heritage hotel, or resort across Madhya Pradesh and India.
                </p>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={() =>
                  openBookingModal({
                    serviceName: "Signature HD Bridal Makeup",
                    servicePrice: "₹15,000",
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#a85f6a] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>BOOK BRIDAL SUITE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={getWhatsAppUrl("Hi Neelam Classic, I would like to book the Signature Bridal Suite.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-transparent border border-[#C9A66B] hover:bg-white/10 text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WHATSAPP DIRECTLY</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
