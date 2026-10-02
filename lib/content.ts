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
      if (!record || !record.publishedJson) return null;
      return record.publishedJson as unknown as SiteSectionsData;
    } catch (err) {
      console.error("Cached public content fetch error:", err);
      return null;
    }
  },
  ["site-content-cache"],
  {
    tags: ["site-content"],
    revalidate: 86400, // 24 hours fallback; revalidated immediately on publish
  }
);
