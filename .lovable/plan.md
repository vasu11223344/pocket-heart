## Goal
Turn the site into a complete Green Spark Solar product: editable hero/about, services breakdown, partners, calculator, AI chatbot, location map, gallery, and customer reviews — with admin controls for everything.

## What I'll build

### 1. Database additions (one migration)
- Extend `site_settings` with: `address_head_office`, `address_branch_office`, `branches_list`, `email_secondary`, `phone_secondary`, `map_embed_url`, `loan_info`, `warranty_years`.
- New table `testimonials` (name, location, rating 1-5, message, avatar_url, published, sort_order) — admin CRUD, public read of published.
- New table `gallery_images` (image_url, caption, sort_order, published) — admin CRUD, public read of published.
- Seed defaults from the flyer (phones 9652847145 / 9100864364 / 6302021671, email greensparksolar11@gmail.com, head office Yerrabalem/Mangalagiri, branch Addanki, branches list).

### 2. Public site updates
- **Home (`/`)**: hero text, about heading, contact numbers all read from `site_settings` (replace hardcoded). Add new sections:
  - "What We Do" — 3 cards: Residential, Commercial, Farm + battery storage.
  - "Partners" strip — Waaree, Tata Solar, Adani Solar logos.
  - "Subsidy & Loans" — 1kW ₹30k, 2kW ₹60k, 3-10kW ₹78k; 25-yr warranty; we handle loan + subsidy paperwork.
  - "Gallery" preview (latest 6 images, link to full page).
  - "Reviews" — testimonial cards with star ratings.
  - Embedded Google Map for the head office.
- **About (`/about`)**: rewrite with company info, what we do, why choose us, partners.
- **New `/calculator`**: solar savings calculator. Inputs: monthly bill OR system size (kW), state subsidy auto-calc (1kW=30k, 2kW=60k, 3-10kW=78k), shows: estimated cost, subsidy, net cost, monthly savings, payback years, 25-yr savings. Added to nav.
- **New `/gallery`**: all published gallery images.
- **AI Chatbot**: floating button (bottom-left, opposite WhatsApp). Opens chat panel. Powered by Lovable AI (`google/gemini-2.5-flash`) via a server function with system prompt scoped to Green Spark Solar offerings, subsidy info, contact details. Streams responses.

### 3. Admin additions
- New `/admin/testimonials` — CRUD with star rating + publish toggle.
- New `/admin/gallery` — upload images to existing `project-images` bucket, caption, publish toggle, sort.
- Extend `/admin/settings` with new fields (addresses, branches, phones, map URL, warranty, loan blurb).
- Admin login already exists at `/admin/login` (email/password). I'll add a small note on the home/about footer that admin access is at `/admin`.

### 4. Settings hook update
- Expand `useSettings` to expose all new fields.

## Technical details
- Chatbot: `createServerFn` POST to `https://ai.gateway.lovable.dev/v1/chat/completions` with `LOVABLE_API_KEY` (already set), streams via async generator. System prompt embeds current `site_settings` so answers stay accurate when admin updates info.
- Map: simple `<iframe src={settings.map_embed_url}>` — admin pastes any Google Maps embed URL; default seeded to Mangalagiri coords.
- Calculator: pure client-side React, no backend needed. Formula:
  - System cost ≈ ₹70,000/kW (editable in settings later if needed; hardcoded for now).
  - Subsidy: kW=1→30k, 2→60k, 3-10→78k, >10→78k.
  - Monthly generation ≈ 120 units/kW; savings ≈ units × ₹7.
- Gallery uploads reuse existing `project-images` bucket and admin RLS.

## Out of scope (ask if you want)
- Per-user accounts beyond admin.
- SMS/email notifications on form submit (sheet sync already exists).
- Multi-language (Telugu) toggle.

Approve and I'll execute the migration + build all of the above in one pass.