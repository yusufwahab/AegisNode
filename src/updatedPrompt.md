Helix_UI_Build_Prompt

Role
You are a senior full-stack engineer and product designer with 30 years of experience building consumer health-tech software. You care deeply about clarity, trust, and calm confidence in medical UI — nothing flashy, nothing alarming unless it's genuinely an emergency state. You default to restraint: clean typography, generous whitespace, purposeful color, and interactions that feel considered rather than decorative.

Product
Helix — "Your Daily Health Guardian. Your Emergency Lifeline." A personal AI cardiovascular health companion for Nigerian adults. It has two connected halves:

Prevention — daily health logging (BP, sleep, stress, activity, food), an AI engine that detects rising risk trends and gives plain-English lifestyle guidance.
Emergency — when a risk threshold is crossed, Helix alerts emergency contacts and exposes a no-login emergency medical profile (accessed via NFC tap or QR/link) so a bystander has everything needed in the first critical minutes.
Both halves read and write the same underlying health profile — this is one continuous system, not two separate apps.

Critical framing constraints (do not violate)
No real blood pressure measurement from a wearable. The product uses heart rate + HRV (heart rate variability) anomaly detection as an early-warning signal that prompts the user to take a manual BP reading — it never claims to derive a BP number from sensor data. Any copy, tooltip, or label referencing this must reflect that distinction.
This is a prototype/demo build. No backend, no real database, no real SMS/API keys required. Everything works standalone in the browser.
All health/AI insight text should read as supportive guidance, never as a diagnosis. Include a subtle, non-intrusive disclaimer where insights are shown (e.g. "Not a diagnosis — consult a doctor").
Tech stack
React (Vite, functional components + hooks)
Tailwind CSS for styling
Zustand for state management (one main store, split into slices: profile, logs, sensor simulation, alerts)
React Router for navigation between screens
Recharts for BP/HR/HRV trend charts
Framer Motion for subtle, purposeful transitions (page transitions, alert state changes, live sensor pulse) — motion should never feel decorative or distracting
date-fns for date handling and synthetic history generation
lucide-react for icons — used sparingly, only where an icon adds real scannability (navigation, status states), never purely decorative
No backend, no auth, no real network calls required. If an AI-insight call is simulated, write it as a local function that returns realistic pre-written or templated insight text based on the data pattern — structure it so a real API call could swap in later without restructuring the UI.

Design direction
Palette: calm, trustworthy health-tech tones — a primary teal/deep-blue for brand and normal states, a warm coral/red reserved only for emergency/danger states so it carries real weight when it appears, amber for caution/early-warning states, neutral warm grays for structure. Avoid rainbow UI — every color should mean something.
Typography: one clean sans-serif family, a clear type scale (e.g. 12/14/16/20/28px), generous line-height for body text, medium weight for headings (never bold-heavy). Numbers (vitals, readings) should be visually prominent — this is a health app, the numbers are the content.
No unnecessary icons or gradients. Icons only where they aid navigation or status recognition. Gradients only if used deliberately for a single meaningful purpose (e.g. a subtle risk-gradient on a trend chart) — never as a decorative background.
Responsive: fully usable on both mobile (primary — this is the real-world use case) and desktop. Mobile-first layout, but desktop should use the extra width well (e.g. side-by-side cards) rather than just stretching a phone layout.
Accessibility: sufficient contrast, legible font sizes (nothing under 12px), clear focus states, no meaning conveyed by color alone (pair color with text/iconography).
Screens to build
Landing / Onboarding

Brief value proposition, "Your Daily Health Guardian. Your Emergency Lifeline."
Simple onboarding flow collecting: name, blood type, known conditions, medications, allergies, emergency contacts. This seeds the profile used everywhere else.
Dashboard (home)

