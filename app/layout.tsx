import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A1330",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://neelamclassicsalon.com"),
  title: "Neelam Classic Salon & Academy | Luxury Makeup, Hair & PMU",
  description:
    "Experience 135+ premium beauty services, bespoke bridal makeups, permanent makeup (PMU), advanced hair treatments, and professional beauty academy training by Neelam Chourasiya.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "Neelam Classic Salon",
    "Neelam Chourasiya",
    "Bridal Makeup",
    "Permanent Makeup",
    "PMU Academy",
    "Hair Smoothening",
    "Beauty Academy",
    "Party Makeup",
  ],
  authors: [{ name: "Neelam Chourasiya" }],
  creator: "Neelam Classic Salon and Academy",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://neelamclassicsalon.com",
    siteName: "Neelam Classic Salon and Academy",
    title: "Neelam Classic Salon & Academy | Luxury Beauty & Professional Academy",
    description:
      "Premier salon and academy led by Neelam Chourasiya offering 135+ services across Bridal Makeup, PMU, Hair Treatments, and Certified Academy Courses.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Neelam Classic Salon and Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neelam Classic Salon & Academy",
    description: "135+ Luxury Beauty Services & Professional Academy by Neelam Chourasiya.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Neelam Classic Salon and Academy",
    "telephone": "+919826747023",
    "founder": {
      "@type": "Person",
      "name": "Neelam Chourasiya",
    },
    "description":
      "Luxury beauty salon and certified academy offering 135+ services across bridal makeup, hair care, permanent makeup, and professional courses.",
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#fef8f4] text-[#1d1b19] font-sans antialiased selection:bg-[#B76E79]/20 selection:text-[#4A1330]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
