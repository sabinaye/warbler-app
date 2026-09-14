# Handoff: Warbler — solo-traveller companion app

## Overview

Warbler is a mobile companion app for **solo travellers in a moment of difficulty** — missed the last train, over budget, ill, lost, or just alone and uneasy. Its guide is **Woby**, an illustrated blue bird who answers in plain language and always leaves the decision with the user.

This bundle contains the complete, working design prototype: cold-start onboarding, a conversational assistant, a nightly plan, a community answers layer, a spend tracker driven by conversation, an emergency/support layer, and a five-step guided tour. All content is **city-keyed** — four cities are fully authored and switching destination re-keys every string in the app.

## About the design files

The files in this bundle are **design references created in HTML** — a prototype showing intended look and behaviour, not production code to copy. `Warbler v4.dc.html` is a single-file prototype built on a bespoke template runtime (`support.js`); its markup is inline-styled and its logic is one class. **Do not port that structure.**

The task is to **recreate these designs in the target codebase's own environment** — React Native / Expo, SwiftUI, Flutter, or whatever the app already uses — following its established component library, navigation, state and styling patterns. If no codebase exists yet, pick the framework appropriate to the target platform (this is an iOS-patterned phone app; React Native + Expo or SwiftUI are the natural choices) and implement there.

Open `Warbler v4.dc.html` in a browser to interact with the real thing. It is the source of truth for behaviour; this README is the source of truth for values.

## Fidelity

**High-fidelity.** Final colours, typography, spacing, copy, motion and interaction states. Recreate the UI closely using the target codebase's primitives. Every hex value, size and string in this document is the intended final value.

Two deliberate prototype-only shortcuts to replace with real implementations:

- **Keyboard.** The prototype draws its own on-screen keyboard and uses `readonly` textareas, because a browser cannot show the iOS keyboard on demand. Use the **native keyboard** and real text inputs. Drop the custom keyboard entirely, along with the `kb` / `kbTarget` / `kbNum` state and the layout shifts that accommodate it (`nowBottom`, `pushBottom`, `showTabs`).
- **Assistant replies.** Replies come from a scripted table with an optional live model call layered on top. Wire this to the real assistant backend. Keep the scripted table as the **offline fallback** — that behaviour is a product feature, not a stub.

---

## Platform and frame

- Target: iOS phone, designed at **393 × 852** (iPhone 15/16 logical size). The prototype's device bezel and status bar are scaffolding — the real app uses the system status bar and safe areas.
- Respect safe areas. The tab bar sits on the bottom inset; the home indicator area is 34px in the prototype.
- **Minimum touch target 44 × 44** throughout. This is honoured everywhere in the design; keep it.

---

## Design tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| Canvas | `#FDFAEA` | App background, all screens |
| Canvas (translucent) | `rgba(253,250,234,.82–.86)` | Nav bars and tab bar, over a 20–22px backdrop blur |
| Ink | `#16323F` | Primary text, icons |
| Ink secondary | `#5F7683` | Secondary text, captions |
| Ink tertiary | `#8196A1` | Footnotes, disabled values |
| Accent | `#2A7BA4` | Links, primary buttons, active tab, selection |
| Accent pressed | `#1F6C94` | Primary button active state |
| Tint | `#71ABCB` | Selected borders, chart segments |
| Tint light | `#A7CADD` | Info panels, chart segments, spotlight halo |
| Tint wash | `rgba(167,202,221,.30–.45)` | Row press state, info cards, selected chips |
| Success | `#2F7D57` | Saved offline, on-track money |
| Warning | `#C86A12` | Offline indicator dot |
| Warning ink | `#A8590C` | "Tight today", unplanned spend |
| Warning wash | `rgba(200,106,18,.10–.14)` | Offline notice, tight-money pill |
| Danger | `#D92B1F` | Emergency, destructive actions, swipe-to-remove |
| Device shell | `#0E1C24` | Prototype bezel and scrim base |
| Surface | `#FFFFFF` | Cards, grouped list rows, message bubbles |
| Hairline | `rgba(22,50,63,.16–.18)` | Row separators, nav borders |

**Semantic discipline:** red appears **only** for genuine emergency and destructive confirmation. Amber means "tight, not wrong". Green means saved or safe. Do not use these colours decoratively.

### Typography