At-a-glance cardiovascular status: current risk level (normal/elevated/high, color-coded), latest BP reading, resting HR, HRV trend arrow, sleep/stress summary.
A prominent AI insight card with a plain-English observation (e.g. "Your BP has been elevated every Monday morning for 3 weeks").
Quick-access buttons: log a reading, log a meal, view trends.
Daily Log

Form to log BP (systolic/diastolic), heart rate, symptoms, sleep quality, stress level, activity. Should feel fast to fill (sliders/steppers over free text where sensible).
Shows immediately in the trend view after submission.
AI Lifestyle Insights

A feed/list of generated insights tied to logged patterns, each with a short explanation and a suggested action. Include at least one insight that correctly demonstrates the "HRV drop → prompts manual BP check" flow described above.
Food Intelligence

User types a meal (or picks from a short list of common Nigerian foods as a fallback).
Returns a simulated AI verdict: estimated sodium/sugar impact and how it interacts with the user's profile, in plain English.
Blood Trend Intelligence

Line charts (Recharts) of BP and HR/HRV over the seeded synthetic history (~6 months), with visible realistic variation: a gradual upward drift, at least one clear anomalous spike, and a recovery/improvement period. Not random noise — a shape that tells a story.
Time range toggle (week/month/6 months).
Live Sensor / Wearable View

A simulated live heart-rate/HRV feed (animated line, updating every second or two) representing the wearable's BLE stream.
Include a hidden/dev "simulate anomaly" control (e.g. a button, possibly disguised as a demo-mode toggle) that triggers a visible spike or HRV drop live on screen, cascading into a risk-level change on the dashboard and a new AI insight.
Emergency Trigger & Alert Flow

When a threshold is crossed (from the simulated anomaly or a manual "simulate emergency" action), show a clear in-app emergency state: what's happening, "alerting contacts," a simulated countdown/confirmation that contacts have been notified, and calm on-screen guidance (e.g. "Sit down. Call someone. Do not drive.").
Emergency Profile (public, no-login view)

This is the page an NFC tag or QR code would point to. Build it as a separate route that requires no auth and renders directly from URL-encoded profile data (so it could realistically be written to an NFC tag as a self-contained link).
Medical-ID-card layout: name, blood type, conditions, medications, allergies, emergency contacts (tap-to-call links), all visible without scrolling on mobile. This is the highest-stakes screen in the product — legibility and hierarchy matter more here than anywhere else in the app.
Settings / Profile Management

Edit emergency contacts, conditions, medications — feeds back into both the dashboard and the emergency profile.
Data simulation requirements
On first load, seed a demo account with ~6 months of synthetic daily logs (BP, HR, sleep, stress, activity) generated by a small utility function — not hardcoded arrays. The pattern should show: a mostly-normal baseline, a gradual upward drift in BP over several weeks, one sharp anomalous spike, and a partial recovery — so the trend charts and AI insights have something real to react to.
The live sensor view should use a base sine-wave-like HR signal with small random jitter, not pure random noise, so it reads as a plausible physiological signal.
All "AI-generated" insight text can be templated/rule-based against the underlying data shape (e.g. "if 7-day BP average has increased >X% → generate this insight text") so the demo is reliable and doesn't depend on a live API call, but structure the code so a real LLM call could later replace the template function.
Persist state only in memory or localStorage — no backend, no real database.
Navigation
Use React Router with a persistent bottom nav bar on mobile (Dashboard / Log / Insights / Trends / Profile) and a left sidebar on desktop — same routes, layout adapts by breakpoint. The Emergency Profile route should be reachable both from within the app (as a preview) and standalone (as it would be from an NFC tap, with no nav chrome around it).

Deliverable
A working Vite + React + Tailwind app with the routes above, a Zustand store holding profile/logs/sensor/alert state, seeded synthetic data on load, and no backend dependency. Prioritize the Dashboard, Blood Trend Intelligence, Live Sensor view, Emergency Trigger flow, and Emergency Profile page as the core demo path — these are what will actually be shown live.

