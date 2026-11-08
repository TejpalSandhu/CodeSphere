import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const __dirname = path.resolve();

// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// express.json() MUST come before the Inngest route - serve() reads
// req.body directly and needs Express to have already parsed it.
app.use(express.json());

app.use(
    "/api/inngest",
    (req, res, next) => {
        console.log("INNGEST ROUTE HIT");
        next();
    },
    serve({ client: inngest, functions })
);

app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
// only serve the frontend if it was built next to the backend - when the frontend is
// deployed separately (e.g. on Vercel) frontend/dist doesn't exist on the API server
const frontendDist = path.join(__dirname, "../frontend/dist");

if (ENV.NODE_ENV === "production" && fs.existsSync(path.join(frontendDist, "index.html"))) {
    app.use(express.static(frontendDist));

    // "*" is the Express 4 catch-all syntax ("/{*any}" only works in Express 5)
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
    } catch (error) {
        console.error("💥 Error starting the server", error);
    }
};

startServer();