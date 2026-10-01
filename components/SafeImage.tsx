"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Sparkles } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  placeholderTitle?: string;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  placeholderTitle = "Neelam Classic",
  fallbackIcon,
  className = "",
  containerClassName = "",
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#F8E8EC] border border-[#B76E79]/20 text-[#4A1330] p-6 text-center select-none overflow-hidden ${containerClassName} ${className}`}
        style={{ minHeight: props.height ? `${props.height}px` : "240px" }}
      >
        {/* Soft decorative background shimmer / aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF9F5]/60 via-transparent to-[#B76E79]/10 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#C9A66B]/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#B76E79]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#C9A66B]/40 flex items-center justify-center text-[#B76E79] shadow-sm">
            {fallbackIcon || <Sparkles className="w-6 h-6 stroke-[1.5]" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#B76E79]">
              Portfolio Image
            </p>
            <p className="text-sm font-semibold text-[#4A1330] mt-0.5 max-w-[200px] truncate">
              {placeholderTitle || alt}
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF9F5]/80 text-[#7A6470] border border-[#B76E79]/20">
            Neelam Classic
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Subtle skeleton shimmer before load */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F8E8EC] animate-pulse flex items-center justify-center z-0">
          <Sparkles className="w-6 h-6 text-[#B76E79]/40 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
