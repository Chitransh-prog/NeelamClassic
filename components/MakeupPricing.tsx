"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, Crown, Heart, Check, Clock } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import { MAKEUP_PRICING, MakeupServiceItem } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/utils";

type TabKey = "basic" | "party" | "bridal" | "permanent";

interface TabOption {
  key: TabKey;
  label: string;
  badge?: string;
}

const TABS: TabOption[] = [
  { key: "basic", label: "Basic Makeup" },
  { key: "party", label: "Party Makeup", badge: "Trending" },
  { key: "bridal", label: "Bridal Makeup", badge: "Signature" },
  { key: "permanent", label: "Permanent (PMU)", badge: "Advanced" },
];

export default function MakeupPricing() {
  const [activeTab, setActiveTab] = useState<TabKey>("bridal");

  const currentCategory = MAKEUP_PRICING[activeTab];

  return (
    <section id="makeup" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      {/* Decorative aura */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#B76E79]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-[#C9A66B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Transparent Menu"
          title="Makeup & PMU Price List"
          subtitle="Explore our transparent pricing curated with authentic, luxury cosmetic formulations. Click any service to book directly on WhatsApp."
        />

        {/* Tab Navigation Pill Bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-[#f3ede9] border border-[#C9A66B]/35 shadow-inner overflow-x-auto max-w-full">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.key}`}
                  id={`tab-${tab.key}`}
                  className={`relative px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap focus:outline-none ${
                    isActive
                      ? "text-[#FFF9F5] shadow-md"
                      : "text-[#7A6470] hover:text-[#4A1330] hover:bg-[#fef8f4]/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#2F001B] rounded-full"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`relative z-10 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#C9A66B] text-[#2F001B] font-bold"
                          : "bg-[#fef8f4] text-[#B76E79] border border-[#B76E79]/30"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Editorial Layout: Ledger on Left, Vanity Arch Photo on Right */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
          >
            {/* Left Ledger Column */}
            <div className="lg:col-span-7 rounded-[28px] border border-[#C9A66B]/35 bg-[#fef8f4] p-6 sm:p-8 plum-shadow-resting">
              <div className="border-b border-[#C9A66B]/30 pb-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#4A1330]">
                  {currentCategory.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6470] mt-1 font-normal">
                  {currentCategory.subtitle}
                </p>
              </div>

              {/* Price Rows */}
              <div className="divide-y divide-[#C9A66B]/20">
                {currentCategory.items.map((item: MakeupServiceItem) => {
                  const bookMsg = `Hi Neelam Classic Salon, I would like to book an appointment for "${item.name}" (${item.price}).`;
                  const bookUrl = getWhatsAppUrl(bookMsg);

                  return (
                    <div
                      key={item.id}
                      className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f3ede9]/50 px-3 rounded-2xl transition-colors group"
                    >
                      <div className="flex-1 pr-0 sm:pr-4">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base font-semibold text-[#4A1330] group-hover:text-[#B76E79] transition-colors">
                            {item.name}
                          </span>
                          {item.popular && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C9A66B]/20 text-[#2F001B] border border-[#C9A66B]/60">
                              <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                              Signature
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-[#7A6470] font-normal leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Price & Book Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0">
                        <span className="text-base sm:text-lg font-bold text-[#4A1330]">
                          {item.price}
                        </span>

                        <a
                          href={bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
                          aria-label={`Book ${item.name} on WhatsApp`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Packages Footer */}
              <div className="mt-6 p-4 rounded-2xl bg-[#f3ede9] border border-[#C9A66B]/30 text-xs text-[#7A6470] flex items-center justify-between flex-wrap gap-2">
                <span>
                  <strong className="text-[#4A1330]">Custom Packages:</strong> Bridal trials &amp; family packages available on consultation.
                </span>
                <a
                  href={getWhatsAppUrl("Hi Neelam Classic, I'd like to enquire about custom bridal packages.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#B76E79] hover:underline"
                >
                  Ask on WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Right Architectural Portrait Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* Halo */}
                <div className="absolute -inset-3 vanity-arch bg-gradient-to-tr from-[#B76E79]/20 via-[#C9A66B]/25 to-transparent blur-md pointer-events-none" />

                <div className="relative vanity-arch p-2 bg-[#fef8f4] border-[1.5px] border-[#C9A66B]/70 shadow-[0_18px_40px_-8px_rgba(74,19,48,0.16)] overflow-hidden">
                  <div className="relative aspect-[4/5] w-full vanity-arch overflow-hidden bg-[#f3ede9]">
                    <SafeImage
                      src="/images/gallery-1.jpg"
                      alt="Bridal Makeup showcase"
                      placeholderTitle="Bridal Glamour"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>

                  {/* Floating Action Card */}
                  <div className="p-4 bg-[#2F001B] text-[#FFF9F5] rounded-2xl mt-2 border border-[#C9A66B]/40 text-center">
                    <h4 className="text-sm font-semibold tracking-wide text-[#FFF9F5]">
                      Experience Haute Couture Bridal Glamour
                    </h4>
                    <p className="text-[11px] text-[#f5f0ec]/75 mt-0.5 mb-3">
                      Personally styled by Neelam Chourasiya
                    </p>
                    <a
                      href={getWhatsAppUrl("Hi Neelam Classic, I would like to book a bridal consultation.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book Consultation</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
