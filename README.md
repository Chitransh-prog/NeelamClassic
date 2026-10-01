# Neelam Classic Salon and Academy

A luxury, production-ready, fully responsive web application built for **Neelam Classic Salon & Academy** (Founder: Neelam Chourasiya).

Designed with a mobile-first philosophy, rich rose-gold/champagne aesthetics, single-font typographic hierarchy (Poppins), and smooth animations.

---

## 🎨 Design System

- **Deep Plum (Primary):** `#4A1330`
- **Rose Gold (Accent):** `#B76E79`
- **Champagne Gold (Highlight):** `#C9A66B`
- **Ivory (Background):** `#FFF9F5`
- **Blush (Surface):** `#F8E8EC`
- **Text:** `#2B1B24`
- **Muted:** `#7A6470`
- **Typography:** Exclusively **Poppins** via `next/font/google` (Weights: 300, 400, 500, 600, 700; Subsets: Latin, Devanagari).

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📸 Managing Photos (`/public/images/`)

All photos should be placed in the `/public/images/` directory:

| Filename | Purpose | Recommended Aspect Ratio |
| :--- | :--- | :--- |
| `logo.png` / `NC logo.png` | Official brand circular monogram insignia used in navbar, footer, badges & favicon | 1:1 Square |
| `hero.jpg` | Main Hero section photo with rose-gold aura backdrop | 4:5 or Portrait |
| `owner.jpg` | Founder Neelam Chourasiya in About section | 3:4 or Portrait |
| `academy-1.jpg` | Academy Studio & Practical Mentorship session | 4:3 or Landscape |
| `gallery-1.jpg` | Royal Bridal Look | 4:5 Portrait |
| `gallery-2.jpg` | HD Luminous Party Finish | 4:5 Portrait |
| `gallery-3.jpg` | Microblading Brow Enhancement | 4:5 Portrait |
| `gallery-4.jpg` | Traditional Bridal Updo | 4:5 Portrait |
| `gallery-5.jpg` | Academy Hands-on Mentorship | 4:5 Portrait |
| `gallery-6.jpg` | Sunny Haldi Festive Glow | 4:5 Portrait |
| `gallery-7.jpg` | Natural Velvet Lip Blush PMU | 4:5 Portrait |
| `gallery-8.jpg` | Lustrous Hair Smoothening | 4:5 Portrait |

> **Graceful Blush Fallback:** If any image file is missing, the site will automatically render a customized blush-colored placeholder card (`#F8E8EC`) with subtle gold accents, salon icon, and label. No broken image icons or generic stock images from the internet are shown.

---

## ✏️ How to Edit Content & Services

All services, prices, academy courses, and reviews are located in a single, typed file:
`data/services.ts`

### 1. Editing the 135+ Services Categories
Open `data/services.ts` and modify `SERVICE_CATEGORIES`:
- `name`: Category title (e.g. *Hair Cut & Wash*, *Skin Services*)
- `count`: Number of available service variations (summing to 135)
- `description`: Subtitle description

### 2. Editing Makeup & PMU Price List
Modify `MAKEUP_PRICING` in `data/services.ts` under keys:
- `basic`: Simple Makeup, Light Makeup, Day Makeup, Night Makeup, Natural Makeup
- `party`: Party, HD, Shimmer, Smokey Eye, Glam, Cocktail
- `bridal`: Bridal, HD Bridal, Airbrush, Haldi, Engagement, Glass Skin, Soft Glam, Signature
- `permanent`: Eyebrow PMU, Lip Blush, Eyeliner, Lashes, BB Glow Foundation, Full Face PMU, Ear Pasting, Ear Piercing

Each service includes a small "Book" button that automatically creates a pre-filled WhatsApp link:
```ts
https://wa.me/919826747023?text=Hi%20Neelam%20Classic%20Salon...
```

### 3. Editing Academy Courses
Modify `ACADEMY_COURSES` in `data/services.ts`:
- Course titles, duration, practical modules, and certification names.

### 4. Editing Testimonials
Modify `TESTIMONIALS` in `data/services.ts`:
- Client name, service received, 5-star rating, review text, and date.

### 5. Editing Contact Information
Modify `lib/utils.ts`:
- Salon Name, Owner Name, Helpline: `9826747023`, and WhatsApp message templates.

---

## 🔒 Privacy & Compliance
- As requested, **NO Google Maps embeds, geolocation coordinates, or address blocks** are present anywhere on this site.
- Booking and enquiries are handled securely via direct phone calls and WhatsApp messaging.
