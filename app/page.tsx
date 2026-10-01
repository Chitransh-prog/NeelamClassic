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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fef8f4] text-[#1d1b19]">
      {/* Suspended Floating Glass Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section (Deep Plum Dark Mode with Vanity Arch) */}
        <Hero />

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