- **Headings:** Poppins 500/600/700 (Google Fonts).
- **Body and UI:** system UI stack — `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif`. On iOS this is SF Pro; use the platform font, not a webfont.

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Large title | Poppins | 34 / 41 | 600 | −0.4px |
| Screen title (collapsed nav) | system | 17 | 600 | — |
| Section heading | Poppins | 28 / 34 | 600 | −0.4px |
| Card title | Poppins | 22 / 28 | 600 | −0.3px |
| Row label / body | system | 17 / 22 | 400 | — |
| Row label emphasis | system | 17 / 22 | 600 | — |
| Body secondary | system | 15 / 20 | 400 | — |
| Button label | system | 15–17 | 600 | — |
| Caption | system | 13 / 18 | 400 | — |
| Group header (uppercase-ish) | system | 13 / 18 | 600 | — |
| Micro (pills, tab labels) | system | 10–12 / 12–16 | 500–600 | — |
| Money ring figure | Poppins | 34 | 600 | −1px |

Numerals in money contexts use `font-variant-numeric: tabular-nums`. Body copy uses `text-wrap: pretty`.

### Spacing, radius, elevation

- Screen gutter **16px**. Vertical section rhythm **24px** (occasionally 20px). Row padding **11–12px × 16px**.
- Radius: rows/grouped cards **10px**, cards **12px**, bottom sheets & tour card **16px**, pills/chips **half height** (11–22px), avatars/toggles **full**.
- Card shadow: `0 1px 2px rgba(22,50,63,.07)`. Pushed screen: `-10px 0 30px -10px rgba(14,28,36,.22)`. Tour card: `0 18px 40px -12px rgba(14,28,36,.55)`. Toggle knob: `0 3px 8px rgba(0,0,0,.18)`.
- Separators are **0.5px** hairlines, inset to align with row content (`margin-left: 16px`, or `52–60px` where the row has a leading icon).

### Motion

| Name | Spec | Use |
|---|---|---|
| Fade up | 8px rise, 0.4s ease | Content appearing |
| Rise | 12px rise, 0.3–0.4s ease | Screen content |
| Push | `translateX(100%) → 0`, 0.34s `cubic-bezier(.2,.85,.25,1)` | Pushed detail screens |
| Sheet | `translateY(100%) → 0`, 0.3s | Action sheets, date picker |
| Dim | opacity 0 → 1, 0.28s | Scrims |
| Alert | scale 1.14 → 1 with fade | Confirmation alerts |
| Toast | 12px drop-in, hold, fade — 3.4s total | Transient confirmations |
| Value transitions | 0.2–0.6s `cubic-bezier(.2,.8,.2,1)` | Progress bars, money ring, toggle knobs |
| Woby bob | 4.5s ease-in-out, ±5px | Ambient character idle |
| Woby wave | 4.5s, rotate 0→−6→+4.5→−5→+3.5→0°, origin bottom-centre; eye-smile overlay fades in over the same beat | Onboarding hero |
| Woby stroll | 4.4s horizontal drift ±9px + 0.62s alternating step (translateY −7px, rotate ±2.5°) with floating notes | "You're set" screen |
| Spotlight pulse | 1.7s ease-in-out, stroke 2.5→4.5px, opacity 1→.55; halo scales 1→1.06 and fades | Guided tour rings |

Haptics fire on every meaningful commit (6–12ms). Keep that — it is part of the tone.

---

## Screens and views

### A. Onboarding (cold start)

Sequential full-screen steps on the canvas, each `wbRise` in. A progress affordance is implied by step order, not a bar.

1. **Hello** — Woby hero illustration (180px wide, waving + eye-smiling), Poppins 34/41 title "Hi, I'm Woby.", supporting copy, primary CTA.
2. **Destination** — grouped card, one row: label "Destination" left, value right, placeholder "Where to?". Free text; matched against city packs by regex.
3. **Dates** — row showing the range, opens a **calendar bottom sheet**: month grid, weekday header `M T W T F S S`, tap start then end, range band `rgba(167,202,221,.25)`, edges filled accent. Heading shows "14–23 March" and a nights count. Confirm is disabled until both ends are chosen.
4. **Interview** — a short sequence of questions about what the user wants from the trip. Woby's avatar (40px) beside a white bubble (radius `20px 20px 20px 6px`), answers as tappable options; some questions are multi-select. Next is disabled until answered.
5. **Budget** — four options in a row (Lean / Comfortable / Generous / Open), selected state is tint wash + `#71ABCB` border. Below, a derived line: "about €X a day over N days" — **N comes from the chosen dates**.
6. **Trusted contact** — pick from a list, or add one (name, relationship, phone — phone opens a numeric keypad).
7. **Permissions** — location and notifications, each as a card explaining *why* in plain language before the system prompt, with a clear denied state. Never a bare system dialog.
8. **Offline download** — a toggle "Save it all offline" with a progress bar that fills to 100% and resolves to a green confirmation row. Default **on**.
9. **Drafting the plan** — Woby (140px) bobbing, "Putting something together", a live-drafting list of the night's items, each removable, plus "Try a different shape" to re-draft with escalating copy.
10. **You're set.** — Woby strolling and singing (170px), title, summary of what was set up, CTA into the app.

