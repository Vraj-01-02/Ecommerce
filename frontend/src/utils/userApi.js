import axios from "axios";

const userApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

/* ================= ATTACH TOKEN ================= */
userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
        config.headers.token = token;
    }

    return config;
});

/* ================= GLOBAL LOGOUT ================= */
userApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("User token invalid. Auto logout.");

            localStorage.removeItem("userToken");
            localStorage.removeItem("cartItems");

            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default userApi;