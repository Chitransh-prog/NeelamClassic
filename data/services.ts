export interface ServiceCategory {
  id: string;
  name: string;
  count: number;
  description: string;
  iconName: string;
  image: string;
  tag?: string;
}

export interface MakeupServiceItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  duration?: string;
  popular?: boolean;
}

export interface AcademyCourse {
  id: string;
  title: string;
  duration: string;
  mode: string;
  description: string;
  highlights: string[];
  certificate: string;
  image?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "Bridal" | "Makeup" | "Hair" | "Academy" | "Skin" | "Permanent";
}

// 1. All Salon Categories (Total 135 services across 10 categories)
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "hair-cut-wash",
    name: "Hair Cut & Wash",
    count: 22,
    description: "Custom precision haircuts, advanced textured styling, refreshing washes, and blowouts tailored to your face shape.",
    iconName: "Scissors",
    image: "/images/cat-haircut.jpg",
    tag: "Signature",
  },
  {
    id: "hair-treatment",
    name: "Hair Treatment",
    count: 7,
    description: "Intense moisture therapies, deep conditioning, and molecular repair treatments for damaged and brittle strands.",
    iconName: "Sparkles",
    image: "/images/cat-treatment.jpg",
  },
  {
    id: "scalp-treatment",
    name: "Scalp Treatment",
    count: 5,
    description: "Anti-dandruff solutions, scalp detox, soothing nourishment, and follicle revitalizing therapies.",
    iconName: "Droplets",
    image: "/images/cat-scalp.jpg",
  },
  {
    id: "hair-repair-smoothening",
    name: "Hair Repair / Smoothening",
    count: 14,
    description: "Keratin, Botox, Nanoplastia, and organic smoothening treatments for silky, frizz-free, luminous hair.",
    iconName: "Feather",
    image: "/images/cat-smoothening.jpg",
    tag: "Most Popular",
  },
  {
    id: "hair-styling",
    name: "Hair Styling",
    count: 17,
    description: "Bridal updos, Hollywood waves, contemporary braids, textured curls, and party hairstyle creations.",
    iconName: "Flame",
    image: "/images/cat-styling.jpg",
  },
  {
    id: "hair-chemical",
    name: "Hair Chemical Services",
    count: 6,
    description: "Global hair color, Balayage, Ombré, Highlights, and root touch-up with ammonia-free premium formulations.",
    iconName: "Palette",
    image: "/images/cat-color.jpg",
  },
  {
    id: "skin-services",
    name: "Skin Services",
    count: 23,
    description: "Hydra facials, bridal radiance rituals, anti-aging therapies, D-tan, clean-ups, and glow enhancements.",
    iconName: "HeartPulse",
    image: "/images/cat-facial.jpg",
    tag: "Essential",
  },
  {
    id: "body-care",
    name: "Body Care",
    count: 14,
    description: "Luxury body polishes, relaxing wellness massages, waxing rituals, manicure, and pedicure spa pampering.",
    iconName: "Flower2",
    image: "/images/cat-spa.jpg",
  },
  {
    id: "makeup",
    name: "Makeup",
    count: 19,
    description: "Flawless Bridal, HD, Airbrush, Haldi, Engagement, and Party makeup designed for timeless photography.",
    iconName: "Crown",
    image: "/images/cat-makeup.jpg",
    tag: "Speciality",
  },
  {
    id: "permanent-makeup",
    name: "Permanent Makeup (PMU)",
    count: 8,
    description: "Advanced Microblading, Lip Blush, Eyeliner, and BB Glow permanent enhancements by certified artists.",
    iconName: "Gem",
    image: "/images/cat-pmu.jpg",
    tag: "Advanced Tech",
  },
];

export const TOTAL_SERVICES = 135;

// 2. Makeup Price List by Category Tabs
export const MAKEUP_PRICING: Record<
  "basic" | "party" | "bridal" | "permanent",
  { title: string; subtitle: string; items: MakeupServiceItem[] }
