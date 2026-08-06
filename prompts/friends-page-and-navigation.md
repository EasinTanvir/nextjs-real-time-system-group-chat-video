# Friends Page and Simplified Chat Navigation

## Goal

Add a responsive static Friends page at `/chat/friends`, visually aligned with the existing Users page, and simplify the shared Chat sidebar to only Chats, Users, Friends, and a bottom logout affordance. Ensure the Chats, Users, and Friends navigation links work correctly and the current page is visibly active.

## Skills Read

- `AGENTS.md` was read.
- No project-specific skill is required: this is a frontend-only static UI task with no authentication, Neon, or AI functionality.
- Local Next.js 16 documentation was consulted for App Router layouts/pages, `Link` navigation, and Client Component requirements for reading the active pathname.

## Existing Code Inspected

- `src/app/chat/_components/chat-shell.js` is the persistent client-side Chat shell. Its sidebar currently contains links for unimplemented routes and hard-codes Users as active.
- `src/app/chat/users/page.js` is the existing static people-discovery page whose main list structure and styling will be reused for Friends.
- `src/app/chat/page.js` exists at `/chat`; `src/app/chat/users/page.js` exists at `/chat/users`; `/chat/friends` does not yet exist.
- The existing Chat shell owns desktop/sidebar and mobile navigation behavior, so it is the correct place to make the navigation update.

## Architecture Decisions

- Add `src/app/chat/friends/page.js` as a static, server-rendered Friends route.
- Update only `src/app/chat/_components/chat-shell.js` to reduce the sidebar nav items to Chats, Users, and Friends, remove the favorites area and all unsupported route links, add a bottom logout affordance, and use `usePathname()` for active state.
- Keep navigation as Next.js `Link` components so `/chat`, `/chat/users`, and `/chat/friends` use client-side App Router navigation and work from both desktop and mobile sidebars.
- Reuse the Users-page visual conventions but present existing friends with an Unfriend control, not Add Friend. No mutation is performed.
- Logout is visual-only because no authentication is presently configured; it must not claim to terminate a session.

## Assumptions

- “Similar to users page” means an analogous responsive heading, search/filter area, cards/rows, status information, and supporting rail where useful.
- Friend data, online states, and row actions are static mock data in this UI phase.
- “Logout is ok” requests a bottom logout control rather than a real sign-out flow; real logout must be connected only when the manual authentication system is added.

## Files Likely To Change

- `src/app/chat/_components/chat-shell.js`
- `src/app/chat/friends/page.js` (new)

## Implementation Plan

1. Update the sidebar navigation array to contain only Chats (`/chat`), Users (`/chat/users`), and Friends (`/chat/friends`).
2. Read the current pathname in the existing client-side shell and apply the active appearance plus `aria-current="page"` to the matching route.
3. Remove the favorites section and all Groups, Calls, Notifications, Bookmarks, and Settings links from desktop and mobile sidebars.
4. Preserve the bottom signed-in profile context and add a clearly labelled visual-only Logout button; do not implement custom auth or session mutation.
5. Create `/chat/friends` with title/description, search field, filter chips, friend rows, presence state, user details, and Unfriend controls.
6. Add a compact right-side summary/invite panel on large screens, following existing users-page patterns, and adapt it cleanly for smaller screens.
7. Keep hover/focus states, labels, visual selection, layout responsiveness, and no page-level horizontal overflow.
8. Run lint and production build checks.

## Security Requirements

- Do not add custom authentication, password logic, API calls, backend routes, database changes, environment variables, or browser storage.
- The Logout control must remain a visual UI affordance until connected to the manual authentication system.
- All friend data and status values are static mock content only.

## Acceptance Criteria

- `/chat/friends` renders successfully and resembles the Users page in layout and visual language.
- Friends rows use Unfriend actions rather than Add Friend actions.
- Shared sidebar shows only Chats, Users, Friends, and the bottom logout/account area.
- Desktop and mobile sidebar navigation links correctly navigate to the three existing routes.
- Active sidebar styling follows the current `/chat`, `/chat/users`, or `/chat/friends` pathname.
- No unimplemented sidebar destinations remain.
- `npm run lint` and `npm run build` pass.

## Checks To Run

- `npm run lint`
- `npm run build`

## Manual Testing Steps

1. Run `npm run dev` from `my-app`.
2. Visit `/chat`, `/chat/users`, and `/chat/friends`; click each sidebar link and confirm it navigates to the expected existing route and marks that item active.
3. At desktop and mobile widths, confirm only the three requested navigation links and bottom logout/account area appear.
4. Visit `/chat/friends` and confirm the page offers friend rows with Unfriend controls rather than Add Friend controls.
5. Tab through navigation, search, filters, Unfriend, and Logout controls; confirm clear labels and visible focus.

## Visual Layout

- Retain the existing white, 260px desktop sidebar and existing global header.
- Friends page uses the same airy main-panel composition as Users: title/description, search and filters, white row list, optional right-hand supporting card on wide screens.
- Use the existing cool slate surfaces, soft borders, blue-indigo active states, rounded controls, gradient avatar placeholders, and green online indicators.

## Typography

- Retain Geist and existing text hierarchy: compact bold page title, semibold names, muted handles/status labels, and legible control text.

## Spacing

- Continue the existing 8px rhythm and compact sidebar item spacing.
- Keep list rows, controls, and cards aligned with the Users page to make the two routes feel part of one system.

## Responsive Behavior

- Desktop shows the permanent simplified sidebar and Friends content with its supporting rail when space allows.
- Mobile uses the existing sidebar drawer, showing the same three links and Logout affordance; Friends content stacks into one usable column.

## Interaction States

- Sidebar links have hover, `focus-visible`, and pathname-driven active states.
- Chats includes its existing unread count and Users/Friends do not display invented counters.
- Filters and Unfriend controls have visual hover/focus states but do not make a network request or claim success.

## Accessibility

- Use a labelled navigation landmark and `aria-current="page"` for the active route.
- Label search and icon-only buttons; provide visible keyboard focus.
- Do not convey online/offline or active state with color alone.
- Label Logout as a visual-only action where its behavior is not real yet.

## Expected User Experience

The Chat module should feel pared down and coherent: users can move confidently among chats, user discovery, and friends without landing on missing routes. The Friends page looks like a natural companion to Users, clearly distinguishes established relationships through Unfriend controls, and keeps real account/session behavior safely out of scope.
