# Chat Users Layout

## Goal

Build a polished, responsive static Chatify users-dashboard layout at `/chat/users`, closely following the supplied reference image. The screen should provide the persistent chat workspace shell, people discovery controls, a user list, and the supporting right-hand panels. This task is limited to presentation and small client-side UI states; it does not introduce real chat, backend APIs, authentication, or database access.

## Skills Read

- `AGENTS.md` was read.
- No project-specific skill is required: this is a frontend-only layout task with no authentication, Neon, or AI functionality.
- Local Next.js 16 documentation was consulted for App Router route conventions and Server/Client Component boundaries.

## Existing Code Inspected

- `src/app/page.js` is an existing static marketing page and already establishes the Chatify visual language.
- `src/app/layout.js` provides Geist fonts and root metadata.
- `src/app/globals.css` defines Tailwind CSS 4 plus shared color and shadow tokens.
- `package.json` provides Next.js 16, React 19, Tailwind CSS 4, and `lucide-react`.
- The supplied reference shows a desktop users-discovery view with a left workspace sidebar, top utility bar, users list, recommendation card, and invitation card.

## Architecture Decisions

- Add `src/app/chat/layout.js` as the shared Chat module shell so its sidebar remains mounted through future `/chat`, `/chat/users`, and `/chat/friends` navigation.
- Add `src/app/chat/users/page.js` for the requested users-discovery screen. Keep the page a Server Component initially because all data is static presentation data.
- Colocate route-specific presentational components and mock data under `src/app/chat/_components/` and `src/app/chat/_data/` only when doing so improves clarity; do not create a new backend endpoint or Next.js route handler.
- Use Lucide icons and CSS/gradient avatar placeholders, avoiding external image loading and additional dependencies.
- Implement a narrow, purposeful Client Component only if necessary for a UI interaction such as active filter chips or a sidebar mobile toggle. Keep the surrounding route layout server-rendered.
- Use normal `Link` components for intended chat navigation. Destinations that are not yet implemented should remain visually available without pretending to perform real user actions.

## Assumptions

- “Chat layout” refers to the dashboard-style Chatify users layout shown in the supplied image, rather than the existing marketing-page chat preview.
- The intended initial route is `/chat/users`, matching the product route specified in `AGENTS.md` and the active “Users” item in the reference.
- User rows, recommendations, counts, statuses, and profile details are static mock content for this UI pass.
- Search, filters, add-friend, notifications, theme, and profile menus are visual or local-only affordances; real behavior will be added only when requested.

## Files Likely To Change

- `src/app/chat/layout.js`
- `src/app/chat/users/page.js`
- `src/app/chat/_components/*` (shared dashboard/sidebar and UI primitives)
- `src/app/chat/_data/*` (static display data, if separated)
- `src/app/globals.css` (only if a small shared base rule is necessary)

## Implementation Plan

1. Create the App Router Chat module with a shared layout and sidebar navigation for Chats, Users, Friends, Groups, Calls, Notifications, Bookmarks, and Settings.
2. Add the compact favorites area and the fixed bottom user profile affordance inside the desktop sidebar.
3. Add the users route with a top utility bar containing a global search field, keyboard-hint decoration, theme and display controls, and profile avatar.
4. Build the main users area: heading, description, search input, filters button, and selected filter chips.
5. Render the supplied-style user discovery list with avatar/presence, name/handle, online/offline status, biography, Add Friend action, and an accessible overflow action.
6. Add the right rail containing “People You May Know” with recommendation rows and the “Invite Your Friends” callout card.
7. Apply responsive behavior: desktop three-column composition; tablet hides or compresses the right rail; mobile replaces the permanent sidebar with an accessible trigger and presents the list as a single column with no page-level horizontal overflow.
8. Match the reference’s airy white surface, slate typography, blue-violet accents, subtle borders and shadows, rounded cards, consistent spacing, and green status indicators.
9. Use semantic regions, form labels, accessible names for icon-only controls, visible focus treatment, and controls with appropriate disabled or no-op behavior where functionality is intentionally out of scope.
10. Run lint and a production build, then resolve relevant errors.

## Security Requirements

- Do not add API calls, secrets, browser storage, authentication bypasses, database access, or real user-data handling.
- Do not use external image URLs; avatars remain local CSS placeholders or initials.
- Do not trust or represent mock display data as authenticated user data.

## Acceptance Criteria

- Visiting `/chat/users` renders the Chatify users layout rather than a 404 page.
- The persistent desktop sidebar, top utility bar, primary users list, and right recommendation/invite rail visually correspond to the supplied reference.
- The Users navigation item is visibly selected.
- The page includes user search, filters, filter chips, online/offline states, Add Friend actions, people recommendations, and an invite card.
- The route is responsive, keyboard navigable, and has no unintended page-level horizontal scrolling.
- No Express/backend, database, authentication, Socket.IO, API, or environment-variable changes are made.
- `npm run lint` and `npm run build` pass.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. Run `npm run dev` from `my-app` and open `http://localhost:3000/chat/users`.
2. At a desktop width near 1536px, compare the sidebar, users list, top controls, and right rail hierarchy against the supplied reference.
3. Resize through tablet and mobile widths; confirm the page stays readable, the right rail adapts appropriately, and no viewport-wide horizontal scrolling appears.
4. Tab through search, filters, navigation, Add Friend, overflow, and utility controls to verify visible focus and useful accessible names.

## Visual Layout

- Full-height white application canvas with a roughly 260px desktop sidebar, a top utility bar, and a spacious main workspace.
- Desktop workspace uses a flexible primary users column and a right rail around 350px wide; panels use white surfaces, faint cool-gray borders, and soft corner radii.
- User list rows are broadly horizontal with 88–94px vertical rhythm and lightly divided; the Add Friend button anchors to the right.
- Use deep slate headings, muted slate supporting text, electric blue-to-indigo actions, pale blue selected navigation, and small green presence dots.

## Typography

- Keep the existing Geist sans font.
- Use a bold, compact “Users” heading with lighter muted supporting copy.
- Preserve clear hierarchy: semi-bold names and panel labels, smaller handles/statuses/biographies, and compact but legible control labels.

## Spacing

- Follow an 8px spacing rhythm.
- Use generous workspace padding at desktop, compact consistent sidebar spacing, and approximately 16–24px card padding.
- Keep controls aligned on a shared vertical grid with consistent 10–14px corner radii.

## Responsive Behavior

- Desktop: show the complete sidebar and right rail.
- Tablet: preserve the main list, reduce margins, and hide or move the right rail below the list if it no longer fits cleanly.
- Mobile: hide the permanent sidebar behind an accessible trigger, stack controls and list content, allow biography/action content to wrap intelligently, and maintain usable tap targets.

## Interaction States

- Navigation, filters, buttons, and rows have hover and `focus-visible` states.
- Show the Users item and All Users filter as selected static states by default.
- Buttons should not claim network success; Add Friend may show only a local visual confirmation if any interactivity is included.

## Accessibility

- Use `aside`, `header`, `nav`, `main`, `section`, headings, and labelled search inputs appropriately.
- Supply `aria-label` text for icon-only buttons and overflow menus.
- Maintain color contrast and do not convey online/offline or selected state only with color.
- Keep keyboard focus visible and touch targets practical.

## Expected User Experience

The screen should feel like a polished Chatify workspace: users can immediately orient themselves in the persistent navigation, browse people without distraction, recognize status and context at a glance, and discover useful suggestions from the supporting right rail. It should look convincing and production-oriented while remaining explicitly static until the corresponding product capabilities are requested.
