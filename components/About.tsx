"use client";

import React from "react";
import { motion } from "framer-motion";
import SafeImage from "./SafeImage";
import { SALON_INFO } from "@/lib/utils";

export default function About() {
  const pillars = [
    {
      index: "01",
      title: "Clinical Bridal Precision",
      description:
        "Micro-targeted skincare pre-infusion, tone-harmonizing bases, and bespoke bridal eye styling for high-definition couture durability.",
    },
    {
      index: "02",
      title: "Master PMU Micro-Pigmentation",
      description:
        "Medical-grade semi-permanent lip blushing, ombre powdered brows, and scalp micropigmentation formulated with organic pigments.",
    },
    {
      index: "03",
      title: "Accredited Academy Pedagogy",
      description:
        "Rigorous hands-on masterclasses in global PMU techniques and editorial hair architecture with recognized certifications.",
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Founder Story & 01-03 Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase mb-4 shadow-xs self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
              <span>THE FOUNDER&apos;S SANCTUARY</span>
            </div>

            {/* Headline */}
            <h2 className="text-[32px] sm:text-[44px] md:text-[48px] font-serif font-semibold text-[#4A1330] leading-[1.15] tracking-normal sm:tracking-[-0.01em] mb-4">
              A Decade of Disciplined Artistry &amp;{" "}
              <span className="italic font-normal text-[#B76E79]">Aesthetic Refinement.</span>
            </h2>

            {/* Description */}
            <p className="text-[15px] sm:text-[16px] text-[#7A6470] leading-[1.75] font-normal mb-8 max-w-2xl">
              At Neelam Classic Salon &amp; Academy, every brush stroke, micro-pigment implant, and hair fiber protocol stems from deep biological pedigree, designed for discerning brides and higher aesthetics.
            </p>

            {/* 01-03 Pillars */}
            <div className="space-y-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.index}
                  className="group p-5 sm:p-6 rounded-2xl bg-white/80 border border-[#F8E8EC] hover:border-[#C9A66B]/50 transition-all shadow-xs flex items-start gap-5 hover:bg-white"
                >
                  <span className="text-sm font-serif font-bold text-[#C9A66B] pt-0.5 tracking-wider">
                    {pillar.index}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#4A1330] mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#7A6470] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Founder Portrait Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Subtle aura behind portrait */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#C9A66B]/20 via-[#B76E79]/15 to-transparent blur-xl pointer-events-none" />

              <div className="relative rounded-3xl p-2.5 bg-white border border-[#C9A66B]/40 shadow-[0_20px_45px_-10px_rgba(74,19,48,0.1)] overflow-hidden">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#f3ede9]">
                  <SafeImage
                    src="/images/owner.jpg"
                    alt="Neelam Chourasiya - Founder & Master Mentor, Neelam Classic"
                    placeholderTitle="Neelam Chourasiya"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>

                {/* Floating bottom badge */}
                <div className="p-4 text-center bg-[#2F001B] rounded-xl mt-2.5 text-[#FFF9F5] shadow-md">
                  <h3 className="text-sm font-semibold tracking-wide">
                    {SALON_INFO.owner}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A66B] font-medium mt-0.5">
                    Founder &amp; Master Mentor, Neelam Classic
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
