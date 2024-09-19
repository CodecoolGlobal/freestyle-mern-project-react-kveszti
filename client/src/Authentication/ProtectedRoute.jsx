import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
    const { validUser, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!validUser) {
        return <Navigate to="/login" />;
    }

    return children;
}