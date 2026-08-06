# JWT authentication API

## Goal

Add secure backend registration and login endpoints, persist password hashes, issue signed JSON Web Tokens, and authenticate protected routes by verifying Bearer tokens from request headers.

## Skills Read

- `AGENTS.md`

## Existing Code Inspected

- The server has Express, Drizzle, PostgreSQL, and the chat API structure already in place.
- `users` currently has no password-hash column.
- `server/src/middleware/auth.js` currently expects a different middleware to set `req.auth.userId`.
- The frontend contains validation-only login/register forms; this change remains backend-only.

## Architecture Decisions

- Add `password_hash` to `users` via the Drizzle schema and a generated migration; never select or return it in normal user responses.
- Install `bcryptjs` for adaptive password hashing and `jsonwebtoken` for signed JWTs.
- Expose public endpoints `POST /api/v1/auth/register` and `POST /api/v1/auth/login`.
- Put credential validation and persistence in `auth-service`, keep controllers thin, and issue tokens through a dedicated JWT utility.
- JWT payload contains only the subject user ID; tokens will be signed with `JWT_SECRET`, validated for algorithm, issuer, audience, and expiry.
- Replace the temporary identity adapter with Bearer-token extraction from the `Authorization` header. On successful verification it sets `req.auth.userId` and `req.userId`; malformed, expired, invalid, or absent tokens return the existing safe `401` response.

## Assumptions

- Email/password authentication is the intended manual-auth system requested by the user.
- Access tokens expire after 7 days by default and no refresh-token/revocation subsystem is requested.
- `JWT_SECRET` will be a high-entropy server-only environment variable; startup must fail if it is absent or unsafe.

## Files Likely To Change

- `server/package.json`, lockfile
- `server/src/db/schema.js`, generated Drizzle migration metadata and SQL
- New authentication route/controller/service/JWT utility
- `server/src/middleware/auth.js`, `server/src/app.js`, environment template
- Existing Postman collection and local environment

## Implementation Plan

1. Install the two runtime dependencies.
2. Add a non-null password-hash column and generate a Drizzle migration.
3. Implement registration with normalized email/username, strict password validation, bcrypt hashing, default settings creation, and conflict-safe errors.
4. Implement login with generic invalid-credential errors and a timing-safe password comparison.
5. Implement signing and verification helpers and secure Bearer-token middleware.
6. Register public auth routes before protected API routes and update Postman login/register requests plus token capture.
7. Run lint, syntax, Drizzle checks, migration generation/check, and auth middleware smoke tests.

## Security Requirements

- Never store plaintext passwords or include a password hash in any response, JWT, log, or Postman variable.
- Require at least 8-character passwords and cap credential input lengths.
- Use bcrypt hashing with an appropriate work factor.
- Use a strong `JWT_SECRET`; restrict JWT verification to HS256 and require issuer/audience/expiry.
- Return the same `401` response for unknown email and wrong password.
- Do not disclose internal authentication or database errors.

## Acceptance Criteria

- Register creates a user, default settings, and returns a Bearer token plus safe user data.
- Login returns a valid Bearer token only for correct credentials.
- Protected chat endpoints accept valid Bearer tokens and reject missing, malformed, expired, and invalid tokens with `401`.
- Postman can register/login and save the returned access token to `authToken` for subsequent requests.
- All checks described below pass, or database-dependent limitations are reported accurately.

## Checks To Run

- `npm run lint`
- `node --check` for all server source files
- `npm run db:generate` and `npm run db:check`
- JWT signing/verification and public-auth-route smoke tests

## Manual Testing Steps

1. Add a strong random `JWT_SECRET` to `server/.env`, along with `JWT_ISSUER`, `JWT_AUDIENCE`, and optional `JWT_EXPIRES_IN`.
2. Run `npm run db:migrate` in `server`.
3. Start `npm run dev` in `server`.
4. Import the Postman collection/environment, call **Register** or **Login**, and confirm `authToken` is saved.
5. Call **My profile**; it should succeed with the Bearer token and return `401` without it.
