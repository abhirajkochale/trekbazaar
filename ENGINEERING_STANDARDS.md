# TrekBazaar Engineering Standards

This document serves as the permanent engineering constitution for TrekBazaar. It dictates how every human contributor and AI agent must write, organize, and maintain code for the next five years.

---

## 1. Folder Structure Rules

Every file belongs in a strict, predictable location:

- **`src/app/`**: Next.js App Router files (`page.tsx`, `layout.tsx`, `loading.tsx`). No business logic or complex UI should live here; pages act as composition wrappers.
- **`src/components/ui/`**: Dumb, reusable, highly polished foundational components (e.g., `Button`, `Input`, `Card`). They have no business logic and rely strictly on props.
- **`src/components/features/`**: Complex components tied to business domains (e.g., `TrekCard`, `EnquiryForm`).
- **`src/components/layout/`**: Structural wrappers (e.g., `Container`, `Section`, `Header`).
- **`src/hooks/`**: Custom React hooks (`use...`).
- **`src/utils/`**: Pure, stateless helper functions (e.g., date formatting, currency calculation).
- **`src/lib/`**: External service initializations and wrappers (e.g., Supabase clients, Auth logic).
- **`src/types/`**: Shared TypeScript definitions and global interfaces.
- **`src/constants/`**: Global hardcoded values, configuration variables, and enums.
- **`public/`**: Static assets like fonts, icons, and placeholder images.

---

## 2. Naming Conventions

Consistency in naming reduces cognitive load.

- **Files & Folders (Components)**: `PascalCase` (e.g., `TrekCard.tsx`, `components/ui/Button/`).
- **Files & Folders (Utils/Hooks/Libs)**: `camelCase` (e.g., `formatCurrency.ts`, `useSearch.ts`).
- **Hooks**: Must be prefixed with `use` (e.g., `useMediaQuery`).
- **Types & Interfaces**: `PascalCase`. Do not prefix with `I` or `T` (Use `Trek`, not `ITrek` or `TTrek`).
- **Enums**: `PascalCase` for both the enum name and its values.
- **Database Files**: `snake_case` prefixed with a timestamp (e.g., `20260627000000_create_treks.sql`).
- **Server Actions**: `camelCase` filenames (e.g., `saveTrek.ts`) or grouped into `actions.ts`.

---

## 3. Component Rules

- **Maximum File Size**: 250 lines. If a component grows larger, extract sub-components or business logic.
- **Complexity**: Adhere to the Single Responsibility Principle. A component should do one thing exceptionally well.
- **Composition**: Use the `children` prop to compose UI rather than passing massive configuration objects via props.
- **Props Rules**: Always define an explicit `type Props = { ... }`. Do not use inline prop typing.
- **Accessibility**: All interactive elements must support keyboard navigation and screen readers.

---

## 4. React Rules

- **Server Components First**: By default, everything is a Server Component. 
- **Client Components Last**: Use `"use client"` only when absolutely necessary (e.g., `useState`, `onClick`, browser APIs). Push the boundary down to the leaf nodes.
- **No Unnecessary `useEffect`**: Derive state during render instead of syncing state via effects.
- **No Unnecessary State**: If a value can be computed from existing props or state, compute it on the fly.
- **Avoid Prop Drilling**: If you are passing props down more than 3 levels, use Composition (passing `children`) or Context (sparingly).

---

## 5. Next.js Rules

- **App Router Conventions**: Strictly use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` for routing and boundaries.
- **Metadata**: Every public page must export a static `metadata` object or a `generateMetadata` function for SEO.
- **Server Actions**: Isolate mutations in separate `actions.ts` files. Keep the component files focused purely on presentation.
- **Data Fetching**: Fetch data directly in Server Components using `async/await`. Avoid client-side data fetching unless absolutely required (e.g., real-time search).

---

## 6. Styling Rules

- **Tailwind Conventions**: Use Tailwind CSS utility classes. Avoid creating custom CSS classes unless handling complex animations or third-party library overrides.
- **Design Tokens**: All colors, spacing, and typography scales must reference the CSS variables defined in `globals.css` (e.g., `bg-emerald-600`). No hardcoded hex codes in components.
- **Responsive Philosophy**: Mobile-first always. Use `sm:`, `md:`, `lg:` prefixes to scale up for larger screens.
- **Spacing Rules**: Strictly adhere to the 8pt grid (`p-2`, `m-4`, `gap-6`).
- **Animation Rules**: Keep transitions fast (`150ms-250ms`) and purposeful (`ease-out`). No distracting or bouncy animations.

---

## 7. TypeScript Rules

- **Strict Typing**: `strict: true` must remain enabled in `tsconfig.json`.
- **No `any`**: The use of `any` is strictly forbidden. If the type is truly unknown, use `unknown` and perform type narrowing.
- **Type vs Interface**: Use `type` for unions, intersections, and primitive aliases. Use `interface` for object shapes that may need declaration merging.
- **Discriminated Unions**: Heavily preferred for representing distinct component states (e.g., `{ status: 'success', data: ... } | { status: 'error', error: ... }`).

---

## 8. Accessibility Rules

- **Keyboard**: Every interactive element must be reachable and actionable via the `Tab` and `Enter/Space` keys.
- **Focus**: Every interactive element must have a highly visible focus ring (`focus-visible:ring-2 focus-visible:ring-emerald-500`).
- **Semantic HTML**: Always use `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, and `<article>` for structure.
- **ARIA**: Use ARIA attributes (`aria-expanded`, `aria-describedby`) only when semantic HTML is insufficient.
- **Contrast**: Text must maintain a minimum WCAG AA contrast ratio of 4.5:1 against its background.

---

## 9. Performance Rules

- **Image Optimization**: Always use `next/image` (`<Image />`) for external assets. Ensure proper sizing, `placeholder="blur"` (if applicable), and accurate `alt` text.
- **Server Components**: Keep JavaScript bundles small by rendering heavy dependencies on the server.
- **Caching**: Utilize React's `cache()` for deduplicating identical database queries across a single request.
- **Lazy Loading**: Use `next/dynamic` to lazy-load heavy Client Components that are not visible above the fold (e.g., massive charts or rich text editors).

---

## 10. Git Rules

- **Branch Naming**: 
  - `feat/add-trek-form`
  - `fix/enquiry-validation`
  - `chore/update-deps`
  - `refactor/button-component`
- **Commit Naming**: Must follow Conventional Commits (e.g., `feat: implement design system foundation`).
- **Verification**: Never commit broken code. You must successfully run `npm run build` and resolve all TypeScript/Lint errors before committing.

---

## 11. AI Agent Rules

Every future AI agent contributing to this repository **MUST** adhere to these directives:

1. **Never duplicate components**: Check `src/components` before building a new UI element.
2. **Never create similar utilities**: Check `src/utils` and `src/lib` before writing a helper function.
3. **Never ignore existing abstractions**: Use the established tokens, hooks, and types.
4. **Always search before creating**: Run extensive searches on the codebase to understand the current context.
5. **Always reuse existing code**: Adapt existing components via props rather than creating slightly modified clones.
6. **Always explain architectural decisions**: When deviating from the norm, document the *why*.
7. **Never create unnecessary complexity**: Do not build abstract factories, generic wrappers, or overly clever patterns if a simple function suffices.

---

## 12. The Golden Rule

**Every Pull Request should leave the project cleaner, more robust, and more readable than it was before.**
