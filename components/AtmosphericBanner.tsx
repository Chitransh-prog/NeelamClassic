import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function AtmosphericBanner() {
  return (
    <section className="relative py-20 sm:py-24 bg-[#2F001B] text-[#FFF9F5] overflow-hidden border-y border-[#C9A66B]/35">
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A1330]/60 via-[#2F001B] to-[#1a000f] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#C9A66B]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Monogram emblem */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full overflow-hidden border border-[#C9A66B]/60 bg-black shadow-lg mb-6">
          <Image
            src="/images/logo.png"
            alt="NC Emblem"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Small Tag */}
        <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#C9A66B] font-medium mb-4 flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C9A66B]" />
          <span>Haute Couture Beauty Atelier</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C9A66B]" />
        </div>

        {/* Cinematic Headline */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.2] text-[#FFF9F5] max-w-3xl mx-auto mb-6 italic">
          &ldquo;Where Timeless Tradition Meets Architectural Precision &amp; Modern Artistry.&rdquo;
        </h2>

        <p className="text-xs sm:text-sm text-[#f5f0ec]/70 uppercase tracking-[0.18em] font-normal">
          Neelam Classic Salon &amp; Academy • Est. 2014 • Mentorship by Neelam Chourasiya
        </p>
      </div>
    </section>
  );
}
