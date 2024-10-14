// src/api/todos.ts
import axiosInstance from './axiosInstance';
import { UpdateUser, GetUser } from '../types/profile';

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
