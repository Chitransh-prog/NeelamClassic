"use client";

import React, { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import SafeImage from "./SafeImage";
import { GalleryItem } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/utils";

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  total: number;
  currentIndex: number;
}

export default function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
  total,
  currentIndex,
}: LightboxProps) {
  // Touch swipe handling for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, handleKeyDown]);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      onNext(); // swipe left -> next
    } else if (distance < -minSwipeDistance) {
      onPrev(); // swipe right -> prev
    }
  };

  if (!item) return null;

  const enquireMsg = `Hi Neelam Classic Salon, I loved this look: "${item.title}" (${item.category}). Can I get details and book an appointment?`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex flex-col justify-between bg-[#12030d]/95 backdrop-blur-2xl text-[#FFF9F5] select-none p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox Viewer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle decorative background auras */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A66B]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B76E79]/15 blur-[130px] rounded-full pointer-events-none" />

        {/* 1. Sleek Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between gap-3 px-1 sm:px-4 py-2">
          {/* Left: Category & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
              {item.category}
            </span>
            <h2 className="text-xs sm:text-base font-serif font-medium text-[#FFF9F5] truncate max-w-[160px] sm:max-w-md md:max-w-xl">
              {item.title}
            </h2>
          </div>

          {/* Right: Counter badge & Close button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] sm:text-xs font-mono font-medium tracking-wide border border-white/15 whitespace-nowrap">
              {currentIndex + 1} / {total}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A66B]"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 text-[#FFF9F5]" />
            </button>
          </div>
        </div>

        {/* 2. Hero Center Image Showcase */}
        <div className="relative z-10 flex-1 w-full min-h-0 flex items-center justify-center my-2 sm:my-3 px-2 sm:px-12">
          {/* Desktop Left Prev Arrow */}
          <button
            type="button"
            onClick={onPrev}
            className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-xl cursor-pointer z-30"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 text-[#FFF9F5]" />
          </button>

          {/* Image Canvas */}
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="relative w-full h-full max-h-[64vh] sm:max-h-[74vh] flex items-center justify-center"
          >
            <SafeImage
              src={item.src}
              alt={item.alt}
              placeholderTitle={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              priority
            />
          </motion.div>

          {/* Desktop Right Next Arrow */}
          <button
            type="button"
            onClick={onNext}
            className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-xl cursor-pointer z-30"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 text-[#FFF9F5]" />
          </button>
        </div>

        {/* 3. Floating Bottom Action Dock */}
        <div className="relative z-20 w-full max-w-2xl mx-auto">
          {/* Mobile swipe and navigation pill */}
          <div className="sm:hidden flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 active:bg-white/20 border border-white/15 text-xs text-[#FFF9F5] font-medium"
            >
              <ChevronLeft className="w-4 h-4 text-[#C9A66B]" />
              <span>Prev</span>
            </button>

            <span className="text-[11px] text-[#f5f0ec]/60 font-light flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C9A66B]" />
              <span>Swipe to browse</span>
            </span>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 active:bg-white/20 border border-white/15 text-xs text-[#FFF9F5] font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 text-[#C9A66B]" />
            </button>
          </div>

          {/* Bottom Card */}
          <div className="rounded-2xl sm:rounded-full bg-white/10 backdrop-blur-xl border border-[#C9A66B]/35 p-3 sm:px-6 sm:py-3 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-[#FFF9F5] truncate">
                {item.title}
              </p>
              <p className="text-[10px] sm:text-xs text-[#f5f0ec]/70 mt-0.5">
                Book a personalized session with Master Neelam Chourasiya
              </p>
            </div>

            <a
              href={getWhatsAppUrl(enquireMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-[#0A2612] text-xs font-semibold tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </AnimatePresence>
  );
}
