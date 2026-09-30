import axiosClient from "../api/axiosClient";

const TOKEN_KEY = "owedly_token";

const authService = {

    async login(email, password) {
        const response = await axiosClient.post("/auth/login", {
            email,
            password,
        });

        const token = response.data.token;

        localStorage.setItem(TOKEN_KEY, token);

        return response.data;
    },

    async register(name, email, password) {
        const response = await axiosClient.post("/auth/register", {
            name,
            email,
            password,
        });

        return response.data;
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated() {
        return Boolean(localStorage.getItem(TOKEN_KEY));
    },
};

export default authService;