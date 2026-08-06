# Frontend / Backend Chat Integration

## Goal

Replace the static frontend with a complete, protected integration to the existing Express, PostgreSQL, and Socket.IO chat backend. Support registration, login, persisted client authentication, user discovery, friend-request management, direct and group conversations, messages, typing/read/presence updates, and user-facing error feedback through React Hot Toast.

## Skills Read

No project-specific skill is required. The existing backend and the current Next.js App Router implementation were inspected; the required Next.js conventions will be verified locally before route and middleware changes.

## Existing Code Inspected

- `src/app/login/page.js` and `src/app/register/page.js`: React Hook Form validation only; no API calls.
- `src/app/chat/**`: mock arrays and static interaction-only UI.
- `server/src/routes`, `controllers`, `services`, and `socket`: authenticated REST APIs and Socket.IO handlers already support accounts, users, friends, conversations, groups, messages, typing, read receipts, and presence.
- `server/src/middleware/auth.js`: accepts bearer JWT access tokens.

## Architecture Decisions

- Install and use `axios`, `socket.io-client`, and `react-hot-toast` on the frontend.
- Centralize base URL, token attachment, response normalization, and unauthorized-session cleanup in one Axios instance.
- Persist the access token locally and hydrate the signed-in user via `/me`; redirect unauthenticated users from all non-public routes.
- Use client providers/hooks for auth and a singleton Socket.IO client. Socket authentication sends the bearer token using the server’s supported handshake auth contract.
- Load authoritative data from REST initially; apply Socket.IO events to local page state without refreshes.
- Keep all authorization and permissions enforced by the existing backend; the frontend never supplies a trusted identity.

## Assumptions

- The browser API base URL is configured by `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:4000/api/v1`; the socket URL defaults to its origin.
- Access tokens are returned in the backend auth response and are safe to retain as the application’s existing bearer-token model.
- Existing REST group endpoints are sufficient for group creation and member management; group-specific realtime membership events may need to be added on the backend to meet the realtime acceptance criterion.

## Files Likely To Change

- `package.json`, `.env.example` (or documented environment variables)
- `src/app/layout.js`, auth pages, chat layout/pages, and a new conversation route
- New `src/lib`, `src/services`, `src/providers`, and reusable chat UI components
- Backend socket event definitions/handlers only where friend-request and group membership realtime events are missing

## Implementation Plan

1. Add dependencies and shared API/auth/socket/error utilities.
2. Add an auth provider, route protection, token persistence, logout, and a global toast renderer.
3. Replace login/register placeholders with real calls, errors, redirects, and success messages.
4. Replace dummy Users and Friends data with API-backed searchable pages and friend-request actions/statuses.
5. Replace the chat mock with an API-backed conversation list, filters, empty state, group creation, and direct-chat creation.
6. Add `/chat/conversation/[conversationId]` for API-backed messages, group/direct headers, sending, typing, presence, and read receipts.
7. Subscribe to socket events and add any narrowly required server events for friend requests and group membership so screens update in real time.
8. Run lint/build checks and document manual end-to-end testing.

## Security Requirements

- Send access tokens only in authorization headers and Socket.IO handshake auth.
- Treat all API and socket failures as untrusted messages and show safe, user-facing errors.
- On expired/invalid authentication, clear the local session and return to login.
- Do not expose server secrets or database information in browser code.
- Preserve backend authorization for every user, friendship, conversation, membership, and message operation.

## Acceptance Criteria

- Login and registration create authenticated sessions and protected routes redirect correctly.
- No rendered feature data comes from dummy arrays.
- Users can discover people, send/cancel friend requests, and accept/reject received requests.
- Friends can begin direct chats; users can create groups from friends and view group conversations.
- Conversation list, message history, sending, typing, presence, and read-status update without a page refresh.
- Friend request and group membership changes update the affected open UI in real time.
- API calls use the shared Axios instance and all errors are handled through React Hot Toast or meaningful inline states.
- Lint and production build pass.

## Checks To Run

- `npm run lint`
- `npm run build`
- `npm run db:check` in `server` (if database configuration is available)
- Start backend and frontend, then test two authenticated browser sessions.

## Manual Testing Steps

1. Register two users, log in on separate browser profiles, and verify protected-route redirects and logout.
2. Search for the other user, send then accept a friend request, and observe both sessions update.
3. Start a direct chat, exchange messages, and verify immediate delivery, typing, online/offline state, and read status.
4. Create a group with accepted friends, verify member visibility and group messages in each session.
5. Trigger invalid requests and expired-token behavior to verify non-technical toast errors and session cleanup.
