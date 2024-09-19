import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [validUser, setValidUser] = useState(false);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            try {
                const response = await fetch('api/auth/isLoggedIn', { credentials: 'include' });
                if (response.ok) {
                    setValidUser(true);
                    setLoading(false);
                } else {
                    setValidUser(false);
                    setLoading(false);
                    console.error('Error fetching user:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchLoginStatus();
    }, []);
    

    return (
        <AuthContext.Provider value={{ validUser, setValidUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);