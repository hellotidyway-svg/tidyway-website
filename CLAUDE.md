# TidyWay Landing Page

## Project Overview
High-converting landing page for **TidyWay**, a residential cleaning company based in London, Ontario.
Built with Next.js 14 App Router, Tailwind CSS, and TypeScript. Ready to deploy on Vercel.

## Tech Stack
| Tool | Version |
|------|---------|
| Next.js | 14.2.5 (App Router) |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| Font | Inter (Google Fonts) |
| Deployment | Vercel |

## Brand Colors
| Name | Hex |
|------|-----|
| Deep Navy (primary) | `#0F1C3F` |
| Teal-Green (accent/CTA) | `#2DD4A7` |
| CTA Hover | `#22c497` |
| Footer Navy | `#0a1530` |
| Light Teal Tint | `#f0fdf9` |

## Project Structure
```
app/
  globals.css           – Tailwind base + Inter font + smooth scroll
  layout.tsx            – Root layout with metadata, font, Google Ads gtag script
  page.tsx              – Assembles all sections in order
  
  booking/
    page.tsx            – Post-lead-form booking page; BookingKoala embed + trust sidebar
  
  privacy-policy/
    page.tsx            – Privacy Policy with 9 sections; SMS consent & data protection clauses
  
  terms-of-service/
    page.tsx            – Terms of Service with 9 sections
  
  jobs-london/
    page.tsx            – Cleaner applicant hiring page; BookingKoala hiring form embed; Header.hideCTA=true

components/
  Header.tsx            – Sticky nav; client component (scroll state); optional hideCTA prop
  Hero.tsx              – Headline, trust badges, image, LeadForm
  LeadForm.tsx          – Lead capture; client component; pill selectors for bedrooms/bathrooms; GHL webhook + Google Ads conversion tracking + redirect to /booking
  SocialProofBar.tsx    – Stats bar below hero
  HowItWorks.tsx        – 3-step process
  Services.tsx          – 6 service cards with navy icon containers, London-specific copy, "Learn more →" links
  CleaningChecklist.tsx – Bullet-point checklist section
  Pricing.tsx           – Competitor price comparison table (TidyWay column elevated)
  WhyTidyway.tsx        – Navy background with grid texture; two-column header; 6 feature cards; 4 bottom badges
  Reviews.tsx           – 3 customer review cards; 5-star ratings
  ServiceAreas.tsx      – Neighbourhood pills; "Book Your Clean Today" button (moved from Reviews)
  Footer.tsx            – White background with navy text (reversed from original); responsive layout

public/
  favicon.svg           – Navy mop icon at 45° angle
  TidyWay Logo Horizontal.png – Logo used in Header and Footer
```

## Key Patterns & Implementation Details

### Navigation & CTAs
- All "Get My Free Quote" / "See My Price" CTAs use `<a href="#lead-form">` — works with CSS smooth scroll
- Header button uses `scrollIntoView` (client component for sticky logic)
- Header component accepts optional `hideCTA` prop to hide "Get My Free Quote" button on specific pages (e.g., /jobs-london)

