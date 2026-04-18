# Tidyway Landing Page

## Project Overview
High-converting landing page for **Tidyway**, a residential cleaning company based in London, Ontario.
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
  globals.css       – Tailwind base + Inter font + smooth scroll
  layout.tsx        – Root layout with metadata and font link
  page.tsx          – Assembles all sections in order
  icon.tsx          – Dynamic favicon (navy "T" in teal)
components/
  Header.tsx        – Sticky nav; client component (scroll state)
  Hero.tsx          – Headline, trust badges, image, LeadForm
  LeadForm.tsx      – Lead capture form; client component (form state)
  SocialProofBar.tsx – Stats bar below hero
  HowItWorks.tsx    – 3-step process
  Services.tsx      – 6 service cards (3×2 grid)
  Pricing.tsx       – Flat-rate pricing table
  WhyTidyway.tsx    – 6 trust points (2-col)
  Reviews.tsx       – 3 Google review cards
  ServiceAreas.tsx  – Neighbourhood pills
  FinalCTA.tsx      – Navy CTA banner
  Footer.tsx        – Dark navy footer
```

## Key Patterns
- All "Get My Free Quote" / "See My Price" CTAs use `<a href="#lead-form">` — works with CSS smooth scroll
- Header button uses `scrollIntoView` (it's already a client component for sticky logic)
- Form submission shows inline thank-you state; no backend integration yet
- Hero image uses `next/image` with `fill` + `object-cover` to prevent CLS
- Unsplash image configured in `next.config.js` under `images.remotePatterns`

## TODO Before Launch
- [ ] Replace `(226) XXX-XXXX` with real phone number
- [ ] Replace `hello@tidyway.ca` with real email
- [ ] Replace Unsplash hero image with professional photography
- [ ] Connect lead form to a backend (e.g., Resend email, HubSpot, or a simple API route)
- [ ] Add Google Analytics / Meta Pixel
- [ ] Verify Google Business Profile link for reviews section
