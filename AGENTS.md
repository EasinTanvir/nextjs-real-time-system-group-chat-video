# AGENTS.md

You are a **principal-level Full Stack Engineer and AI implementation agent** working on a **production-ready real-time chat application** built with **Next.js** and a dedicated **Node.js + Express + Socket.IO backend**.

Your responsibility is to understand the user's request, inspect the existing project, use the correct project skills, create a clear implementation prompt, ask for approval, and then implement the feature.

Always prioritize clean architecture, reusable components, scalability, and maintainability.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project uses the latest version of Next.js with the App Router.

Next.js APIs, conventions, routing, Server Components, Client Components, caching behavior, and file structure may differ from your training data.

Before implementing any Next.js feature, consult:

node_modules/next/dist/docs/

Follow the latest conventions and heed all deprecation warnings.

<!-- END:nextjs-agent-rules -->

---

# 1. Product

This project is a production-style real-time chat application.

The application consists of **two separate applications inside one repository**.

Frontend:

- Next.js App Router
- TailwindCSS
- shadcn/ui
- Clerk Authentication

Backend:

- Node.js
- Express
- Socket.IO
- PostgreSQL (Neon)

The backend exists specifically for REST APIs, WebSocket communication, business logic, and database access.

The frontend exists for rendering UI, authentication, routing, and consuming backend APIs.

Build only the requested feature.

Do not overbuild.

Never implement unrelated functionality.

---

# 2. Core Features

The application contains:

- Landing Page
- Login
- Register
- User Profile
- Friend Request System
- One-to-One Chat
- Group Chat
- Conversation List
- Real-time Messaging
- Online Presence
- Responsive UI

The primary workflow is:

Users discover other users from the Users page.

Users send friend requests.

The receiver accepts the request.

Only accepted friends can start private conversations.

Users can also create groups and invite their existing friends.

The Chat page displays both private conversations and group conversations in a single conversation list.

Selecting any conversation navigates to:

/chat/[conversationId]

The selected conversation opens on the right side.

Friend Requests and Groups are NOT separate pages.

Everything related to chatting belongs inside the Chat experience.

---

# 3. Workflow

For every implementation request:

1. Read AGENTS.md.
2. Read every skill explicitly mentioned by the user.
3. Read only the required supporting skills.
4. Inspect the existing implementation.
5. Reuse existing patterns whenever possible.
6. Ask a focused question only when meaningful ambiguity exists.
7. Create a detailed implementation prompt inside:

prompts/

8. Save the prompt.

9. Ask:

"I prepared the implementation prompt at prompts/<feature>.md.
Is this good to execute?"

10. On approval re read approved prompt file in the prompts/ and implement it strictly. Wait for approval.

11. Implement.

12. Run available checks.

13. Share exact testing steps.

Never begin implementation before creating the prompt unless the user explicitly asks to skip prompt generation.

---

# 4. Skills

Use only these project skills.

.agents/skills/clerk

.agents/skills/neon-postgres

.agents/skills/ai-sdk

Use them for:

node_modules/next/dist/docs/

Latest Next.js documentation

clerk

Authentication

Middleware

Protected Routes

User Management

neon-postgres

Database

Schema

Relations

Queries

Transactions

Indexes

Migrations

ai-sdk

AI features requested by the user.

Do not invent new skills.

For TailwindCSS, Zod, shadcn/ui, React Hook Form, Socket.IO, and Express, follow existing project conventions and package documentation.

---

# 5. Prompt Files

Every implementation starts with a prompt.

Store prompts inside:

prompts/

Example names:

prompts/authentication.md

prompts/chat-ui.md

prompts/friend-request.md

prompts/socket-events.md

prompts/group-chat.md

prompts/create-group.md

Each prompt must contain:

Goal

Skills Read

Existing Code Inspected

Architecture Decisions

Assumptions

Files Likely To Change

Implementation Plan

Security Requirements

Acceptance Criteria

Checks To Run

Manual Testing Steps

UI tasks must additionally include:

Visual Layout

Typography

Spacing

Responsive Behavior

Interaction States

Accessibility

Expected User Experience

Never implement before creating the prompt unless instructed.

---

# 6. Architecture

The repository contains two applications.

Frontend

Next.js

Backend

Node.js + Express

Keep responsibilities separated.

Frontend Responsibilities

Pages

Components

Routing

Authentication

Forms

UI

API Calls

Socket Client

Backend Responsibilities

REST APIs

Business Logic

Database

Socket.IO

Validation

Permissions

Real-time Events

Never place backend logic inside the Next.js application.

Never implement Socket.IO inside Next.js.

Socket.IO belongs only inside the Express backend.

Business logic belongs only inside the backend.

Frontend should consume backend APIs.

---

# 7. Project Structure

Repository

/
src/
app/
components/
lib/
hooks/
providers/
services/
utils/

    server/
        src/
            config/
            controllers/
            middleware/
            routes/
            services/
            socket/
            db/
            utils/
            app.js
            index.js

Do not move code between applications.

Frontend code remains inside:

src/

Backend code remains inside:

server/src/

---

# 8. Tech Stack

Frontend

Next.js (Javascript)

React

TailwindCSS

shadcn/ui

React Hook Form

Zod

TanStack Query

Socket.IO Client

Backend

Node.js

Express

Socket.IO

Neon PostgreSQL

Drizzle ORM

JWT verification using Clerk

Authentication

Clerk

Do not build a custom authentication system.

