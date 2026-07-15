import { clerkClient, requireAuth } from '@clerk/express'
import User from "../models/User.js"
import { upsertStreamUser } from "../lib/stream.js"

export const protectRoute = [
    requireAuth(), // requireAuth({signInUrl: "/sign-in"}) dont let requireAuth() to take us to home page

    async (req, res, next) => {
        try {
            const clerkID = req.auth().userId;

            console.log("Current Clerk ID:", clerkID);

            if (!clerkID) return res.status(401).json({ message: "Unauthorized - invalid token" })

            //find user in db by clerk ID
            let user = await User.findOne({ clerkID })

            // If user not found in MongoDB, create them from Clerk data (fallback for webhook failures)
            if (!user) {
                console.log("User not found in DB, creating from Clerk data...")
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkID)

                    const newUser = {
                        clerkID: clerkUser.id,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                        profileImage: clerkUser.imageUrl || "",
                    }

                    user = await User.create(newUser)
                    console.log("User created in DB from Clerk fallback:", user)

                    // Also upsert user in Stream (chat/video)
                    await upsertStreamUser({
                        id: user.clerkID.toString(),
                        name: user.name,
                        image: user.profileImage,
                    })
                } catch (createError) {
                    console.error("Error creating user from Clerk data:", createError)
                    return res.status(500).json({ message: "Failed to create user" })
                }
            }

            console.log("Mongo User:", user);

            //attach user to req
            req.user = user;

            next()

        } catch (error) {
            console.error("Error in protectRoute middleware", error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
]