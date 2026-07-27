---
name: Donatio
description: Connect, Donate, Transform Lives — a community donation platform connecting donors with local NGOs
colors:
  primary: "#7C3AED"
  primary-foreground: "#FFFFFF"
  accent: "#F3EFF9"
  accent-foreground: "#7C3AED"
  background: "#FCFCFD"
  foreground: "#14121C"
  secondary: "#F6F5F9"
  secondary-foreground: "#2A2733"
  muted: "#F1F0F5"
  muted-foreground: "#7A7585"
  card: "#FFFFFF"
  card-foreground: "#14121C"
  border: "#E8E6ED"
  input: "#E8E6ED"
  ring: "#7C3AED"
  destructive: "#E53E3E"
  success: "#1F8B4C"
  warning: "#E68A2E"
typography:
  display:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    border: "1px solid {colors.border}"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    typography: "{typography.label}"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
    border: "1px solid {colors.input}"
---

# Design System: Donatio

## Overview

**Creative North Star: "The Community Canvas"**

Donatio's visual system is a Community Canvas — a warm, approachable surface where generosity is visible, trusted, and celebrated. The aesthetic is **refined, trustworthy, and precise**, treating every interaction as a small act of care. The purple accent acts as a consistent thread of conviction, appearing sparingly to guide attention and signal action.

The system uses **layered paper** as its depth model: surfaces sit at consistent, gentle elevations with soft shadows at rest and subtle lifts on interaction. Everything feels tactile, settled, and deliberate — like well-designed stationery for a cause that matters.

**Key Characteristics:**
- Clean, card-based layouts with generous whitespace
- Purple as the single accent voice; neutral palette carries the bulk of the interface
- Layered paper depth — shadows present at rest, lift on hover
- Rounded but not overly playful forms (10px base radius)
- DM Sans throughout — consistent weight and proportion across all scales
- Gradients reserved for hero moments and the Donatio brand mark only

## Colors

The palette is restrained: a single purple primary with a warm neutral base. Color carries meaning, not decoration.

