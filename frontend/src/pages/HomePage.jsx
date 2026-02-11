import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import toast from "react-hot-toast"
import React from 'react'

function Homepage() {

    // fetch some data - without using tanstack --> very large code, we have to write code for refetching, caching, loading state, error state, etc.
    // fetch some data - using tanstack query --> very small code, we don't have to write code for refetching, caching, loading state, error state, etc.

    return (
        <div>
            <button className='btn btn-secondary' onClick={() => toast.success("This is a succes toast")}>Click me</button>

            <SignedOut>
                <SignInButton mode='modal'>
                    <button>Login</button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton />
            </SignedIn>

            <UserButton />
        </div>
    )
}

export default Homepage