import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServicesOverview from "@/components/ServicesOverview";
import MakeupPricing from "@/components/MakeupPricing";
import AtmosphericBanner from "@/components/AtmosphericBanner";
import Academy from "@/components/Academy";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getCachedPublishedContent } from "@/lib/content";
import type { Metadata } from "next";

export const revalidate = 86400; // 24-hour cache; revalidated on-demand when admin publishes

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCachedPublishedContent();
  if (content?.seo) {
    return {
      title: content.seo.title,
      description: content.seo.description,
      keywords: content.seo.keywords,
      openGraph: {
        title: content.seo.title,
        description: content.seo.description,
        images: content.seo.ogImage ? [{ url: content.seo.ogImage }] : undefined,
      },
    };
  }
  return {
    title: "Neelam Classic Salon & Academy | Luxury Bridal Makeup & Academy",
    description:
      "Premier luxury salon and professional beauty academy curated by Neelam Chourasiya. Royal bridal transformations, HD makeup, PMU, and advanced hair therapies.",
  };
}

export default async function Home() {
  const content = await getCachedPublishedContent();

  return (
    <div className="flex min-h-screen flex-col bg-[#fef8f4] text-[#1d1b19]">
      {/* Suspended Floating Glass Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section (Deep Plum Dark Mode with Vanity Arch) */}
        <Hero content={content?.hero} />

        {/* 2. About Founder Neelam Chourasiya */}
        <About />

        {/* 3. Services Overview (135+ Total Across 10 Categories) */}
        <ServicesOverview />

        {/* 4. Makeup & PMU Price List (Editorial Ledger + Model Arch) */}
        <MakeupPricing />

        {/* 5. Cinematic Atelier Quote Banner */}
        <AtmosphericBanner />

        {/* 6. Neelam Classic Academy (Deep Plum Luxury) */}
        <Academy />

        {/* 7. Portfolio Gallery with Centerpiece Showcase & Lightbox */}
        <Gallery />

        {/* 8. Client Reviews Carousel */}
        <Testimonials />

        {/* 9. Contact & Quick Booking Form (No Map) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
