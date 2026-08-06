# Chat Module Improvements

## Goal

Deliver a cohesive, responsive real-time chat module across `/chat`, `/chat/users`, `/chat/friends`, and `/chat/conversation/[conversationId]`. Preserve the mounted chat layout while its main content changes, make friendship state authoritative and immediately visible, create direct conversations upon friendship acceptance, and add persistent, unread-aware notifications with Socket.IO updates.

## Skills Read

- `AGENTS.md`
- `.agents/skills/neon-postgres/SKILL.md` (schema migrations through Drizzle; no ad-hoc database changes)
- Next.js App Router layouts documentation in `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` (the nested `/chat` layout preserves mounted state during navigation)

## Existing Code Inspected

- Frontend shell and chat routes under `src/app/chat/`
- Frontend API/socket/auth helpers: `src/lib/api.js`, `src/lib/socket.js`, and `src/providers/auth-provider.js`
- Backend friend, user, conversation, and message controllers/services/routes
- Drizzle schema/migrations and Socket.IO rooms, events, middleware, and handlers

## Architecture Decisions

- Keep the existing `/chat` layout as the persistent shell; move all page-specific behavior into reusable client components/hooks below it.
- Keep REST as the source of truth and Socket.IO as the fan-out mechanism. The Express backend creates and authorizes all friendship, conversation, notification, and message state.
- Add a normalized `notifications` table linked to recipient, optional actor, and optional conversation. Store type, title, description, read state, and timestamps; index unread/list queries. Generate its migration with Drizzle.
- Add backend notification service/controller/routes for listing the latest ten, unread count, and marking items read. Socket events only deliver notification payloads; they do not trust browser-provided user identities.
- Extend user discovery to return a relationship state for the authenticated user: `none`, `outgoing_pending`, `incoming_pending`, or `friends`, plus the relevant request ID when applicable.
- On friend-request acceptance, atomically create the friendship and idempotently create the pair's direct conversation. Emit user-room events to both participants after the transaction completes.
- Use user-scoped socket rooms for notifications, friendship changes, and newly available conversations; retain conversation rooms for messages, read receipts, typing, and presence.
- Do not change authentication behavior, add routes outside the requested chat module, add dependencies, or move server work into Next.js.

## Assumptions

- Existing migrations are already applied in the target environment; the new migration will be applied by the owner using the configured direct `DATABASE_URL`.
- A direct conversation should appear immediately after request acceptance, even before the first message.
- Opening the notification dropdown marks its displayed unread items read; the API remains available for explicit per-notification read updates.
- The requested notification types are implemented for currently supported workflow events: friend received/accepted/rejected, group creation/member changes, and messages received outside the open conversation. Unsupported actions will not be represented as fake UI.

## Files Likely To Change

- `server/src/db/schema.js` and generated `server/src/db/migrations/*`
- New backend notification service, controller, and routes; `server/src/app.js`
- Friend, user, conversation, and message services/controllers as needed for relationship states, direct-conversation creation, and notification creation
- `server/src/socket/events.js`, `rooms.js`, `index.js`, and focused socket handlers
- `src/lib/socket.js`, with reusable chat hooks/components beneath `src/app/chat/_components/`
- `src/app/chat/_components/chat-shell.js`, and the four existing chat route pages

## Implementation Plan

1. Define the notification schema, generate a Drizzle migration, and build the backend notification API with validation, authorization, ordering, and unread count.
2. Add reusable server-side emit helpers and focused socket events for friendship, conversation, notifications, message delivery/read, and presence. Ensure every relevant recipient is addressed through authenticated user rooms.
3. Update friend workflows to prevent duplicate/reverse pending requests, return consistent relationship data, create the direct conversation on acceptance, create notifications, and broadcast both sides' updates.
4. Update conversation/group membership and message workflows to create the applicable notifications and conversation-list events without duplicating conversation records.
5. Build reusable frontend chat UI primitives (avatars, page headers, stateful action buttons, empty/loading/error states, notification dropdown, conversation list, and message pane) using existing Tailwind conventions and lucide icons.
6. Wire each page to its REST initialization plus socket subscriptions with cleanup: user-card relationship actions, friends sections, live conversation list, message handling, read/typing state, and notification badge/dropdown.
7. Ensure responsive behavior: persistent desktop sidebar, accessible mobile drawer, readable compact cards, and a vertically resilient conversation pane.
8. Run lint, backend checks, and production builds where available; report any environment-dependent migration limitation explicitly.

