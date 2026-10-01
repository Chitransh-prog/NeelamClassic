"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { TESTIMONIALS } from "@/data/services";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const prevReview = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const nextReview = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const review = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-24 sm:py-28 bg-[#f8f2ef]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Client Love"
          title="Words From Our Radiant Clients"
          subtitle="Real experiences from cherished brides, long-time salon visitors, and passionate academy graduates."
        />

        <div className="max-w-3xl mx-auto relative">
          
          {/* Main Card */}
          <div
            className="relative rounded-[32px] p-8 sm:p-12 bg-[#fef8f4] border border-[#C9A66B]/35 shadow-[0_16px_36px_-6px_rgba(74,19,48,0.1)] overflow-hidden min-h-[300px] flex flex-col justify-between"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {/* Soft decorative quote watermark */}
            <Quote className="absolute top-6 right-6 w-24 h-24 text-[#B76E79]/10 pointer-events-none rotate-12" />

            <AnimatePresence mode="wait">
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#C9A66B] text-[#C9A66B]"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#f3ede9] text-[#B76E79] border border-[#B76E79]/30">
                      {review.service}
                    </span>
                  </div>

                  {/* Comment Quote */}
                  <p className="text-[16px] sm:text-[18px] text-[#1d1b19] font-normal leading-[1.7] italic mb-8">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="flex items-center justify-between pt-6 border-t border-[#C9A66B]/20">
                  <div>
                    <h4 className="text-base font-semibold text-[#4A1330]">
                      {review.name}
                    </h4>
                    <p className="text-xs text-[#7A6470]">{review.date}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#C9A66B] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Verified Review</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 px-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-[#4A1330]"
                      : "w-2 bg-[#B76E79]/30 hover:bg-[#B76E79]/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={prevReview}
                className="p-3 rounded-full bg-[#fef8f4] border border-[#C9A66B]/35 text-[#4A1330] hover:bg-[#f3ede9] transition-all hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextReview}
                className="p-3 rounded-full bg-[#fef8f4] border border-[#C9A66B]/35 text-[#4A1330] hover:bg-[#f3ede9] transition-all hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