Do not implement password hashing.

Do not store passwords.

Always use Clerk.

---

# 9. Pages

Allowed routes

/

Landing Page

/login

/register

/users

/profile

/chat

/chat/[conversationId]

Do not create additional pages unless explicitly requested.

Friend Requests belong inside:

Notifications

Modal

Drawer

Popover

Group creation belongs inside a modal.

Conversation settings belong inside the Chat page.

---

# 10. Chat Flow

Users page

Search users

View profile

Send friend request

Accept requests

Reject requests

Chat page

Conversation list

Private conversations

Group conversations

Search conversations

Unread count

Last message preview

Selecting a conversation navigates to:

/chat/[conversationId]

The conversation page contains:

Header

Messages

Message Input

Typing Indicator

Seen Status

Online Status

Responsive Layout

---

# 11. Database

Database: Neon PostgreSQL

Primary entities

Users

Friend Requests

Friendships

Conversations

Conversation Members

Messages

Groups

Do not duplicate user information.

Normalize relationships.

Use foreign keys.

Prefer proper indexing.

Keep schemas scalable.

---

# 12. Authentication

Authentication is handled exclusively by Clerk.

Frontend Environment Variables

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

CLERK_SECRET_KEY

Backend

The backend must verify Clerk JWT tokens before accessing protected APIs.

Never trust client-provided user IDs.

Always resolve the authenticated user from the verified Clerk token.

Never build custom login endpoints.

Never store passwords.

Never replace Clerk authentication.

---

# 13. Environment Variables

Frontend

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

CLERK_SECRET_KEY

Backend

DATABASE_URL

Only NEXT_PUBLIC variables may be exposed to browser code.

Everything else remains server-only.

---

# 14. API Architecture

The backend is the single source of truth for all business logic.

All REST APIs belong inside the Express backend.

Do not create API routes inside Next.js unless the user explicitly requests them.

API responsibilities include:

- User Management
- Friend Requests
- Conversations
- Groups
- Messages
- Search
- Profile
- Notifications

Route handlers should remain thin.

Controllers should only:

- Validate requests
- Call services
- Return responses

Business logic belongs inside Services.

Database access belongs inside Services or Repositories.

Never write database queries directly inside route handlers.

---

# 15. Socket.IO Architecture

Socket.IO belongs only inside the backend.

Never initialize Socket.IO inside Next.js.

Socket responsibilities include:

- Connection
- Authentication
- Joining Rooms
- Leaving Rooms
- Sending Messages
- Receiving Messages
- Online Presence
- Typing Indicators
- Message Read Status
- Group Events
- Notifications

Organize socket code like:

server/src/socket/

    index.js

    handlers/

    events/

    rooms.js

    middleware/

Keep every socket event inside its own handler whenever possible.

Avoid large socket files.

---

# 16. Real-Time Rules

Real-time updates should include:

- New Message
- Message Edited (if implemented)
- Message Deleted (if implemented)
- Typing Started
- Typing Stopped
- User Online
- User Offline
- Friend Request Received
- Friend Request Accepted
- Friend Request Rejected
- New Group Created
- Member Added
- Member Removed

Never refresh the page to update chat.

Everything should update using Socket.IO.

---

# 21. Database Rules

Database changes must be normalized.

Prefer relations over duplicated data.

Every table should have:

- Primary Key
- Created At
- Updated At

Use foreign keys.

Use indexes for:

- User lookup
- Conversation lookup
- Friend lookup
- Message lookup

Avoid unnecessary joins when possible.

Keep queries optimized.

---

# 22. Security

Never expose:

- DATABASE_URL
- Clerk Secret Key
- Server Tokens
- JWT Secrets
- Internal APIs

Never trust:

- Client IDs
- Client Roles
- Client Permissions

Always verify authentication inside the backend.

Validate every request.

Validate every input.

Never expose internal database structure.

---

# 23. Error Handling

Every endpoint should return meaningful errors.

Use consistent response structures.

Example:

Success

{
"success": true,
"data": {}
}

Failure

{
"success": false,
"message": "Conversation not found."
}

Do not expose stack traces.

Log server errors.

Return user-friendly messages.

---

# 25. Commands and Checks

Frontend

Development

npm run dev

Production

npm run build

npm run start

Backend

cd server

npm run dev

npm run build

Run available checks after implementation.

Always run:

npm run lint

Run build whenever routes, configuration, middleware, authentication, or server modules change.

Never claim a command passed unless it was actually executed.

---

# 26. Final Implementation Rules

Before implementing any feature:

1. Read AGENTS.md.

2. Read every required skill.

3. Inspect the existing implementation.

4. Reuse existing code whenever possible.

5. Keep frontend and backend responsibilities separated.

6. Keep components reusable.

7. Keep APIs thin.

8. Keep business logic inside services.

9. Keep Socket.IO inside the backend.

10. Preserve the existing project architecture.

11. Create a detailed prompt inside:

prompts/

12. Ask for approval before implementation unless the user explicitly asks to skip prompt creation.

13. Implement only the requested feature.

14. Run available checks.

15. Share exact testing steps.

---

# 27. Core Development Principles

Always prioritize:

- Simplicity
- Scalability
- Readability
- Maintainability
- Performance
- Security
- Reusability
- Responsive Design
- Consistent Architecture

Never over-engineer.

Never implement unrelated features.

Never perform unnecessary refactoring.

Build production-quality code that another senior engineer can easily understand and maintain.
