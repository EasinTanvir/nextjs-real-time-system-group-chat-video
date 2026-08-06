# Backend API completion

## Goal

Implement the production-oriented Express API required by the existing real-time chat data model, and provide an importable Postman collection with happy-path and validation/error requests. The implementation must keep route handlers thin, put business rules and database access in services, and use one consistent error contract.

## Skills Read

- `AGENTS.md`
- `.agents/skills/neon-postgres/SKILL.md`

## Existing Code Inspected

- `server/src/app.js` and `server/src/index.js` are empty.
- `server/src/db/schema.js` already contains normalized Drizzle tables and indexes for users, user settings, friend requests, friendships, conversations, memberships, messages, and read receipts.
- `server/src/db/migrations/0000_wandering_scourge.sql` creates the schema.
- The frontend login and registration pages are presently UI-only; no backend authentication mechanism or identity middleware exists.
- The server has Express, Drizzle, PostgreSQL, CORS, and dotenv installed. Socket.IO and validation libraries are not installed.

## Architecture Decisions

- Create `config`, `controllers`, `routes`, `services`, `middleware`, `utils`, and `validators` modules below `server/src`.
- Mount all APIs below `/api/v1`; add `GET /health`.
- Standardize responses as `{ success: true, data }` and `{ success: false, message, errors? }`.
- Use a typed application-error class, async-handler wrapper, 404 middleware, centralized error middleware, PostgreSQL/Drizzle constraint translation, and production-safe logging.
- Validate and normalize every path, query, and JSON body input at the HTTP boundary without trusting client-supplied actor IDs, roles, or permissions.
- Preserve the manual-auth boundary: protected routes will obtain the authenticated actor only from a small adapter middleware that expects the project owner's auth layer to set `req.auth.userId`. It must return `401` when no verified identity is present; it must never accept an arbitrary `userId` in a request body or query.
- Encapsulate authorization and transactions in services. Friend acceptance, direct-conversation creation, group creation/member changes, message creation, and read marking will be transaction-safe where multiple writes must stay consistent.
- Use cursor pagination for discovery, conversation lists, and messages; make all resource access membership-aware.
- Do not add Next.js API routes, frontend authentication, a Groups table, or Socket.IO in this change. Socket events can be added as a separate implementation after Socket.IO authentication is defined.

## Assumptions

- “All required endpoints” means the REST endpoints supported by the existing schema: health; current-user profile/settings; user discovery; friend-request lifecycle and friends; direct and group conversations; group membership administration; messages; and read receipts.
- Existing migrations represent the intended baseline; any schema changes needed to safely support these endpoints will be generated with Drizzle rather than applied ad hoc.
- Because authentication is not yet implemented, Postman protected-route examples will use a documented `{{authToken}}` placeholder and will require the owner’s authentication middleware to resolve it into `req.auth.userId`. The collection will clearly include the expected unauthorized response until that integration exists.

## Endpoint Scope

- `GET /health`
- `GET/PATCH /api/v1/me`; `GET/PATCH /api/v1/me/settings`
- `GET /api/v1/users` and `GET /api/v1/users/:userId`
- `GET/POST /api/v1/friend-requests`; `PATCH /api/v1/friend-requests/:requestId` for accept/reject; `DELETE /api/v1/friend-requests/:requestId` for sender cancellation; `GET /api/v1/friends`; `DELETE /api/v1/friends/:userId`
- `GET/POST /api/v1/conversations`; `GET/PATCH/DELETE /api/v1/conversations/:conversationId`; `POST /api/v1/conversations/direct`
- `GET/POST /api/v1/conversations/:conversationId/members`; `PATCH/DELETE /api/v1/conversations/:conversationId/members/:userId`
- `GET/POST /api/v1/conversations/:conversationId/messages`; `PATCH/DELETE /api/v1/conversations/:conversationId/messages/:messageId`; `POST /api/v1/conversations/:conversationId/read`

## Files Likely To Change

- `server/src/app.js`, `server/src/index.js`
- New server route/controller/service/middleware/validator/utility modules
- `server/src/db/schema.js` and a generated Drizzle migration only if endpoint integrity requires it
- `server/package.json` only for a justified runtime dependency
- `server/.env.example`
- `server/postman/chat-api.postman_collection.json` and `server/postman/local.postman_environment.json`

## Implementation Plan

1. Build the Express bootstrap, configuration, health route, CORS/JSON middleware, and centralized error handling.
2. Add reusable input parsing, UUID/pagination validation, response utilities, and request identity adapter.
3. Implement user/profile/settings and discovery services/controllers/routes.
4. Implement friend-request and friendship lifecycle with canonical pairs, duplicate prevention, permission checks, and transactions.
5. Implement member-scoped direct/group conversation creation, listing/detail, group updates/deletion, and member role management.
6. Implement membership-checked, cursor-paginated messages, author-only edit/delete, conversation last-message maintenance, and read receipts.
7. Generate a Postman v2.1 collection and local environment with variables, request bodies, chained IDs where feasible, and explicit expected error cases.
8. Run server checks, migration checks, and focused endpoint tests that do not require a live database; document commands and manual Postman steps.

## Security Requirements

- Authenticate every protected operation through a verified server-side identity only.
- Authorize every target resource: users may only manage their own profile/settings; friendship operations must involve the actor; conversation and message reads/writes require active membership; group changes require owner/admin privileges; only message authors can edit/delete their own messages.
- Enforce direct-chat friendship before creation; prevent self-actions, duplicate friend requests, duplicate memberships, and invalid group role changes.
- Limit page sizes and trim/enforce nonempty bounded text inputs.
- Keep `DATABASE_URL`, tokens, stack traces, and database errors out of API responses.
- Parameterize all database access through Drizzle and use database transactions for coupled writes.

## Acceptance Criteria

- The previously empty server starts and exposes a versioned REST API.
- All endpoints in the scope use consistent success/error responses and correct 400/401/403/404/409/422/500 statuses.
- No protected endpoint trusts a client-provided acting user ID.
- Friend, conversation, member, message, and read-receipt business rules are enforced in services.
- An importable Postman collection JSON and local environment JSON are included in the repository.
- The collection demonstrates both successful request bodies and representative failures.
- Available checks pass, with any database-dependent checks reported accurately.

## Checks To Run

- `npm run db:check` from `server`
- `node --check` for every server source file
- Start the server with a valid `DATABASE_URL` and exercise `/health`
- Import `server/postman/chat-api.postman_collection.json` into Postman, configure the environment, and run the documented sequence against a seeded/authenticated development account.

## Manual Testing Steps

1. Configure `server/.env` with `DATABASE_URL`, port, CORS origin, and the project authentication settings.
2. Run migrations with `npm run db:migrate` from `server`.
3. Start the backend using `npm run dev`.
4. Import the collection and local environment JSON in Postman; set `baseUrl` and a valid `authToken` for the owner’s authentication system.
5. Create or select two user accounts, send/accept a friend request, create a direct conversation, send/edit/delete a message, mark it read, create a group, and verify member-role authorization with a second account.
6. Run the supplied invalid-body, unauthenticated, forbidden, and nonexistent-resource requests to confirm their error responses.
