# Aegis Node — Frontend Build Specification

**Prompt for AI Coding Assistant.** Build the frontend only. No backend, no Supabase, no real API calls yet — use mock data and local component state. Stack: **React + Vite + Tailwind CSS**. Install `framer-motion` for animation, `react-router-dom` for routing, `lucide-react` for icons (used sparingly — see Design System), and `unsplash-js` (or plain `fetch`) for sourcing hero/section imagery from the Unsplash API. Use an env variable `VITE_UNSPLASH_ACCESS_KEY` and gracefully fall back to a set of pre-picked static Unsplash image URLs if the key isn't present, so the app never breaks visually.

This is a health-tech / medical-emergency product. The tone throughout is **calm, precise, trustworthy** — never alarmist, never "startup-generic." Think premium medical device packaging, not a SaaS landing page template.

---

## 1. Design System

### 1.1 Color Palette

Keep it restrained. Two brand colors, one alert color, neutrals do the rest of the work.

- **Ink** `#12181B` — primary text, near-black with a slight cool tone (not pure black — avoid harshness)
- **Paper** `#FAF9F6` — primary background, warm off-white (not clinical bright-white)
- **Deep Teal** `#0E4F45` — primary brand color, used for CTAs, active states, key headings. Reads as clinical trust without being a generic "health blue."
- **Signal Coral** `#E4572E` — reserved _only_ for emergency/urgency cues: the live scan indicator, critical alert badges, the "Order Your Tag" primary CTA. Never used decoratively. Its rarity is what gives it power.
- **Mist** `#E8E6E0` — borders, dividers, card backgrounds on Paper
- **Slate** `#5B6664` — secondary/muted text

No purple-blue gradients, no neon, no glassmorphism. Flat color, generous whitespace, sharp intentional contrast.

### 1.2 Typography

- **Display / Headlines:** `Fraunces` (Google Fonts) — a warm editorial serif. Used at large sizes for hero headlines and section titles. This is what makes it feel premium instead of generic tech.
- **Body / UI:** `Inter` — for all body copy, labels, buttons, forms, dashboard UI.
- Headline weights: 400–500 (never bold-heavy — let the size carry weight, not boldness).
- Generous line-height on body copy (1.6–1.7). Tight line-height on large display type (1.05–1.1).
- Type scale (desktop): hero 64–80px, H1 48px, H2 36px, H3 24px, body 17px, small 14px.

### 1.3 Spacing & Grid

- 12-column grid, max content width `1280px`, generous side padding (`24px` mobile, `64px+` desktop).
- Section vertical rhythm: `120–160px` padding-top/bottom on desktop, `64–80px` mobile. Let sections breathe — premium = whitespace.
- Border radius: small and consistent — `8px` on buttons/inputs, `16px` on cards, `24px` on large image containers. No pill buttons except small status badges.

### 1.4 Iconography & Imagery

- Icons: `lucide-react`, stroke width 1.5, used only functionally (nav, form fields, status indicators) — never as decorative filler next to every heading.
- Photography sourced from Unsplash: search terms should skew toward _real medical/clinical/human_ imagery — "paramedic," "ambulance interior," "hospital corridor," "hands," "emergency room," "clinical technology close-up." Avoid stock-photo-smiling-doctor clichés; prefer candid, documentary-style, slightly desaturated shots. Apply a subtle consistent treatment: `duotone`-adjacent — slight desaturation + a warm overlay at 4–6% opacity in Paper tone — so every photo feels part of one shot library even though sourced from different photographers.
- Always include Unsplash photographer attribution in a small unobtrusive caption/link where required by API terms.

### 1.5 Motion Principles (Framer Motion)

