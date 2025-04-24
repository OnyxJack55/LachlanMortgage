import { SECURE_CONFIG } from '../config/secure.config';

interface User {
    email: string;
    role: string;
}

class AuthService {
    private static TOKEN_KEY = 'auth_token';
    private static USER_KEY = 'user_info';

    async login(email: string, password: string): Promise<boolean> {
        try {
            const adminUser = SECURE_CONFIG.adminUsers[0];
            
            // Case-insensitive email comparison, exact password match
            if (email.toLowerCase() === adminUser.email.toLowerCase() && password === adminUser.password) {
                // Store fake JWT token
                const token = this.generateFakeToken();
                localStorage.setItem(AuthService.TOKEN_KEY, token);
                
                // Store user info
                const user: User = { email: adminUser.email, role: adminUser.role };
                localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    logout(): void {
        try {
            // Clear all auth-related items
            localStorage.removeItem(AuthService.TOKEN_KEY);
            localStorage.removeItem(AuthService.USER_KEY);
            // Clear any other potential stored data
            sessionStorage.clear();
            // Force reload to clear any in-memory state
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    isAuthenticated(): boolean {
        try {
            const token = this.getToken();
            if (!token) return false;
            
            // Check if user info exists
            const user = this.getUser();
            if (!user) return false;
            
            // Check token expiration
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp && payload.exp < Date.now() / 1000) {
                    this.logout(); // Clear expired session
                    return false;
                }
            } catch (e) {
                this.logout(); // Clear invalid token
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Authentication check error:', error);
            return false;
        }
    }

    getUser(): User | null {
        try {
            const userStr = localStorage.getItem(AuthService.USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    getToken(): string | null {
        try {
            return localStorage.getItem(AuthService.TOKEN_KEY);
        } catch (error) {
            console.error('Get token error:', error);
            return null;
        }
    }

    private generateFakeToken(): string {
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = {
            sub: '1234567890',
            name: 'Admin User',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 hours expiration
        };

        const encodedHeader = btoa(JSON.stringify(header));
        const encodedPayload = btoa(JSON.stringify(payload));
        const signature = btoa(SECURE_CONFIG.jwt.secret);

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
}

export default new AuthService(); 