import { isLoggedIn, getRole } from "../services/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
    if (!isLoggedIn()) return <Navigate to="/login" />;
    if (adminOnly && getRole() !== "ADMIN") return <Navigate to="/" />;
    return children;
}