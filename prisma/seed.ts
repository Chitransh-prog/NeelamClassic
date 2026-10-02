import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  SERVICE_CATEGORIES,
  MAKEUP_PRICING,
  ACADEMY_COURSES,
  TESTIMONIALS,
  GALLERY_ITEMS,
} from "../data/services";
import { SALON_INFO } from "../lib/utils";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Starting database seeding on Neon dev branch...");

  const adminEmail = process.env.ADMIN_EMAIL || "neelamclassicsalon@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "neelamsalon";

  // 1. Seed Admin User (Bcrypt cost 12)
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      mustChangePassword: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      mustChangePassword: true,
    },
  });
  console.log(`✅ Admin user seeded (${admin.email})`);

  // 2. Seed Default Settings
  const defaultSettings = [
    { key: "invoice_terms", value: "1. All services once booked are subject to availability.\n2. Advance deposits are non-refundable.\n3. Please arrive 10 minutes prior to your scheduled appointment." },
    { key: "invoice_footer_note", value: "Thank you for choosing Neelam Classic Salon & Academy! We appreciate your patronage." },
    { key: "invoice_prefix", value: "NCS" },
    { key: "invoice_next_number", value: "1" },
    { key: "gst_enabled", value: "false" },
    { key: "gst_rate", value: "18" },
    { key: "gstin", value: "" },
    { key: "business_phone", value: SALON_INFO.phone },
    { key: "business_whatsapp", value: SALON_INFO.phone },
    { key: "business_hours", value: "Mon - Sun: 10:00 AM - 08:30 PM" },
    { key: "instagram_url", value: "https://instagram.com" },
    { key: "facebook_url", value: "https://facebook.com" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log("✅ Default settings seeded");

  // 3. Seed Service Categories & Items
  for (let catIdx = 0; catIdx < SERVICE_CATEGORIES.length; catIdx++) {
    const cat = SERVICE_CATEGORIES[catIdx];
    const categoryRecord = await prisma.serviceCategory.upsert({
      where: { slug: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
        thumbnail: cat.image,
        sortOrder: catIdx,
      },
      create: {
        name: cat.name,
        slug: cat.id,
        description: cat.description,
        thumbnail: cat.image,
        sortOrder: catIdx,
      },
    });

    // If makeup category, seed the detailed makeup pricing items
    if (cat.id === "makeup") {
      let itemIdx = 0;
      for (const [tabKey, tabGroup] of Object.entries(MAKEUP_PRICING)) {
        for (const item of tabGroup.items) {
          const match = item.price.match(/₹?([0-9]+)/);
          const numPrice = match ? parseInt(match[1], 10) : null;
          await prisma.serviceItem.upsert({
            where: { id: item.id },
            update: {
              name: item.name,
              description: item.description,
              price: numPrice ? numPrice : null,
              priceDisplay: item.price,
              badge: item.popular ? "Popular" : null,
              tab: tabKey,
              sortOrder: itemIdx++,
              categoryId: categoryRecord.id,
            },
            create: {
              id: item.id,
              name: item.name,
              description: item.description,
              price: numPrice ? numPrice : null,
              priceDisplay: item.price,
              badge: item.popular ? "Popular" : null,
              tab: tabKey,
              sortOrder: itemIdx++,
              categoryId: categoryRecord.id,
            },
          });
        }
      }
    }
  }
  console.log("✅ Service categories and items seeded");

  // 4. Seed Gallery Items
  for (let gIdx = 0; gIdx < GALLERY_ITEMS.length; gIdx++) {
    const g = GALLERY_ITEMS[gIdx];
    await prisma.galleryItem.upsert({
      where: { id: g.id },
      update: {
        title: g.title,
        category: g.category,
        url: g.src,
        altText: g.alt,
        sortOrder: gIdx,
      },
      create: {
        id: g.id,
        title: g.title,
        category: g.category,
        url: g.src,
        altText: g.alt,
        sortOrder: gIdx,
      },
    });
  }
  console.log("✅ Gallery items seeded");

  // 5. Seed Testimonials
  for (let tIdx = 0; tIdx < TESTIMONIALS.length; tIdx++) {
    const t = TESTIMONIALS[tIdx];
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        text: t.comment,
        stars: t.rating,
        sortOrder: tIdx,
        isVerified: true,
      },
      create: {
        id: t.id,
        name: t.name,
        text: t.comment,
        stars: t.rating,
        sortOrder: tIdx,
        isVerified: true,
      },
    });
  }
  console.log("✅ Testimonials seeded");

  // 6. Seed Academy Courses
  for (let cIdx = 0; cIdx < ACADEMY_COURSES.length; cIdx++) {
    const c = ACADEMY_COURSES[cIdx];
    await prisma.course.upsert({
      where: { id: c.id },
      update: {
        title: c.title,
        duration: c.duration,
        description: c.description,
        modules: c.highlights,
        image: c.image,
        hasCertificate: true,
        sortOrder: cIdx,
      },
      create: {
        id: c.id,
        title: c.title,
        duration: c.duration,
        description: c.description,
        modules: c.highlights,
        image: c.image,
        hasCertificate: true,
        sortOrder: cIdx,
      },
    });
  }
  console.log("✅ Academy courses seeded");

  // 7. Seed Initial SiteContent
  const siteContentData = {
    navbar: {
      brandName: "Neelam Classic",
      tagline: "Salon & Academy",
      phone: SALON_INFO.phone,
      formattedPhone: SALON_INFO.formattedPhone,
      ctaText: "Book Appointment",
      links: [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Pricing", href: "#pricing" },
        { label: "Academy", href: "#academy" },
        { label: "Gallery", href: "#gallery" },
        { label: "Reviews", href: "#testimonials" },
        { label: "Contact", href: "#contact" },
      ],
    },
    hero: {
      badge: "Luxury Salon & Academy",
      titleLine1: "Timeless Elegance &",
      titleHighlight: "Signature Artistry",
      description: "Indulge in royal bridal transformations, high-precision permanent makeup (PMU), advanced hair therapies, and master academy training personally curated by Neelam Chourasiya.",
      primaryBtnText: "Book on WhatsApp",
      secondaryBtnText: "Call Salon",
      image: "/images/hero-bride.jpg",
      rating: "4.9",
      reviewsCount: "500+ Happy Brides & Clients",
      experienceYears: "15+",
      experienceLabel: "Years of Master Excellence",
      servicesCount: "135+",
      servicesLabel: "Premium Salon Services",
    },
    about: {
      badge: "Our Heritage & Founder",
      title: "Where Artistry Meets Pure Luxury",
      description1: "Founded by Neelam Chourasiya, Neelam Classic Salon & Academy has stood as a beacon of bespoke beauty, bridal elegance, and cosmetic innovation.",
      description2: "Every service is a bespoke ritual crafted with dermatologically safe, premium international formulations and uncompromising hygiene.",
      ownerName: "Neelam Chourasiya",
      ownerRole: "Founder & Master Aesthetician",
      image: "/images/hero-bride.jpg",
      points: [
        "15+ Years of Industry Leadership & Bridal Mastery",
        "Sterilized, Medical-Grade PMU & Piercing Protocols",
        "Personalized Consultations for Every Skin & Hair Texture",
        "Certified Professional Academy Training",
      ],
    },
    servicesOverview: {
      badge: "Curated Portfolio",
      title: "Comprehensive Salon Services",
      subtitle: "Explore our spectrum of 135+ bespoke beauty, hair, skin, and wellness treatments.",
    },
    makeupPriceList: {
      badge: "Transparent Pricing",
      title: "Signature Makeup Packages",
      subtitle: "From radiant daily looks to majestic royal bridal transformations.",
    },
    videoShowcase: {
      badge: "Behind The Scenes",
      title: "Witness the Transformation",
      subtitle: "Watch our real brides, master hair sculpts, and academy students in action.",
      videoUrl: "",
      posterUrl: "/images/cat-makeup.jpg",
    },
    academy: {
      badge: "Empowering Careers",
      title: "Neelam Classic Academy",
      subtitle: "Launch your career as a certified makeup artist, hair specialist, or aesthetician with hands-on mentorship.",
      ctaTitle: "Ready to launch your beauty career?",
      ctaText: "Enroll for Next Batch",
    },
    gallery: {
      badge: "Real Results",
      title: "Our Signature Transformations",
      subtitle: "Real brides, flawless party glam, precision permanent makeup, and academy moments.",
    },
    testimonials: {
      badge: "Client Love",
      title: "Cherished Experiences",
      subtitle: "Hear directly from brides, salon guests, and academy graduates.",
    },
    contact: {
      badge: "Get in Touch",
      title: "Book Your Appointment",
      subtitle: "Connect with us on WhatsApp or call directly for reservations and personalized bridal consultations.",
      phone: SALON_INFO.phone,
      formattedPhone: SALON_INFO.formattedPhone,
      hours: "Mon - Sun: 10:00 AM - 08:30 PM",
      note: "Prior appointment recommended for bridal makeup and PMU sessions.",
    },
    footer: {
      salonName: "Neelam Classic Salon & Academy",
      tagline: "Timeless elegance, royal bridal transformations, and professional beauty academy.",
      copyright: "© 2026 Neelam Classic Salon & Academy. All rights reserved.",
      owner: "Neelam Chourasiya",
    },
    theme: {
      primaryColor: "#4A1330",
      accentColor: "#B76E79",
      champagneColor: "#C9A66B",
      bgColor: "#FFF9F5",
      blushColor: "#F8E8EC",
      textColor: "#2B1B24",
      mutedColor: "#7A6470",
      borderRadius: "1rem",
    },
    seo: {
      title: "Neelam Classic Salon & Academy | Luxury Bridal Makeup & Academy",
      description: "Premier luxury salon and professional beauty academy curated by Neelam Chourasiya. Royal bridal transformations, HD makeup, PMU, and advanced hair therapies.",
      keywords: "salon, academy, bridal makeup, permanent makeup, hair treatments, beauty parlour, makeup artist",
      ogImage: "/images/hero-bride.jpg",
    },
  };

  await prisma.siteContent.upsert({
    where: { key: "site_sections" },
    update: {
      draftJson: siteContentData,
      publishedJson: siteContentData,
    },
    create: {
      key: "site_sections",
      draftJson: siteContentData,
      publishedJson: siteContentData,
    },
  });

  // Seed initial content version
  await prisma.contentVersion.create({
    data: {
      contentKey: "site_sections",
      snapshotJson: siteContentData,
      createdBy: "Initial Seed",
    },
  });
  console.log("✅ SiteContent and initial version snapshot seeded");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
