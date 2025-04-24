import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        // Redirect to login but remember where they were trying to go
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
} 