### Primary
- **Violet Trust** (#7C3AED / hsl(262 80% 55%)): The sole accent. Used for primary actions (buttons, links, active nav), key statistics, and brand moments. Its rarity is the point.

### Neutral
- **White** (#FFFFFF): Card surfaces, modals, popovers.
- **Off-White** (#FCFCFD / hsl(260 20% 99%)): Page background. The canvas itself.
- **Cool Stone** (#F6F5F9 / hsl(260 25% 97%)): Secondary surfaces, subtle section backgrounds.
- **Frost** (#F1F0F5 / hsl(260 15% 95%)): Muted backgrounds, skeleton states, disabled fills.
- **Silver Mist** (#E8E6ED / hsl(260 15% 92%)): Borders, dividers, input strokes.
- **Warm Slate** (#7A7585 / hsl(260 15% 48%)): Secondary text, placeholder text, metadata.
- **Deep Ink** (#14121C / hsl(260 40% 8%)): Primary text, headings, high-emphasis content.

### Semantic
- **Rose Alert** (#E53E3E / hsl(0 78% 58%)): Destructive actions, errors.
- **Forest Done** (#1F8B4C / hsl(145 65% 35%)): Success states, completed badges.
- **Amber Notice** (#E68A2E / hsl(38 90% 48%)): Warnings, pending states.

### Named Rules
**The One Voice Rule.** Violet Trust appears on ≤10% of any given screen. Its scarcity is what gives it power. When everything is accent, nothing is.

## Typography

**Font:** DM Sans (400, 500, 600, 700 weights) — one family for all roles.

**Character:** Clean, geometric, warmly human. DM Sans combines the legibility of a neo-grotesk with the approachability of a humanist sans. It never feels cold or mechanical.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), 1.15): Hero headlines on landing and empty states only.
- **Headline** (600, clamp(1.25rem, 2.5vw, 1.75rem), 1.25): Section headings, page titles.
- **Title** (600, 1rem, 1.3): Card titles, dashboard headers, modal headers.
- **Body** (400, 0.875rem, 1.6): All running text, descriptions, paragraphs. Max line length 65ch.
- **Label** (500, 0.8125rem, 1.4): Button text, form labels, nav items, badges. Letter-spacing: normal.

### Named Rules
**The Single-Family Rule.** DM Sans serves every role. No second font, no display face, no mono. Hierarchy is expressed through weight and size alone, not font switching.

## Layout

**Container:** max-width 1280px (max-w-7xl), centered with horizontal padding (16px mobile / 24px tablet / 32px desktop).

**Grid:** 12-column implied via Tailwind grid. Standard column patterns: 1-col (mobile), 2-col (sm: 640px+), 3-col (lg: 1024px+) for card grids.

**Vertical Rhythm:** 8px base unit. Section spacing uses 32px (py-8) within pages, 16-24px between content blocks within a section. Content containers use 24px vertical padding between major blocks.

**Density:** Comfortable. Whitespace is a deliberate tool for scanability. Cards have 20px internal padding. Form fields stack with 16px gaps.

## Elevation & Depth

The **Layered Paper** model: every surface sits at a known, consistent elevation with a soft shadow at rest. Depth conveys hierarchy, not motion.

### Elevation Levels
- **Canvas (level 0):** Page background (Off-White). No shadow. No border treatment beyond the page edge.
- **Surface (level 1):** Cards, dropdowns, sheets. `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` (shadow-sm). Subtle enough to feel like paper weight, not float.
- **Raised (level 2):** Hovered cards. `box-shadow: 0 4px 12px rgba(0,0,0,0.08)` (shadow-md). Used only on interactive surfaces that invite action.
- **Modal (level 3):** Dialogs, toasts. `box-shadow: 0 8px 30px rgba(0,0,0,0.12)`.

### Named Rules
**The Flat-By-Default Rule.** Non-interactive surfaces (page backgrounds, section wells, static containers) have no shadow. Shadow is a signal: it means "you can interact with this."

## Shapes

**Corner Language:** Gently rounded — consistent but not aggressively soft.

- **Base radius:** 10px (rounded-lg) — buttons, inputs, form fields, non-interactive cards.
- **Large radius:** 16px (rounded-xl) — card containers, modals, major surface panels.
- **Small radius:** 6px (rounded-sm) — compact badges, small tags.
- **Full:** 9999px (rounded-full) — pills, status badges, avatars, points badges.

**Borders:** All surfaces that need separation use a 1px stroke in Silver Mist (#E8E6ED) with 60% opacity on the `card-base` utility. Interactive borders shift to Violet Trust on focus.

## Components

### Buttons

Buttons are **refined and confident** — substantial padding, clear hierarchy, no ambiguity about what's actionable.

- **Shape:** Gently rounded (10px). Full-height internal padding (12px top/bottom, 20px sides).
- **Primary (default):** Violet Trust background, white text. Hover: opacity 90%. Active: scale 0.98.
- **Secondary:** Cool Stone background, Deep Ink text. Hover: 80% opacity.
- **Outline:** Transparent background, Deep Ink text, Silver Mist border. Hover: Cool Stone background.
- **Ghost:** Transparent, no border, Warm Slate text. Hover: Cool Stone background.
- **Link:** Violet Trust text, underline on hover. No padding.
- **Sizes:** default (h-10), sm (h-9), lg (h-11), icon (h-10 w-10).
- **Focus:** `focus-visible:ring-2 focus:ring-ring focus:ring-offset-2`.
- **Disabled:** opacity 50%, pointer-events none.

### Cards / Containers

Cards are the **fundamental building block** — every content region is a card.

- **Corner Style:** Large radius (16px).
- **Background:** White.
- **Shadow:** Surface shadow at rest (shadow-sm); raised shadow on hover (shadow-md) for interactive cards.
- **Border:** 1px Silver Mist at 60% opacity.
- **Internal Padding:** 20px.

### Inputs / Fields

- **Style:** 1px Silver Mist stroke, Off-White background, 10px radius.
- **Padding:** 10px top/bottom, 16px sides. Icons sit at 14px from the left edge.
- **Focus:** 2px Violet Trust ring at 20% opacity, border shifts to Violet Trust.
- **Placeholder:** Warm Slate.
- **Disabled:** Frost background, reduced opacity, cursor not-allowed.
- **Error:** Rose Alert border.
- **Textarea:** Same as input, min-height 80px, resize vertical.

### Chips / Badges

- **Style:** Pill-shaped (full radius), compact (6px top/bottom, 10px sides).
- **Status badges:** Colored by semantic role (Violet Trust for accepted, Rose Alert for rejected, Amber Notice for pending, Forest Done for completed). Background uses 10% opacity of the semantic color.
- **Category badges:** Tinted backgrounds per category (e.g. blue-50 for education, rose-50 for healthcare), no border.
- **Points badges:** Same pill shape, colored by tier (amber for bronze, slate for silver, yellow for gold, violet for platinum).

### Navigation

- **Style:** Sticky top bar, 56px height, separated from content by a 1px border.
- **Background:** Off-White at 80% opacity with backdrop blur.
- **Nav items:** Inline links with 14px horizontal padding. Active state: Violet Trust text on 10% Violet Trust background. Default: Warm Slate text, Cool Stone background on hover.
- **Mobile:** Hamburger menu opens a full-width dropdown below the bar.

## Do's and Don'ts

### Do:
- **Do** use Violet Trust sparingly — one primary action per view, one accent element per card.
- **Do** keep all body text at Warm Slate or Deep Ink — never lighter than Warm Slate on white.
- **Do** let cards breathe — 20px internal padding is the minimum.
- **Do** use gradient-primary only on the brand logo, hero CTAs, and the landing page CTA section.

### Don't:
- **Don't** add a second accent color. Violet Trust is the single voice.
- **Don't** use shadows on non-interactive surfaces — shadow means actionable.
- **Don't** mix border radii — buttons use 10px, cards use 16px, pills use full. No intermediate values.
- **Don't** place text directly on gradient backgrounds without sufficient contrast (use primary-foreground white or secondary variant).
- **Don't** use DM Sans below 400 weight or in italic — the weight range (400-700) is the full vocabulary.
