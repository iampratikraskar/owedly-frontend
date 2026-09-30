import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add JWT automatically
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("owedly_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle common API errors
axiosClient.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        // JWT expired / invalid
        if (status === 401) {
            localStorage.removeItem("owedly_token");

            window.dispatchEvent(
                new Event("owedly:logout")
            );

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;