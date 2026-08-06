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
- Authentication is implemented and maintained manually by the project owner

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

/chat/conversation[conversationId]

The selected conversation opens on the right side.

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

Use only these project skills when they are relevant to the requested feature.

.agents/skills/neon-postgres

.agents/skills/ai-sdk

Use them for:

node_modules/next/dist/docs/

Latest Next.js documentation

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

lucide-react

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

Authentication is implemented and maintained manually by the project owner.

Do not add, replace, or modify authentication behavior unless the user explicitly requests it.

---

# 9. Pages

## Public Routes

/

Landing Page

/login

Register Page

---

## Protected Routes

Except Public page all are protected

---

## Chat Module

The Chat module uses its own shared layout.

The layout is responsible for:

- Sidebar Navigation
- User Profile
- Search
- Theme Toggle
- Main Content Area

The layout must remain mounted while navigating between chat pages.

Only the main content should change.

### Chat Routes

/chat

Displays:

- Conversation List
- Empty State (when no conversation is selected)

/chat/conversation/[conversationId]

Displays:

- Selected Conversation
- Private Chat
- Group Chat

The conversation type should be determined from the database, not from the route.

/chat/users

Displays:

- Search Users
- Discover Users
- Send Friend Requests

/chat/friends

Displays:

- Friends List
- Pending Friend Requests
- Sent Friend Requests
- Received Friend Requests

Do not create additional routes inside the Chat module unless explicitly requested.

---

## Sidebar Navigation

The Chat sidebar contains:

- Chats
- Users
- Friends

Each item navigates to:

/chat

/chat/users

/chat/friends

The sidebar must remain visible while navigating between chat pages.

---

## Conversation Navigation

Selecting a conversation should navigate to:

/chat/conversation/[conversationId]

Example:

/chat/conversation/conv_01HZX8A2K4T3P9R5

Refreshing the page must preserve the selected conversation.

Browser Back/Forward navigation should work correctly.

Conversation URLs should be shareable and bookmarkable.

---

## Modals

Friend Requests

- Notification Panel
- Modal
- Drawer
- Popover

Create Group

- Modal

Conversation Details

- Right Drawer

Edit Group

- Modal

Add Members

- Modal

Remove Members

- Confirmation Dialog

Do not create separate pages for these features unless explicitly requested.

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

Primary Entities

- Users
- User Settings
- Friend Requests
- Friendships
- Conversations
- Conversation Members
- Messages
- Message Reads

A conversation represents both:

- Direct Messages
- Group Chats

Do not create a separate Groups table.

Instead, use a `type` field on the Conversations table:

- direct
- group

Conversation Members determine:

- Which users belong to a conversation
- User roles within a group (owner, admin, member)

Friendships should only contain accepted relationships.

Friend Requests should track:

- Pending
- Accepted
- Rejected

Messages belong to a Conversation.

Message Reads are responsible for tracking read receipts and message status.

Do not duplicate user information.

Normalize relationships.

Use foreign keys.

Create proper indexes.

Design schemas for scalability.

Business logic should determine conversation behavior, not separate database structures.

# 12. Authentication

Authentication is implemented and maintained manually by the project owner.

Do not add, replace, configure, or modify authentication flows, providers, middleware, credentials, sessions, or tokens unless the user explicitly requests it.

When working on protected features, preserve the existing authentication boundaries and never trust client-provided user IDs, roles, or permissions.

---

# 13. Environment Variables

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
