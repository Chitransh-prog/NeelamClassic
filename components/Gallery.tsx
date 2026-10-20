"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles, Eye, ChevronDown, ChevronUp } from "lucide-react";
import SafeImage from "./SafeImage";
import Lightbox from "./Lightbox";
import { GALLERY_ITEMS, GalleryItem } from "@/data/services";
import { openBookingModal } from "./ServiceBookingModal";

type FilterTabId = "all" | "ambience" | "spa-nails" | "skin-pmu" | "bridal" | "academy";

interface FilterTab {
  id: FilterTabId;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "All Collections" },
  { id: "ambience", label: "Salon Ambience" },
  { id: "spa-nails", label: "Nails & Foot Spa" },
  { id: "skin-pmu", label: "Skin & PMU Suites" },
  { id: "bridal", label: "Bridal & Hair Artistry" },
  { id: "academy", label: "Academy" },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<FilterTabId>("all");
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on selected category tab
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "ambience") return item.category === "Ambience";
      if (activeTab === "spa-nails") return item.category === "Nails" || item.category === "Spa";
      if (activeTab === "skin-pmu") return item.category === "Skin" || item.category === "Permanent";
      if (activeTab === "bridal") return item.category === "Bridal" || item.category === "Makeup" || item.category === "Hair";
      if (activeTab === "academy") return item.category === "Academy";
      return true;
    });
  }, [activeTab]);

  // Compute count for each tab
  const getTabCount = (tabId: FilterTabId) => {
    if (tabId === "all") return GALLERY_ITEMS.length;
    return GALLERY_ITEMS.filter((item) => {
      if (tabId === "ambience") return item.category === "Ambience";
      if (tabId === "spa-nails") return item.category === "Nails" || item.category === "Spa";
      if (tabId === "skin-pmu") return item.category === "Skin" || item.category === "Permanent";
      if (tabId === "bridal") return item.category === "Bridal" || item.category === "Makeup" || item.category === "Hair";
      if (tabId === "academy") return item.category === "Academy";
      return true;
    }).length;
  };

  // Limit display to 8 initially unless showAll is toggled
  const INITIAL_LIMIT = 8;
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_LIMIT);
  const hasMore = filteredItems.length > INITIAL_LIMIT;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (prev) => ((prev ?? 0) - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#B76E79]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
            <span>SALON AMBIENCE &amp; ARTISTRY GALLERY</span>
          </div>
          <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-serif font-semibold text-[#4A1330] leading-[1.16] tracking-normal sm:tracking-[-0.01em]">
            Step Inside Neelam Classic
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#7A6470] mt-3 leading-relaxed">
            Experience our premier luxury suites: high-tech PMU &amp; derma clinic rooms, serene pedicure spa thrones, bespoke nail art bar, and royal bridal transformations.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAll(false);
                }}
                className={`group relative whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-[#4A1330] text-[#FFF9F5] shadow-md border border-[#C9A66B]/50"
                    : "bg-white text-[#7A6470] hover:text-[#4A1330] border border-[#C9A66B]/25 hover:border-[#C9A66B]/60 hover:bg-[#FFF9F5]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                    isActive
                      ? "bg-[#C9A66B] text-[#4A1330] font-bold"
                      : "bg-[#F8E8EC] text-[#7A6470] group-hover:bg-[#4A1330]/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photo Grid with Animation */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                onClick={() => {
                  const actualIndex = filteredItems.findIndex((fi) => fi.id === item.id);
                  openLightbox(actualIndex >= 0 ? actualIndex : index);
                }}
                className="group cursor-pointer relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f3ede9] border border-[#C9A66B]/25 shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
              >
                <SafeImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle top category tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md text-[#FFF9F5] border border-white/20 shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Hover overlay with title & icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 z-10">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[10px] uppercase font-semibold text-[#C9A66B] tracking-[0.15em] mb-1">
                      Neelam Classic
                    </p>
                    <h3 className="text-sm sm:text-base font-serif font-medium text-[#FFF9F5] leading-snug drop-shadow-sm">
                      {item.title}
                    </h3>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-[#FFF9F5]/90 font-medium">
                      <Eye className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>Click to view full photo</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All / Collapse Button */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-[#FFF9F5] border border-[#C9A66B] text-[#4A1330] text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>{showAll ? "Show Curated Highlights" : `View All ${filteredItems.length} Photos in Collection`}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 text-[#C9A66B]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#C9A66B]" />
              )}
            </button>
          </div>
        )}

        {/* Academy Admissions Bottom Banner */}
        <div className="mt-12 sm:mt-16 rounded-3xl bg-white border border-[#F8E8EC] p-5 sm:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#4A1330] text-[#C9A66B] flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-semibold text-[#4A1330] flex items-center justify-center md:justify-start gap-2">
                <span>Admissions Open for Master PMU &amp; Bridal Artistry Diploma</span>
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
              </div>
              <p className="text-xs sm:text-[13px] text-[#7A6470] mt-1">
                Industry-recognized certificates, live bridal models, real salon floor experience, and business mentorship with Master Neelam.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openBookingModal({
                serviceName: "Professional Academy Masterclass",
                servicePrice: "Admissions Open",
                categoryName: "Professional Academy",
              })
            }
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0"
          >
            <span>ACADEMY ADMISSIONS ENQUIRY</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={lightboxIndex !== null ? filteredItems[lightboxIndex] : null}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        total={filteredItems.length}
        currentIndex={lightboxIndex ?? 0}
      />
    </section>
  );
}
