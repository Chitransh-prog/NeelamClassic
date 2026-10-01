"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Maximize2, Camera } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import Lightbox from "./Lightbox";
import { GALLERY_ITEMS, GalleryItem } from "@/data/services";

const CATEGORIES = ["All", "Bridal", "Makeup", "Permanent", "Hair", "Academy"] as const;

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Signature Portfolio"
          title="Glimpse Our Master Artistry"
          subtitle="A visual celebration of our radiant brides, flawless party glam, precision permanent makeup, and academy triumphs."
        />

        {/* Category Filter Pills */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-[#2F001B] text-[#FFF9F5] shadow-md scale-105 border border-[#C9A66B]/50"
                    : "bg-[#f3ede9] text-[#7A6470] hover:text-[#4A1330] border border-[#C9A66B]/25 hover:bg-[#f3ede9]/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Curated Editorial Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredItems.slice(0, 7).map((item, index) => {
            // Apply subtle architectural silhouettes to images
            const isArch = index % 3 === 0;

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => openLightbox(index)}
                className={`group relative cursor-pointer overflow-hidden bg-[#f3ede9] border border-[#C9A66B]/35 hover:border-[#C9A66B] plum-shadow-resting hover:plum-shadow-floating transition-all duration-300 ${
                  isArch ? "vanity-arch-sm" : "rounded-[24px]"
                }`}
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <SafeImage
                    src={item.src}
                    alt={item.alt}
                    placeholderTitle={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F001B]/95 via-[#2F001B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-[#FFF9F5]">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C9A66B] mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold leading-snug mb-2">
                      {item.title}
                    </h4>
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#FFF9F5]/90">
                      <Maximize2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>View In Detail</span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#fef8f4]/90 backdrop-blur-sm text-[#4A1330] text-[9px] font-bold uppercase tracking-wider shadow-sm border border-[#C9A66B]/30 group-hover:opacity-0 transition-opacity">
                    {item.category}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Featured Grand Centerpiece (Lustrous Hair Smoothening Showcase) */}
        {filteredItems.length >= 8 && (
          <div className="mt-14 max-w-4xl mx-auto">
            {/* Editorial Divider Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C9A66B]" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#4A1330]">
                  Neelam Classic Salon &amp; Academy
                </h3>
                <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#C9A66B]" />
              </div>
            </div>

            {/* Big Feature Card */}
            <div
              onClick={() => openLightbox(7)}
              className="group cursor-pointer relative rounded-[28px] overflow-hidden border-[1.5px] border-[#C9A66B]/60 shadow-[0_20px_45px_-10px_rgba(74,19,48,0.18)] bg-[#f3ede9]"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                <SafeImage
                  src={filteredItems[7]?.src || "/images/gallery-8.jpg"}
                  alt={filteredItems[7]?.alt || "Luxury Hair Smoothening"}
                  placeholderTitle={filteredItems[7]?.title || "Lustrous Hair Smoothening"}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1000px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#2F001B]/90 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10 text-[#FFF9F5]">
                  <span className="text-xs uppercase tracking-widest text-[#C9A66B] font-semibold mb-1">
                    Signature Hair Transformation
                  </span>
                  <h4 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFF9F5]">
                    Lustrous Nanoplastia &amp; Keratin Smoothening
                  </h4>
                  <p className="text-xs sm:text-sm text-[#f5f0ec]/80 mt-1">
                    Click to view full resolution transformation details
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notice for Custom Additions */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#7A6470] flex items-center justify-center gap-2">
            <Camera className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>Real brides &amp; client transformations updated weekly in our studio.</span>
          </p>
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