### Lead Form (LeadForm.tsx)
- **Bedroom selector**: pill-style buttons ['1', '2', '3', '4', '5+'] (centered, flex flex-wrap justify-center)
- **Bathroom selector**: pill-style buttons ['1', '1.5', '2', '2.5', '3+'] (centered, flex flex-wrap justify-center)
- **Pill styling**: unselected (bg-[#F3F4F6], text-[#374151], border border-[#D1D5DB]), selected (bg-[#2DD4A7], text-[#0F1C3F])
- **Button subtext**: "✓ Takes less than 60 seconds" (text-xs, italic, text-white/80, font-normal)
- **SMS consent disclaimer**: "By providing your phone number, you agree to receive texts from TidyWay. See our Privacy Policy for details." (italic, centered, text-gray-400 text-xs)
- **Post-submission message**: "⌛ Thanks, {firstName}! You're being redirected to complete your booking."
- **Form submission flow**:
  1. User submits form (validates bedrooms & bathrooms are selected)
  2. Display thank-you state (1.5s delay)
  3. Send POST to GHL webhook: `https://services.leadconnectorhq.com/hooks/OFtHKPjNBLxDyUbUKHKF/webhook-trigger/7cc910b6-3d58-4383-a978-b33bec26bd44` with fields: firstName, email, phone, bedrooms, bathrooms
  4. Fire Google Ads conversion event (gtag with send_to: AW-17983524327/XqPACJvx454cEOebm_9C)
  5. Redirect to /booking

### Google Ads & Analytics
- gtag.js script injected in layout.tsx: `https://www.googletagmanager.com/gtag/js?id=AW-17983524327`
- Conversion tracking ID: `AW-17983524327/XqPACJvx454cEOebm_9C`
- Conversion event fires on lead form submission with event_callback before redirect

### Third-Party Integrations
- **GHL (Google Home + Lead Link)**: Webhook receives lead data on form submission
- **BookingKoala**: Embedded on /booking (main booking form) and /jobs-london (hiring form)
  - Booking embed: `https://tidyway.bookingkoala.com/booknow/home_cleaning?embed=true&bar=false&banner=false`
  - Hiring embed: `https://tidyway.bookingkoala.com/hiring/form/69bb0abb77ed7cb7689d03ef?embed=true`

### Mobile-Only Responsive Styling
Applied to Services, WhyTidyway, Reviews, and Footer for centering on mobile:
- Text alignment: `sm:text-left text-center` (mobile-centered, desktop left-aligned)
- Icon alignment: `mx-auto sm:ml-0` (icons centered on mobile, left-aligned on desktop)
- Flex direction: `flex flex-col items-center` on mobile, `md:text-left text-center` patterns

### Favicon
- SVG mop icon at 45° rotation (navy #0F1C3F)
- Located at `public/favicon.svg` (not dynamic icon.tsx)
- Configured in layout.tsx: `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`

### Images
- Hero image uses `next/image` with `fill` + `object-cover` to prevent CLS
- Unsplash image configured in `next.config.js` under `images.remotePatterns`

## Component-Specific Implementation Notes

### Header.tsx
- **hideCTA prop**: Optional boolean (defaults false); when true, hides "Get My Free Quote" button
- Usage: `<Header hideCTA={true} />` on /jobs-london page
- Logo: 50×134px TidyWay Logo Horizontal.png

### Services.tsx
- Navy icon containers (#0F1C3F background) with white SVG icons
- 6 services: Regular Cleaning, Deep Cleaning, Move In/Move Out, Apartments & Condos, Eco-Friendly, Student Move-Out
- Each card includes London-specific copy and "Learn more →" link (scrolls to #lead-form)
- Mobile centering: `sm:text-left text-center`, `mx-auto sm:ml-0` for icons

### WhyTidyway.tsx
- Dark navy background with grid texture (rgba(255,255,255,0.055) at 48px intervals)
- Radial gradients: teal at top-center, blue at bottom-right
- Two-column header (mobile: flex-col): eyebrow bubble + headline (left), description (right)
- 6 feature cards in 3×2 grid
- 4 bottom badges/pills
- Mobile centering: cards and icons centered on mobile

### Pricing.tsx
- Competitor price comparison table format
- TidyWay column elevated as "best value"
- Flat-rate pricing (varies by bedroom/bathroom count)
- Subscription discount text (bold): "Save an additional 10–20%..."

### /booking Page (app/booking/page.tsx)
- Two-column layout: BookingKoala embed (60%), trust sidebar (40%)
- Hero section: light grey background (bg-gray-100)
- Trust sidebar: 5-star review card, trust points list, navy contact card
- Contact message: "We normally reply within just a few hours!"
- Reassurance strip: 🔒 secure booking, no payment until after clean, 24-hour cancellation
- Mobile: columns stack vertically (embed first, sidebar below)

### /privacy-policy Page (app/privacy-policy/page.tsx)
- 9 sections: Information Collection, Use of Information, SMS & Communication Consent, Sharing of Information, Data Security, Cookies & Tracking, Your Rights, Updates to Policy, Contact Us
- **Section 4 (Sharing)**: Includes data protection clause — "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties."
- Contact: hello@tidyway.ca, (226) 242-9012

### /terms-of-service Page (app/terms-of-service/page.tsx)
- 9 sections: Services, Quotes & Bookings, Payments, Cancellations & Rescheduling, Satisfaction Guarantee, Communication Consent, Limitation of Liability, Changes to Terms, Contact

### /jobs-london Page (app/jobs-london/page.tsx)
- Metadata: robots noindex, nofollow (hidden from search)
- Header with hideCTA prop set to true (no "Get My Free Quote" button)
- No Footer component
- BookingKoala hiring form embed (centered)
- Logo displayed below form

### Footer.tsx
- **Reversed colors**: White background (#ffffff), navy text (#0F1C3F)
- Three-column grid: Brand, Company Links, Contact Info
- Mobile centering: `md:text-left text-center`, centered logo/links on mobile
- Phone: (226) 242-9012 (tel: +12262429012)
- Email: hello@tidyway.ca
- Links: Privacy Policy, Terms of Service, Email Link

### layout.tsx (app/layout.tsx)
- **Google Ads Integration**:
  - Script: `https://www.googletagmanager.com/gtag/js?id=AW-17983524327`
  - Inline script for gtag initialization and config
- **Fonts**: Inter (400, 500, 600, 700, 800, 900) from Google Fonts
- **Favicon**: SVG mop icon at public/favicon.svg

## Homepage Section Order
Header → Hero → SocialProofBar → HowItWorks → Services → CleaningChecklist → Pricing → WhyTidyway → Reviews → ServiceAreas → Footer

## Phone Number
All instances: **(226) 242-9012** (tel: +12262429012)

## TODO Before Launch
- [x] Replace Unsplash hero image with professional photography
- [x] Verify Google Business Profile link for reviews section (removed "Verified Google" label)
- [x] Set up GHL webhook integration for lead capture
- [x] Implement Google Ads conversion tracking
- [x] Create /booking page with BookingKoala embed
- [x] Create /privacy-policy and /terms-of-service pages
- [x] Create /jobs-london hiring page
- [x] Replace favicon with SVG mop icon
- [x] Update lead form with pill selectors and SMS consent
- [x] Reverse footer colors (white background, navy text)
- [x] Mobile-only centering for responsive sections
- [ ] Monitor and optimize lead form conversion rate
- [ ] A/B test call-to-action copy and positioning
