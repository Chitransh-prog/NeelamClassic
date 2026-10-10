"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import SafeImage from "./SafeImage";
import Lightbox from "./Lightbox";
import { GALLERY_ITEMS } from "@/data/services";
import { openBookingModal } from "./ServiceBookingModal";

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // First 6 curated highlight tiles
  const curatedItems = GALLERY_ITEMS.slice(0, 6);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % curatedItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (prev) => ((prev ?? 0) - 1 + curatedItems.length) % curatedItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
            <span>ACADEMY ATELIER &amp; CURATED GALLERY</span>
          </div>
          <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-serif font-semibold text-[#4A1330] leading-[1.16] tracking-normal sm:tracking-[-0.01em]">
            Academy Atelier &amp; Curated Gallery
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#7A6470] mt-3 leading-relaxed">
            Where traditional Indian beauty traditions fuse with certified clinical PMU and editorial hair artistry.
          </p>
        </div>

        {/* 6-Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {curatedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => openLightbox(index)}
              className="group cursor-pointer relative aspect-square rounded-2xl overflow-hidden bg-[#f3ede9] border border-[#C9A66B]/20 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <SafeImage
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-[11px] text-[#FFF9F5] font-medium leading-tight">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Academy Admissions Bottom Banner */}
        <div className="mt-10 sm:mt-12 rounded-3xl bg-white border border-[#F8E8EC] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4A1330] text-[#C9A66B] flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-semibold text-[#4A1330] flex items-center justify-center md:justify-start gap-2">
                <span>Admissions Open for Master PMU &amp; Bridal Artistry Diploma</span>
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
              </div>
              <p className="text-xs text-[#7A6470] mt-0.5">
                Industry-recognized certificates, live bridal models, and business mentorship with Master Neelam.
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0"
          >
            <span>ACADEMY ADMISSIONS ENQUIRY</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={lightboxIndex !== null ? curatedItems[lightboxIndex] : null}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        total={curatedItems.length}
        currentIndex={lightboxIndex ?? 0}
      />
    </section>
  );
}