On completion, setup persists and the **guided tour** starts after 700ms.

### B. Now (tab 1) — the conversation

- **Context strip** at the top: horizontally scrolling pills, 32px tall, white, radius 16: city + night number, money left today, battery, distance from accommodation, weather. An **Offline** pill (amber dot) replaces network-dependent state when offline. The city/night and money pills are **live values** — they must agree with the Money tab at all times.
- **Message list.** Woby messages: 40–44px avatar left, white bubble, radius `20px 20px 20px 6px`, 17/22 ink. User messages: accent-tinted bubble, right-aligned, mirrored radius. Woby messages can carry **option chips** — the "three things you could actually do".
- **Thinking state:** three dots, 0.25→1 opacity with a 3px rise, staggered.
- **Offline notice:** amber wash panel — "No connection, so this is from what I've saved on your phone." — with a retry.
- **Empty state:** quick-start chips: "I missed the last train", "I spent €18 on dinner", "I'm over budget", "I'm low on energy", "I'm not feeling great".
- **Composer:** white pill, radius 22, 44px min height, placeholder "Tell Woby what's happening", 32px circular send button (accent when there's text, `rgba(22,50,63,.22)` when empty).

### C. Plan (tab 2)

- Large title "Plan" with a **tappable trip summary line** beneath it in accent — "Reykjavík, Iceland · 14–23 Mar · €880" with a chevron — opening **Trip details**.
- **Trip prep** card: title, remaining-count summary, 6px progress bar. Pushes a checklist screen.
- **Tonight** — a list of plan items. Each item is **swipe-to-remove**: the row slides left to reveal a `#D92B1F` "Remove" action 88px wide. Items Woby added are visibly marked as Woby's.
- Below: a "What Woby changed" panel with keep/undo, and a "When you're home" row that pushes the reflection flow.

### D. Nearby (tab 3)

- Segmented control: **Answers** / **Guides**.
- **Answers:** cards with the question in 17/22 semibold, a one-line short answer, an agreement count ("11 travellers") and freshness ("Updated 2 days ago"). Tapping pushes a detail screen with the full answer and traveller replies (who / when / text).
- **Guides:** a grouped list — Getting around, Paying for things, Staying connected, If something goes wrong. Each pushes a screen with an intro and 3–4 headed points.
- **Ask the travellers:** a composer screen with suggestion chips, posting **anonymously**. Copy is explicit that nobody sees who asked.

### E. Money (tab 4)

- Large title "Money", subhead "**N days left of M**" — derived from the chosen dates.
- Segmented control: **Today** / **Whole trip**.
- **Ring:** 180 × 180, SVG, `r=54` in a 120 viewBox, 11px stroke, `stroke-dasharray: 339`, rotated −90°, track `rgba(167,202,221,.45)`. Centre: amount (Poppins 34/600, −1px), caption ("of €88 left today"), and a status pill — green "Fine today"/"On track", amber "Tight today" when under 25% remains. Offset transitions over 0.6s.
- **"Log a spend"** primary button (accent, 50px, radius 12) with the caption *Tell me in your own words — "I spent €18 on dinner" — and I'll put it here.* Tapping it navigates to **Now**, focuses the composer and pre-fills `I spent €`.
- **Breakdown:** grouped rows with a 10px colour dot, label, and right-aligned tabular amount. User-logged entries carry the caption "You told me" and an accent dot.
- Below: "What Woby changed" explanation panel.

### F. Support (tab 5)

- Large title "Support", subhead "Nothing leaves this phone unless you send it."
- **Grouped settings list**, each row with a 32px rounded leading icon tile:
  - **Trusted contact** → push (edit name, relationship, phone)
  - **Location sharing** → push (radio list of durations; copy states sharing ends on its own and is never started for you)
  - **What Warbler knows** → push (four individually switchable data sources — where you are, your plan, what you've spent, battery and signal — each with a plain-language reason; plus "Delete everything Warbler knows", red, behind a confirm alert)
  - **Save it all offline** → inline toggle with live progress caption
  - **Show me around again** → replays the guided tour
- **"Tell [contact] I'm okay"** — accent button, 50px. Caption: "Sends one short message. No location, no trip details."
- **"I need help now"** — white card with a red icon tile and red title; pushes the urgency check.
- **"Start over from the beginning"** — accent text on white, behind a confirm alert; clears the trip and re-runs setup.
- Closing disclaimer paragraph (13/18 tertiary).

### G. Pushed detail screens

Ten screens share one chrome: 103px header with a **labelled back button** (chevron + the originating tab's name, in accent) on the left and a centred 17/600 title, over a translucent blurred canvas with a hairline bottom border. Content scrolls under it with `127px` top padding.

Titles: Trusted contact · Location sharing · What Warbler knows · Trip prep · Trip details · Looking back · Ask the travellers · Your details · (answer detail) · (guide detail) · (urgency check).

**Trip details** holds: Destination row (text edit), Dates row (opens the calendar sheet), one-tap chips to switch between the four authored cities, and the four budget options with the derived per-day line. Any change re-keys the entire app's content and persists immediately.

**Urgency check** reads the situation, then surfaces local emergency numbers, insurance details and the trusted contact on one screen. **The user confirms before anything is called or sent.** It must work with no network.

**Looking back** is a five-question end-of-trip reflection ending on a "You did it." screen with Woby.

### H. Guided tour (post-onboarding, replayable)

A five-step coach-mark sequence. Each step:

- Switches to the relevant tab.
- Draws a **dark scrim** (`rgba(14,28,36,.62)`) over the whole screen with **two rounded cut-outs**: the step's key control (8px padding, 16px radius) and the corresponding **tab bar button** (3px padding, 12px radius). Implemented as an SVG mask; each hole gets a pulsing cream `#FDFAEA` ring plus an expanding `#A7CADD` halo, the second offset by 0.18s. Rects are measured live and clamped inside the screen.
- Shows a card (cream, radius 16, heavy shadow) with Woby's face, the tab name, a step counter, the explanation, a "Lit up: …" line naming the highlighted control, a **try-it CTA that performs the real action**, and a footer: Skip · Back (from step 2) · progress dots · Next / "That's it".
- **The card flips to the top of the screen** when its spotlight falls in the lower half, so it never covers what it's pointing at.
- Highlighted elements stay tappable — the scrim does not block input.

Steps: Now → the message field · Plan → tonight's first item · Money → the day/trip switch · Nearby → a saved answer · Support → the urgency check.

Seen-state persists; "Show me around again" in Support clears it and restarts.

### I. Tab bar

Five items, 49px tall over a 34px home-indicator area, translucent canvas + 22px blur, hairline top border. Each item: 26px stroked icon (1.6–1.8 stroke, `currentColor`) over a 10/12 500 label, 2px gap. Active is accent, inactive is `#8196A1`. Order: **Now · Plan · Nearby · Money · Support**.

### J. Overlays

- **Bottom sheets** — canvas, top radius 16, slide up over a `rgba(14,28,36,.4)` scrim, tap-out to dismiss.
- **Alerts** — 270px centred card, title 17/600, body 13/18, actions stacked with hairlines; destructive action in `#D92B1F`. Used for every destructive or irreversible action.
- **Toasts** — top-anchored, auto-dismiss at 3.4s. Used for confirmations that don't need a decision.

---

## Interactions and behaviour

**Navigation.** Five tabs; one pushed-screen layer per tab with a labelled back. Sheets and alerts are modal over everything. The tour overlays without blocking.

**Assistant turn.** User sends → message appended → thinking indicator → reply with optional action chips → sometimes a follow-up message ~1.4s later. If the network fails, the reply comes from saved content and is labelled as such with a retry.

**Spend logging by conversation.** Parse the user's message for spend intent: a verb (`spent|spend|paid|bought|cost`) plus a number, with an optional label after `on`/`for`. On a match, skip the normal reply path: log the entry and reply "Logged €18 for dinner. That leaves €X for today." — or, when the day's budget is exhausted, "That's today's budget used up — I'll keep tonight's suggestions free where I can." The entry appears in the Money breakdown marked "You told me", and every money readout in the app updates.

**Money derivation.** Trip length = `dateEnd − dateStart + 1`. Daily budget = `budget / tripDays`. Today's remaining = daily budget − scripted day spend − logged total, floored at 0. "Tight today" below 25% remaining. The Now context pills read from the same values — never duplicate this maths in two places.

**City keying.** Destination text is matched against city packs by regex. Everything downstream — emergency numbers, phrases, pharmacy, police equivalent, transit card, last-train time, ATM and plug advice, embassy, day trip, clinic cost, traveller answers, guides, suggestion chips — comes from the matched pack. Unmatched input falls back to the default pack. **Four cities are fully authored: Osaka, Lisbon, Reykjavík, Seoul.**

**Swipe to remove** on plan items: horizontal drag reveals a fixed-width destructive action; commit removes the item and shows a toast offering it back.

**Permissions** are always explained in-app before the system prompt, with a designed denied state.

**Offline** is a first-class state, not an error: an amber pill in the context strip, labelled answers, and a toggle with real progress. Default on.

**Destructive actions** always go through an alert. Nothing is sent, shared or called without explicit confirmation.

---

## State

Persisted (device storage):

- **Setup:** destination, date range, budget, trusted contact, completion timestamp. Written on onboarding completion **and on any later edit from Trip details**.
- **Tour seen** flag — cleared by "Show me around again".

Session / app state:

- Navigation: current screen, tab, pushed screen, sheet, alert, toast.
- Conversation: messages, thinking flag, draft text, last question, offline-degraded flag.
- Money: `logged` entries (`{id, label, amount}`), Today/Whole-trip segment.
- Plan: removed items, swipe target and offset, prep checklist ticks, prep segment.
- Onboarding: step index, interview answers, draft plan, draft date range.
- Support: location-sharing mode, per-source data toggles, offline enabled + download progress.
- Tour: step index, measured spotlight rects, card-position side.
- Reflection: step index, answers.

Prototype-only state to drop: custom keyboard (`kb`, `kbTarget`, `kbNum`) and the layout offsets that accommodate it.

---

## Assets

In `assets/`:

- `woby-hero.png` — calm, wing raised. Onboarding hero, Now avatar default, tour step 1.
- `woby-happy.png` — eyes-closed smile with confetti. Prep screen, tour step 2.
- `woby-sing.png` — mid-stride, winking, music notes. "You're set", Plan panel.
- `woby-love.png` — Nearby, reflection completion, location panel.
- `woby-fly.png` — drafting, interview, ask-the-travellers, Support tour step.
- `woby-tired.png` — Money tour step.
- `woby-cry.png`, `woby-oops.png`, `woby-angry.png` — available emotional states, used for assistant reactions.

Transparent PNGs, roughly 680 × 830. **Ask the design owner for vector originals before shipping** — the prototype fakes the wave and eye-smile with a clipped overlay because the source is raster. With layered vector or Lottie assets, animate the wing and face properly and delete those hacks. The music notes in the "You're set" animation are likewise a clip-and-overlay workaround.

All icons in the UI are inline stroked SVG (1.6–1.8px, round caps and joins, `currentColor`) — reproduce with the codebase's icon system at matching weight.

---

## Files in this bundle

| File | What it is |
|---|---|
| `Warbler v4.dc.html` | The complete prototype. Open in a browser. Source of truth for behaviour. |
| `support.js` | Runtime the prototype needs to render. Not part of the product. |
| `assets/` | The nine Woby illustrations. |
| `Warbler v3.dc.html`, `Warbler v2.dc.html` | Earlier iterations, for history only. Ignore unless you want to see what was rejected. |

## Where to start

1. Open `Warbler v4.dc.html` and walk the whole thing: complete onboarding, take the tour, log a spend in chat, change the destination from Plan → Trip details, toggle offline, open the urgency check.
2. Build the tab shell, the pushed-screen chrome and the grouped-list row as three reusable primitives — most of the app is those three plus content.
3. Implement the city pack as data, not as conditionals. It is the thing that makes the app feel local.
4. Build the money derivation once, in one place, and read every readout from it.
5. Leave the guided tour until last — it depends on being able to measure real, laid-out controls.
