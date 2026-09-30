import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(user);

    useEffect(() => {

        const loadUser = async () => {

            const token = authService.getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const currentUser =
                    await userService.getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                authService.logout();
                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, []);

    useEffect(() => {

        const handleLogout = () => {
            setUser(null);
        };

        window.addEventListener(
            "owedly:logout",
            handleLogout
        );

        return () => {
            window.removeEventListener(
                "owedly:logout",
                handleLogout
            );
        };

    }, []);

    const login = async (email, password) => {

        await authService.login(email, password);

        const currentUser =
            await userService.getCurrentUser();

        setUser(currentUser);

        return currentUser;
    };

    const register = async (name, email, password) => {

        return await authService.register(
            name,
            email,
            password
        );
    };

    const logout = () => {

        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    return useContext(AuthContext);
}