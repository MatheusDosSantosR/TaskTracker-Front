// src/types/auth.d.ts
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface RegisterCredentials {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
