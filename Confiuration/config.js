
import axios from "axios";
import SendEmail from "../../backend/utils/SendEmail";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { Children } from "react";

const API_URL = "http://localhost:5000";

export default API_URL;

// If stored user exists, restore the user
if (storeduser) {
    setuser(JSON.parse(storeduser));
}

const interceptor = axios.interceptors.response.use(
    (response) => response,

    (error) => {
        if (
            error.response &&
            error.response.status === 403 &&
            error.response.data.message?.includes("blocked")
        ) {
            logout();
        }

        return Promise.reject(error);
    }
);

// Cleanup interceptor
return () => {
    axios.interceptors.response.eject(interceptor);
};

// login 

const login = async (Email, password) => {
    try {
        const res = await axios.post('${API_URL}/API/auth/login', {
            Email,
            password
        });

        const { token, user } = req.data;
        setToken(token);
        setuser(user);

        localStorage.setItem("token", token);
        localStorage.setItem("User", JSON.stringify(user));
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: err.response?.data?.message || "Login Denied or Failed"
        };
    }
}

// register

const register = async (userData) => {
    try {
        const res = await axios.post(`${API_URL / API / auth / register, userData
            }`);

        return {
            success: true,
            message: res.data.message
        };

    }
    catch (error) {
        return {
            success: false,
            message: err.response?.data?.message || "Registration Failed"
        };
    }
}

//Logout 

const logout = () => {
    setToken(null);
    setuser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    Navigate("/login");
};

// to get user details 

const refreshUser = async () => {
    if (!token) return
    try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
            Headers: { Authorization: `Bearner ${token}` }
        });
        if (res.data.success) {
            const updateuser = res.data.user
            setuser(updateuser);

            const storage = localStorage.getItem("token") ? localStorage : sessionStorage
            storage.setItem("user", JSON.stringify(updateuser))
        }
    }
    catch (err) {
        console.error("Failed to refresh the user", err);
    }

}

return <AuthContext.Provider
    value={{
        user,
        setuser,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser
    }}
>
    {Children}

</AuthContext.Provider>