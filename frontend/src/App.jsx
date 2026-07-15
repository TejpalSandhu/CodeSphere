import { lazy, Suspense } from "react"
import { useUser } from "@clerk/clerk-react"
import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router"
import DashboardPage from "./pages/DashboardPage"
import HomePage from "./pages/HomePage"
import ProblemsPage from "./pages/ProblemsPage"
import ProblemPage from "./pages/ProblemPage"

const SessionPage = lazy(() => import("./pages/SessionPage"))


function App() {
  const { isSignedIn, isLoaded } = useUser();

  //this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? < HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? < DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={
          isSignedIn ? (
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading session...</div>}>
              <SessionPage />
            </Suspense>
          ) : <Navigate to={"/"} />
        } />
      </Routes >

      <Toaster toastOptions={{ duration: 3000 }} />

    </>

  )
}

export default App

//tw, daisyui, react-router, react-hot-toast,
// todo: react-query aka tanstack query, axios

