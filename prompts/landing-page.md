# Chatify Landing Page

## Goal

Replace the placeholder home page with a polished, responsive Chatify marketing landing page based on the supplied reference. The page should present a top navigation, prominent hero copy and actions, a realistic static chat-product preview, a feature-card section, and a compact trust/statistics strip.

## Skills Read

- No project skill is required for this frontend-only, static UI task.
- `AGENTS.md` was read. Before implementation, consult the installed Next.js documentation relevant to App Router components and current Next.js 16 conventions.

## Existing Code Inspected

- `src/app/page.js` currently renders only `HomePage` text.
- `src/app/globals.css` provides Tailwind CSS 4 and shared color/shadow tokens.
- `src/app/layout.js` configures Geist fonts and Chatify metadata.
- `package.json` includes Next.js 16, React 19, Tailwind CSS 4, and `lucide-react`.
- The supplied reference image shows the desired Chatify composition and visual language.

## Architecture Decisions

- Keep this entirely in the Next.js frontend; do not modify the Express backend, database, authentication, or sockets.
- Use reusable, presentational components inside `src/app/page.js` for repeated structures such as navigation links, feature cards, chat rows, message bubbles, and metrics.
- Use `lucide-react` for iconography and initials/gradient avatar placeholders rather than external image URLs.
- Use Tailwind utilities and, only if needed, small global CSS adjustments for base typography/background behavior.
- Keep navigation and buttons as safe links/placeholders until matching product routes are implemented; avoid inventing application behavior.

## Assumptions

- “Landing page” refers to `/` in `src/app/page.js`.
- The supplied screenshot is the visual reference, not a request to implement a functional chat client.
- Chat UI data is static demo content and should not make API calls or require authentication.
- Authentication routes may not yet exist, so action destinations should be conservative and easy to update later.

## Files Likely To Change

- `src/app/page.js`
- `src/app/globals.css` (only for small, reusable page-level base styles if Tailwind utilities are insufficient)
- `src/app/layout.js` (only if an accurate metadata adjustment is needed)

## Implementation Plan

1. Consult the local Next.js 16 documentation for applicable App Router and component conventions.
2. Build a full-width light landing surface with a centered max-width container and subtle blue/lavender background glow.
3. Add the responsive header: Chatify mark, desktop navigation, log-in link, and blue Get Started action.
4. Build the hero: small blue audience badge, large two-tone headline, supporting copy, primary/secondary actions, and three concise value propositions.
5. Build a high-fidelity static chat-dashboard hero preview with a sidebar, inbox list, conversation header, received/sent message bubbles, and composer.
6. Add the feature section with heading, four cards, and visual icons matching the reference hierarchy.
7. Add the bottom stats strip for active users, messages sent, uptime, and encryption.
8. Add responsive behavior: hide/collapse desktop navigation as needed, stack hero content, and make the dashboard preview horizontally readable rather than cramped on small screens.
9. Ensure semantic landmarks, visible focus states, button/link accessible names, and sufficient contrast.
10. Run lint and a production build; resolve relevant errors.

## Security Requirements

- Do not add environment variables, API requests, database access, user-data handling, or browser storage.
- Do not use external avatar/image URLs or expose any server-only configuration.
- Treat the chat interface exclusively as static presentation data.

## Acceptance Criteria

- `/` no longer renders the starter placeholder and closely follows the reference’s airy Chatify marketing composition.
- Header, hero copy/actions, benefit points, dashboard preview, feature cards, and statistics strip are present.
- The product-preview includes recognizable navigation, conversation rows, message bubbles, presence, and a message composer.
- The design uses blue/violet accents, neutral ink text, rounded white panels, and restrained shadows similar to the supplied image.
- Page is responsive and does not introduce horizontal page overflow on mobile.
- It uses local/static visuals only and passes lint and production build checks.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. From `my-app`, run `npm run dev` and open `http://localhost:3000`.
2. At a desktop width, compare the header, hero, chat preview, feature cards, and metrics hierarchy with the supplied reference.
3. Resize to tablet and mobile widths; confirm hero sections stack, header remains usable, and no content is clipped or causes page-level horizontal scrolling.
4. Tab through the header and hero actions to confirm visible focus treatment and accessible controls.

## Visual Layout

- Center the page in a wide container against an off-white background with extremely subtle cool-blue illumination.
- The desktop hero is a two-column composition: copy on the left and the chat dashboard preview on the right.
- Place the feature section beneath the hero, center its heading, and arrange four equal cards in a desktop row.
- Place a softly tinted, rounded metric strip below the cards.

## Typography

- Use the existing Geist sans font.
- Hero headline should be large, bold, compact, and use a blue-to-violet emphasis for the second line.
- Keep supporting text and preview UI labels restrained, legible, and slate-toned.

## Spacing

- Use an 8px rhythm with generous hero whitespace, compact UI-preview spacing, and consistent card padding.
- Keep the header and hero visually aligned within the same max-width container.

## Responsive Behavior

- At desktop, show the full navigation, two-column hero, four feature cards, and one-row metric strip.
- At tablet widths, allow feature cards to wrap and reduce preview density without sacrificing readability.
- At mobile widths, collapse nonessential navigation, stack hero columns, vertically stack cards/metrics, and allow the dashboard preview to scroll within its own container if needed.

## Interaction States

- Provide hover and keyboard-focus states for navigation and calls to action.
- Use static visual active/selected states for the Inbox row and chat dashboard UI.
- Do not implement functional messaging, authentication, or navigation logic beyond normal links.

## Accessibility

- Use `header`, `nav`, `main`, and `section` landmarks; maintain a logical heading order.
- Use text labels or `aria-label` for icon-only controls in the demo preview.
- Preserve visible `:focus-visible` states and readable text contrast.

## Expected User Experience

Visitors should immediately understand Chatify as a modern, friendly, real-time messaging product. The hero communicates the promise while the dashboard preview makes the product feel tangible; the feature and metric sections reinforce capability and trust without overwhelming the page.
