// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials, AuthResponse } from '../types/auth';
import { loginApi } from '../api/auth';

interface AuthContextProps {
    user: AuthResponse['user'] | null;
    token: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    token: null,
    login: async () => { },
    logout: () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    useEffect(() => {
        if (token) {
            // Aqui você poderia buscar os detalhes do usuário usando o token
            // Por simplicidade, assumimos que já temos os dados do usuário
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [token]);

    const login = async (credentials: LoginCredentials) => {
        const response = await loginApi(credentials);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
