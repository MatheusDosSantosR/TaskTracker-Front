// src/api/todos.ts
import axiosInstance from './axiosInstance';
import { UpdateUser, GetUser, CreateUser, ResponseCreateUser } from '../types/profile';
import { IDefaultResponse } from '../types/profile';

// Função para atualizar o user
export const updateUser = async (body: UpdateUser): Promise<any> => {
    const user = await axiosInstance.put("/api/profile", body);
    return user.data
};

// Função para obter os dados do user
export const getUser = async (): Promise<GetUser> => {
    const user = await axiosInstance.get("/api/profile");
    return user.data
};

// Função para cadastrar usuario
export const createUser = async (body: CreateUser): Promise<ResponseCreateUser> => {
    const user = await axiosInstance.post("/api/public/users", body);
    return user.data
};

// Função para enviar codigo por Email
export const recoveryPassword = async (email: string): Promise<IDefaultResponse> => {
    const user = await axiosInstance.post("/api/public/users/forgot-password", { email });
    return user.data
};

// Função para resetar a senha
export const resetPassword = async (newPassword: string, token: string): Promise<IDefaultResponse> => {
    const user = await axiosInstance.post("/api/public/users/reset-password/" + token, { newPassword });
    return user.data
};