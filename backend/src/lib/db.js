import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if (!ENV.DB_URL) {
            throw new Error("DB_URL is not defined in environment variables");
        }
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("✅ Connected to MongoDB:", conn.connection.host);

        // Fix stale index: the collection may have a unique index on 'clerkId' (camelCase)
        // from an older schema, but the current schema uses 'clerkID' (uppercase D).
        // This causes all inserts to fail with E11000 duplicate key error on clerkId: null.
        try {
            const usersCollection = conn.connection.collection("users");
            const indexes = await usersCollection.indexes();
            const staleIndex = indexes.find((idx) => idx.name === "clerkId_1");
            if (staleIndex) {
                await usersCollection.dropIndex("clerkId_1");
                console.log("🔧 Dropped stale 'clerkId_1' index from users collection");
            }
            // Clean up any orphaned documents that have no clerkID set
            const deleted = await usersCollection.deleteMany({ clerkID: { $exists: false } });
            if (deleted.deletedCount > 0) {
                console.log(`🧹 Cleaned up ${deleted.deletedCount} orphaned user document(s)`);
            }
        } catch (indexError) {
            // Non-fatal — log and continue
            console.warn("⚠️ Index cleanup warning:", indexError.message);
        }
    } catch (error) {
        console.error("❌ Error connecting to MongoDB", error);
        process.exit(1); // 0 means success, 1 means failure
    }
};