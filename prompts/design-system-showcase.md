# Chatify Design System Showcase

## Goal

Implement the supplied Chatify design-system reference as the frontend home page: a clean, responsive visual system showcase for a real-time chat product. It should demonstrate the product's colors, type scale, buttons, form controls, cards, avatars, badges, status indicators, icons, sidebar, top bar, chat bubbles, message composer, and chat-window example.

## Skills Read

- No project skill is required for this UI-only task.
- The Next.js guidance in `AGENTS.md` requires consulting the installed Next.js documentation before implementation.

## Existing Code Inspected

- `src/app/page.js` contains only a `HomePage` placeholder.
- `src/app/globals.css` only imports Tailwind CSS.
- `src/app/layout.js` loads Geist and establishes the page metadata.
- `package.json` provides Next.js 16, React 19, Tailwind CSS 4, and `lucide-react`.

## Architecture Decisions

- Keep this change frontend-only; no backend, database, authentication, API, or socket work is needed.
- Build reusable presentational React components within the page module (or a nearby component module if it becomes clearer) for repeated UI patterns such as section cards, color swatches, avatars, badges, navigation rows, and chat messages.
- Use Tailwind utilities plus a small set of semantic CSS variables in `globals.css` for the shared palette, typography, shadows, and surface treatments.
- Use `lucide-react` for UI iconography; do not add an icon asset dependency.
- Use styled initials/gradient avatar placeholders instead of external images, keeping the page deterministic and self-contained.

## Assumptions

- The request is to recreate the provided design-system board as the current home page, not to implement the application’s full chat product.
- The intended visual direction is a polished light desktop board with blue primary actions, subtle lavender accents, generous white space, thin cool-gray borders, and a deep neutral text color.
- Functional chat behavior is out of scope; controls are visual demonstrations, with lightweight harmless interaction only where it improves the showcase.

## Files Likely To Change

- `src/app/page.js`
- `src/app/globals.css`
- `src/app/layout.js` (only if metadata or font setup needs a small adjustment)

## Implementation Plan

1. Review the installed Next.js documentation relevant to App Router client/server component boundaries and the current app conventions.
2. Define global design tokens for the reference palette, surface layers, typography, radii, and shadows.
3. Replace the placeholder home page with a responsive showcase layout: brand/color/type column, component specimen column, and chat/product-preview column.
4. Implement component specimens for buttons, inputs, cards, avatars, badges, statuses, and Lucide icon samples.
5. Implement the reference navigation, top bar, conversation list, chat bubbles, composer, and compact chat-window preview using static mock data.
6. Add responsive breakpoints so the dense desktop board reflows into readable stacked sections on tablet and mobile without horizontal overflow.
7. Run lint and a production build, then address any relevant errors.

## Security Requirements

- No secrets, environment variables, user data, network requests, authentication logic, or backend endpoints are involved.
- Do not render untrusted HTML or introduce client-side storage for this static showcase.

## Acceptance Criteria

- The home page visually communicates the supplied Chatify design system with the major reference sections present.
- Colors include light and dark theme token specimens with readable labels.
- Typography, button variants/sizes, input states, cards, avatars, badges, status indicators, and icons are demonstrated.
- A convincing static sidebar, top bar, chat bubbles, message composer, conversation list, and chat-window preview are included.
- Desktop closely follows the reference’s three-column hierarchy; tablet/mobile content remains readable and usable.
- The page has no dependency on external avatar/image URLs and passes lint/build checks.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. Run `npm run dev` from `my-app` and open the home page.
2. At desktop width, compare the board hierarchy, blue actions, white cards, side navigation, and chat preview against the reference.
3. Resize to tablet and mobile widths; confirm sections stack cleanly with no clipped content or horizontal scrolling.
4. Confirm buttons, form samples, navigation rows, badges, and chat composer have clear focus/hover states where interactive.
5. Verify icons and avatar placeholders render without console errors or external network images.

## Visual Layout

- A soft off-white page background frames a large rounded design-board surface.
- Desktop composition uses a narrow brand/tokens column, a broad components column, and a preview column.
- Each specimen is grouped inside subtle bordered white panels with consistent spacing and small explanatory labels.

## Typography

- Use the existing Geist sans font as the product UI typeface.
- Use strong, compact headings and restrained labels/body text to mirror the reference’s precise editorial hierarchy.

## Spacing

- Use an 8px-based rhythm with airy section padding and tighter spacing between control labels and controls.

## Responsive Behavior

- Keep the full three-column board at wide desktop sizes.
- Collapse the board into a single ordered content flow below desktop widths, keeping chat previews readable rather than compressed.
- Make repeated specimen grids wrap naturally at narrow widths.

## Interaction States

- Show visual primary, secondary, outline, ghost, and danger button states.
- Include default, focused, and disabled input examples.
- Provide hover/focus-visible styling for active controls and nav rows.

## Accessibility

- Use semantic headings, buttons, form labels, and navigation landmarks.
- Provide accessible names for icon-only controls.
- Preserve visible keyboard focus and maintain sufficient foreground/background contrast.

## Expected User Experience

Visitors immediately see a coherent, premium Chatify visual language and can scan the individual tokens and UI patterns before seeing how they combine in a realistic chat interface.
