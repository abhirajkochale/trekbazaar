# Design System Handbook

**STATUS: FROZEN.** 
*Do not alter typography, base colors, spacing rules, or border radiuses without explicit founder approval. The goal is to maintain Aesthetic Authority.*

## Core Philosophy
TrekBazaar is not a generic booking engine. It is a premium, high-trust, editorial-style marketplace. It must feel as polished as Stripe, Airbnb, and Linear.
- **Maximum Whitespace**: Let elements breathe. Avoid dense walls of text or cramped forms.
- **No Playfulness**: We sell high-altitude adventure where safety is paramount. Do not use playful illustrations, gradient text, or bouncy animations.
- **Subtlety**: Borders should be thin (`border-zinc-200`). Backgrounds should be calm (`bg-zinc-50`, `bg-white`).
- **Contrast**: Use stark contrast for CTAs (e.g., `bg-zinc-900 text-white`).

## Typography
- **Primary Font**: Inter (or system sans-serif equivalent).
- **Headings**: Heavy, tight tracking (`tracking-tight`, `font-black`).
- **Small Text**: Use uppercase tracking for metadata (`text-xs uppercase tracking-wider text-zinc-500 font-bold`).

## Components

### Buttons
- **Primary CTA**: `bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md active:scale-95`.
- **Secondary CTA**: `bg-white text-zinc-900 font-bold px-6 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-sm`.
- *Never use generic primary blue/red buttons unless for explicit destructive actions.*

### Cards & Layouts
- **Containers**: Use `rounded-2xl` for large cards, `rounded-xl` for inner elements.
- **Shadows**: Use subtle shadows (`shadow-sm`, `shadow-xl shadow-zinc-200/40`). Avoid heavy, dark drop shadows.
- **Borders**: Elements should be separated by `border-zinc-100` or `border-zinc-200`.

### Forms (B2B SaaS Style)
- Inputs must be chunky and legible.
- `px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium`.
- Labels must be small, bold, and clear: `text-sm font-bold text-zinc-700`.

### Badges
- **Approved/Success**: `bg-emerald-50 text-emerald-700 border border-emerald-200`
- **Pending/Warning**: `bg-amber-50 text-amber-700 border border-amber-200`
- **Rejected/Error**: `bg-red-50 text-red-700 border border-red-200`
- **Neutral/Info**: `bg-zinc-100 text-zinc-700 border border-zinc-200`
- Use `rounded-full` for badges. Include tiny Lucide icons (w-3 h-3) inside badges for visual clarity.

## Icons
- Use **Lucide React**. 
- Keep icons small and proportional (`w-4 h-4` for inline text, `w-5 h-5` for UI controls).
- Never use oversized, colorful icons. 

## Things NEVER Allowed
- ❌ CSS Gradients on text or backgrounds (unless specifically designed for a hero image overlay).
- ❌ Placeholders like "John Doe" or fake numbers in production UIs.
- ❌ Tailwind default blue (`bg-blue-500`) for primary actions.
- ❌ "Cartoonish" or "Friendly" tone of voice.

## Things Encouraged
- ✅ Glassmorphism (subtle blur backdrops on fixed headers).
- ✅ Skeleton loaders (no generic spinning wheels for main page content).
- ✅ Sticky layouts (e.g., the B2B Wizard sidebar).
- ✅ Smooth, snappy state transitions (using React `useTransition`).
