# Authenticated real-time Socket.IO events (server)

## Goal

Add production-oriented, authenticated Socket.IO real-time messaging to the separate Express backend. The feature must use focused modules, authorization checks on every client-originated event, acknowledgement-based errors, and useful server-side console diagnostics without exposing secrets or stack traces. Frontend integration is explicitly out of scope.

## Skills Read

- Project `AGENTS.md`
- Installed Next.js 16 App Router documentation: Server and Client Components

## Existing Code Inspected

- `server/src/index.js` starts Express directly with `app.listen`.
- `server/src/app.js` configures CORS and protected REST routes.
- `server/src/middleware/auth.js` and `server/src/utils/jwt.js` provide JWT validation and must remain the authentication source of truth.
- `server/src/services/message-service.js` authorizes active conversation membership and provides the existing message persistence behavior.
- `server/src/services/conversation-service.js` exposes reusable `requireConversation` and `requireMember` authorization helpers.

## Architecture Decisions

- Install `socket.io` only in `server`.
- Change the backend entry point to create one Node HTTP server, attach Socket.IO there, and preserve Express as the REST application.
- Keep socket code under `server/src/socket/`: bootstrap, JWT middleware, room naming helpers, event-name constants, and focused handler modules.
- Authenticate the Socket.IO handshake with the existing signed JWT supplied as `auth.token`; derive `socket.data.userId` exclusively from the verified JWT.
- Use per-user rooms (`user:<id>`) for direct notifications and per-conversation rooms (`conversation:<id>`) only after server-side membership verification.
- Reuse message/conversation services for persistence and authorization; never accept a caller-supplied sender/user/role as trusted state.
- Use acknowledgement callbacks with a consistent `{ success, data }` / `{ success: false, message, code? }` envelope, and map expected `AppError` failures to safe user-facing socket errors.

## Assumptions

- Real-time scope is message delivery, room subscription, typing state, read receipts, and online/offline presence. It will not add unrelated group/friend workflows.
- REST endpoints remain available and remain authoritative for initial data loading and fallback operations.

## Files Likely To Change

- `server/package.json`, `server/package-lock.json`
- `server/src/index.js`, potentially `server/src/app.js`
- `server/src/socket/index.js`
- `server/src/socket/events.js`
- `server/src/socket/middleware/auth.js`
- `server/src/socket/rooms.js`
- `server/src/socket/handlers/conversation-handler.js`
- `server/src/socket/handlers/message-handler.js`
- `server/src/socket/handlers/presence-handler.js`

## Implementation Plan

1. Add the Socket.IO server package.
2. Create an HTTP server around Express and attach a Socket.IO instance with the existing configured CORS origins and credentials policy.
3. Add socket JWT middleware that validates `handshake.auth.token` with `verifyAccessToken`, rejects malformed/missing credentials via `connect_error`, and stores only the verified user id on `socket.data`.
4. Add centralized event constants, safe acknowledgement/error helpers, and room helpers.
5. Add isolated handlers for connection/presence, conversation join/leave, message send, typing start/stop, and message-read events. Validate payload shape, UUIDs, content length, and active membership before joining/emitting/persisting.
6. Persist messages and reads through existing services, then broadcast server-authoritative payloads to authorized conversation rooms. Emit user presence through user rooms and clean up typing/presence state on disconnect.
7. Add safe, contextual server console logging for connection, disconnect, and handler failures without logging tokens or stack traces.
8. Run available backend checks, along with the repository lint/build checks required by the project workflow.

## Security Requirements

- Verify JWT on every socket connection using the existing issuer, audience, algorithm, and secret rules.
- Reject unauthenticated sockets and do not allow unauthenticated room joins.
- Authorize every event server-side, including re-checking membership before sends, reads, typing, or room joins.
- Validate all payloads and enforce the existing 5,000-character message limit.
- Never trust client-provided user ids, sender ids, roles, conversation member lists, or room names.
- Restrict Socket.IO CORS to the configured origins; preserve credential behavior.
- Do not expose JWTs, environment variables, database details, or stack traces in emitted errors or console output.

## Acceptance Criteria

- Express and Socket.IO run from the same backend HTTP server, while remaining in separate modules.
- A valid JWT connects and yields a verified `socket.data.userId`; invalid or absent JWTs fail with a safe authentication error.
- Only active conversation members can join a conversation room or send/read/type within it.
- A sent message is persisted once and broadcast as a server-authoritative `message:new` event to the authorized room.
- Typing, read receipts, and presence events are scoped to authorized recipients and clean up on disconnect.
- Every socket event uses safe acknowledgement/error handling, and client/server console errors include actionable event context but never secrets.
- The existing REST and manual authentication behavior remain unchanged.

## Checks To Run

- `npm run lint`
- `npm run build`
- `npm --prefix server run db:check` (if database configuration is available)
- Start the backend and verify `/health` still responds.

## Manual Testing Steps

1. Start the backend with a valid JWT configuration.
2. Connect two Socket.IO test clients using JWTs for accepted-friend conversation members.
3. Confirm connection succeeds, each user enters only their own user room, and the presence event reaches permitted peers.
4. Join the same conversation from both clients; send a message in one client and verify the other receives the broadcast and the message is persisted.
5. Trigger typing start/stop and read events; verify only conversation members receive them.
6. Attempt a conversation join/send/read with a non-member or invalid UUID and verify the acknowledgement returns a safe error with no broadcast.
7. Attempt a connection without/with an invalid token and verify `connect_error` returns the safe authentication error without logging tokens or stack traces.
