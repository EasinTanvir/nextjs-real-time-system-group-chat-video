# Chatify Login and Registration Forms

## Goal

Implement responsive, Chatify-styled `/login` and `/register` pages that use React Hook Form for client-side validation:

- Login: email and password
- Registration: username, email, and password

These forms provide polished UI and validation only. Authentication, API submission, credential storage, sessions, and redirects remain the project owner's manual implementation responsibility.

## Skills Read

- `AGENTS.md`
- No project skill is required: this is a frontend-only form UI task with no database, AI, Socket.IO, or backend-authentication work.
- Before implementation, consult the relevant local Next.js 16 documentation in `node_modules/next/dist/docs/` for current App Router and client-component conventions.
- Follow the installed React Hook Form package documentation for its current API and accessibility guidance.

## Existing Code Inspected

- `src/app/page.js` is the established Chatify landing page. It uses an off-white canvas, subtle blue/violet ambient gradients, Geist typography, a message-circle brand mark, and links to `/login` and `/register`.
- `src/app/chat/_components/chat-shell.js` provides the current in-product visual language: blue-to-indigo gradients, rounded-xl controls, slate text, soft borders, and visible interactive states.
- `src/app/layout.js` configures the shared Geist font family and site metadata.
- `src/app/globals.css` provides Tailwind CSS 4 and global color tokens.
- `package.json` does not currently include `react-hook-form`.
- No login or registration route exists yet, and no authentication backend/API is being added by this change.

## Architecture Decisions

- Install and use `react-hook-form` for field registration, submit handling, touched/error state, and client-side validation.
- Keep each route as a client component because React Hook Form requires browser-side state.
- Share the visual shell and repeated field behavior in a small reusable local component/module so login and registration stay visually consistent without broad refactoring.
- Use `next/link` for navigation between `/`, `/login`, and `/register`.
- Do not call an API, use browser storage, create authentication middleware, hash or persist credentials, or navigate to `/chat` after submit. On valid submission, only retain/formally surface a neutral “ready to connect” UI state that can be replaced with the owner's manual auth action.

## Assumptions

- “Similar design pattern” refers to the existing Chatify landing and chat-shell styling, rather than an external reference image.
- Email is required and must match a conventional email format.
- Password is required and must have at least 8 characters.
- Username is required, trimmed, 3–30 characters, and may contain letters, numbers, underscores, and hyphens.
- Password confirmation is not requested and will not be added.
- The forms should not pretend to authenticate users until manual server integration is supplied.

## Files Likely To Change

- `package.json`
- `package-lock.json`
- `src/app/login/page.js`
- `src/app/register/page.js`
- `src/components/auth/auth-page-shell.js` (or an equivalently scoped reusable presentational component)
- `src/components/auth/auth-field.js` (only if it improves field reuse without over-abstraction)
- `src/app/globals.css` only if a small shared style adjustment is necessary

## Implementation Plan

1. Read the relevant current local Next.js documentation.
2. Add `react-hook-form` as a frontend dependency.
3. Add a reusable Chatify auth-page shell with the message-circle logo, return-home link, clear heading/copy, centered white card, and responsive blue/violet background treatment.
4. Build `/login` using `useForm` with required email and password fields, email-format validation, minimum password length validation, accessible inline errors, and disabled/processing button handling.
5. Build `/register` using `useForm` with the same email/password validation plus username requirements and inline errors.
6. Add cross-navigation: Login links to Register and Register links to Login.
7. On valid form submission, display a non-authenticating success/ready state and keep submitted credentials out of logs, URLs, local storage, and rendered success text.
8. Ensure controls expose labels, `aria-invalid`, and error associations; retain keyboard focus and mobile usability.
9. Run lint and production build, resolving relevant failures.

## Security Requirements

- Do not submit credentials to any endpoint or store them in local/session storage, cookies, URLs, analytics, or console logs.
- Do not add custom authentication logic, authentication middleware, passwords hashing, token creation, or database access.
- Never render entered passwords after submit.
- Keep this change limited to client-side validation and presentation; real credential validation and authorization must be handled by the manual backend implementation.

## Acceptance Criteria

- `/login` renders a Chatify-styled login page with Email and Password fields.
- `/register` renders a matching registration page with Username, Email, and Password fields.
- Both forms use React Hook Form; invalid inputs show useful inline validation feedback when interacted with/submitted.
- Valid submissions do not authenticate, persist, log, or expose credentials.
- Both pages link correctly to each other and back to the landing page.
- Layout remains readable and unclipped at desktop and mobile widths.
- `npm run lint` and `npm run build` complete successfully.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. Run `npm run dev` from `my-app`.
2. Open `http://localhost:3000/login`; submit empty values, an invalid email, and a password shorter than 8 characters, confirming clear inline errors.
3. Enter a valid email and 8+ character password, submit, and confirm only the non-authenticating ready state appears.
4. Open `http://localhost:3000/register`; test empty values, invalid username characters/length, invalid email, and a short password.
5. Enter valid username, email, and password values; submit and confirm no navigation or credentials are persisted or exposed.
6. Use the Login/Register links and Home link; confirm the intended routes open.
7. Tab through both pages and test at mobile width for visible focus, readable labels, and no clipped content.

## Visual Layout

- Place a subtle blue/violet radial ambient gradient over Chatify's off-white background.
- Center a compact white authentication card with a soft border and restrained shadow.
- Position Chatify's blue-to-indigo message mark and wordmark above the card, with a small return-home action.
- Use full-width fields and a prominent blue-to-indigo primary submit button; reserve a clear area beneath fields for errors and the non-authenticating ready state.

## Typography

- Continue using the shared Geist font.
- Use a concise bold heading, muted supporting paragraph, 14–16px field labels/inputs, and readable 13–14px error/help text.

## Spacing

- Use consistent rounded-xl controls, 12–16px gaps between fields, 24–32px card padding, and adequate viewport-safe vertical space.

## Responsive Behavior

- Constrain the card to a comfortable desktop width.
- At small widths, retain page gutters and allow the card/form to fill the available width without horizontal scrolling.

## Interaction States

- Inputs have clear default, hover, focus, and error borders.
- The submit button has hover, focus-visible, disabled, and submitting states.
- Inline errors appear near their respective fields and disappear when the field becomes valid.
- The pages contain no misleading sign-in or account-created completion state.

## Accessibility

- Use semantic `main`, a single page-level heading, explicit labels, and appropriate input `autoComplete` attributes.
- Connect validation messages with `aria-describedby` and set `aria-invalid` for invalid fields.
- Announce the neutral valid-submission state with an appropriate live region.
- Maintain a logical tab order and sufficient color contrast.

## Expected User Experience

Visitors find familiar, polished Chatify forms that identify input issues immediately and guide them between login and registration. Once valid, the UI clearly signals that the form is ready for the owner's future manual authentication connection, without falsely claiming that a login or account creation occurred.
