import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true //by adding thus field browser will send the cookies to server automatically, on every single req
})

// Intercept requests to manually attach the Clerk JWT token.
// This is strictly required when the frontend (Vercel) and backend (Render) are on different domains,
// because modern browsers block cross-site cookies, so withCredentials: true won't work on its own.
axiosInstance.interceptors.request.use(async (config) => {
    try {
        if (window.Clerk && window.Clerk.session) {
            const token = await window.Clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error("Error fetching Clerk token:", error);
    }
    return config;
});

export default axiosInstance;