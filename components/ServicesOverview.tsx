"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SafeImage from "./SafeImage";
import { openBookingModal } from "./ServiceBookingModal";

interface PavilionCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  pills: string[];
  priceDisplay: string;
  image: string;
}

const PAVILIONS: PavilionCard[] = [
  {
    id: "couture-bridal",
    tag: "1. COUTURE ARTISTRY • 32 PROTOCOLS",
    title: "Couture Bridal & High-Definition Makeup",
    description:
      "HD bridal, airbrush finish, pre-bridal glow, party glam and royal muhurat ceremonies with luxury cosmetic brands.",
    pills: ["4-6 Hours", "All Skin Types", "Studio & On-Site"],
    priceDisplay: "₹15,000",
    image: "/images/hero-bride.jpg",
  },
  {
    id: "hair-architecture",
    tag: "2. TRICHOLOGY & COUTURE HAIR • 28 PROTOCOLS",
    title: "Advanced Trichology & Hair Architecture",
    description:
      "Nanoplastia, Brazilian keratin infusions, botox hair therapy, Japanese straightening, and bespoke wedding hairstyles.",
    pills: ["2-4 Hours", "Bespoke Cut & Style", "Medical Grade"],
    priceDisplay: "₹2,500",
    image: "/images/service-hair.jpg",
  },
  {
    id: "derma-radiance",
    tag: "3. DERMA & BODY AESTHETICS • 24 PROTOCOLS",
    title: "Derma-Radiance & Body Alchemy",
    description:
      "Hydra-facial resurfacing, Korean glass skin rituals, bridal body polishing, and clinical anti-aging treatments.",
    pills: ["60-90 Mins", "FDA Approved Actives", "Instant Glow"],
    priceDisplay: "₹1,800",
    image: "/images/service-facial.jpg",
  },
  {
    id: "clinical-pmu",
    tag: "4. CLINICAL PMU • 12 PROTOCOLS",
    title: "Micro-Pigmentation & Permanent Cosmetics",
    description:
      "Semi-permanent ombre powder brows, microblading, lip blush neutralization, and medical-grade lash line enhancement.",
    pills: ["Semi-Permanent (2-3 Yrs)", "Organic Pigments", "Zero Downtime"],
    priceDisplay: "₹8,000",
    image: "/images/service-pmu.jpg",
  },
];

export default function ServicesOverview() {
  return (
    <section id="services" className="py-24 sm:py-28 bg-[#fef8f4] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Top-Right Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
              <span>HAUTE SALON &amp; PMU PORTFOLIO</span>
            </div>
            <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-serif font-semibold text-[#4A1330] leading-[1.16] tracking-normal sm:tracking-[-0.01em]">
              Curated Signature Sanctuaries
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#7A6470] mt-3 max-w-2xl leading-relaxed">
              Explore 135+ precision services formulated across our premier architectural pavilions.
            </p>
          </div>

          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#C9A66B]/50 hover:border-[#C9A66B] text-[#4A1330] hover:text-[#B76E79] text-xs font-semibold tracking-wider transition-all shadow-xs self-start md:self-auto hover:bg-[#FFF9F5]"
          >
            <span>View All 10 Pavilions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Horizontal Pavilion Cards */}
        <div className="space-y-6">
          {PAVILIONS.map((pavilion, index) => (
            <motion.div
              key={pavilion.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-3xl bg-white border border-[#F8E8EC] hover:border-[#C9A66B]/60 p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-[#f3ede9] border border-[#C9A66B]/20">
                  <SafeImage
                    src={pavilion.image}
                    alt={pavilion.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, 180px"
                  />
                </div>

                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A66B]">
                    {pavilion.tag}
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#4A1330] group-hover:text-[#B76E79] transition-colors">
                    {pavilion.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#7A6470] leading-relaxed max-w-2xl">
                    {pavilion.description}
                  </p>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1.5">
                    {pavilion.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] sm:text-[11px] font-medium px-3 py-1 rounded-full bg-[#f8f2ef] text-[#7A6470] border border-[#F8E8EC]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-[#F8E8EC] shrink-0 gap-3">
                <div className="text-left sm:text-right">
                  <div className="text-[9px] uppercase tracking-[0.18em] text-[#7A6470] font-medium">
                    INVESTMENT FROM
                  </div>
                  <div className="text-lg sm:text-xl font-serif font-semibold text-[#4A1330]">
                    {pavilion.priceDisplay}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openBookingModal({
                      serviceName: pavilion.title,
                      servicePrice: pavilion.priceDisplay,
                      categoryName: pavilion.tag,
                    })
                  }
                  title={`Book ${pavilion.title}`}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                >
                  <span>BOOK</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