> = {
  basic: {
    title: "Basic Makeup",
    subtitle: "Effortless, natural beauty for daily gatherings, corporate meets, and intimate occasions.",
    items: [
      { id: "bm-1", name: "Simple Makeup", price: "₹999", description: "Clean, even base with subtle eye definition and delicate lip tint." },
      { id: "bm-2", name: "Light Makeup", price: "₹999", description: "Featherlight coverage perfect for casual brunches or college celebrations." },
      { id: "bm-3", name: "Day Makeup", price: "₹999", description: "Daylight-friendly natural palette that stays fresh and smudge-free." },
      { id: "bm-4", name: "Night Makeup", price: "₹1499", description: "Enhanced contouring and deepened eye tones tailored for evening ambiance." },
      { id: "bm-5", name: "Natural Makeup", price: "₹2000", description: "Minimalist 'no-makeup' makeup look emphasizing radiant, healthy skin.", popular: true },
    ],
  },
  party: {
    title: "Party Makeup",
    subtitle: "Glamorous, camera-ready statements for cocktail evenings, sangeet, and festive celebrations.",
    items: [
      { id: "pm-1", name: "Party Makeup", price: "₹2000", description: "Vibrant party look with customized blush, highlights, and matching lipstick." },
      { id: "pm-2", name: "HD Makeup", price: "₹2499", description: "High-definition micro-pigment finish that photographs flawlessly without flashback.", popular: true },
      { id: "pm-3", name: "Shimmer Makeup", price: "₹2499", description: "Luminous dewy glow featuring fine champagne and rose shimmer highlights." },
      { id: "pm-4", name: "Smokey Eye Makeup", price: "₹2499", description: "Classic or modern gradient smokey eyes paired with balanced nude lips." },
      { id: "pm-5", name: "Glam Makeup", price: "₹2499", description: "Bold dramatic lashes, sharp winged liner, and sculpted cheekbones." },
      { id: "pm-6", name: "Cocktail Makeup", price: "₹2499", description: "Sleek, cosmopolitan chic tailored for evening dresses and black-tie affairs." },
    ],
  },
  bridal: {
    title: "Bridal Makeup",
    subtitle: "Bespoke royal bridal transformations crafted to make your wedding day utterly unforgettable.",
    items: [
      { id: "brm-1", name: "Bridal Makeup", price: "₹5000", description: "Traditional bridal elegance with long-lasting waterproof luxury formulas." },
      { id: "brm-2", name: "HD Bridal Makeup", price: "₹7000", description: "Ultra-fine HD perfection for 4K video shoots and wedding photography.", popular: true },
      { id: "brm-3", name: "Airbrush Makeup", price: "₹3000", description: "Ultra-smooth airbrush mist delivering seamless, lightweight, humidity-resistant coverage." },
      { id: "brm-4", name: "Haldi Look Makeup", price: "₹3000", description: "Fresh, playful dewy makeover complemented with yellow floral aesthetics." },
      { id: "brm-5", name: "Engagement Makeup", price: "₹3000", description: "Romantic, graceful elegance crafted for ring ceremonies and pre-wedding functions." },
      { id: "brm-6", name: "Glass Skin Makeup", price: "₹10000", description: "Korean-inspired hyper-radiant, poreless finish with rich hydrating elixirs." },
      { id: "brm-7", name: "Soft Glam Makeup", price: "₹10000", description: "Muted luxury tones, velvety skin, and softly blended hazel accents." },
      { id: "brm-8", name: "Signature Makeup", price: "₹15000", description: "The pinnacle of bridal artistry personally curated by Neelam Chourasiya with premium international kits.", popular: true },
    ],
  },
  permanent: {
    title: "Permanent Makeup (PMU)",
    subtitle: "Precision semi-permanent aesthetics and clinical piercings performed with sterile medical-grade equipment.",
    items: [
      { id: "pmu-1", name: "Eyebrow PMU (Microblading / Ombre)", price: "₹4999 to ₹10000", description: "Hair-like realistic strokes or powder shading for naturally full, framed brows." },
      { id: "pmu-2", name: "Permanent Lip Blush / Lip Colour", price: "₹6999 to ₹25000", description: "Youthful tint, symmetry correction, and delicate flush that lasts 2-3 years.", popular: true },
      { id: "pmu-3", name: "Permanent Eyeliner", price: "₹7999 to ₹15000", description: "Smudge-proof lash-enhancement or winged definition for daily elegance." },
      { id: "pmu-4", name: "Permanent Eyelashes", price: "₹9999 to ₹15000", description: "Long-term lash styling and extension enhancements for voluminous flutter." },
      { id: "pmu-5", name: "Permanent Foundation (BB Glow)", price: "₹12000 to ₹30000", description: "Semi-permanent peptide serum infusion for an even-toned, illuminated complexion." },
      { id: "pmu-6", name: "Full Face PMU", price: "₹25000 to ₹50000", description: "Comprehensive face enhancement including brows, lip blush, liner, and BB glow.", popular: true },
      { id: "pmu-7", name: "Ear Pasting", price: "₹1000 to ₹2000", description: "Safe, aesthetic torn earlobe correction and closure without invasive surgery." },
      { id: "pmu-8", name: "Ear Piercing", price: "₹1000 to ₹2000", description: "Hygienic, painless precision piercing with sterile hypoallergenic studs." },
    ],
  },
};

