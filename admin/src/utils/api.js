import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

let isLoggingOut = false;

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem("adminToken");

        // ✅ ADMIN PANEL → ALWAYS attach adminToken
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) return Promise.reject(error);

        if (error.response.status === 401 && !isLoggingOut) {
            isLoggingOut = true;

            console.warn("Admin token expired or invalid");

            localStorage.removeItem("adminToken");

            // Route guard will redirect to login
            setTimeout(() => {
                isLoggingOut = false;
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default api;