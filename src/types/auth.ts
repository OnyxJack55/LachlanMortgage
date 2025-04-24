export interface AdminCredentials {
    email: string;
    password: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthResponse {
    token: string;
    expiresIn: number;
} 