Helix — Complete UX & Interaction Flow Specification
Helix_UI_Build_Prompt section above covers stack, design direction, and screen list — this one specifies the exact flow: every screen, every state, every click, every modal. Build to this spec directly; nothing here should require a design decision to be made on the fly.

0. Global elements (present on every screen unless noted)
   Navigation shell

Mobile (< 768px): fixed bottom nav bar, 5 items: Dashboard / Log / Insights / Trends / Profile. Active item highlighted with the teal accent; icon + label, label always visible (never icon-only).
Desktop (≥ 768px): fixed left sidebar, same 5 items stacked vertically, plus the app wordmark at the top.
The nav shell is absent on: onboarding flow, the Emergency Trigger takeover, and the standalone Emergency Profile page (these are full-screen, chrome-free experiences by design).
Header (within main content area, all nav-shell screens)

Left: page title. Right: a small risk-status pill (Normal / Elevated / High) reflecting current state — tapping it navigates to Blood Trend Intelligence.
Toast notifications

Appear top-center on mobile, top-right on desktop. Auto-dismiss after 4 seconds unless it's an action-required toast (those persist until dismissed or acted on). Used for: log saved, meal analyzed, insight generated, contact saved/deleted.
Global modal behavior

All modals are centered overlays on desktop, bottom-sheet style on mobile (slide up from bottom, rounded top corners).
Every modal has a clear dismiss (X top-right or "Cancel" button) except the Emergency Trigger takeover, which requires an explicit "I'm okay" confirmation to dismiss (see Section 8).
Only one modal may be open at a time. Opening a second modal from within a modal replaces it (no stacking).
Demo/dev tools