## Security Requirements

- Validate all REST and socket payloads server-side.
- Derive actor and recipient identity from authenticated request/socket context; never from browser payloads.
- Authorize conversation membership before joining, sending, reading, or typing in a room.
- Authorize notification list/read access strictly to the authenticated recipient.
- Keep database URLs, JWT secrets, and internal errors server-only.

## Acceptance Criteria

- The chat sidebar stays mounted across all four requested routes and all pages use the shared shell.
- User cards show exactly the applicable relationship action/state; successful sends change immediately to Pending and cannot duplicate.
- Incoming, sent, and accepted friendship updates propagate to both users without refresh; acceptance creates exactly one direct conversation and exposes it to both lists.
- Friends page shows friends, received pending requests, and sent pending requests with functional actions.
- Conversation list includes direct and group conversations, navigates to bookmarkable conversation URLs, and receives live list/message updates.
- A selected conversation loads history, joins/leaves its room correctly, sends/receives messages live, updates typing/read state, and handles empty/error/loading states.
- Notification badge counts only unread entries; the dropdown shows at most ten recent notifications with avatar/title/body/time/read state and updates live.
- Relevant Socket.IO events for presence, friendship, conversations, messaging, delivery/read, typing, and notifications are registered, authorized, and consumed by the UI where supported.

## Checks To Run

- `npm run lint`
- `npm run build`
- `npm run db:check` from `server/`
- `npm run build` from `server/` if a build script is added or becomes available (otherwise report that it is not defined)

## Manual Testing Steps

1. Run the frontend and backend with valid local environment variables; register or sign in as two different users.
2. From User A's Users page, send a request to User B and confirm the button instantly reads Pending and resists a duplicate send.
3. Sign in as User B, verify the request in Friends and notifications, then accept it. Verify each account sees Friends, a new direct conversation, and the appropriate notification without refresh.
4. Reject a separate request and verify both pages and notifications update correctly.
5. Open the direct conversation in two browser sessions; exchange messages, verify ordering, typing, read updates, and the recipient's conversation list update.
6. Create a group, add/remove a friend, and verify member-specific list and notification updates.
7. Verify the notification badge/dropdown unread behavior, mobile sidebar drawer, direct URL refresh, and browser Back/Forward navigation.

## Visual Layout

- Desktop: fixed-width left navigation; a shared top bar with search, notification badge/dropdown, and user menu; route content occupies the remaining width.
- Chat list: clear conversation title/avatar, last-message preview, relative timestamp, and unread treatment.
- Users/Friends: responsive cards with relationship badges and unambiguous primary/secondary actions.
- Conversation: sticky header and composer with independently scrolling messages, visually distinct own/other bubbles, and mobile-safe spacing.

## Typography

- Retain the existing slate/blue visual language and font scale: strong page titles, readable 14–15px supporting text, and compact metadata.

## Spacing

- Use the existing Tailwind rounded-card and 12–32px spacing rhythm; prevent nested content from exceeding the viewport on small screens.

## Responsive Behavior

- Keep the desktop sidebar visible at `lg` and use the existing modal drawer below it. Stack page actions/cards and preserve an accessible composer on narrow viewports.

## Interaction States

- Provide loading, error, empty, disabled/submitting, active-navigation, pending, unread, hover, focus-visible, online/offline, and typing states.

## Accessibility

- Use semantic landmarks, labeled icon buttons, keyboard-operable menus/drawers, `aria-current` navigation, visible focus styles, and appropriate live feedback for status changes.

## Expected User Experience

- A user can discover someone, send or receive a request, become friends, and begin a direct chat with both browser sessions remaining in sync—without manually refreshing any chat screen.
