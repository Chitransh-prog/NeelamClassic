"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Check, Phone, Sparkles, ChevronDown } from "lucide-react";
import { getWhatsAppUrl, SALON_INFO } from "@/lib/utils";
import { openBookingModal } from "@/components/ServiceBookingModal";

interface TariffItem {
  name: string;
  price: string;
  priceNum: number;
  description: string;
}

interface TariffGroup {
  id: string;
  title: string;
  tag: string;
  items: TariffItem[];
}

const TARIFF_GROUPS: TariffGroup[] = [
  {
    id: "bridal",
    title: "ROYAL BRIDAL TRANSFORMATION",
    tag: "SIGNATURE SUITE",
    items: [
      {
        name: "Signature HD Bridal Makeup",
        price: "₹15,000",
        priceNum: 15000,
        description: "Micro-pigment base, luxury lashes, customized draping, and 12-hour couture setting.",
      },
      {
        name: "Airbrush Bridal Artistry",
        price: "₹18,000",
        priceNum: 18000,
        description: "Silicone-based micro-atomized finish for flawless high-definition cameras & studio lighting.",
      },
      {
        name: "Engagement / Reception Glamour",
        price: "₹8,000",
        priceNum: 8000,
        description: "Elevated couture styling, modern hair artistry, and skin radiance base.",
      },
      {
        name: "Pre-Bridal Glow Package (4 Sessions)",
        price: "₹12,000",
        priceNum: 12000,
        description: "Full body polishing, derma hydra-facials, and skin brightening therapies.",
      },
    ],
  },
  {
    id: "pmu",
    title: "PERMANENT MAKEUP PROTOCOLS",
    tag: "CLINICAL GRADE",
    items: [
      {
        name: "Ombre Powder Eyebrows",
        price: "₹10,000",
        priceNum: 10000,
        description: "Micro-pixel shading for soft, defined brows lasting 2-3 years with organic pigments.",
      },
      {
        name: "Microblading Feather Brows",
        price: "₹12,000",
        priceNum: 12000,
        description: "Ultra-fine medical-grade nano strokes mimicking natural brow hair patterns.",
      },
      {
        name: "Permanent Lip Blush & Neutralization",
        price: "₹8,000",
        priceNum: 8000,
        description: "Tone-correcting botanical pigment wash for youthful, naturally tinted, hydrated lips.",
      },
    ],
  },
  {
    id: "hair",
    title: "ADVANCED HAIR TRICHOLOGY",
    tag: "SALON EXCLUSIVE",
    items: [
      {
        name: "Nanoplastia Repair Treatment",
        price: "₹6,000",
        priceNum: 6000,
        description: "Formaldehyde-free organic amino acid restructuring and intense mirror gloss.",
      },
      {
        name: "Brazilian Keratin Smoothing",
        price: "₹4,500",
        priceNum: 4500,
        description: "Deep frizz elimination, split-end repair, and long-lasting thermal cuticle sealing.",
      },
      {
        name: "Hair Botox Deep Revival",
        price: "₹3,500",
        priceNum: 3500,
        description: "Caviar protein & hyaluronic acid infusion for brittle, chemically damaged hair.",
      },
    ],
  },
];

export default function MakeupPricing() {
  const [openGroup, setOpenGroup] = useState<string>("bridal");

  const toggleGroup = (id: string) => {
    setOpenGroup(openGroup === id ? "" : id);
  };

  return (
    <section id="pricing" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
            <span>BESPOKE SERVICE TARIFFS</span>
          </div>
          <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-serif font-semibold text-[#4A1330] leading-[1.16] tracking-normal sm:tracking-[-0.01em]">
            Haute Couture Menu &amp; Tariffs
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#7A6470] mt-3 leading-relaxed">
            Transparent, elevated investment tiers for bridal, cosmetological, and clinical PMU services.
          </p>
        </div>

        {/* 2-Column Layout: Tariffs Accordions on Left, Concierge Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (8 cols): Groups */}
          <div className="lg:col-span-8 space-y-5">
            {TARIFF_GROUPS.map((group) => {
              const isOpen = openGroup === group.id;

              return (
                <div
                  key={group.id}
                  className="rounded-3xl bg-white border border-[#F8E8EC] overflow-hidden shadow-xs transition-all"
                >
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FFF9F5] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                      <h3 className="text-sm sm:text-base font-semibold tracking-wider text-[#4A1330] uppercase">
                        {group.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8E8EC] text-[#B76E79] border border-[#B76E79]/30">
                        {group.tag}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#7A6470] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Group Items */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 divide-y divide-[#F8E8EC] border-t border-[#F8E8EC]"
                    >
                      {group.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-4 first:pt-4 last:pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                        >
                          <div className="space-y-1 flex-1 pr-4">
                            <div className="text-sm font-semibold text-[#2B1B24] group-hover:text-[#B76E79] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-xs text-[#7A6470] leading-relaxed">
                              {item.description}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                            <span className="text-sm sm:text-base font-serif font-semibold text-[#4A1330]">
                              {item.price}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                openBookingModal({
                                  serviceName: item.name,
                                  servicePrice: item.price,
                                  categoryName: group.title,
                                })
                              }
                              className="px-4 py-1.5 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-[11px] font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column (4 cols): Concierge Plum Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-[#2F001B] text-[#FFF9F5] border border-[#C9A66B]/40 p-6 sm:p-7 shadow-[0_20px_45px_-10px_rgba(47,0,27,0.35)] space-y-6">
              
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B] mb-2">
                  BESPOKE CONCIERGE
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#FFF9F5] mb-3">
                  Neelam Atelier Concierge
                </h3>
                <p className="text-xs sm:text-[13px] text-[#f5f0ec]/80 leading-relaxed">
                  Custom bridal suites and multi-day trousseau packages tailored to your wedding itinerary. Dedicated consultations with Master Neelam.
                </p>
              </div>

              {/* Checkmark List */}
              <div className="space-y-3 pt-2 border-t border-[#C9A66B]/25">
                <div className="flex items-start gap-2.5 text-xs text-[#f5f0ec]/90">
                  <Check className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                  <span>Multi-event bridal packages (Haldi, Mehendi, Sangeet, Wedding)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#f5f0ec]/90">
                  <Check className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                  <span>On-location vanity setup across Madhya Pradesh</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#f5f0ec]/90">
                  <Check className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                  <span>Complimentary touch-up concierge and veil setting</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    openBookingModal({
                      serviceName: "Signature Royal Maharani Makeup",
                      servicePrice: "₹25,000",
                      categoryName: "Bespoke Concierge",
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#B76E79] hover:bg-[#a85f6a] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md hover:scale-102 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFF9F5]" />
                  <span>Reserve Bespoke Suite</span>
                </button>

                <a
                  href={getWhatsAppUrl("Hi Neelam Classic Atelier, I would like to request a bespoke bridal trousseau consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all shadow-md hover:scale-102"
                >
                  <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href={`tel:${SALON_INFO.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-transparent hover:bg-white/10 text-[#FFF9F5] border border-[#C9A66B]/60 text-xs font-semibold tracking-wider transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C9A66B]" />
                  <span>CALL ATELIER</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
