"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Send, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SALON_INFO, getWhatsAppUrl } from "@/lib/utils";

const SERVICE_OPTIONS = [
  "Bridal Makeup (HD / Airbrush / Signature)",
  "Party / Engagement / Sangeet Makeup",
  "Permanent Makeup (PMU / Microblading / Lip Blush)",
  "Hair Smoothening / Keratin / Botox",
  "Hair Cut / Styling / Global Color",
  "Clinical Facial & Skin Treatment",
  "Body Spa & Wellness Care",
  "Neelam Classic Academy Course Enquiry",
  "Other Custom Service",
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: SERVICE_OPTIONS[0],
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMsg = `Hello Neelam Classic Salon & Academy!
My Name: ${formData.name.trim() || "Guest"}
Contact Number: ${formData.phone.trim() || "Not provided"}
Interested Service: ${formData.service}
Message / Preferred Date: ${formData.message.trim() || "I would like to book a consultation."}`;

    const url = getWhatsAppUrl(formattedMsg);
    window.open(url, "_blank");
  };

  return (
    <section id="contact" className="py-24 sm:py-28 bg-[#fef8f4] relative overflow-hidden">
      {/* Decorative subtle glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#B76E79]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#C9A66B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Appointments & Enquiries"
          title="Connect with Our Salon & Academy"
          subtitle="Get in touch directly with Neelam Chourasiya and team. Schedule your personalized bridal consultation or academy batch registration."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start max-w-5xl mx-auto">
          
          {/* Direct Connect Options (Left Side) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 sm:p-9 rounded-[32px] bg-[#2F001B] text-[#FFF9F5] border border-[#C9A66B]/45 shadow-[0_20px_45px_-10px_rgba(47,0,27,0.35)]">
              <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#C9A66B] block mb-2">
                Instant Direct Connect
              </span>
              <h3 className="text-2xl font-semibold text-[#FFF9F5] mb-4 tracking-tight">
                Call or WhatsApp Directly
              </h3>
              <p className="text-xs sm:text-[14px] text-[#f5f0ec]/75 mb-6 leading-relaxed">
                Prefer immediate booking or a voice consultation? Reach out directly on our studio helpline:
              </p>

              {/* Big Phone Number */}
              <div className="text-2xl sm:text-3xl font-bold text-[#FFF9F5] tracking-tight mb-8">
                {SALON_INFO.phone}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={getWhatsAppUrl("Hi Neelam Classic Salon & Academy, I would like to book an appointment.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#B76E79] hover:bg-[#a65f6b] text-[#FFF9F5] font-semibold text-xs sm:text-sm tracking-wider shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-[#FFF9F5]" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={SALON_INFO.telLink}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-transparent text-[#FFF9F5] border-[1.5px] border-[#C9A66B] hover:bg-[#4A1330] font-semibold text-xs sm:text-sm tracking-wider transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C9A66B]" />
                  <span>Call {SALON_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Salon Hours & Assurance */}
            <div className="p-6 rounded-[28px] bg-[#f8f2ef] border border-[#C9A66B]/30 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A1330]">
                <Clock className="w-4 h-4 text-[#C9A66B]" />
                <span>Operating Timings</span>
              </div>
              <p className="text-xs text-[#7A6470] leading-relaxed">
                Open Daily: 10:00 AM – 8:00 PM<br />
                Bridal &amp; Event Makeups available on customized early morning schedules upon prior appointment.
              </p>
              <div className="pt-2 border-t border-[#C9A66B]/20 flex items-center gap-2 text-xs text-[#4A1330] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C9A66B]" />
                <span>Prior appointment recommended for bridal trials</span>
              </div>
            </div>

          </div>

          {/* WhatsApp Enquiry Form (Right Side) */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] p-8 sm:p-10 bg-[#fef8f4] border border-[#C9A66B]/40 shadow-[0_16px_36px_-6px_rgba(74,19,48,0.1)] relative">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B76E79] mb-2">
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                <span>Quick Booking Form</span>
              </div>

              <h3 className="text-2xl font-semibold text-[#4A1330] mb-2 tracking-tight">
                Send Us an Enquiry
              </h3>
              <p className="text-xs sm:text-[14px] text-[#7A6470] mb-8 font-normal">
                Fill in your details below. Submitting will open WhatsApp with your customized message ready to send with one tap.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-xs font-semibold text-[#4A1330] uppercase tracking-wider mb-2"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-5 py-3.5 rounded-[20px] bg-[#f8f2ef] border border-[#C9A66B]/40 text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#B76E79]/20 text-sm transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="client-phone"
                    className="block text-xs font-semibold text-[#4A1330] uppercase tracking-wider mb-2"
                  >
                    Your Phone / WhatsApp Number *
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-5 py-3.5 rounded-[20px] bg-[#f8f2ef] border border-[#C9A66B]/40 text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#B76E79]/20 text-sm transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="client-service"
                    className="block text-xs font-semibold text-[#4A1330] uppercase tracking-wider mb-2"
                  >
                    Desired Service / Academy Program *
                  </label>
                  <select
                    id="client-service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-[20px] bg-[#f8f2ef] border border-[#C9A66B]/40 text-[#1d1b19] focus:outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#B76E79]/20 text-sm transition-all cursor-pointer"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="client-message"
                    className="block text-xs font-semibold text-[#4A1330] uppercase tracking-wider mb-2"
                  >
                    Your Message / Preferred Date &amp; Time
                  </label>
                  <textarea
                    id="client-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the occasion, number of guests, or preferred appointment slot..."
                    className="w-full px-5 py-3.5 rounded-[20px] bg-[#f8f2ef] border border-[#C9A66B]/40 text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#B76E79]/20 text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#2F001B] hover:bg-[#3a0823] text-[#FFF9F5] font-semibold text-xs sm:text-sm tracking-wider shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border border-[#C9A66B]/40"
                >
                  <Send className="w-4 h-4 text-[#C9A66B]" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