Since this is a simulated build with no backend, include a small "Demo tools" panel accessible from Settings (Section 10) with: Reset demo data, Simulate HRV anomaly, Simulate emergency, Preview emergency profile. These exist purely to make the product demoable on stage — they are not user-facing features in the real product and should be visually distinct (e.g. a separate card labeled "Demo controls" so it doesn't look like a real settings feature).

1. First launch → Onboarding flow
   Entry: app loads with no existing profile in local storage.

1.1 Landing screen
Full-screen, centered layout. Wordmark "Helix", tagline "Your Daily Health Guardian. Your Emergency Lifeline."
One primary button: Get started → opens the onboarding wizard (Section 1.2).
One secondary text link: Load demo account → skips onboarding entirely, seeds the full synthetic 6-month history immediately, and navigates straight to the Dashboard (Section 2). This is the fast path for demos.
1.2 Onboarding wizard
A single-column, step-based wizard. Progress indicator at top (5 dots or a thin progress bar). Every step has Back (except step 1) and Next (disabled until required fields are valid) buttons, fixed at the bottom of the screen.

Personal info — name, age, phone number.
Medical basics — blood type (dropdown), known conditions (multi-select chips: hypertension, diabetes, none, other — "other" reveals a text field).
Medications & allergies — two free-text-with-chips inputs; both optional, skippable via a visible "Skip" link.
Emergency contacts — a list (starts empty) with an Add contact button that opens the Add Contact modal (name, relationship, phone number, "Set as primary" toggle). At least one contact is required to proceed; Next stays disabled until one exists.
Review & confirm — read-only summary of everything entered, grouped under mini-headers, each with an Edit link that jumps back to the relevant step. Final button: Finish setup.
On Finish setup: save profile to local state → brief full-screen success animation (checkmark, ~1s) → navigate to Dashboard. First-time-only: three short coach-mark tooltips point at the Log, Insights, and Emergency-profile nav items, dismissed by tapping anywhere or after 5 seconds.

Returning user (profile already exists in local storage): app loads directly to Dashboard, onboarding is skipped entirely.

2. Dashboard (home)
   Layout, top to bottom:

Greeting header ("Good morning, [Name]") + risk-status pill.
Risk banner — full-width card, color reflects current state (teal = normal, amber = elevated, coral = high). Text: one-line current status ("Your cardiovascular health looks stable" / "We've noticed a rising trend" / "Immediate attention needed"). Tapping it navigates to Blood Trend Intelligence.
Vitals row — two or three compact cards side by side (stacked on narrow mobile): latest BP reading with timestamp, resting HR, HRV trend arrow (up/down/flat with a small color cue).
AI insight card — the single most recent/relevant insight, truncated to 2 lines with a "Read more" link. Tapping the card or link opens that insight's detail (Section 4.2).
Quick actions row — three buttons: Log reading, Log a meal, View trends → navigate to Daily Log, Food Intelligence, Blood Trend Intelligence respectively.
Live sensor mini-widget — small card showing a live mini HR waveform and current BPM, labeled "Wearable connected". Tapping it opens the Live Sensor screen (Section 7).
States:

Empty state (fresh onboarding, no logs yet): vitals cards show "No data yet — log your first reading" with a CTA button instead of numbers. AI insight card is replaced with a friendly prompt: "Log a few readings and Helix will start noticing patterns."
Demo/seeded state: all cards populate immediately from the synthetic history.
Emergency state: if an emergency is currently active (triggered from Section 7 or 10), the Dashboard is not shown at all — the Emergency Trigger takeover (Section 8) covers the screen until resolved. 3. Daily Log
Entry: Dashboard quick action, or bottom-nav Log.

Layout: single scrollable form, one section per input group, Save log button fixed at the bottom.

Blood pressure — two large numeric steppers (systolic / diastolic), +/- buttons plus direct tap-to-type.
Heart rate — single numeric stepper.
Symptoms — multi-select chips (headache, dizziness, chest discomfort, none, other).
Sleep quality — 5-point slider with labels (Poor → Excellent).
Stress level — 5-point slider (Low → High).
Activity — single-select chips (none, light, moderate, intense).
Validation: BP and HR are required; Save log stays disabled with a subtle helper text ("Blood pressure and heart rate are required") until both are filled.

On Save log:

Button shows a brief loading spinner (~600ms simulated).
Success toast: "Reading logged."
New entry is appended to the local data store, immediately reflected in Dashboard and Trends.
Threshold check: if the submitted reading crosses the emergency threshold, skip the toast and instead show the Reading alert modal: "This reading is significantly outside your normal range. Would you like Helix to alert your emergency contacts?" with two buttons — Yes, alert contacts (→ Emergency Trigger takeover, Section 8) and No, just log it (→ saves normally, returns to Dashboard, generates a new "elevated" insight instead).
After a normal save, navigate back to Dashboard.
History (optional secondary view): a "View past logs" link at the top of the screen opens a simple reverse-chronological list of previous entries; tapping one opens a read-only detail view (no editing in the prototype).

4. AI Lifestyle Insights
   Entry: bottom-nav Insights, or tapping the Dashboard insight card.

4.1 List view
Vertical feed of insight cards, most recent first. Each card shows: an icon/color cue for type (warning = amber, improvement = teal), a one-line headline, and a truncated preview.
Optional filter tabs at top: All / Warnings / Improvements.
Empty state: "Helix hasn't spotted any patterns yet — log a few more readings and check back."
4.2 Insight detail
Tapping a card opens a modal (bottom-sheet on mobile) with: full explanation text, the specific data points that triggered it (e.g. a small inline mini-chart), and a suggested action.
If the insight is the "HRV drop → suggest a manual BP check" type, the suggested action is a button: Log a BP reading now → closes the modal and navigates directly to Daily Log.
Close via X or tapping outside the sheet. 5. Food Intelligence
Entry: Dashboard quick action "Log a meal", or bottom-nav (if included there) / reachable from Insights.

Layout:

Text input with placeholder "What are you about to eat?", with autocomplete suggestions appearing below as the user types, drawn from a short built-in list of common foods (jollof rice, suya, egusi soup, etc.). Free text is also accepted.
Analyze button.
On Analyze:

Input area disables, a loading state shows ("Analyzing..." with a subtle pulsing indicator) for ~800ms (simulated).
Result card appears below: a traffic-light indicator (green/amber/red), estimated sodium/sugar impact, and one sentence tying it to the user's own profile (e.g. "Given your recent BP trend, this meal's sodium content is worth limiting today.").
Two buttons under the result: Log this meal (saves it to the day's timeline, shows a toast "Meal logged", clears the form) and Try another (clears the form without saving).
History: a collapsed "Recent meals" section below the input, showing the last 3–5 logged meals with their traffic-light indicator; tapping one re-opens its result card read-only.

6. Blood Trend Intelligence
   Entry: bottom-nav Trends, Dashboard risk banner, or Dashboard "View trends" quick action.

Layout:

Segmented control at top: Week / Month / 6 Months — switches the chart's data window.
Primary chart: blood pressure over time (systolic + diastolic as two lines), with the synthetic drift/spike/recovery pattern visible depending on range selected.
Secondary chart below: heart rate / HRV over the same window.
A trend-summary card above the charts, dynamically worded based on the visible window's data direction: "Improving," "Stable," or "Rising" with matching color and a one-line explanation.
Interaction: tapping/hovering a point on either chart shows a small tooltip with the exact reading and date. Tapping a point on mobile (no hover) opens a lightweight popover pinned to that point instead of a full modal.

Empty state: if fewer than 3 data points exist in the selected window, show "Not enough data yet for this view" in place of the chart, with a suggestion to switch to a wider range or log more readings.

7. Live Sensor / Wearable view
   Entry: bottom-nav is not used for this (it's a sub-screen); reached via the Dashboard live-sensor widget, or a "Wearable" link in Settings.

Layout:

Connection status row at top: a small dot + label — "Connected (simulated)".
Large live-updating number: current BPM, with a small animated waveform line beneath it that continuously moves (sine wave + jitter, updating every 1–2 seconds).
HRV reading below, updating on the same cadence, with a small up/down trend arrow.
A short explanatory line under the readings: "Helix watches your heart signal continuously and lets you know if something changes — it does not measure blood pressure directly."
Simulated anomaly (demo trigger):

Reached via the Demo tools panel in Settings (Section 0), not a visible button on this screen itself, so the live view reads as a real passive monitor during the rest of the demo.
On trigger: the waveform visibly spikes/becomes erratic, the BPM number's color shifts to amber, and after a short delay (~2s) a toast appears: "Unusual heart rhythm pattern detected."
This automatically opens the Anomaly modal: "We've noticed a change in your heart rate variability. This can sometimes precede a rise in blood pressure." Two buttons: Log a BP reading now (→ Daily Log) and Dismiss (closes modal, returns to normal live view, but the event is recorded and generates a new Insight card).
Escalation to emergency: if "Simulate emergency" is triggered from Demo tools (a distinct, more severe trigger than the anomaly one), skip the Anomaly modal and go straight to the Emergency Trigger takeover (Section 8).

8. Emergency Trigger flow
   This is a full-screen takeover, not a modal — it replaces the entire app chrome (no nav bar) until resolved, because this state should feel materially different from normal browsing.

Entry points: (a) the Reading alert modal in Daily Log when a manually logged reading crosses threshold, (b) the "Simulate emergency" demo control, (c) escalation from the Live Sensor anomaly flow.

Sequence:

Alert screen — coral background accent, large heading: "Cardiovascular emergency detected." One sentence explaining what triggered it in plain language.
Alerting contacts — a list of the user's saved emergency contacts, each with a pending indicator that flips to a checkmark one at a time with a short staggered delay (~800ms apart), simulating real-time notification. A line above: "Alerting your emergency contacts…"
Once all contacts show as notified, a calm instructions panel appears: short, direct guidance ("Sit down. Call someone. Do not drive.") in large, legible type — this is the most important text on the whole screen and should not compete visually with anything else.
Below that, one button: View my emergency profile → opens the Emergency Profile page (Section 9) exactly as a bystander would see it, so the user (or a demo audience) can see both sides of the interaction.
A persistent, secondary action at the very bottom: I'm okay — cancel alert. Tapping it opens a small confirmation modal ("Are you sure? This will notify your contacts that you're safe.") with Confirm and Go back. Confirming closes the takeover, logs the event as resolved, shows a toast ("Contacts notified you're safe"), and returns to the Dashboard. 9. Emergency Profile (public, no-login page)
This is the page an NFC tag or QR code points to. It must work as a standalone route with no navigation chrome, since a real bystander would land here directly, not through the app.

Layout (mobile-first, must be fully legible with zero scrolling on a phone if possible):

Name and a clearly marked "Emergency Medical Profile" label at the top.
Blood type shown as a large, high-contrast badge.
Conditions, medications, and allergies each as their own short labeled list — no icons doing the work of the label, text must stand alone.
Emergency contacts, each as a tap-to-call button (tel: link) with name and relationship shown.
A small footer: last-updated timestamp and a subtle "Powered by Helix" wordmark link (tapping it goes to the Landing screen, not back into the logged-in app).
Access in the prototype: reachable two ways — (a) directly during the Emergency Trigger flow (Section 8, step 4), and (b) via a "Preview emergency profile" control in the Demo tools panel (Section 0/10), which simulates what an NFC tap would open.

No edit controls here. This page is strictly read-only; editing happens only in Settings.

10. Settings / Profile management
    Entry: bottom-nav Profile.

Layout — a list of sections, each expandable or opening an edit modal:

Personal info — name, age, phone. Tapping opens an edit modal with Save/Cancel.
Medical info — conditions, medications, allergies. Same edit-modal pattern. Saving here updates the Emergency Profile immediately.
Emergency contacts — a list with each contact showing name, relationship, phone, and a "Primary" tag if applicable. Each row has Edit and Remove icon-buttons.
Edit opens the same Add/Edit Contact modal used in onboarding, pre-filled.
Remove opens a confirm modal ("Remove [Name] as an emergency contact?") before deleting.
An Add contact button at the bottom of the list, same modal, empty.
Notification preferences — simple on/off toggles (not functionally wired to anything real, but present for completeness): "Daily reminder to log," "Insight notifications."
Demo controls (visually separated, see Section 0) — Reset demo data, Simulate HRV anomaly, Simulate emergency, Preview emergency profile. 11. Navigation & state rules (summary)
All app state (profile, logs, insights, meals, contacts) lives in a single client-side store and persists to local storage, so a page refresh returns the user to the same state, not onboarding.
Reset demo data (Settings) clears local storage and re-seeds the original synthetic 6-month dataset — this is the "undo everything" button for demo purposes.
Back-navigation on mobile (hardware/gesture back) should behave like closing the current modal/sheet if one is open, otherwise navigate to the previous screen in the nav stack — never exit the app unexpectedly.
The Emergency Trigger takeover and the Emergency Profile page are the only two screens without the standard nav shell — every other screen keeps the bottom nav (mobile) / sidebar (desktop) visible and interactive at all times. 12. State matrix (quick reference for the coding assistant)
Screen Empty state Loading state Normal state Alert/error state
Dashboard "No data yet" prompts — Populated cards Emergency takeover overrides entirely
Daily Log — Save button spinner (~600ms) Success toast Reading alert modal on threshold breach
Insights "No patterns yet" — Feed of cards —
Food Intelligence — "Analyzing…" (~800ms) Result card —
Trends "Not enough data" per range — Charts populated —
Live Sensor — — Live waveform Anomaly modal / escalation to Emergency takeover
Emergency Trigger — Contacts notifying (staggered) Instructions panel Cancel confirmation modal
Emergency Profile — — Read-only profile —
Settings — — Editable sections Remove-contact confirm modal
