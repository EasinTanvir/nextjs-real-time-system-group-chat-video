# Chat Conversation Page

## Goal

Build a polished, responsive static chat conversation page at `/chat`, inside the existing Chatify shared chat layout. Recreate the conversation workspace from the supplied reference: conversation list at left, active private conversation at right, message bubbles, conversation header, and message composer. Do not modify the existing shared Chat module layout, sidebar, global search header, or `/chat/users` page.

## Skills Read

- `AGENTS.md` was read.
- No project-specific skill is required: this is a frontend-only static UI task with no Clerk, Neon, or AI functionality.
- Local Next.js 16 documentation was consulted for App Router layouts/pages and Server/Client Component boundaries.

## Existing Code Inspected

- `src/app/chat/layout.js` wraps every Chat module route with the persistent `ChatShell`.
- `src/app/chat/_components/chat-shell.js` already provides the required sidebar, mobile navigation, global search, theme controls, and profile affordance.
- `src/app/chat/users/page.js` establishes local visual conventions for static avatar placeholders, white panels, blue-indigo controls, and responsive behavior.
- The supplied reference displays a conversation list and a selected Emma Johnson conversation beside it; its outer sidebar differs from the existing app shell and must not replace it.

## Architecture Decisions

- Add only `src/app/chat/page.js` for the `/chat` route; preserve all existing Chat layout files without modification.
- Keep the route a Server Component and render static presentation data. No API, database, Clerk, Socket.IO, or browser-storage work is introduced.
- Use `lucide-react` and CSS/gradient initial avatars rather than external images or new packages.
- Structure the page as route-local presentational helpers for avatars, conversation rows, message bubbles, and composer controls.
- Treat list selection, calling, video, details, filtering, and message sending as visual affordances only; do not simulate a network conversation.

## Assumptions

- The user requests the selected-conversation view shown in the reference at `/chat`, rather than a separate dynamic conversation route in this static UI phase.
- Emma Johnson is the static selected conversation and all listed conversations/messages are mock content.
- The existing shared shell remains the source of sidebar/global header behavior, even where the reference contains a different outer layout.

## Files Likely To Change

- `src/app/chat/page.js` (new)

## Implementation Plan

1. Create `/chat` as a two-pane workspace within the existing persistent Chat module shell.
2. Build the conversation-list pane with title, compose affordance, search/filter control, static filter chips, and recognizable direct/group conversation previews with unread badges.
3. Build the active conversation pane with Emma Johnson’s identity, online state, and accessible search/call/video/details controls.
4. Render a centered Today divider and alternating incoming/outgoing message bubbles, including timestamps and sent/read indicators.
5. Add a bottom message composer with labelled text input, emoji, attachment, microphone, and send controls.
6. Add responsive behavior: full two-pane experience on wide screens; hide/replace the conversation list on narrow screens so the active conversation remains usable without page-level horizontal scrolling.
7. Preserve accessible semantics, labels, visible focus states, contrast, and practical touch targets.
8. Run lint and production build checks.

## Security Requirements

- Do not add API calls, environment variables, external images, browser storage, authentication logic, or any server/database changes.
- Display only static mock conversation content.
- Do not claim message delivery, read status, or calling functionality beyond visual presentation.

## Acceptance Criteria

- `/chat` renders the conversation-list and active-chat workspace inside the unchanged existing shared Chatify shell.
- Conversation rows include search/filter controls, avatars, previews, timestamps, group/direct context, and unread badges.
- The active Emma Johnson view includes a header, online status, messages, timestamps/read markers, and composer.
- The page matches the reference’s light, airy, blue-accented visual language while preserving the existing layout around it.
- The design is responsive, keyboard navigable, and does not create viewport-wide horizontal overflow.
- `npm run lint` and `npm run build` pass.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. Run `npm run dev` from `my-app` and visit `http://localhost:3000/chat`.
2. At a desktop width, verify that the persistent app shell is unchanged and that the conversations pane and active Emma conversation have the intended hierarchy.
3. Resize to tablet/mobile; verify the conversation content is readable, controls remain accessible, and no page-wide horizontal scrollbar appears.
4. Tab through search, filter, conversation-row, header, and composer controls; verify meaningful accessible labels and focus visibility.

## Visual Layout

- Retain the existing Chatify shell. Its route content becomes a full-height, white two-pane conversation workspace.
- The desktop conversation pane is approximately 350–390px wide, has a right divider, and presents rows with 16–20px padding.
- The active chat pane uses a compact identity/action header, wide vertical message area, and a fixed-feeling composer aligned at the bottom of the pane.
- Received bubbles are soft gray with a small lower-left tail; sent bubbles are blue-to-indigo with lower-right tails, white text, and right-aligned timestamps.

## Typography

- Keep Geist sans, using clear medium/bold conversation names and muted slate metadata.
- Messages should be comfortable to read at 15–16px with relaxed line height.
- Conversation preview labels and timestamps should remain smaller but legible.

## Spacing

- Follow the existing 8px spacing rhythm.
- Use consistent 16–24px pane/header padding, airy message gaps, and 12–16px bubble padding.
- Composer should have a generous 52–60px minimum height and sit clear of page edges.

## Responsive Behavior

- Desktop: two visible panes, with a fixed-width conversation list and flexible active conversation.
- Tablet: reduce list width and action spacing while preserving both panes where possible.
- Mobile: hide the list by default and show the active chat full width; keep composer and message controls easy to tap.

## Interaction States

- Selected conversation has a pale blue active background.
- Buttons, chips, inputs, rows, and composer controls have hover and `focus-visible` states.
- UI actions are visual only and must not falsely signal that an external action was completed.

## Accessibility

- Use complementary landmarks/labels for conversation list and active conversation.
- Label all search fields and icon-only buttons.
- Make selected/online/unread states understandable beyond color alone through text or accessible labeling.
- Preserve visible keyboard focus and sufficient contrast.

## Expected User Experience

Users should feel like they have entered a calm, credible messaging workspace. The conversation list makes it easy to scan activity and the selected Emma Johnson thread is spacious and immediately readable, with all common chat controls visually familiar while remaining safely static for this phase.
