# CodeSphere 🌐


CodeSphere is a modern, real-time collaborative platform designed for technical interviews and pair programming. Connect face-to-face via video, code together in a shared editor, and solve curated algorithms across multiple languages with instant code execution.

## ✨ Features

- **Live Video & Audio Calling**: Crystal-clear HD video communication powered by Stream SDK.
- **Collaborative Code Editor**: Real-time code syncing with Monaco Editor (the engine behind VS Code).
- **Multi-Language Execution**: Write and execute code instantly in JavaScript, Python, and Java using the Judge0 API.
- **Integrated Problem Library**: Practice built-in algorithmic challenges (like Two Sum, Maximum Subarray) with instant output validation.
- **Session Chat**: Built-in messaging system for sharing links and notes during an active session.
- **Flexible UI Layout**: Fully resizable window panels for a customizable workspace.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS + daisyUI
- **Editor**: Monaco Editor
- **UI Components**: `react-resizable-panels`, `lucide-react`, `canvas-confetti`

### Backend & Services
- **Server**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: Clerk
- **Video & Chat**: Stream (GetStream.io)
- **Code Execution Engine**: Judge0 CE API

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/codesphere.git
cd codesphere
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following keys:
```env
PORT=5000
DB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` directory with the following keys:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

## 🎯 How it Works

1. **Dashboard**: View your statistics, past sessions, and live active rooms.
2. **Practice Problems**: Browse the library of algorithms. Click "Solve" to start a solo practice session.
3. **Live Sessions**: Create a new room with a specific problem and difficulty. Share the room link with a participant to start a real-time pair programming session with video and chat.
4. **Code Execution**: The platform automatically formats Java classes and handles runtime/compilation errors directly in the browser console.

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request if you have ideas for new features or bug fixes.

## 📝 License

This project is licensed under the MIT License.
