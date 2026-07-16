# CodeSphere 🌐

> A modern, real-time collaborative platform for technical interviews and pair programming — connect face-to-face via video, code together in a shared editor, and solve curated algorithm challenges across multiple languages with instant execution.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Live Video & Audio** | Crystal-clear HD video communication powered by Stream SDK |
| **Collaborative Code Editor** | Real-time code syncing with Monaco Editor (the engine behind VS Code) |
| **Multi-Language Execution** | Write and execute code in JavaScript, Python, Java, and C++ via Judge0 CE API |
| **Problem Library** | Curated algorithmic challenges (Two Sum, Maximum Subarray, and more) with output validation |
| **Session Chat** | Built-in messaging for sharing links and notes during an active session |
| **Resizable Panels** | Fully customizable workspace layout with draggable, resizable panes |
| **Background Jobs** | Automated session lifecycle management via Inngest event-driven functions |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) (Vite 7) | UI framework & build tool |
| [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/) | Styling & component library |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor |
| [Stream Video React SDK](https://getstream.io/video/) | Video & audio calling |
| [Stream Chat React](https://getstream.io/chat/) | Real-time messaging |
| [TanStack React Query](https://tanstack.com/query) | Server state management |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) | Celebration animations |
| [date-fns](https://date-fns.org/) | Date utility functions |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) | Server framework |
| [MongoDB](https://www.mongodb.com/) ([Mongoose](https://mongoosejs.com/)) | Database & ODM |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Stream Node SDK](https://getstream.io/) | Video/chat token generation |
| [Inngest](https://www.inngest.com/) | Background functions & event-driven jobs |
| [Judge0 CE API](https://ce.judge0.com/) | Remote code execution engine |

---

## 📁 Project Structure

```
CodeSphere/
├── backend/
│   └── src/
│       ├── controllers/        # Route handlers (sessions, chat)
│       ├── lib/                # DB connection, env config, Inngest, Stream setup
│       ├── middleware/         # Auth & request middleware
│       ├── models/             # Mongoose schemas (User, Session)
│       ├── routes/             # Express route definitions
│       └── server.js           # App entry point
├── frontend/
│   └── src/
│       ├── api/                # Axios API client functions
│       ├── components/         # Reusable UI components
│       ├── data/               # Problem definitions & language configs
│       ├── hooks/              # Custom React hooks (sessions, stream client)
│       ├── lib/                # Utilities (axios, piston/Judge0, stream, helpers)
│       ├── pages/              # Page-level components
│       ├── App.jsx             # Root component with routing
│       └── main.jsx            # Application entry point
├── package.json                # Root-level scripts (build, start)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Clerk](https://clerk.com/) account (for authentication)
- A [Stream](https://getstream.io/) account (for video & chat)
- *(Optional)* An [Inngest](https://www.inngest.com/) account (for background job processing)

### 1. Clone the Repository

```bash
git clone https://github.com/TejpalSandhu/talent-IQ.git
cd talent-IQ
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🎯 How It Works

1. **Home / Sign Up** — Land on the homepage and authenticate with Clerk (sign-in / sign-up).
2. **Dashboard** — View your stats, recent sessions, and browse currently active rooms.
3. **Problem Library** — Explore curated algorithm challenges. Click **Solve** to start a solo practice session.
4. **Live Sessions** — Create a new room with a specific problem and difficulty. Share the room link with a partner to start a real-time pair programming session complete with video, chat, and a shared code editor.
5. **Code Execution** — Select a language (JavaScript, Python, Java, or C++), write your solution, and run it against test cases. The platform handles Java class formatting and displays compilation/runtime errors directly in the output panel.

---

## 🏗️ Deployment

The project includes deployment-ready configuration:

- **Backend** serves the frontend in production mode (`NODE_ENV=production`), with static assets served from `frontend/dist/`.
- **Frontend** includes a `vercel.json` for Vercel SPA deployment with catch-all rewrites.
- **Root `package.json`** provides unified scripts:
  ```bash
  npm run build   # Installs deps & builds frontend
  npm start       # Starts the backend (production)
  ```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/TejpalSandhu/talent-IQ/issues) or submit a pull request if you have ideas for new features or bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.
