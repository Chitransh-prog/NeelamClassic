"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Award, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import SafeImage from "./SafeImage";
import SectionHeading from "./SectionHeading";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";

export default function About() {
  const highlights = [
    "Over a decade of celebrated bridal artistry & luxury styling",
    "Internationally certified permanent makeup (PMU) practitioner",
    "Founder & Master Mentor at Neelam Classic Academy",
    "Committed to 100% hygienic, skin-friendly, medical-grade protocols",
  ];

  return (
    <section id="about" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="About Our Founder"
          title="Artistry Defined by Passion & Precision"
          subtitle="Meet Neelam Chourasiya, the creative visionary behind the salon and academy."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Owner Photo in Architectural Vanity Arch */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
              {/* Subtle aura */}
              <div className="absolute -inset-3 vanity-arch bg-gradient-to-tr from-[#C9A66B]/25 via-[#B76E79]/20 to-[#f8f2ef] blur-md" />
              
              <div className="relative vanity-arch p-2.5 bg-[#fef8f4] border-[1.5px] border-[#C9A66B]/60 shadow-[0_16px_36px_-6px_rgba(74,19,48,0.12)] overflow-hidden">
                <div className="relative aspect-[3/4] w-full vanity-arch overflow-hidden bg-[#f3ede9]">
                  <SafeImage
                    src="/images/owner.jpg"
                    alt="Neelam Chourasiya - Founder of Neelam Classic Salon & Academy"
                    placeholderTitle="Neelam Chourasiya"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>

                {/* Floating bottom badge */}
                <div className="p-4 text-center bg-[#fef8f4] border-t border-[#C9A66B]/30 flex items-center justify-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#C9A66B]/70 bg-black">
                    <Image
                      src="/images/logo.png"
                      alt="NC Logo"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-[#4A1330] leading-tight">
                      {SALON_INFO.owner}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#B76E79] font-medium mt-0.5">
                      Master Artist &amp; Educator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Editorial Quote Box */}
            <div className="p-5 sm:p-6 rounded-r-2xl rounded-l-md bg-[#f3ede9] border-l-4 border-[#C9A66B] mb-7 shadow-sm">
              <p className="text-[16px] sm:text-[18px] text-[#2B1B24] font-medium leading-[1.6] italic">
                &ldquo;True beauty is not about changing who you are; it is about bringing out your most radiant, confident self.&rdquo;
              </p>
            </div>

            <div className="space-y-4 text-[15px] sm:text-[17px] text-[#7A6470] leading-[1.75] font-normal">
              <p>
                Welcome to <strong className="text-[#4A1330] font-semibold">Neelam Classic Salon and Academy</strong>. For over a decade, I have had the privilege of transforming brides on their most cherished days, creating camera-ready glam, and restoring healthy, luminous hair and skin for hundreds of discerning clients.
              </p>
              <p>
                Whether you visit us for our bespoke <em className="text-[#4A1330]">HD &amp; Airbrush Bridal Artistry</em>, clinical <em className="text-[#4A1330]">Permanent Makeup (PMU)</em>, or therapeutic hair repair rituals, our philosophy remains unwavering: unmatched hygiene, individual attention, and artistic precision tailored to your unique beauty.
              </p>
              <p>
                Through the <strong className="text-[#4A1330] font-semibold">Neelam Classic Academy</strong>, our mission extends to mentoring the next generation of artists with intensive hands-on practical masterclasses that build sustainable careers in the beauty industry.
              </p>
            </div>

            {/* Credential Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-8">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A66B] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-[#1d1b19] font-medium leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={getWhatsAppUrl("Hi Neelam ma'am, I would like to consult with you regarding bridal / salon services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#4A1330] text-[#FFF9F5] text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#370c22] shadow-[0_10px_24px_-4px_rgba(74,19,48,0.25)] transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 text-[#C9A66B]" />
                <span>Consult with Neelam Chourasiya</span>
              </a>

              <a
                href="#academy"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent text-[#4A1330] border-[1.5px] border-[#C9A66B] text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#F8E8EC] transition-colors"
              >
                <Award className="w-4 h-4 text-[#B76E79]" />
                <span>Explore Academy</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
