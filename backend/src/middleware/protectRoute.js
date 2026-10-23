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

                    const email = clerkUser.emailAddresses[0]?.emailAddress
                    const newUser = {
                        clerkID: clerkUser.id,
                        email,
                        // name is required - fall back for users who signed up without first/last name
                        name:
                            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
                            clerkUser.username ||
                            email?.split("@")[0] ||
                            "User",
                        profileImage: clerkUser.imageUrl || "",
                    }

                    // upsert instead of create: the dashboard fires several requests at once on first
                    // login, and a plain create() would fail with a duplicate key error for all but one
                    user = await User.findOneAndUpdate(
                        { clerkID },
                        { $setOnInsert: newUser },
                        { upsert: true, new: true, runValidators: true }
                    )
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