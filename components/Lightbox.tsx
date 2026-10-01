"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
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

  if (!item) return null;

  const enquireMsg = `Hi Neelam Classic Salon, I loved this look: "${item.title}" (${item.category}). Can I get details and book a similar styling?`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox"
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-4xl bg-[#FFF9F5] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A66B]/40 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#B76E79]/20 bg-[#F8E8EC]/70">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-[#4A1330] text-[#FFF9F5] text-xs font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#4A1330] truncate max-w-[200px] sm:max-w-md">
                {item.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#7A6470]">
                {currentIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-[#FFF9F5] text-[#4A1330] hover:bg-[#B76E79]/20 focus:outline-none focus:ring-2 focus:ring-[#B76E79] transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Display Area */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#F8E8EC] flex items-center justify-center overflow-hidden">
            <SafeImage
              src={item.src}
              alt={item.alt}
              placeholderTitle={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-contain sm:object-cover"
            />

            {/* Left Prev Arrow Button */}
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#FFF9F5]/90 hover:bg-[#FFF9F5] text-[#4A1330] shadow-lg border border-[#B76E79]/30 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow Button */}
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#FFF9F5]/90 hover:bg-[#FFF9F5] text-[#4A1330] shadow-lg border border-[#B76E79]/30 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Action */}
          <div className="p-4 sm:p-5 bg-[#FFF9F5] border-t border-[#B76E79]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#7A6470] text-center sm:text-left">
              Want a similar transformation? Contact Neelam Chourasiya directly.
            </p>

            <a
              href={getWhatsAppUrl(enquireMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A1330] text-[#FFF9F5] text-xs sm:text-sm font-semibold hover:bg-[#370c22] transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A66B]" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
