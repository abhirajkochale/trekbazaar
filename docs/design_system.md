# TrekBazaar Design System Specification

## 1. Brand Personality

**How should TrekBazaar feel?**
TrekBazaar feels like a premium, reliable piece of outdoor equipment. It sits at the intersection of "Linear's operational precision", "Airbnb's hospitality and warmth", and "Patagonia's rugged authenticity." It is intentionally understated, allowing the breathtaking landscapes and expedition details to command attention. 

**Emotions Users Should Experience:**
- **Inspiring**: Triggering wanderlust through stunning, uncropped photography.
- **Confident**: Reassuring trekkers that they are dealing with verified professionals, not fly-by-night operators.
- **Clarity**: Feeling relieved that complex itineraries and pricing are finally easy to understand.

---

## 2. Visual Direction

- **Overall Aesthetic**: "Utilitarian Premium." Content is king. The interface itself should feel nearly invisible, functioning as a crisp, quiet frame for the trekking data.
- **Whitespace Philosophy**: Generous and deliberate. Whitespace is used instead of lines to separate content wherever possible, reducing visual noise and creating a sense of calm.
- **Rounded Corners**: Subtle. Elements use a baseline radius of `6px` or `8px`. We avoid pill-shaped buttons or overly aggressive rounding (e.g., `24px+`) which can feel childish or overly casual.
- **Borders**: Hairline (`1px`), low-contrast borders (e.g., soft gray) are used to define boundaries only when whitespace is insufficient.
- **Depth & Elevation**: Extremely flat default state. Shadows are reserved strictly for high-elevation elements (modals, dropdowns) or interaction states (hovering on a card). 
- **Glassmorphism & Gradients**: Strictly forbidden. The UI relies on solid colors. Gradients are only permitted as subtle overlays on hero images to ensure text legibility.
- **Photography Style**: Raw, authentic, high-contrast, and unfiltered. No generic stock photos. We want real mountains, real weather, and real trekkers. 
- **Illustration Style**: None. We rely on iconography and photography. Illustrations detract from the rugged realism of the brand.

---

## 3. Color System

- **Primary (Forest/Emerald)**: Represents nature, go, and action. Used for primary CTAs and active states. 
- **Secondary (Slate/Charcoal)**: A sophisticated, slightly cool dark gray used for primary typography and secondary buttons. Softer than pure black (`#000000`).
- **Success (Muted Green)**: Used for confirmation states (e.g., successful enquiry submission).
- **Warning (Amber/Ochre)**: Used to highlight scarcity (e.g., "Only 2 spots left") or missing information.
- **Danger (Rust Red)**: Used for destructive actions (e.g., Archiving a trek) or form validation errors.
- **Surface (White)**: The primary background for cards, modals, and content blocks to ensure maximum contrast.
- **Background (Off-White/Light Gray)**: Used for the main application background to make Surface elements subtly pop without needing drop shadows.
- **Border**: Very faint gray (`#E5E7EB` equivalent) to provide structure without drawing the eye.
- **Text Hierarchy**: 
  - `Text-Primary`: Charcoal (Headings, primary body).
  - `Text-Secondary`: Medium Gray (Descriptions, metadata).
  - `Text-Tertiary`: Light Gray (Placeholders, disabled states).
- **Hover Colors**: A 5-10% darkening of the base color.
- **Dark Mode Strategy**: Deferred for Version 1. The brand focuses on bright, legible daylight interfaces. However, all colors are defined as semantic tokens (e.g., `color-bg-primary`) to allow future inversion.

---

## 4. Typography

- **Font Family**: A modern, highly legible sans-serif (e.g., Inter, Geist, or Roboto). No decorative or serif fonts.
- **Heading Scale**: Tight and restrained. 
  - `H1`: 36px/42px (Hero).
  - `H2`: 24px (Section titles).
  - `H3`: 18px (Card titles).
- **Body Scale**: 
  - `Body-Large`: 16px (Main reading text).
  - `Body-Small`: 14px (UI elements, secondary text).
- **Caption/Metadata**: 12px uppercase, medium weight, wide tracking (letter-spacing) for labels and tags.
- **Line Heights**: 
  - `1.2` for Headings (tight).
  - `1.6` for Body text (loose, for reading long itineraries).
- **Font Weights**: Regular (400) for body, Medium (500) for interactive elements, Semibold (600) for headings. No Black (900) or Thin (100).
- **Reading Width**: Text blocks (like itineraries) must never exceed `65-75 characters` in width to maintain optimal readability.

---

## 5. Spacing System

Based on a strict **8pt Grid System** (with 4pt for micro-adjustments).

- **Micro (4px, 8px)**: Used inside components (e.g., space between an icon and text).
- **Small (16px, 24px)**: Used for component padding (e.g., inside a button or a card).
- **Medium (32px, 48px)**: Used between distinct content blocks within the same section.
- **Large (64px, 96px)**: Used for macro page layout (e.g., spacing between the Hero section and the Catalog section).
- **Container Widths**: Maximum width constrained to `1200px` (or `1024px` for reading views) to ensure the UI doesn't stretch awkwardly on ultrawide monitors.

---

## 6. Component Library

- **Buttons**:
  - *Primary*: Solid Primary color, white text. No border.
  - *Secondary*: Transparent background, hairline border, text color matches border.
  - *Ghost*: No background, no border, text color changes on hover.
