import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authHeader, setAuthHeader] = useState(() => localStorage.getItem("authHeader"));
    const [loggedInRoles, setLoggedInRoles] = useState([]);
    const navigate = useNavigate();

    // Helper to decode username from Basic Auth header
    const getLoggedInUsername = (header) => {
        if (!header) return null;
        try {
            const base64Credentials = header.split(" ")[1];
            const decoded = atob(base64Credentials);
            return decoded.split(":")[0];
        } catch (error) {
            console.error("Failed to decode authHeader:", error);
            return null;
        }
    };

    const loggedInUsername = getLoggedInUsername(authHeader);

    useEffect(() => {
        if (authHeader) {
            localStorage.setItem("authHeader", authHeader);

            const fetchRoles = async () => {
                try {
                    // Eğer username varsa rollerini çek
                    if (loggedInUsername) {
                        const res = await fetch(`${API_URL}/auth/user-details?username=${loggedInUsername}`, {
                            headers: { Authorization: authHeader },
                        });
                        if (res.ok) {
                            const data = await res.json();
                            setLoggedInRoles(data.roles || []);
                        }
                    }
                } catch (error) {
                    console.error("Roller alınamadı:", error);
                    setLoggedInRoles([]);
                }
            };

            fetchRoles();
        } else {
            localStorage.removeItem("authHeader");
            setLoggedInRoles([]);
        }
    }, [authHeader, loggedInUsername]);

    const login = (header) => {
        setAuthHeader(header);
    };

    const logout = () => {
        setAuthHeader(null);
        setLoggedInRoles([]);
        localStorage.removeItem("authHeader");
        navigate("/login");
    };

    const value = {
        authHeader,
        loggedInUsername,
        loggedInRoles,
        login,
        logout,
        isAuthenticated: !!authHeader,
        apiUrl: API_URL 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};