// 3. Academy Training Courses
export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: "course-makeup",
    title: "Masterclass in Professional Makeup Artistry",
    duration: "1 to 2 Months",
    mode: "Hands-on Practical Studio",
    image: "/images/gallery-5.jpg",
    description: "Master bridal, HD, airbrush, festive, and editorial makeup techniques under the direct mentorship of Neelam Chourasiya.",
    highlights: [
      "Skin preparation & undertone theory",
      "HD bridal, Haldi & cocktail looks",
      "Airbrush gun operation & product chemistry",
      "Live model practical assessments & portfolio shoot",
    ],
    certificate: "Professional Makeup Artist Certificate",
  },
  {
    id: "course-hair",
    title: "Advanced Hair Designing & Chemical Tech",
    duration: "1 Month",
    mode: "Practical Intensive",
    image: "/images/cat-styling.jpg",
    description: "From classic scissor techniques to trending balayage, keratin infusions, and bridal hair sculpts.",
    highlights: [
      "Face-shape based haircutting techniques",
      "Color theory, balayage & highlights",
      "Keratin, Botox & Nanoplastia therapies",
      "Bridal buns, Hollywood waves & texturing",
    ],
    certificate: "Master Hair Stylist Certificate",
  },
  {
    id: "course-skin",
    title: "Clinical Skin Aesthetics & Facial Therapy",
    duration: "3 to 4 Weeks",
    mode: "Theory + Clinical Practice",
    image: "/images/cat-facial.jpg",
    description: "Scientific skin diagnosis, acne/pigmentation management, high-tech facials, and anti-aging treatments.",
    highlights: [
      "Dermatological skin anatomy & analysis",
      "Hydra-facial machine protocols",
      "Chemical peels & organic brightening",
      "Client consultation & hygiene standards",
    ],
    certificate: "Certified Aesthetician Diploma",
  },
  {
    id: "course-pmu",
    title: "Permanent Makeup (PMU) & Microblading",
    duration: "2 to 3 Weeks",
    mode: "Specialized Master Workshop",
    image: "/images/gallery-3.jpg",
    description: "State-of-the-art semi-permanent cosmetic tattooing including brows, lip blush, and eyeliner artistry.",
    highlights: [
      "Microblading & powder ombré brow mapping",
      "Lip blush contouring & color corrections",
      "Sterilization, needles & anesthesia protocols",
      "Client aftercare & consent documentation",
    ],
    certificate: "Certified PMU Practitioner Diploma",
  },
];

// 4. Testimonials (Easily editable reviews)
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "rev-1",
    name: "Pooja Sharma",
    service: "Signature Bridal Makeup",
    rating: 5,
    comment: "Neelam ma'am made my wedding day magical! My bridal look was so elegant, natural, and lasted from the morning pheras till late night without a single crease. Everyone was complimenting the subtle glow.",
    date: "February 2026",
  },
  {
    id: "rev-2",
    name: "Dr. Ananya Verma",
    service: "Permanent Lip Blush & Brow PMU",
    rating: 5,
    comment: "I was nervous about permanent makeup, but Neelam Classic's hygienic environment and Neelam ji's gentle precision completely put me at ease. The brow shape and lip tint look so effortless every single day!",
    date: "January 2026",
  },
  {
    id: "rev-3",
    name: "Sakshi Gupta",
    service: "Academy Makeup Diploma Graduate",
    rating: 5,
    comment: "Enrolling in Neelam Classic Academy was the best career decision. The personal attention, practical hands-on training with real models, and business guidance helped me start taking my own bridal bookings!",
    date: "December 2025",
  },
  {
    id: "rev-4",
    name: "Meera Rathore",
    service: "Hair Repair & Nanoplastia",
    rating: 5,
    comment: "My hair had become rough and frizzy after repeated heat styling. The hair repair smoothening here transformed my hair into pure silk. Outstanding service and warm hospitality.",
    date: "February 2026",
  },
  {
    id: "rev-5",
    name: "Ritu Soni",
    service: "Party & Engagement Makeup",
    rating: 5,
    comment: "Booked them for my brother's engagement. The HD makeup stayed pristine throughout the evening dancing. Neelam Classic is our family's go-to salon for all occasions.",
    date: "January 2026",
  },
];

// 5. Gallery Items (Mapped to user-provided photos in /public/images/)
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    src: "/images/gallery-1.jpg",
    alt: "Royal Bridal Makeup Look at Neelam Classic Salon",
    title: "Royal Bridal Glamour",
    category: "Bridal",
  },
  {
    id: "gal-2",
    src: "/images/gallery-2.jpg",
    alt: "HD Party Makeup and Soft Glow Styling",
    title: "HD Luminous Party Finish",
    category: "Makeup",
  },
  {
    id: "gal-3",
    src: "/images/gallery-3.jpg",
    alt: "Microblading and Precision Eyebrow PMU",
    title: "Microblading Brow Enhancement",
    category: "Permanent",
  },
  {
    id: "gal-4",
    src: "/images/gallery-4.jpg",
    alt: "Intricate Bridal Hair Bun with Floral Accents",
    title: "Traditional Bridal Updo",
    category: "Hair",
  },
  {
    id: "gal-5",
    src: "/images/gallery-5.jpg",
    alt: "Neelam Classic Academy Practical Training Session",
    title: "Hands-on Academy Mentorship",
    category: "Academy",
  },
  {
    id: "gal-6",
    src: "/images/gallery-6.jpg",
    alt: "Radiant Haldi Ceremony Makeup Artistry",
    title: "Sunny Haldi Festive Glow",
    category: "Bridal",
  },
  {
    id: "gal-7",
    src: "/images/gallery-7.jpg",
    alt: "Permanent Lip Blush Tinting Demonstration",
    title: "Natural Velvet Lip Blush",
    category: "Permanent",
  },
  {
    id: "gal-8",
    src: "/images/gallery-8.jpg",
    alt: "Luxury Hair Smoothening and Gloss Treatment",
    title: "Lustrous Hair Smoothening",
    category: "Hair",
  },
];
