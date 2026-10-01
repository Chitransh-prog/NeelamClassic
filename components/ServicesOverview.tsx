"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Droplets,
  Feather,
  Flame,
  Palette,
  HeartPulse,
  Flower2,
  Crown,
  Gem,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SERVICE_CATEGORIES, TOTAL_SERVICES } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Feather: <Feather className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Flower2: <Flower2 className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Gem: <Gem className="w-5 h-5" />,
};

export default function ServicesOverview() {
  return (
    <section id="services" className="py-24 sm:py-28 bg-[#f8f2ef]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Curated Catalog"
          title="Exceptional Care Across 135 Services"
          subtitle={`From bespoke bridal transformations to revitalizing therapies, discover our complete suite of ${TOTAL_SERVICES} personalized salon treatments.`}
        />

        {/* Central Highlight Banner */}
        <div className="max-w-3xl mx-auto -mt-4 mb-14 p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-[#2F001B] via-[#4A1330] to-[#2F001B] text-[#FFF9F5] shadow-[0_16px_36px_-6px_rgba(74,19,48,0.25)] border border-[#C9A66B]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5]/10 border border-[#C9A66B]/50 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#C9A66B] font-semibold">
                Comprehensive Luxury Menu
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFF9F5]">
                Total {TOTAL_SERVICES} Signature Services
              </div>
            </div>
          </div>

          <a
            href={getWhatsAppUrl(`Hi Neelam Classic, I would like to ask about your ${TOTAL_SERVICES} salon services.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider shadow-md transition-all hover:scale-105 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* Grid of 10 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SERVICE_CATEGORIES.map((category, index) => {
            const isDarkSpecial = category.id === "makeup" || category.id === "permanent-makeup";
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`group relative rounded-[28px] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
                  isDarkSpecial
                    ? "bg-[#2F001B] text-[#FFF9F5] border border-[#C9A66B]/60 shadow-[0_16px_36px_-6px_rgba(47,0,27,0.3)] hover:-translate-y-1.5"
                    : "bg-[#fef8f4] border border-[#C9A66B]/30 hover:border-[#C9A66B]/70 plum-shadow-resting hover:plum-shadow-floating hover:-translate-y-1"
                }`}
              >
                <div>
                  {/* Top Bar: Icon and Count Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        isDarkSpecial
                          ? "bg-[#4A1330] border border-[#C9A66B]/50 text-[#C9A66B]"
                          : "bg-[#f3ede9] border border-[#B76E79]/20 text-[#4A1330] group-hover:bg-[#4A1330] group-hover:text-[#C9A66B]"
                      }`}
                    >
                      {ICON_MAP[category.iconName] || <Sparkles className="w-5 h-5" />}
                    </div>

                    <div className="flex items-center gap-2">
                      {category.tag && (
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isDarkSpecial
                              ? "bg-[#4A1330] text-[#C9A66B] border border-[#C9A66B]/40"
                              : "bg-[#f3ede9] text-[#B76E79] border border-[#B76E79]/20"
                          }`}
                        >
                          {category.tag}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isDarkSpecial
                            ? "bg-[#C9A66B] text-[#2F001B]"
                            : "bg-[#4A1330] text-[#FFF9F5]"
                        }`}
                      >
                        {category.count} Options
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-semibold mb-2.5 ${
                      isDarkSpecial
                        ? "text-[#FFF9F5]"
                        : "text-[#4A1330] group-hover:text-[#B76E79] transition-colors"
                    }`}
                  >
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-[14px] leading-[1.65] mb-6 font-normal ${
                      isDarkSpecial ? "text-[#f5f0ec]/75" : "text-[#7A6470]"
                    }`}
                  >
                    {category.description}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div
                  className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                    isDarkSpecial
                      ? "border-[#C9A66B]/20 text-[#C9A66B]"
                      : "border-[#B76E79]/15 text-[#4A1330]"
                  }`}
                >
                  {isDarkSpecial ? (
                    <a
                      href="#makeup"
                      className="inline-flex items-center gap-1.5 text-[#C9A66B] hover:text-[#FFF9F5] transition-colors"
                    >
                      <span>View Price List</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <a
                      href={getWhatsAppUrl(`Hi Neelam Classic, I would like to know the options and pricing for ${category.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#4A1330] hover:text-[#B76E79] transition-colors"
                    >
                      <span>Enquire on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C9A66B]" />
                    </a>
                  )}

                  <span
                    className={`text-[11px] font-normal ${
                      isDarkSpecial ? "text-[#f5f0ec]/50" : "text-[#7A6470]"
                    }`}
                  >
                    Category #{index + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
