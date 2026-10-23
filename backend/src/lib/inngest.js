import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({
    id: "talent-iq",
});

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: [{ event: "clerk/user.created" }],
    },
    async ({ event }) => {
        console.log("========== syncUser triggered ==========");
        console.log(event.data);

        await connectDB();

        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const email = email_addresses?.[0]?.email_address;
        const newUser = {
            clerkID: id,
            email,
            // name is required - fall back for users who signed up without first/last name
            name: `${first_name || ""} ${last_name || ""}`.trim() || event.data.username || email?.split("@")[0] || "User",
            profileImage: image_url || "",
        };

        console.log("Creating user:", newUser);

        // upsert: the user may already have been created by the protectRoute fallback,
        // and Inngest retries the function if it throws (e.g. on a duplicate key error)
        await User.findOneAndUpdate(
            { clerkID: id },
            { $setOnInsert: newUser },
            { upsert: true, new: true, runValidators: true }
        );

        console.log("User created successfully");

        await upsertStreamUser({
            id: newUser.clerkID.toString(),
            name: newUser.name,
            image: newUser.profileImage
        })

        //challenge: send a welcome email here later - once I complete the course
    }
);

const deleteUserFromDB = inngest.createFunction(
    {
        id: "delete-user-from-db",
        triggers: [{ event: "clerk/user.deleted" }],
    },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;
        await User.deleteOne({ clerkID: id });

        await deleteStreamUser(id.toString())
    }
);

export const functions = [syncUser, deleteUserFromDB];