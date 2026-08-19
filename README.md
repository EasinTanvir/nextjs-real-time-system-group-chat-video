# Chatify

A real-time chat application with 1:1 and group messaging, live presence, friend requests, and WebRTC-powered audio/video calling — built on Next.js and a horizontally-scalable Express + Socket.IO backend.

## Project Structure

```
my-app/
├── server/          # Express + Socket.IO backend
│   ├── src/
│   │   ├── config/        # env, session, passport config
│   │   ├── controllers/   # route handlers
│   │   ├── services/      # business logic (friends, messages, groups, calls)
│   │   ├── routes/        # Express route definitions
│   │   ├── socket/        # Socket.IO connection handling, call signaling
│   │   ├── db/             # Drizzle schema & client
│   │   ├── lib/            # shared singletons (socket instance, call store)
│   │   └── redis/          # BullMQ workers, pub/sub setup
├── src/             # Next.js frontend (App Router)
│   ├── app/               # routes: /chat, /chat/conversation/[id], /users, /friends
│   ├── components/        # UI components (chat, calls, modals)
│   ├── providers/         # SocketProvider, CallProvider (React context)
│   └── lib/                # API client, helpers
├── public/
└── prompts/         # (agent/prompt configs, if applicable)
```

## Features

### Messaging

- **1:1 direct conversations** — auto-created the moment a friend request is accepted
- **Group chat** — create groups from your friends list, add members later, live member roster
- **Real-time delivery** via Socket.IO, scoped per-conversation for efficient fan-out
- **Optimistic UI** — messages appear instantly on send, reconciled against the server response
- **Unread counts & read receipts** — per-conversation cursor tracking (`lastReadMessageId` / `lastReadAt`)
- **Live sidebar updates** — conversation list re-sorts and updates last-message/unread badges in real time without refetching the full list

### Friends & Social

- **Friend request flow** — send, accept, reject, cancel, with duplicate/self/reverse-pending protection enforced at the DB level (partial unique indexes + check constraints)
- **Discover users** — browse non-friends, see pending request state inline
- **Real-time friend events** — requests, acceptances, and rejections update both parties' UI instantly, including live socket-room updates so already-connected clients don't need a reload

### Presence

- **Online/offline status**, scoped to friends only (not broadcast platform-wide, for privacy and efficiency)
- **Grace-period disconnect handling** — brief network drops or page reloads don't flash a user offline
- **Last-seen timestamps** persisted on true disconnect

### Notifications

- **In-app real-time notifications** for friend requests, acceptances, and rejections
- **Unread badge counter** with mark-as-read / mark-all-as-read

### Audio & Video Calling

- **WebRTC peer-to-peer calling** (audio and video), signaled entirely over the existing Socket.IO connection — no separate media server required
- **Full call lifecycle** — ringing, accept, reject, cancel, busy detection, ring timeout, and clean teardown on disconnect
- **In-call controls** — mute/unmute mic, toggle camera on/off, with the peer notified of state changes
- **Live call timer**, synced to actual peer-connection establishment (not just signaling completion)
- **Call history messages** — completed and missed calls are logged into the conversation as system messages, including duration

## Tech Stack

### Frontend

- **Next.js (App Router)** — server components for initial data fetching, client components for interactivity
- **React** — hooks-based state management, no external state library
- **Tailwind CSS** — utility-first styling
- **Socket.IO Client** — real-time transport
- **lucide-react** — icon set

### Backend

- **Node.js + Express** — REST API layer
- **Socket.IO** — WebSocket transport for real-time events, with Express session/Passport middleware bridged into the socket handshake for authenticated connections
- **Drizzle ORM** — type-safe schema and queries
- **PostgreSQL (Neon)** — primary datastore, serverless Postgres
- **Passport.js** — authentication (local + Google OAuth), session-based

### Real-Time & Infrastructure

