import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");


        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(
        () =>
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            null
    );

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const storedUser =
                localStorage.getItem("user") ||
                sessionStorage.getItem("user");

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            }
        }

        setLoading(false);
    }, [token]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
        setToken(null);

        navigate("/login");
    };

    const value = {
        user,
        setUser,
        token,
        setToken,
        loading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );


};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
