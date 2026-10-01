"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  MessageCircle,
  Users,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import SafeImage from "./SafeImage";
import { ACADEMY_COURSES } from "@/data/services";
import { getWhatsAppUrl, SALON_INFO } from "@/lib/utils";

export default function Academy() {
  return (
    <section id="academy" className="py-24 sm:py-28 bg-[#2F001B] text-[#FFF9F5] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#B76E79]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#C9A66B]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Neelam Classic Academy"
          title="Turn Your Artistic Passion into a Thriving Career"
          subtitle="Learn modern bridal makeup, PMU micro-pigmentation, advanced hair designing, and skin aesthetics under the direct mentorship of Neelam Chourasiya."
          dark
        />

        {/* Academy Highlight Spotlight Banner */}
        <div className="mb-14 rounded-[28px] bg-[#3a0823]/90 border border-[#C9A66B]/45 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.4)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A1330] text-[#C9A66B] text-[11px] font-semibold uppercase tracking-[0.16em] mb-4 border border-[#C9A66B]/40">
              <GraduationCap className="w-4 h-4 text-[#C9A66B]" />
              <span>Certified Professional Diplomas</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-[#FFF9F5] tracking-tight leading-snug mb-4">
              Real-World Practical Mentorship with Live Models
            </h3>

            <p className="text-sm sm:text-[15px] text-[#f5f0ec]/80 leading-relaxed mb-7 font-normal">
              Unlike generic theory-heavy institutes, Neelam Classic Academy focuses on 80% hands-on practical artistry. You will master product chemistry, skin mapping, vanity kit setup, client consultations, social media portfolio creation, and real bride styling.
            </p>

            {/* Benefits Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
              <div className="p-3.5 rounded-2xl bg-[#2F001B] border border-[#C9A66B]/30">
                <Users className="w-5 h-5 text-[#C9A66B] mb-1.5" />
                <div className="text-xs font-semibold text-[#FFF9F5]">Small Batches</div>
                <div className="text-[11px] text-[#f5f0ec]/60">1-on-1 Guidance</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#2F001B] border border-[#C9A66B]/30">
                <Award className="w-5 h-5 text-[#C9A66B] mb-1.5" />
                <div className="text-xs font-semibold text-[#FFF9F5]">Certification</div>
                <div className="text-[11px] text-[#f5f0ec]/60">Recognized Diploma</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#2F001B] border border-[#C9A66B]/30">
                <Sparkles className="w-5 h-5 text-[#C9A66B] mb-1.5" />
                <div className="text-xs font-semibold text-[#FFF9F5]">Live Practice</div>
                <div className="text-[11px] text-[#f5f0ec]/60">Real Model Demos</div>
              </div>
            </div>

            <a
              href={getWhatsAppUrl("Hi Neelam Classic Academy, I would like to enquire about course details, syllabus, and upcoming batch dates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
              <span>Enquire About Batches on WhatsApp</span>
            </a>
          </div>

          {/* Academy Studio Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-[24px] overflow-hidden border-[1.5px] border-[#C9A66B]/50 shadow-xl aspect-[4/3] bg-[#2F001B]">
              <SafeImage
                src="/images/academy-1.jpg"
                alt="Neelam Classic Academy Classroom and Training Studio"
                placeholderTitle="Academy Studio Session"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>

        </div>

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {ACADEMY_COURSES.map((course, idx) => {
            const courseMsg = `Hi Neelam Classic Academy, I am interested in enrolling in the "${course.title}". Please share syllabus and upcoming batch details.`;
            const courseUrl = getWhatsAppUrl(courseMsg);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-[28px] p-6 sm:p-8 bg-[#370c22]/80 border border-[#C9A66B]/35 hover:border-[#C9A66B]/75 shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {course.image && (
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 border border-[#C9A66B]/30 bg-[#2F001B]">
                      <SafeImage
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 550px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2F001B]/85 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-semibold tracking-wider px-3 py-1 rounded-full bg-[#B76E79]/25 text-[#FFF9F5] border border-[#B76E79]/40">
                      {course.duration}
                    </span>
                    <span className="text-[11px] text-[#C9A66B] flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {course.mode}
                    </span>
                  </div>

                  <h4 className="text-xl font-semibold text-[#FFF9F5] tracking-tight mb-2.5">
                    {course.title}
                  </h4>

                  <p className="text-xs sm:text-[14px] text-[#f5f0ec]/75 mb-6 leading-relaxed font-normal">
                    {course.description}
                  </p>

                  <div className="mb-6 space-y-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A66B]">
                      Key Learning Modules:
                    </div>
                    {course.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#f5f0ec]/85">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#2F001B] border border-[#C9A66B]/25 mb-6 flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <span className="text-xs font-medium text-[#FFF9F5]">
                      Awarded: {course.certificate}
                    </span>
                  </div>
                </div>

                <a
                  href={courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] text-xs font-semibold tracking-wider shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
