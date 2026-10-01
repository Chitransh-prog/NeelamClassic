import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
  dark = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${
        center ? "mx-auto text-center" : "text-left"
      } mb-12 sm:mb-16 ${className}`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium uppercase tracking-[0.18em] mb-4 shadow-sm ${
            dark
              ? "bg-[#370c22]/80 border border-[#C9A66B]/40 text-[#C9A66B]"
              : "bg-[#F8E8EC] border border-[#B76E79]/30 text-[#B76E79]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
          <span>{badge}</span>
        </div>
      )}

      <h2
        className={`text-[30px] sm:text-[40px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.18] ${
          dark ? "text-[#FFF9F5]" : "text-[#4A1330]"
        }`}
      >
        {title}
      </h2>

      {/* Thin champagne gold divider accent with diamond */}
      <div
        className={`flex items-center gap-3 my-4 ${
          center ? "justify-center" : "justify-start"
        }`}
      >
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A66B]" />
        <span className="w-2 h-2 rotate-45 border border-[#C9A66B] bg-[#FFF9F5]" />
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A66B]" />
      </div>

      {subtitle && (
        <p
          className={`text-[15px] sm:text-[17px] font-normal leading-[1.7] max-w-2xl ${
            center ? "mx-auto" : ""
          } ${dark ? "text-[#f5f0ec]/75" : "text-[#7A6470]"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
