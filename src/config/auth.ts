import { SECURE_CONFIG, PASSWORD_REQUIREMENTS as SECURE_PASSWORD_REQUIREMENTS } from './secure.config';

export interface AdminUser {
    email: string;
    password: string;
    name: string;
    role: 'admin';
}

// Export admin users from secure config
export const ADMIN_USERS = SECURE_CONFIG.adminUsers;

// JWT configuration
export const JWT_CONFIG = {
    ...SECURE_CONFIG.jwt,
    tokenPrefix: 'Bearer'
};

// Auth storage keys
export const STORAGE_KEYS = {
    token: 'lachlan_mortgage_auth_token',
    user: 'lachlan_mortgage_auth_user'
} as const;

// Password requirements
export const PASSWORD_REQUIREMENTS = {
    ...SECURE_PASSWORD_REQUIREMENTS
} as const;

// Security configuration
export const SECURITY_CONFIG = {
    ...SECURE_CONFIG.security,
    tokenExpiration: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const; 