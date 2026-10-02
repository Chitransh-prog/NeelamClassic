# Neelam Classic Salon & Academy

A luxury, production-grade web application and secure **Admin Management Suite** built for **Neelam Classic Salon & Academy** (Founder & Master Aesthetician: Neelam Chourasiya).

Built with **Next.js 16 (App Router, Turbopack)**, **Neon Serverless PostgreSQL (Lakebase Postgres)**, **Prisma ORM (@prisma/adapter-neon)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🎨 Brand Design System

- **Deep Plum (Primary):** `#4A1330`
- **Rose Gold (Accent):** `#B76E79`
- **Champagne Gold (Highlight):** `#C9A66B`
- **Ivory (Background):** `#FFF9F5`
- **Blush (Surface):** `#F8E8EC`
- **Text:** `#2B1B24`
- **Muted:** `#7A6470`
- **Typography:** Strictly **Poppins** across the entire public website and admin portal.
- **Privacy & Safety:** Strictly no map or physical address anywhere on the website or invoices (client contact strictly via direct phone and WhatsApp).

---

## 🚀 Setup & Local Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Configuration
Copy the template to `.env.local` and `.env`:
```bash
cp .env.example .env.local
cp .env.example .env
```

Ensure the following variables are defined in `.env.local` (and `.env` for Prisma CLI):
```env
# Neon Database Connection Strings
DATABASE_URL="postgresql://user:password@ep-xxxx-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxxx.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Cryptographic JWT Secrets
JWT_ACCESS_SECRET="generate-strong-random-secret"
JWT_REFRESH_SECRET="generate-strong-random-secret"

# Default Admin Credentials
ADMIN_EMAIL="neelamclassicsalon@gmail.com"
ADMIN_PASSWORD="neelamsalon"

# Optional Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 3. Sync Database Schema & Seed Data
Push the schema to your Neon branch and run the seed script:
```bash
# Push schema to PostgreSQL
npx prisma db push

# Seed initial admin, categories, 135+ services, reviews, and site content
npx tsx prisma/seed.ts
```

### 4. Start the Development Server
```bash
npm run dev
```
- Public Website: [http://localhost:3000](http://localhost:3000)
- Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🌿 Neon Branch Workflow (Dev vs. Production)

This project uses Neon's branch-first workflow to ensure migrations and content updates are tested in complete isolation without risking production data.

### Neon Branches Configured:
- **`production`**: Live database powering the production Vercel deployment.
- **`dev`**: Isolated copy-on-write branch used for local development, schema migrations, and initial seeding.

### Switching Between Branches:
```bash
# Switch to dev branch and pull its environment variables
neon checkout dev

# Switch to production branch
neon checkout production

# See differences between dev and production
neon diff
```

### Applying Changes to Production:
1. Test and verify all migrations and features on the `dev` branch.
2. Checkout the production branch:
   ```bash
   neon checkout production
   ```
3. Run migrations on production direct URL:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
4. Re-pin `dev` for your day-to-day work:
   ```bash
   neon checkout dev
   ```

---

## ☁️ Vercel Deployment

1. **Deploy to Vercel**:
   - Connect your GitHub repository to [Vercel](https://vercel.com).
   - In Project Settings → **Functions**, the deployment region is configured to **`cle1` (Cleveland, Ohio / us-east-2)** via `vercel.json` to ensure single-millisecond proximity to the Neon Postgres database.

2. **Add Environment Variables in Vercel Dashboard**:
   - `DATABASE_URL`: Production pooled connection string (`-pooler`).
   - `DIRECT_URL`: Production unpooled direct connection string.
   - `JWT_ACCESS_SECRET`: 64-character random hex string.
   - `JWT_REFRESH_SECRET`: 64-character random hex string.
   - `ADMIN_EMAIL`: `neelamclassicsalon@gmail.com`
   - `ADMIN_PASSWORD`: Your chosen secure master password.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional, falls back to `/public/uploads`).

3. **Deploy**:
   - Vercel automatically runs `npm run build`, generating the static ISR public site and dynamic admin serverless routes.

---

## 📖 How the Owner Edits the Website & Manages the Salon

A simple, non-technical guide for **Neelam Chourasiya** to manage the salon from a laptop or mobile phone:

### 1. Accessing the Admin Panel
1. Open `https://your-domain.com/admin/login` on any phone or computer.
2. Enter your Admin Email (`neelamclassicsalon@gmail.com`) and password.
3. *First time logging in:* The system will prompt you to set a strong personal password (at least 10 characters, including a number and symbol).

