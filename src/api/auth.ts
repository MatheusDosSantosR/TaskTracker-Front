// src/api/auth.ts
import axiosInstance from './axiosInstance';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/login', credentials);
    return response.data;
};

export const recoveryAPI = async (email: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/login', email);
    return response.data;
};