import { AdminCredentials } from '../types/auth';
import { ADMIN_USERS, STORAGE_KEYS, PASSWORD_REQUIREMENTS, SECURITY_CONFIG } from '../config/auth';
import { createHash } from 'crypto';

interface User {
  email: string;
  name: string;
  role: 'admin';
}

interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

class AuthService {
  private readonly TOKEN_KEY = STORAGE_KEYS.token;
  private readonly USER_KEY = STORAGE_KEYS.user;
  private readonly ATTEMPTS_KEY = 'login_attempts';
  private loginAttempts: Map<string, LoginAttempt> = new Map();

  constructor() {
    // Load login attempts from storage
    const savedAttempts = localStorage.getItem(this.ATTEMPTS_KEY);
    if (savedAttempts) {
      const attempts = JSON.parse(savedAttempts);
      Object.entries(attempts).forEach(([email, attempt]) => {
        this.loginAttempts.set(email, attempt as LoginAttempt);
      });
    }
  }

  private saveLoginAttempts(): void {
    const attempts = Object.fromEntries(this.loginAttempts.entries());
    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
  }

  private hashPassword(password: string): string {
    // In a real application, use a proper password hashing library like bcrypt
    return createHash('sha256')
      .update(password + SECURITY_CONFIG.passwordSalt)
      .digest('hex');
  }

  private validatePassword(password: string): boolean {
    if (password.length < PASSWORD_REQUIREMENTS.minLength) return false;
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) return false;
    if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) return false;
    if (PASSWORD_REQUIREMENTS.requireSpecialChars && 
        !new RegExp(`[${PASSWORD_REQUIREMENTS.specialChars}]`).test(password)) return false;
    return true;
  }

  private isAccountLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const now = Date.now();
    if (attempts.count >= SECURITY_CONFIG.maxLoginAttempts &&
        now - attempts.lastAttempt < SECURITY_CONFIG.lockoutDuration) {
      return true;
    }

    // Reset attempts if lockout period has passed
    if (now - attempts.lastAttempt >= SECURITY_CONFIG.lockoutDuration) {
      this.loginAttempts.delete(email);
      this.saveLoginAttempts();
    }

    return false;
  }

  private recordLoginAttempt(email: string, success: boolean): void {
    const now = Date.now();
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: now };

    if (success) {
      this.loginAttempts.delete(email);
    } else {
      attempts.count += 1;
      attempts.lastAttempt = now;
      this.loginAttempts.set(email, attempts);
    }

    this.saveLoginAttempts();
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check for account lockout
      if (this.isAccountLocked(email)) {
        reject(new Error('Account is temporarily locked. Please try again later.'));
        return;
      }

      // Simulate API call delay
      setTimeout(() => {
        const user = ADMIN_USERS.find(u => u.email === email);
        
        if (!user) {
          this.recordLoginAttempt(email, false);
          reject(new Error('Invalid credentials'));
          return;
        }

        // In a real application, compare hashed passwords
        if (password !== user.password) {
          this.recordLoginAttempt(email, false);
          reject(new Error('Invalid credentials'));
          return;
        }

        // Successful login
        this.recordLoginAttempt(email, true);

        // Generate token with expiration
        const token = this.generateToken();
        
        // Store user info without sensitive data
        const safeUser: User = {
          email: user.email,
          name: user.name,
          role: user.role
        };

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(safeUser));
        resolve();
      }, 1000);
    });
  }

  private generateToken(): string {
    const payload = {
      timestamp: Date.now(),
      expires: Date.now() + SECURITY_CONFIG.tokenExpiration
    };
    
    return createHash('sha256')
      .update(JSON.stringify(payload) + SECURITY_CONFIG.tokenSecret)
      .digest('hex');
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    // In a real application, verify JWT token
    // For now, we'll just check if the token exists
    return true;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getUser();
    if (!user) throw new Error('Not authenticated');

    const adminUser = ADMIN_USERS.find(u => u.email === user.email);
    if (!adminUser) throw new Error('User not found');

    // Verify current password
    if (currentPassword !== adminUser.password) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!this.validatePassword(newPassword)) {
      throw new Error('New password does not meet requirements');
    }

    // Update password (in a real app, this would update the backend)
    adminUser.password = newPassword;
  }
}

export const authService = new AuthService(); 