- **Inputs**: Flat. Background is white, border is hairline gray. Focus state applies a 2px primary-color ring. No internal drop shadows.
- **Cards**: Flat white surface, 1px border. On desktop hover, a subtle elevation shadow appears, and the cover image zooms by 3%.
- **Badges**: Soft background (e.g., 10% opacity of the text color). Used for Difficulty (e.g., "Moderate", "Extreme") and Status.
- **Tables**: Clean, flush left. Border-bottom on rows only. No vertical dividers. Header row is uppercase, 12px, text-secondary.
- **Search & Filters**: Search bars should span wide. Filter dropdowns should feel native and lightweight.
- **Modals & Drawers**: Dark overlay (60% opacity). Modals have a max-width; drawers slide in from the right (desktop) or bottom (mobile).
- **Alerts / Toast**: Minimal. Sliding in from the bottom right (desktop) or top (mobile). Includes an icon, title, and optional description.
- **Skeletons**: Soft pulsing gray boxes matching the exact dimensions of the loading content. No spinners on initial page loads.
- **Forms**: Labels sit *above* inputs, not inside them. Mandatory asterisks are subtle. Error messages appear below the input in Danger color.

---

## 7. Iconography

- **Style**: Stroke-based (Outline), minimalist, geometric. Consistent `1.5px` stroke width.
- **Size**: `24px` for standalone actions, `16px` for inline text support (e.g., a tiny calendar icon next to a date).
- **Usage**: Functional, never purely decorative. If an icon doesn't aid navigation or comprehension, remove it.

---

## 8. Motion System

- **Philosophy**: Fast, purposeful, and snappy. Animation should never make the user wait.
- **Duration**: `150ms` for micro-interactions (hovers, clicks). `250ms` for macro-interactions (modals opening, drawers sliding).
- **Easing**: `ease-out` (starts fast, slows down at the end) for elements entering the screen.
- **Micro-interactions**: Buttons should scale down infinitesimally (`0.98`) on click to provide tactile feedback. 

---

## 9. Responsive Rules

- **Mobile First**: Design assumes a `375px` viewport first.
- **Touch Targets**: Any interactive element (button, link, checkbox) must have a minimum interactive area of `44x44px` to prevent fat-finger errors.
- **Breakpoints**:
  - `sm`: 640px (Large phones / Phablets)
  - `md`: 768px (Tablets)
  - `lg`: 1024px (Small laptops)
  - `xl`: 1280px (Desktops)
- **Behavior**: Grids collapse from 3-columns (`lg`) to 2-columns (`md`) to 1-column (`sm`). Horizontal scroll snapping is preferred for rows of cards on mobile to save vertical space.

---

## 10. Accessibility

- **Contrast**: All text must pass WCAG AA standards (minimum 4.5:1 contrast ratio against its background). Muted text (`Text-Tertiary`) must be tested strictly.
- **Keyboard Navigation**: The entire site must be navigable via the `Tab` key.
- **Focus Rings**: A highly visible, high-contrast focus ring (`2px` solid, offset by `2px`) must appear when navigating via keyboard. `outline: none` without a fallback is strictly prohibited.
- **ARIA**: Semantic HTML (e.g., `<nav>`, `<main>`, `<article>`) is preferred over `div` soup. ARIA labels are mandated for icon-only buttons.

---

## 11. Design Tokens

Tokens abstract hard-coded values into a semantic language:
- **Color**: `color-brand-primary`, `color-surface-base`, `color-text-muted`, `color-border-subtle`.
- **Spacing**: `space-1` (4px), `space-2` (8px), `space-4` (16px), `space-8` (32px).
- **Radii**: `radius-sm` (4px), `radius-md` (8px), `radius-full` (9999px).
- **Shadows**: `shadow-sm` (Cards on hover), `shadow-lg` (Modals/Dropdowns).

---

## 12. Component Naming Convention

Reusable components follow PascalCase and are categorized conceptually:
- **Base Components**: Dumb, stateless building blocks (`Button`, `Input`, `Badge`, `Card`).
- **Composite Components**: Groups of base components (`TrekCard`, `EnquiryForm`, `FilterBar`).
- **Layout Components**: Structural wrappers (`Container`, `Section`, `Grid`).

---

## 13. Anti-Patterns (What We NEVER Do)

To maintain brand integrity, TrekBazaar must strictly avoid the following:

- ❌ **Giant Hero Gradients**: Do not use generic "SaaS-style" purple/blue blurred blobs. We rely on majestic nature photography.
- ❌ **Oversized Buttons & Inputs**: Keep forms compact and professional. Do not use massive padded inputs that look like consumer dating apps.
- ❌ **Random Shadows**: Do not add drop shadows to text, buttons, or flat cards. Shadows are for elevation hierarchy only.
- ❌ **Inconsistent Spacing**: Never eyeball margins (e.g., using `17px` or `23px`). Stick strictly to the 8pt grid.
- ❌ **Decorative Clutter**: If a dividing line, icon, or background color doesn't serve a specific informational purpose, delete it.
- ❌ **"Clever" Microcopy**: Avoid quirky startup jargon ("Oopsie! Something broke!"). Use clear, professional language ("Failed to load treks. Please refresh.").