- Nothing should animate "because it can." Motion should always communicate state (loading, success, transition) or draw the eye to the single most important element per screen.
- Standard easing: `[0.22, 1, 0.36, 1]` (custom ease-out), duration 0.5–0.7s for section reveals, 0.2–0.3s for micro-interactions (hover, tap).
- Scroll-triggered reveals: fade + 24px translate-Y, staggered by 80ms per child in a group. Use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`.
- No parallax gimmicks, no spinning icons, no bouncing. The one place we go bigger on motion is the **hero NFC scan animation** (below) — that's the emotional centerpiece of the whole site.

---

## 2. Site Map / Page List

1. Landing Page (`/`)
2. How It Works (`/how-it-works`)
3. For Hospitals (`/hospitals`)
4. Pricing / Order (`/order`)
5. About / Mission (`/about`)
6. Auth — Sign Up / Log In (`/signup`, `/login`)
7. Onboarding — Medical Profile Setup (`/onboarding`, multi-step, post-signup)
8. User Dashboard (`/dashboard`) — patient/consumer side
9. Tag Management (`/dashboard/tag`)
10. Simulated Scan View — responder-facing demo (`/scan-demo`)
11. Hospital Triage Dashboard (`/hospital-dashboard`) — separate role/view
12. Settings (`/dashboard/settings`)
13. 404 page

Persistent global **Navbar** (transparent over hero, solid Paper on scroll) and **Footer** on all public-facing pages. Dashboard pages use a separate authenticated shell (sidebar layout) — no public navbar/footer there.

---

## 3. Landing Page (`/`) — Full Section-by-Section Breakdown

This is the flagship page. Build it with the most care.

### 3.1 Navbar

- Transparent background over the hero, logo in Paper-white, links in Paper-white at 80% opacity.
- On scroll past hero (use a scroll listener or `IntersectionObserver` on hero), background animates to solid Paper with a subtle bottom border (Mist), text flips to Ink. Animate the color/background transition over 300ms — no hard cut.
- Left: wordmark "Aegis Node" (set in Fraunces, medium weight, small NFC-wave icon mark to its left — a simple custom SVG of 2–3 concentric arcs, not a generic icon).
- Center/right nav links: How It Works, For Hospitals, Pricing, About.
- Right: "Log In" (text link) + "Get Your Tag" (solid Deep Teal button, Paper text).
- Mobile: hamburger → full-screen overlay menu, Paper background, links in large Fraunces type, staggered fade-in on open.

### 3.2 Hero Section — the centerpiece

**Layout:** Split hero, ~55/45. Left: headline + subtext + dual CTA. Right: the NFC scan visual.

- Background: Ink-dark, not Paper — the hero is the one section allowed to invert the palette for drama. Deep Ink (`#0B0F10`) background with a very faint radial vignette.
- Headline (Fraunces, 72px desktop / 40px mobile, Paper-white): "Your medical history. Ready before you arrive." — animate in with a word-by-word or line-by-line fade+rise on page load (not scroll-triggered, since it's above the fold).
- Subhead (Inter, 18px, Slate-light on dark): one to two lines explaining the offline-first NFC tag + instant hospital alert concept in plain language.
- Dual CTA row: primary Signal Coral button "Order Your Tag →", secondary ghost/outline button (Paper border, transparent) "See How It Works".
- **The NFC scan animation (right side):** This is the single most important visual on the site — build it with real care.
  - A stylized illustration/photo composite of the **back of a smartphone being tapped against a wrist-worn NFC tag/band**. Use a real Unsplash photo of a phone (search "smartphone hand dark background") as the base layer, then overlay a custom SVG/CSS animated "scan pulse": 2–3 concentric rings emanating outward from the tap point in Deep Teal, looping every 2.5s with easing, fading opacity as they expand (like a sonar ping).
  - On the pulse's "capture" moment (roughly when the ring fades), trigger a small card to fade+slide in near the phone showing a mock parsed data readout: "Blood Type: O− · Allergy: Penicillin · Synced ✓" in a small rounded Paper card with a soft shadow — reinforcing the value prop visually without needing the user to read the headline.
  - This whole animation loops continuously, subtle and ambient — not distracting, more like a "breathing" proof-of-concept than a flashy demo.
  - On mobile, simplify to a static image with just the pulse rings animating (skip the data-card sequence to conserve space/performance).

### 3.3 Trust/Stat Strip

Thin horizontal band directly under hero, Paper background, 3–4 stats in a row (e.g. "< 2 sec scan time", "100% offline capable", "0 apps to install for patients", "Auto-sync on reconnect"). Each stat: large Fraunces numeral + small Inter label underneath. Fade+rise in on scroll, staggered.

### 3.4 "The Problem" Section

Two-column: left a short, serious paragraph on the real-world problem (unconscious/non-verbal patients, no signal at accident scenes, golden-hour delays), right a large Unsplash photo (ambulance/accident-response, documentary style) in a rounded 24px container with the duotone treatment. Reveal on scroll: image scales from 1.05 → 1 with a fade as it enters viewport (subtle, not zoom-gimmicky).

### 3.5 "How It Works" — 3-Step Visual Flow

Full-width section, Mist-tinted background block to visually separate from Paper sections above/below.

- Section title centered: "From tap to treatment, in three steps."
- Three cards in a row (stack on mobile), connected by a thin animated dashed line that "draws" itself left to right on scroll (SVG stroke-dashoffset animation).
- Card 1: "Tap" — icon + short copy on the NFC tag scan, small illustrative photo.
- Card 2: "Cache" — icon + copy on offline local storage, works with zero signal.
- Card 3: "Sync & Alert" — icon + copy on auto-sync when connection returns and instant hospital dashboard alert.
- Each card: on hover (desktop), lift 4px with a soft shadow increase and border color shifts from Mist to Deep Teal — transition 200ms.

### 3.6 "For Patients" / "For Responders" — Dual Audience Split

Two large side-by-side panels (stack on mobile), each with its own photo, headline, 2-3 bullet benefits, and a text link CTA ("Get your tag →" / "See responder view →").

- Left panel (Patients): warm, human photo — someone wearing the tag/band in daily life.
- Right panel (Responders): clinical/urgent photo — a paramedic or ER hallway.
- On hover, each panel's image very subtly scales (1.0 → 1.03) and a colored underline animates under the panel's CTA link.

### 3.7 Testimonial / Credibility Strip

Since this is early-stage, frame as "Built with input from..." rather than fake testimonials — a horizontal logo/credibility strip (EMT associations, hospital partners, or "As featured in" — use placeholder neutral-gray logo blocks the dev can swap later) on a Paper background, subtle fade-in.

### 3.8 Final CTA Band

Full-width Deep Teal background, centered content: large Fraunces headline ("Seconds matter. Be ready."), single Signal Coral button "Order Your Tag". Keep this section short and high-contrast — the visual "close" of the page.

### 3.9 Footer

Paper background, top border in Mist. 4-column layout (Product, Company, Resources, Legal) collapsing to accordion on mobile. Small wordmark + one-line mission statement bottom-left, social icons bottom-right (lucide icons, small, muted). Unsplash attribution links if required, placed unobtrusively in footer legal row.

---

## 4. How It Works Page (`/how-it-works`)

Long-form, scroll-driven explainer expanding on the 3-step section from the homepage.

- Sticky left-side step navigator (desktop only) that highlights the active step as the user scrolls through right-side detailed content — a common premium-editorial pattern (numbered list, active number gets Deep Teal fill, others stay outline).
- Each step gets its own full viewport-height-ish block with a large photo, detailed copy, and a small animated diagram-style graphic (e.g., a simple animated signal-bars icon going from "no signal" gray to "connected" teal for the sync step).
- End with the same Final CTA band pattern as homepage for consistency.

## 5. For Hospitals Page (`/hospitals`)

- Hero variant: same dark treatment as homepage hero but content reframed for hospital/ER administrators — headline like "Know before they arrive."
- Feature grid (2x2 or 3-col) covering: real-time triage dashboard, pre-arrival alerts, integration-ready webhook architecture, patient data format.
- A **mock dashboard preview**: an embedded, non-functional static screenshot/illustration of the Hospital Triage Dashboard (see section 10) inside a browser-chrome frame, with a subtle floating "New Alert" toast animating in/out on a loop to bring it to life.
- CTA: "Request a Partner Demo" (opens a modal, see 4.1).

### 5.1 "Request a Demo" Modal

Triggered from multiple CTAs across the site. Centered modal, Paper background, Mist backdrop overlay at 60% opacity with blur. Animate in with scale 0.96→1 + fade, 250ms. Simple form: Name, Hospital/Org, Email, Message. Close on backdrop click, Esc key, or X button (top-right, lucide `X` icon).

---

## 6. Pricing / Order Page (`/order`)

- Clean 3-tier or single-product layout depending on business model — default to a **single hero product card** ("Aegis Node Tag — ₦X,000") since this is one physical product, not a SaaS tier ladder.
- Large product photo (can be a styled mockup/placeholder — note to swap once real product photography exists) in a soft-shadowed rounded frame, with a subtle slow auto-rotating 3D tilt on mouse-move (`framer-motion` `useMotionValue` + `useTransform` on mouseX/mouseY for a gentle parallax tilt — max 6-8 degrees, never gimmicky).
- Right side: price, 3-4 feature bullets (custom-engraved tag, lifetime data updates, works with any NFC phone, offline always), quantity selector, "Add to Cart" primary button (Signal Coral).
- Below: an accordion FAQ (What if I lose my tag? Is my data secure? Does it work internationally?) — accordion rows expand/collapse with height animation, chevron icon rotates 180°.

---

## 7. About / Mission Page (`/about`)

- Editorial long-form layout: large opening statement in Fraunces (like a magazine pull-quote), followed by mission narrative, founding story, and a simple team grid (photo, name, role) if applicable — use neutral placeholder avatars if no real team photos yet.
- One well-chosen full-bleed Unsplash image break (documentary-style, emergency response context) between sections for pacing.

---

## 8. Auth Pages (`/signup`, `/login`)

- Minimal, centered single-column card on a softly blurred/darkened version of a relevant background photo (ambulance or clinical scene, very subtle, low opacity so it doesn't compete with the form).
- Card: logo mark, headline ("Create your Aegis Node profile"), form fields (email, password, confirm on signup), primary button, and a toggle link to switch between login/signup.
- Field focus states: border animates from Mist to Deep Teal, subtle glow (box-shadow), label micro-animates upward if using floating labels.
- Inline validation with gentle shake animation (small `x` translate loop, 3 cycles, 300ms total) on error — never harsh red flash.

---

## 9. Onboarding — Medical Profile Setup (`/onboarding`)

Multi-step wizard (4 steps) immediately after signup — this is where the user builds the data that eventually gets written to their tag.

- Top progress indicator: thin horizontal bar that fills left-to-right as steps complete, plus step labels ("Basics", "Medical", "Emergency Contact", "Review").
- **Step 1 — Basics:** Name, DOB, photo upload (optional) with a nice drag-and-drop dropzone (dashed Mist border, becomes Deep Teal + subtle background tint on drag-over).
- **Step 2 — Medical:** Blood type (visual selector — 8 pill buttons in a grid, not a plain dropdown, for tactile premium feel), allergies (tag/chip input — type and press enter to add a removable chip), chronic conditions (same chip pattern).
- **Step 3 — Emergency Contact:** Name, relationship, phone.
- **Step 4 — Review:** A clean read-only summary card styled _exactly_ like what will render on a responder's scan screen — this is a nice touch, letting the user preview their own "emergency card" before confirming. Confirm button finalizes and routes to Dashboard with a success animation (checkmark draws in via SVG stroke animation, brief confetti-free celebratory scale-pulse — keep it dignified, this is medical data, not a game).
- Each step transitions via slide (translateX 24px + fade), direction-aware (forward = slide from right, back = slide from left).

---

## 10. User Dashboard (`/dashboard`)

Authenticated shell: left sidebar (Paper, Mist right-border) with nav — Overview, My Tag, Medical Profile, Settings, Log Out. Collapses to bottom tab bar on mobile.

- **Overview:** Greeting header, a visual "digital twin" card of their tag/profile (same styled emergency-card look from onboarding step 4), sync status indicator ("Last synced: 2 hours ago" with a small green dot for up-to-date, amber if a change is pending sync), and quick-edit links.
- **My Tag (`/dashboard/tag`):** Shows tag status (Active/Inactive), option to "Reissue Tag" or "Report Lost", order history for physical tags, and a small illustrative graphic of the tag itself.
- Empty/loading states matter: use skeleton loaders (pulsing Mist rectangles, not spinners) for any async-feeling content, even though this is frontend-only with mock data — build it so it's backend-ready.

---

## 11. Simulated Scan View (`/scan-demo`)

A public, no-auth demo page letting site visitors experience the responder side without needing a real NFC tag — important for the "engaging" requirement since most visitors can't test real hardware.

- Large centered "Tap to Simulate Scan" button/card with a phone-and-tag illustration matching the hero's visual language.
- On click: play the same scan-pulse animation from the hero (reused component), then transition into a mock "scanned result" screen: large, high-contrast card showing sample patient data (Name, Blood Type, Allergies, Conditions, Emergency Contact) exactly as a real paramedic would see it — big type, clear hierarchy, a small "SCANNED OFFLINE" badge in Signal Coral to reinforce the core value prop.
- Include a "Reset Demo" ghost button to replay.

---

## 12. Hospital Triage Dashboard (`/hospital-dashboard`)

Separate authenticated shell (different sidebar nav: Incoming Alerts, Patient Log, Settings) styled slightly more clinical/dense than the consumer dashboard — this audience wants information density over marketing polish, but should still follow the same design system.

- **Incoming Alerts (main view):** A live-feed list of incoming patient alerts as cards, newest at top. Each card: patient name/ID, blood type badge, allergy tags, ETA, status pill (Incoming / Arrived / Resolved).
- Simulate a "new alert" arriving: a mock button (dev/demo only, clearly labeled) that pushes a new card into the top of the list with a slide-down + highlight-flash (brief Signal Coral background tint fading to transparent over 1.5s) so it's obviously new without being obnoxious.
- Clicking a card expands into a detail drawer (slides in from the right, 400px wide desktop / full-screen mobile) with full patient data and a "Mark as Arrived" action button.

---

## 13. Settings Page (`/dashboard/settings`)

Standard account settings — profile info, password change, notification preferences (toggle switches — custom-styled, Deep Teal when active, smooth 200ms slide), danger zone (delete account) visually separated with a thin coral-tinted border, not a jarring red block.

## 14. 404 Page

On-brand, not generic — reuse the dark hero treatment with a simple line "This page didn't sync." + button back to home. Keep the humor dry, not cutesy, consistent with the calm/precise brand voice.

---

## 15. Responsive Behavior — General Rules

- Breakpoints: mobile `<640px`, tablet `640–1024px`, desktop `1024px+`, wide `1440px+` (cap content width, don't stretch).
- Hero and all major sections: stack to single column below `1024px`, image-first or text-first per section as noted above.
- Touch targets minimum 44px on mobile. No hover-dependent functionality — every hover effect must have a tap/click equivalent state.
- Reduce motion: respect `prefers-reduced-motion` — wrap Framer Motion animations to fall back to simple opacity fades with no translate/scale when this is set.

## 16. Component Library to Build (Reusable)

Button (primary/secondary/ghost, 3 sizes), Card, Modal, Drawer, Badge/Pill, Chip Input, Accordion, Toggle Switch, Skeleton Loader, Toast/Notification, Stepper/Progress Bar, Navbar, Footer, Sidebar Nav (two variants: consumer + hospital).

## 17. Packages to Install

```
npm install react-router-dom framer-motion lucide-react clsx
npm install -D tailwindcss postcss autoprefixer
```

Fonts: load `Fraunces` and `Inter` via Google Fonts `<link>` or `@fontsource` packages for better performance (`@fontsource/fraunces`, `@fontsource/inter`).

---

**Deliverable order for the AI coding assistant:** (1) design tokens in `tailwind.config.js` + global fonts, (2) shared component library, (3) Landing Page in full, (4) remaining public pages, (5) auth + onboarding flow, (6) consumer dashboard, (7) hospital dashboard, (8) scan demo page, (9) responsive QA pass, (10) reduced-motion + accessibility pass.