- **Redis Pub/Sub** — powers the Socket.IO adapter, allowing real-time events (messages, presence, notifications, call signaling) to propagate correctly across multiple server instances rather than being trapped in a single process's memory
- **Redis + BullMQ** — background job queue for asynchronous work (e.g. transactional email), decoupled from the request/response cycle
- **Redis Session Store** — centralized session storage shared across all server instances, so authentication survives horizontal scaling and load-balanced deployments (rather than sessions being pinned to whichever instance issued them)
- **WebSockets (Socket.IO)** — bidirectional real-time event channel for messages, presence, notifications, and typing/room events
- **WebRTC** — peer-to-peer media transport for audio/video calls; Socket.IO is used purely as the signaling channel (SDP offer/answer and ICE candidate exchange), keeping actual audio/video traffic off the application server entirely

## Architecture Notes

### Why Redis Pub/Sub matters here

Without it, `io.to(room).emit(...)` only reaches sockets connected to _that specific_ Node process. The moment this app runs on more than one instance (e.g. behind a load balancer, or scaled on a PaaS), two users could easily land on different server processes and never receive each other's real-time events. Redis Pub/Sub backs the Socket.IO adapter so an emit on any instance is broadcast to every instance, which then delivers to its own locally-connected sockets — making the real-time layer horizontally scalable rather than single-process-bound.

### Why Redis-backed sessions matter here

Socket.IO authentication in this app works by running the same Express session + Passport middleware used for REST routes against each socket's handshake request. If sessions were stored in-memory (the Express default), a session created on one instance would be invisible to another — breaking login the moment traffic is load-balanced across multiple processes. A centralized Redis session store makes the session valid across the entire fleet.

### Real-time event design

- **Personal room** (`userId`) — every authenticated socket joins a room named after its user ID. This is used for anything that must reach a user regardless of what page/conversation they currently have open: notifications, presence updates, sidebar conversation updates, and incoming call signaling.
- **Conversation room** (`conversation:{id}`) — joined only while a user is actively viewing that specific conversation, and authorized server-side against actual membership before the join is allowed. Used for the live message stream itself, keeping room membership proportional to _concurrently active viewers_ rather than total historical membership — this is what keeps the design viable even for users with hundreds of conversations.
- **Sidebar updates** are emitted as a separate, lightweight event (`sidebar:update`) to every conversation member's personal room, decoupled from the conversation-room broadcast — so the conversation list stays live no matter what page a user is on, without needing to join every conversation room up front.

### Calling architecture

Calls use plain WebRTC (peer-to-peer, mesh) rather than an SFU/media server. For 1:1 calls this is the simplest correct architecture — audio/video flows directly between the two browsers once ICE negotiation completes, and the application server only ever sees signaling metadata (offer/answer SDP, ICE candidates), never media itself. An in-memory call registry (per server instance, keyed by call ID) tracks active call state, ringing timeouts, and busy detection.

> A production deployment should add a TURN server (e.g. coturn or a hosted TURN provider) alongside the STUN servers currently configured, to ensure connectivity for users behind restrictive/symmetric NATs.

## Database Schema Highlights

- **Canonical pair ordering** enforced via check constraints on both `friendships` and `conversations` (direct), preventing duplicate rows for the same pair regardless of insert order
- **Partial unique indexes** — e.g. only one _pending_ friend request allowed per sender/receiver pair, without blocking new requests after a prior one was resolved
- **Circular FK handled correctly** — `conversations.lastMessageId` references `messages`, and `messages.conversationId` references `conversations`; insert order is: create conversation → insert message → update conversation's last-message pointer
- **Cursor-friendly composite indexes** on `messages(conversationId, createdAt DESC, id DESC)` for efficient paginated history queries

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database (Neon or self-hosted)
- Redis instance

### Environment Variables

Create a `.env` file in `server/` with (adjust to your actual config keys):

```env
DATABASE_URL=
REDIS_URL=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CORS_ORIGIN=
PORT=
```

And in the Next.js root:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
```

### Installation

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (from project root)
npm install
npm run dev
```

### Database Setup

```bash
cd server
npx drizzle-kit generate
npx drizzle-kit migrate
```
