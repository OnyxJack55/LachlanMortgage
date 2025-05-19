import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // This file is likely obsolete; use src/components/auth/ProtectedRoute.tsx instead.
  // If you want to keep this, you should update it to use Firebase Auth as in the other file.
  // For now, just render children.
  return <>{children}</>;
} 