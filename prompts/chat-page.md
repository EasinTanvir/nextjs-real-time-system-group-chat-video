# Chatify Chat Page

## Goal

Create the `/chat` page for Chatify to closely match the supplied desktop reference: a full-height three-column chat workspace with application navigation, a searchable conversation list, and an active one-to-one conversation.

## Skills Read

No project skill is applicable to this visual-only request:

- Clerk is not used because authentication and protected-route behavior are outside this request.
- Neon Postgres is not used because no schema, data, or API behavior is requested.
- AI SDK is not used because no AI feature is requested.

The implementation will follow the existing Next.js 16 App Router structure and consult the installed Next.js documentation before editing route code.

## Existing Code Inspected

- `src/app/page.js` contains the existing static Chatify landing page and its compact preview mockup.
- `src/app/globals.css` holds the current global visual tokens and landing-page styles.
- `src/app/layout.js` supplies Geist font variables and site metadata.
- `package.json` uses Next.js 16.3, React 19, and Tailwind CSS 4; no icon library or component library is installed.
- No `src/app/chat` route or reusable chat components currently exist.
- The supplied reference image establishes the target layout, visual hierarchy, conversation data direction, and responsive priorities.

## Architecture Decisions

- Add a dedicated App Router page at `src/app/chat/page.js`; do not replace the landing page at `/`.
- Keep this initial page static and presentational. Use local, typed-by-structure JavaScript data arrays and small components for avatars, navigation items, conversation rows, message bubbles, and icon buttons.
- Use inline SVG icon components rather than adding a dependency for icons.
- Put chat-page-specific styling in `src/app/globals.css`, namespaced with `chat-` classes so the existing landing page remains unaffected.
- Use the provided image solely as visual direction. Create generated initials/gradient avatars rather than using the supplied image or external profile images.
- No backend routes, database writes, Socket.IO events, Clerk changes, or stateful messaging will be added in this pass.

## Assumptions

- “Implement the chat page” means create the allowed `/chat` route shown in the supplied design.
- The requested deliverable is an accurate responsive interface, not a connected real-time messaging system.
- Search, filter tabs, navigation, call controls, composer controls, and conversation selection will receive accessible interactive affordances and visual states, but will not persist data or contact services yet.
- On compact screens, the navigation and conversation columns will collapse into a practical inbox-first layout; an active conversation can remain visible in the same route as a static presentation.

## Files Likely To Change

- `src/app/chat/page.js` (new)
- `src/app/globals.css`
- `src/app/layout.js` (only if page metadata needs a safe global adjustment)

## Implementation Plan

1. Read the installed Next.js 16 App Router routing documentation relevant to page files and client interactivity.
2. Add a `/chat` page with static sample data for sidebar navigation, favorites, conversations, and messages based on the visual reference.
3. Build reusable page-local presentational components for the brand, SVG icons, avatar/status indicator, navigation entries, conversation rows, message bubbles, and circular action buttons.
4. Implement the desktop workspace at full viewport height:
   - left rail with Chatify branding, navigation, favorites, and account footer;
   - middle rail with Conversations title, compose action, search/filter control, chips, and scrollable conversation list;
   - conversation panel with recipient presence, search/call/video/info controls, dated messages, and a composer.
5. Match the visual system: near-white background, restrained blue selected states, blue outgoing bubbles, pale incoming bubbles, fine separators, rounded controls, and clear size/weight hierarchy.
6. Add responsive breakpoints so tablet reduces column widths and mobile avoids horizontal scrolling while retaining usable controls and readable content.
7. Add hover, active, and focus-visible states with semantic controls and accessible labels for icon-only buttons.
8. Run lint and a production build after implementation.

## Security Requirements

- Do not use, expose, or alter environment variables or credentials.
- Do not fabricate network calls, data persistence, authentication, authorization, or real-time behavior.
- Keep all sample people, messages, badges, and presence indicators static and clearly contained in frontend presentation data.
- Use actual `button` elements and accessible names for actions rather than clickable non-semantic elements.

## Acceptance Criteria

- Visiting `/chat` renders a finished chat workspace, independent from the landing page at `/`.
- At desktop widths, the page visibly contains the three primary columns and closely follows the supplied reference’s proportions and information hierarchy.
- The interface contains all principal reference details: logo, navigation, favorites, search/filter UI, conversation tabs/list, selected conversation, recipient header and presence, message stream, and composer.
- The selected chat row, unread badges, online indicators, incoming/outgoing bubbles, timestamps, and control surfaces are visually distinct and readable.
- The page works without external image URLs, service calls, or added dependencies.
- At approximately 1440px, 768px, and 375px widths, no viewport-level horizontal scrolling occurs and controls remain usable.
- Icon-only controls have descriptive `aria-label` values and keyboard focus is plainly visible.
- `npm run lint` and `npm run build` complete successfully.

## Checks To Run

```bash
npm run lint
npm run build
```

## Manual Testing Steps

1. From `my-app`, run `npm run dev`.
2. Open `http://localhost:3000/chat`.
3. At a desktop width around 1536px, compare the navigation rail, conversation list, message pane, spacing, and blue accents to the supplied reference.
4. Tab through buttons to confirm visible keyboard focus and useful labels for icon actions.
5. Resize the page to about 768px and 375px; confirm columns adapt without clipping or page-level horizontal overflow.
6. Confirm the existing home page still renders correctly at `http://localhost:3000`.

## Visual Layout

- A full-height workspace divided by subtle vertical borders into a 234px app rail, roughly 402px conversation rail, and a flexible message panel.
- Keep content airy, with 24–36px desktop gutters, a white canvas, light cool-gray dividers, and a carefully restrained use of blue.
- The active conversation should align sender bubbles left and user bubbles right, with ample negative space between message groups like the reference.

## Typography

- Continue using the configured Geist Sans font.
- Use a bold, high-contrast application/section title and compact, muted supporting metadata.
- Use 14–16px primary UI text, smaller 12–13px timestamps/status text, and moderately compact line heights.

## Spacing

- Follow a 4px spacing rhythm.
- Use 14–18px padding on compact controls and list rows, 24px desktop section padding, and a 20–28px content gutter in the chat panel.
- Keep consistent separation around avatars, badges, conversation metadata, and composer actions.

## Responsive Behavior

- Desktop: maintain all three columns with the active conversation filling remaining space.
- Tablet: narrow the rails and reduce decoration/secondary labels while retaining conversation browsing and the active panel.
- Mobile: present an inbox-focused layout with a compact top bar and a readable active conversation treatment; avoid forcing a three-column canvas into the viewport.

## Interaction States

- Navigation, filters, conversation rows, and icon buttons provide hover, pressed, selected, and keyboard focus states.
- The selected conversation has a pale-blue surface; filters show the active `All` state.
- Composer and header controls remain presentation-only for this static implementation, with no simulated network behavior.

## Accessibility

- Use semantic `aside`, `nav`, `main`, `header`, `section`, list semantics where suitable, labeled search input, and buttons for every action.
- Provide `aria-label` text for icon-only actions and hidden supporting text where needed for status.
- Maintain sufficient contrast for timestamps, dividers, badges, controls, and focus indicators.
- Respect narrow viewports and provide content that remains usable at high zoom.

## Expected User Experience

Opening `/chat` should feel like entering a finished, modern Chatify product surface: people can immediately scan their chats, see the active contact’s online status, understand which messages are theirs, and recognize where they would search, start a conversation, make a call, or write a message once real data is connected.
