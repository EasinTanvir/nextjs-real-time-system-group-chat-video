# Chatify Design System Showcase

## Goal

Replace the starter landing page with a polished, responsive design-system showcase inspired by the supplied Chatify reference. The page will present the product identity, color tokens, typography scale, buttons, inputs, cards, avatars, badges, statuses, icon samples, chat navigation, chat bubbles, and responsive layout previews.

## Skills Read

- `.agents/skills/clerk/SKILL.md` (read; not applicable to this visual-only feature)
- `.agents/skills/neon-postgres/SKILL.md` (read; not applicable to this visual-only feature)
- `.agents/skills/ai-sdk/SKILL.md` (read; not applicable to this visual-only feature)

No product skill applies directly: this feature does not introduce authentication, database access, or AI behavior.

## Existing Code Inspected

- `src/app/page.js` contains only a starter `HomePage` placeholder.
- `src/app/globals.css` contains only the Tailwind import.
- `src/app/layout.js` configures Geist fonts and starter metadata.
- `package.json` uses Next.js 16.3, React 19, and Tailwind CSS 4. No icon package is installed.

## Architecture Decisions

- Keep this as a static App Router page, using semantic React markup and reusable local data arrays for repeated swatches, buttons, avatars, chats, and navigation items.
- Implement the visual system with Tailwind CSS 4 utility classes plus a small set of scoped CSS utilities for decorative gradients, shadows, and responsive previews.
- Use inline Unicode/CSS symbols and initials for UI icon/avatar placeholders; do not add an icon, image, database, authentication, or AI dependency for a static reference page.
- Keep all work in the frontend and avoid server, API, Socket.IO, Clerk, or Neon changes.

## Assumptions

- “Implement the design system” means build a faithful design-system showcase page from the supplied image, not yet implement real messaging interactions or backend behavior.
- The showcased product name is Chatify, as represented in the design reference.
- The reference is a style and layout direction; text and sample data can be recreated as static UI content.

## Files Likely To Change

- `src/app/page.js`
- `src/app/globals.css`
- `src/app/layout.js`

## Implementation Plan

1. Verify current Next.js 16 documentation in `node_modules/next/dist/docs/` before modifying App Router files.
2. Update page metadata to Chatify Design System.
3. Define the page’s primitive tokens (light/dark surfaces, ink, muted text, border, brand blue/purple, semantic colors, radii, and shadows).
4. Build a desktop multi-column board containing the design-system overview and live chat application examples.
5. Build reusable presentational sections for colors, typography, buttons, form states, cards, avatars, badges, statuses, and icon samples.
6. Build navigation/sidebar, topbar, conversation list, chat bubbles, composer, and responsive-preview examples using static data.
7. Add breakpoints so the large board collapses cleanly to tablet and phone without horizontal overflow; preserve hierarchy and readable touch targets.
8. Run lint and a production build after implementation, then report the exact local testing steps.

## Security Requirements

- Do not introduce API calls, credentials, environment variable access, client secrets, authentication changes, or database access.
- Treat all sample names/messages as static placeholder content.

## Acceptance Criteria

- The root route displays a complete Chatify design-system page rather than the starter placeholder.
- The page includes the major sections visible in the reference: identity, color palette, typography, component samples, sidebar/topbar, chat bubbles/composer, conversation window, and responsive examples.
- Buttons, inputs, cards, badges, and chat UI share consistent tokens and visual language.
- The page is responsive and usable at desktop, tablet, and mobile widths.
- No extra dependencies are required for the visual implementation.
- `npm run lint` and `npm run build` pass.

## Checks To Run

```bash
npm run lint
npm run build
```

## Manual Testing Steps

1. Run `npm run dev` in `my-app`.
2. Visit `http://localhost:3000`.
3. Confirm the desktop view shows the full design-system board with clear panels and chat examples.
4. Resize through approximately 1440px, 768px, and 375px widths.
5. Confirm all sections reflow, remain legible, and avoid viewport-level horizontal scrolling.

## Visual Layout

- Light neutral canvas with a white/very pale panel system, thin cool-gray borders, 14–18px rounded corners, restrained shadows, and blue-to-indigo brand gradients.
- Three main desktop columns: a narrow token/typography column, a broad component gallery, and a product-UI preview column; responsive previews span the lower section.
- Chat examples use a white sidebar, a bordered message pane, neutral incoming bubbles, and saturated blue outgoing bubbles.

## Typography

- Use the existing Geist sans font, with dark near-black headings, compact labels, and muted supporting text.
- Make hierarchy explicit: prominent product title, section headings, component labels, and small token annotations.

## Spacing

- Use a consistent 4px-derived rhythm with generous panel padding and 12–24px internal gaps.
- Keep dense reference content scannable via grouped section dividers and aligned component specimens.

## Responsive Behavior

- On large screens, use the full multi-column composition.
- On tablet, collapse into a single or two-column reading order while keeping chat previews usable.
- On mobile, stack panels, reduce padding and type scale modestly, and make component rows wrap or scroll only inside their local sample area when necessary.

## Interaction States

- Show static default, focused, and disabled input examples plus distinct primary, secondary, outline, ghost, and danger button treatments.
- Use visible hover/focus styles for practical controls and accessible keyboard focus indicators.

## Accessibility

- Use semantic headings, buttons, inputs, labels/aria-labels, sufficient color contrast, and visible `:focus-visible` treatment.
- Keep sample icon-only controls labelled for assistive technology.

## Expected User Experience

Opening the root route feels like viewing a concise internal design-system and product UI board: users can immediately see the visual rules and how they combine into a real-time-chat interface at different screen sizes.
