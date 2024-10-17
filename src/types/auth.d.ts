// src/types/auth.d.ts
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    status: "success" | "error";
    message: string;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }
}

export interface RegisterCredentials {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
