# CodeSphere 🌐

> A real-time platform for technical interviews and pair programming — meet face-to-face over video, chat during the session, work through curated algorithm problems, and run your code in JavaScript, Python, Java, or C++ right in the browser.

[![Node.js](https://img.shields.io/badge/Node.js-20.19+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## ✨ Features

| Feature | Description |
|---|---|
| **1-on-1 Live Sessions** | Create a room for a problem; one other user can join it (max 2 people per session) |
| **Video & Audio Calls** | HD video calling inside each session, powered by Stream Video |
| **Session Chat** | A Stream Chat channel is created for every session, toggleable next to the video |
| **Code Editor** | Monaco Editor (the engine behind VS Code) with syntax highlighting for each language |
| **Multi-Language Execution** | Run JavaScript, Python, Java, and C++ via the public [Judge0 CE](https://ce.judge0.com/) API |
| **Problem Library** | 5 curated problems — Two Sum, Reverse String, Valid Palindrome, Maximum Subarray, Container With Most Water |
| **Solo Practice with Auto-Check** | On the practice page, your output is compared to the expected output — pass and you get confetti 🎉 |
| **Dashboard** | See live sessions (with OPEN / FULL status), your completed sessions, and session counts |
| **Resizable Panels** | Drag to resize the problem, editor, output, and video panes |
| **User Sync** | Clerk sign-ups/deletions are synced to MongoDB and Stream through Inngest background functions |

> **Note:** each participant has their own editor — code is **not** synced live between the two users. Use the video call (or screen share) and chat to collaborate on a solution.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) | UI framework & build tool |
| [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/) | Styling & component library |
| [Clerk React](https://clerk.com/docs/references/react/overview) | Sign-in / sign-up UI and session tokens |
| [Monaco Editor](https://github.com/suren-atoyan/monaco-react) | Code editor |
| [Stream Video React SDK](https://getstream.io/video/) | Video & audio calling |
| [Stream Chat React](https://getstream.io/chat/) | In-session messaging |
| [TanStack React Query](https://tanstack.com/query) | Server state & data fetching |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | Resizable workspace layout |
| [Axios](https://axios-http.com/) | HTTP client (attaches the Clerk token to every request) |
| [React Hot Toast](https://react-hot-toast.com/) | Notifications |
| [Lucide React](https://lucide.dev/) | Icons |
| [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) | Celebration when tests pass |
| [date-fns](https://date-fns.org/) | Relative dates for past sessions |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM (`User`, `Session` models) |
| [Clerk Express](https://clerk.com/docs/references/express/overview) | Verifies requests and protects API routes |
| [Stream Node SDK](https://getstream.io/) + [stream-chat](https://getstream.io/chat/) | Creates video calls & chat channels, issues user tokens |
| [Inngest](https://www.inngest.com/) | Background functions that sync Clerk users to MongoDB & Stream |

### External Services

| Service | Used for |
|---|---|
| [Judge0 CE](https://ce.judge0.com/) | Code execution — called **directly from the browser** (`frontend/src/lib/piston.js`), no API key needed |

---

## 📁 Project Structure

```
CodeSphere/
├── backend/
│   └── src/
│       ├── controllers/        # chatController (Stream token), sessionController (session CRUD)
│       ├── lib/                # db.js, env.js, inngest.js (user sync), stream.js (Stream clients)
│       ├── middleware/         # protectRoute.js – Clerk auth + loads/creates the Mongo user
│       ├── models/             # User.js, Session.js
│       ├── routes/             # chatRoutes.js, sessionRoutes.js
│       └── server.js           # Express app entry point
├── frontend/
│   ├── public/                 # Language icons & hero image
│   ├── src/
│   │   ├── api/                # sessions.js – API calls
│   │   ├── components/         # Navbar, editor, output, video call UI, dashboard widgets…
│   │   ├── data/               # problems.js – problems, starter code, expected outputs, language config
│   │   ├── hooks/              # useSessions.js (React Query), useStreamClient.js (video + chat setup)
│   │   ├── lib/                # axios.js, piston.js (Judge0 runner), stream.js, utils.js
│   │   ├── pages/              # HomePage, DashboardPage, ProblemsPage, ProblemPage, SessionPage
│   │   ├── App.jsx             # Routes (all pages except Home require sign-in)
│   │   └── main.jsx            # Providers: Clerk, React Query, Router
│   └── vercel.json             # SPA rewrites for Vercel
├── package.json                # Root scripts: build & start
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20.19+ or v22.12+** (required by Vite 7)
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Clerk](https://clerk.com/) application (publishable + secret key)
- A [Stream](https://getstream.io/) app (API key + secret — the same app is used for video and chat)
- *(Optional)* An [Inngest](https://www.inngest.com/) account — see [User sync](#-user-sync-optional)

### 1. Clone the Repository

```bash
git clone https://github.com/TejpalSandhu/CodeSphere.git
cd CodeSphere
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Inngest (optional for local development)
INNGEST_DEV=1
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

Start the backend (with auto-reload):

```bash
npm run dev
```

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

> ⚠️ Never put secret keys (`CLERK_SECRET_KEY`, `STREAM_API_SECRET`) in the frontend `.env` — any `VITE_` variable can end up in the public browser bundle.

Start the frontend:

```bash
npm run dev
```

### 4. Open the App

Go to **[http://localhost:5173](http://localhost:5173)**, sign in, and you'll land on the dashboard. To try a live session, open the app in a second browser (or an incognito window) with a different account and join the session from **Live Sessions**.

---

## 🎯 How It Works

1. **Sign in** — The home page uses Clerk's sign-in modal. Signed-in users are redirected to the dashboard.
2. **Practice solo** — Open **Problems**, pick one, and click **Solve**. Choose a language, edit the starter code, and click **Run Code**. The output is compared with the expected output; matching output triggers confetti.
3. **Create a session** — On the dashboard click **Create Session** and pick a problem (the difficulty comes from the problem). This creates the session in MongoDB plus a Stream video call and chat channel, and takes you to the session page.
4. **Join a session** — Other users see the room under **Live Sessions** and can click **Join** while it is OPEN. A session holds the host and one participant.
5. **Collaborate** — The session page shows the problem, a code editor with output panel, and the video call with a chat toggle.
6. **End the session** — Only the host can click **End Session**. This deletes the Stream call and chat, marks the session completed, and sends the other participant back to the dashboard. Completed sessions appear under **Your Past Sessions**.

---

## 🔌 API Reference

All routes are prefixed with `/api` and (except Inngest) require a Clerk session token in the `Authorization: Bearer <token>` header — the frontend's Axios instance adds this automatically.

| Method | Route | Description |
|---|---|---|
| `POST` | `/sessions` | Create a session — body: `{ problem, difficulty }` |
| `GET` | `/sessions/active` | Latest 20 active sessions |
| `GET` | `/sessions/my-recent` | Your latest 20 completed sessions (as host or participant) |
| `GET` | `/sessions/:id` | Get one session |
| `POST` | `/sessions/:id/join` | Join a session as the participant |
| `POST` | `/sessions/:id/end` | End a session (host only) |
| `GET` | `/chat/token` | Get a Stream token for the current user |
| `*` | `/inngest` | Inngest webhook endpoint |
| `GET` | `/health` *(no `/api` prefix)* | Health check |

---

## 🔄 User Sync (optional)

When a user signs up or is deleted in Clerk, an Inngest function (`backend/src/lib/inngest.js`) creates or deletes the matching MongoDB user and Stream user. To enable it, send Clerk's `user.created` / `user.deleted` webhooks to Inngest, and for local development run the Inngest dev server:

```bash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```

This step is **optional**: if a signed-in user doesn't exist in MongoDB yet, the `protectRoute` middleware creates them from their Clerk profile on their first API request.

---

## 🏗️ Deployment

Two setups are supported:

**A. Frontend and backend deployed separately** (e.g. Vercel + Render)

- Deploy `frontend/` to Vercel — `vercel.json` rewrites all routes to `index.html` so client-side routes work on refresh. Set `VITE_API_URL` to your backend URL (ending in `/api`).
- Deploy `backend/` to any Node host. Set `CLIENT_URL` to your frontend URL (used for CORS).
- Authentication works across domains because the Clerk token is sent in the `Authorization` header rather than relying on cookies.

**B. Single server** — the backend also serves the built frontend when `NODE_ENV=production`:

```bash
npm run build   # from the repo root: installs backend & frontend deps, builds frontend/dist
npm start       # starts the backend, which serves the API and frontend/dist
```

In this setup, build the frontend with `VITE_API_URL=/api`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/TejpalSandhu/CodeSphere/issues) or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.
