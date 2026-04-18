# Chat App Frontend

🚀 A real-time chat application with 1-on-1 audio/video calling, built with React 19, Vite, and WebRTC.

## ✨ Tech Stack

*   **Framework:** [React 19](https://react.dev) + [Vite 6](https://vite.dev)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Data Fetching:** [TanStack Query v5](https://tanstack.com/query)
*   **Routing:** [React Router v7](https://reactrouter.com/)
*   **Form Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
*   **Real-time:** [Socket.IO Client](https://socket.io/) (shared context provider)
*   **Calls:** WebRTC (native) + Socket.IO signaling
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Environment Types:** Strictly typed using Zod variables (`src/config/env.ts`)

## 🎯 Features

- ✅ Authentication (Login / Register / Google OAuth)
- ✅ Conversations (private, group, channel)
- ✅ Messaging (send, receive, files, threaded replies)
- ✅ Message reactions & @mentions
- ✅ Members management with roles
- ✅ Real-time updates via Socket.IO
- ✅ Profile & Settings
- ✅ UI polish (animations, skeletons, error handling, responsive design)
- ✅ 1-on-1 Audio/Video Calls (WebRTC)
  - Incoming call modal with ringtone animation
  - Outgoing call screen with pulsing rings
  - Video call with draggable picture-in-picture
  - Audio call with animated wave visualization
  - Screen sharing with thumbnail layout
  - Call recording (local WebM download)
  - Mute, camera toggle, screen share, record controls
  - Call history via REST API

## 📁 Architecture (Feature-Driven)

We enforce a **Feature-Driven Architecture**. Rather than separating by file type (`src/components`, `src/hooks`, `src/api`), we group related functionality into features.

```bash
src/
├── app/                  # Application initialization (App.tsx, main.tsx)
├── assets/               # Global static assets (images, svg)
├── components/           # Global, reusable UI components
│   ├── layout/           # Shared layouts (ChatLayout)
│   ├── shared/           # Shared components (OfflineBanner)
│   └── ui/               # shadcn/ui components (button, input, toast)
├── config/               # Application-level configuration (env.ts)
├── features/             # Feature-based scalable modules
│   ├── auth/             # Authentication (login, register, Google OAuth)
│   │   ├── api/          # React Query hooks (useLoginMutation)
│   │   ├── components/   # Auth-specific UI components
│   │   └── pages/        # Route-level pages (Login.tsx, Register.tsx)
│   ├── conversations/    # Conversations list, create, search
│   │   ├── api/          # useConversations, useCreateConversation
│   │   ├── components/   # Sidebar, ConversationList, ConversationView
│   │   ├── hooks/        # useConversationSearch
│   │   └── pages/        # ConversationsPage
│   ├── messaging/        # Messages CRUD, input, file upload
│   │   ├── api/          # useMessages, useSendMessage, useEditMessage
│   │   ├── components/   # MessageList, MessageBubble, MessageInput
│   │   ├── hooks/        # useMessageActions
│   │   └── utils/        # Message grouping utilities
│   ├── members/          # Conversation member management
│   ├── mentions/         # @mention support
│   ├── reactions/        # Emoji reactions
│   ├── profile/          # User profile page
│   └── calls/            # 1-on-1 audio/video calls (WebRTC)
│       ├── api/          # callsApi (REST call history)
│       ├── components/   # IncomingCallModal, ActiveCallView, CallControls, etc.
│       ├── hooks/        # useWebRTC, useMediaDevices, useCallSocket, etc.
│       └── utils/        # callConstants (ICE servers, timeouts)
├── hooks/                # Global generic hooks (useOnlineStatus, useReducedMotion)
├── lib/                  # Framework wrappers (axios.ts, socketContext.tsx, animations.ts)
├── routes/               # Routing configuration & guards (ProtectedRoutes.tsx)
├── store/                # Global Redux state
│   └── slices/           # authSlice, callSlice
└── types/                # Shared TypeScript definitions
```

## 🛠 Getting Started

### Prerequisites

Ensure you have **Node.js 20+** installed.

### Installation

1.  Clone the repository and install dependencies:

```bash
npm install
```

2.  Copy `.env.example` to `.env` and fill in your variables:

```bash
cp .env.example .env
```

3.  Run the development server:

```bash
npm run dev
```

## 🏗 Using shadcn/ui

We use shadcn/ui for our component library. To add a new component:

```bash
npx shadcn@latest add [component-name]
```

These components will be placed in `src/components/ui`.

## 📞 Calls Architecture

The calling feature uses **WebRTC** for peer-to-peer media and **Socket.IO** for signaling:

```
Caller                     Server (Socket.IO)                  Callee
  │── call:initiate ──────▶ │ ── call:incoming ───────────────▶ │
  │                         │ ◀─ call:accept ─────────────────  │
  │◀─ call:accepted ──────  │                                   │
  │═══ WebRTC Offer / Answer / ICE candidates via signaling ═══│
  │═══ Peer-to-peer media stream (audio / video) ══════════════│
  │── call:end ───────────▶ │ ── call:ended ──────────────────▶ │
```

### Redux Call State Machine

```
idle → ringing → connecting → ongoing → ended → idle
```

### Key Hooks

| Hook | Purpose |
|------|--------|
| `useCallSocket` | Orchestrates socket events → Redux → WebRTC |
| `useWebRTC` | RTCPeerConnection lifecycle, ICE handling |
| `useMediaDevices` | Camera/mic access with toggle controls |
| `useScreenShare` | Screen capture with track replacement |
| `useCallRecording` | MediaRecorder for call recording |
| `useCallHistory` | React Query hook for call history API |
