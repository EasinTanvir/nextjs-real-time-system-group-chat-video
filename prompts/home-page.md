# Chatify Home Page

## Goal

Build the root (`/`) landing page for Chatify, closely following the supplied reference: a polished navigation bar, hero copy and calls to action, a detailed static chat-product preview, feature cards, and a compact trust/statistics bar.

## Skills Read

- `.agents/skills/clerk/SKILL.md` (read; not applicable to this static visual feature)
- `.agents/skills/neon-postgres/SKILL.md` (read; not applicable to this static visual feature)
- `.agents/skills/ai-sdk/SKILL.md` (read; not applicable to this static visual feature)

No approved project skill applies directly because this request has no authentication, database, or AI behavior.

## Existing Code Inspected

- `src/app/page.js` is an unimplemented starter page.
- `src/app/globals.css` only imports Tailwind CSS.
- `src/app/layout.js` currently configures Geist fonts and starter metadata.
- `package.json` contains Next.js 16.3, React 19, and Tailwind CSS 4, without a dedicated icon or component library.

## Architecture Decisions

- Implement the page entirely in the Next.js frontend as a static, responsive App Router page.
- Use small presentational React components and static data arrays for nav links, mini chat sidebar/conversation items, feature cards, and trust metrics.
- Use Tailwind CSS 4 and a small number of global CSS utilities for brand gradients, shadows, subtle background effects, and the chat mockup.
- Use accessible inline symbols/CSS decoration in place of adding an icon dependency for this static visual feature.
- Keep messaging preview controls visual only; do not add routes, API calls, Socket.IO, Clerk, or Neon changes.

## Assumptions

- “Build the home page” means build the supplied landing-page design at the existing `/` route.
- The buttons and navigation may be visually interactive (hover/focus) but do not require authentication or destination pages yet.
- Chat names and messages are static sample content based on the reference.

## Files Likely To Change

- `src/app/page.js`
- `src/app/globals.css`
- `src/app/layout.js`

## Implementation Plan

1. Consult version-matched Next.js App Router documentation under `node_modules/next/dist/docs/` before editing the application files.
2. Update global metadata for Chatify.
3. Establish reusable visual tokens for the blue/indigo brand, warm white canvas, muted gray-blue text, borders, rounded surfaces, and shadows.
4. Create the responsive header with Chatify brand, desktop navigation, Log in, and prominent Get Started button.
5. Build the hero: context pill, two-line headline with highlighted gradient phrase, concise product description, two CTAs, and three product benefits.
6. Recreate the right-side chat application mockup with a mini sidebar, inbox list, active-chat header, incoming/outgoing messages, and composer.
7. Build the features section with heading, four cards, and the lower statistics/trust bar.
8. Add desktop, tablet, and mobile responsive layouts, including a collapsed navigation treatment and readable chat mockup scaling.
9. Run lint and a production build, then provide exact local verification steps.

## Security Requirements

- Do not add API calls or process user data.
- Do not read or expose environment variables, database details, credentials, or authentication secrets.
- Mark non-functional UI controls with appropriate buttons/labels rather than implying data persistence.

## Acceptance Criteria

- `/` renders a finished Chatify landing page rather than the starter text.
- The design visibly includes the header, hero CTAs, chat UI product mockup, feature cards, and metric bar from the supplied reference.
- Visual tokens are consistent across the page: brand blue/purple gradient, white surfaces, subtle borders/shadows, rounded cards, and clear type hierarchy.
- The page adapts cleanly at desktop, tablet (~768px), and mobile (~375px) without viewport-level horizontal scrolling.
- Interactive controls have visible hover and keyboard focus states; icon-only mockup controls carry accessible labels.
- No extra dependencies or backend changes are introduced.
- `npm run lint` and `npm run build` pass.

## Checks To Run

```bash
npm run lint
npm run build
```

## Manual Testing Steps

1. From `my-app`, run `npm run dev`.
2. Open `http://localhost:3000`.
3. Verify the header, hero, chat product preview, feature section, and metric strip match the supplied layout direction.
4. Test hover and keyboard focus on header/hero actions.
5. Resize to approximately 1440px, 768px, and 375px and confirm content stacks gracefully with no clipping or horizontal viewport scrolling.

## Visual Layout

- A wide, airy white-to-pale-blue canvas with a centered max-width content area.
- A slim top navigation with brand at left, centered links, and auth actions at right.
- The hero uses a left text/action column and a larger right product mockup; the feature section flows beneath in a centered composition.
- The mockup combines a narrow navigation rail, conversation list, and active chat pane inside a white rounded panel with soft elevation.

## Typography

- Retain Geist Sans for the existing font pipeline.
- Use a high-contrast, large, bold headline; apply blue-to-purple emphasis to the second phrase.
- Use compact but readable supporting copy, labels, navigation, and chat metadata.

## Spacing

- Use a consistent 4px-derived spacing rhythm with generous desktop margins, 16–28px card padding, and balanced hero gutters.
- Preserve dense but legible spacing in the chat preview.

## Responsive Behavior

- Desktop: two-column hero and four-column feature grid.
- Tablet: stack or rebalance hero columns and use a two-column feature grid.
- Mobile: collapse nonessential nav links, stack all content, show a compact mockup, and use a one-column feature grid while retaining tap-friendly controls.

## Interaction States

- CTAs and nav actions provide hover, active, and visible focus states.
- Product preview controls are presentational but use consistent button affordances.
- Chat sidebar selected item, unread badges, online dots, and outgoing/incoming message colors communicate interface state.

## Accessibility

- Use semantic `header`, `nav`, `main`, `section`, headings, buttons, and descriptive accessible names.
- Ensure sufficient text/background contrast and `:focus-visible` indicators.
- Avoid conveying meaningful information through color alone; pair status colors with text or labels where practical.

## Expected User Experience

Visitors immediately understand Chatify as a modern, fast, private real-time chat platform. The hero communicates the product promise, the embedded UI establishes credibility, and the feature/metric sections give concise reasons to explore further.
