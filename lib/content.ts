import { unstable_cache } from "next/cache";
import { prisma, withDbRetry } from "./prisma";

export interface SiteSectionsData {
  navbar: {
    brandName: string;
    tagline: string;
    phone: string;
    formattedPhone: string;
    ctaText: string;
    links: Array<{ label: string; href: string }>;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    image: string;
    rating: string;
    reviewsCount: string;
    experienceYears: string;
    experienceLabel: string;
    servicesCount: string;
    servicesLabel: string;
  };
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    ownerName: string;
    ownerRole: string;
    image: string;
    points: string[];
  };
  servicesOverview: {
    badge: string;
    title: string;
    subtitle: string;
  };
  makeupPriceList: {
    badge: string;
    title: string;
    subtitle: string;
  };
  videoShowcase: {
    badge: string;
    title: string;
    subtitle: string;
    videoUrl: string;
    posterUrl: string;
  };
  academy: {
    badge: string;
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaText: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    phone: string;
    formattedPhone: string;
    hours: string;
    note: string;
  };
  footer: {
    salonName: string;
    tagline: string;
    copyright: string;
    owner: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    champagneColor: string;
    bgColor: string;
    blushColor: string;
    textColor: string;
    mutedColor: string;
    borderRadius: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  sectionOrder?: string[];
  hiddenSections?: string[];
}

export const DEFAULT_SITE_CONTENT: SiteSectionsData = {
  navbar: {
    brandName: "Neelam's Classic",
    tagline: "Salon & Academy",
    phone: "9826747023",
    formattedPhone: "+91 98267 47023",
    ctaText: "Book Appointment",
    links: [
      { label: "Home", href: "#hero" },
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
  hero: {
    badge: "BESPOKE BRIDAL MAKEUP & ADVANCED PMU CLINIC",
    titleLine1: "The Architecture of",
    titleHighlight: "Radiant Grace.",
    description:
      "The definitive sanctuary of elevated bridal couture, micro-pigmentation artistry (PMU), and precision cosmetological hair trichology. Every distinguishing ritual is curated directly by Master Neelam Chourasiya.",
    primaryBtnText: "Book an Appointment",
    secondaryBtnText: "Book with WA",
    image: "/images/hero-bride.jpg",
    rating: "4.9",
    reviewsCount: "500+ Patron Reviews",
    experienceYears: "15+",
    experienceLabel: "Years of Master Mastery",
    servicesCount: "135+",
    servicesLabel: "Architectural Rituals",
  },
  about: {
    badge: "THE FOUNDER'S SANCTUARY",
    title: "A Decade of Disciplined Artistry & Aesthetic Refinement.",
    description1:
      "At Neelam Classic Salon & Academy, every brush stroke, micro-pigment implant, and hair fiber protocol stems from deep biological pedigree, designed for discerning brides and higher aesthetics.",
    description2:
      "Under the master mentorship of Neelam Chourasiya, each treatment is formulated with clinical precision and luxury artistry.",
    ownerName: "Neelam Chourasiya",
    ownerRole: "Founder & Master Mentor, Neelam Classic",
    image: "/images/owner.jpg",
    points: [
      "Clinical Bridal Precision with High-Definition Durability",
      "Medical-Grade Master PMU Micro-Pigmentation",
      "Accredited Academy Pedagogy with Recognized Diplomas",
    ],
  },
  servicesOverview: {
    badge: "HAUTE SALON & PMU PORTFOLIO",
    title: "Curated Signature Sanctuaries",
    subtitle: "Explore 135+ precision services formulated across our premier architectural pavilions.",
  },
  makeupPriceList: {
    badge: "BESPOKE SERVICE TARIFFS",
    title: "Haute Couture Menu & Tariffs",
    subtitle: "Transparent, elevated investment tiers for bridal, cosmetological, and clinical PMU services.",
  },
  videoShowcase: {
    badge: "Behind The Scenes",
    title: "Artistry in Motion",
    subtitle: "Watch real brides and client transformations crafted at Neelam Classic.",
    videoUrl: "",
    posterUrl: "/images/hero-bride.jpg",
  },
  academy: {
    badge: "ACADEMY ATELIER & CURATED GALLERY",
    title: "Academy Atelier & Curated Gallery",
    subtitle: "Where traditional Indian beauty traditions fuse with certified clinical PMU and editorial hair artistry.",
    ctaTitle: "Admissions Open for Master PMU & Bridal Artistry Diploma",
    ctaText: "Industry-recognized certificates, live bridal models, and business mentorship with Master Neelam.",
  },
  gallery: {
    badge: "ACADEMY ATELIER & CURATED GALLERY",
    title: "Academy Atelier & Curated Gallery",
    subtitle: "Where traditional Indian beauty traditions fuse with certified clinical PMU and editorial hair artistry.",
  },
  testimonials: {
    badge: "PATRON TESTIMONIALS",
    title: "Endorsements of Elegance",
    subtitle: "Honest impressions from cherished brides, long-time salon patrons, and diploma graduates.",
  },
  contact: {
    badge: "RESERVE YOUR APPOINTMENT TODAY",
    title: "Book Your Haute Experience",
    subtitle:
      "Whether in our private bridal salon sanctuary or at your destination wedding venue, our master team is ready to curate your transformation.",
    phone: "9826747023",
    formattedPhone: "+91 98267 47023",
    hours: "Open Daily: 10:00 AM – 08:30 PM",
    note: "Prior appointment recommended for private bridal suites.",
  },
  footer: {
    salonName: "Neelam's Classic",
    tagline: "Salon & Academy",
    copyright: "© 2026 Neelam Classic Salon and Academy. All rights reserved.",
    owner: "Neelam Chourasiya",
  },
  theme: {
    primaryColor: "#2F001B",
    accentColor: "#B76E79",
    champagneColor: "#C9A66B",
    bgColor: "#fef8f4",
    blushColor: "#F8E8EC",
    textColor: "#1d1b19",
    mutedColor: "#7A6470",
    borderRadius: "28px",
  },
  seo: {
    title: "Neelam Classic Salon & Academy | Haute Bridal Makeup & PMU",
    description:
      "The definitive sanctuary of elevated bridal couture, micro-pigmentation artistry (PMU), and precision cosmetological hair trichology.",
    keywords: "Neelam Classic Salon, Bridal Makeup Bhopal, Mandideep, PMU Academy, Luxury Salon",
    ogImage: "/images/hero-bride.jpg",
  },
};

/**
 * Fetches the published site content with ISR caching and on-demand revalidation tag.
 * Visitors to the public website NEVER wake the Neon database!
 */
export const getCachedPublishedContent = unstable_cache(
  async (): Promise<SiteSectionsData | null> => {
    try {
      const record = await withDbRetry(async () => {
        return await prisma.siteContent.findUnique({
          where: { key: "site_sections" },
        });
      });
      if (!record || !record.publishedJson) return DEFAULT_SITE_CONTENT;
      return record.publishedJson as unknown as SiteSectionsData;
    } catch (err) {
      console.error("Cached public content fetch error:", err);
      return DEFAULT_SITE_CONTENT;
    }
  },
  ["site-content-cache"],
  {
    tags: ["site-content"],
    revalidate: 86400, // 24 hours fallback; revalidated immediately on publish
  }
);
