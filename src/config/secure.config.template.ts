// This is a template file. Copy this to secure.config.ts and update with your actual values.
// secure.config.ts should never be committed to version control.

export const SECURE_CONFIG = {
    adminUsers: [
        {
            email: 'admin@lachlanmortgage.com.au',
            password: 'password',
            name: 'Admin Name',
            role: 'admin' as const
        }
    ],
    jwt: {
        secret: '91f28b1558a2926b78c41cf21775c12f',
        expiresIn: '8h'
    },
    security: {
        passwordSalt: 'your-password-salt',
        tokenSecret: 'your-token-secret'
    }
} as const;

// Password requirements can be customized here
export const PASSWORD_REQUIREMENTS = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*(),.?":{}|<>'
} as const; 