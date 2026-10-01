"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 group">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF9F5] border border-[#B76E79]/30 shadow-xl text-xs font-semibold text-[#4A1330] whitespace-nowrap animate-bounce duration-1000">
          <span>Need help or quick booking?</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-[#7A6470] hover:text-[#4A1330] p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={getWhatsAppUrl("Hi Neelam Classic Salon & Academy, I would like to book an appointment.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Neelam Classic Salon on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba59] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Soft pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping -z-10 pointer-events-none" />
        
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>
    </div>
  );
}