### 2. Visually Editing the Website (`/admin/editor`)
- Navigate to **Edit Website** from the sidebar or mobile menu.
- **Live Device Preview**: Switch between **Desktop**, **Tablet**, and **Mobile** view to see how your site looks on clients' phones.
- **Editing Text**: Click any headline, paragraph, or badge in the right inspector to edit text in real time.
- **Replacing Photos**: Click the camera icon next to any image field to pick an existing image or upload a fresh transformation photo directly from your device.
- **Saving vs Publishing**:
  - As you type, changes are automatically saved to your private **Draft**.
  - When ready to make changes visible to clients worldwide, click the dark plum **Publish Live** button. The website updates instantly without waking the database!
- **Version History**: Made a mistake? Click **Versions** in the top bar to restore any of the last 20 published versions in 1 click.

### 3. Managing Services & Pricing (`/admin/services`)
- Add or modify any of the 135+ services across Hair, Makeup, PMU, and Skin.
- Set display price ranges (e.g., `₹5,000 to ₹10,000`) or fixed prices.
- These prices automatically update the public pricing tables and become available in the invoice generator.

### 4. Client Enquiries (`/admin/enquiries`)
- When a client fills out the appointment form on the website, two things happen automatically:
  1. WhatsApp opens with their pre-filled appointment request.
  2. The enquiry is saved in your admin dashboard.
- Click **WhatsApp** next to any enquiry to reply directly to the client.
- Click **Invoice** to instantly create a new bill with the client's name and phone number prefilled!

### 5. Creating & Sharing Invoices (`/admin/invoices`)
1. Click **Create New Invoice** (`/admin/invoices/new`).
2. Type or select the client's name and phone number.
3. In the line items section, click the **⚡ Pick service...** dropdown to pick any service (e.g. *Signature Bridal HD Makeup*) or type a custom item.
4. Add any bridal discounts or advance payment received (e.g. ₹5,000 advance).
5. Click **Save & Generate Invoice**.
6. On the invoice page:
   - Click **WhatsApp** to send a professional pre-formatted invoice summary directly to the client.
   - Click **Download PDF** to get a branded A4 PDF with the salon monogram, itemized breakdown, and Indian currency words.
   - Click **Add Payment** whenever the client pays the remaining balance.

---

## ✅ Test Checklist

Verify the entire workflow end-to-end:

- [x] **Database & Branching**: Neon `dev` branch created and seeded with all 135+ services, categories, and site sections.
- [x] **Admin Authentication**: Navigate to `/admin/login`, submit credentials, verify JWT cookie issuance and rate limiting.
- [x] **Forced Password Update**: First login enforces `/admin/settings/password` (min 10 chars, 1 number, 1 symbol).
- [x] **Admin Shell & Mobile Nav**: Responsive plum sidebar on desktop, bottom tab bar and hamburger on mobile.
- [x] **Visual Website Editor**:
  - Edit a headline or description in `/admin/editor`.
  - Preview in Desktop, Tablet, and Mobile frames.
  - Autosaves to draft state.
  - Click **Publish Live** to revalidate ISR cache.
- [x] **Services & Pricing**: Add a service, change a price, verify category grouping.
- [x] **Photo Gallery**: Upload a photo, assign a category (Bridal, Makeup, PMU, Hair, Academy), view preview card.
- [x] **Testimonials**: Add and hide client reviews with star ratings and verified tags.
- [x] **Public Enquiry Form**: Fill out the appointment form on the home page, verify honeypot check, verify database record created, and verify WhatsApp launch.
- [x] **Invoice Creation**:
  - Create invoice with customer details, pick items from service catalog.
  - Verify calculations: subtotal, line discounts, GST toggle, advance paid, balance due.
  - Verify Indian numbering to words (e.g., *Fifteen Thousand Rupees Only*).
- [x] **Invoice Output**:
  - Generate branded A4 PDF via `@react-pdf/renderer`.
  - Share invoice on WhatsApp via `wa.me` with prefilled message.
  - Record part-payment and mark as paid.
