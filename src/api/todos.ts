// src/api/todos.ts
import axiosInstance from './axiosInstance';
import { DeleteTodo, Todo, ResponseCreateTodo } from '../types/todo';

//Função para obter os to-dos
export const getTodos = async (): Promise<Todo[]> => {
    const response = await axiosInstance.get('/api/todos');
    return response.data;
};

// Função para atualizar o status de um to-do
export const updateTodo = async (id: number, body: Todo): Promise<void> => {
    await axiosInstance.put(`/api/todos/${id}`, body);
};

// Função para remover o status de um to-do
export const removeTodo = async (id: number): Promise<DeleteTodo> => {
    const response = await axiosInstance.delete(`/api/todos/${id}`);
    return response.data
};

// Função para cadastro de um to-do
export const createTodo = async (body: Todo): Promise<ResponseCreateTodo> => {
    const response = await axiosInstance.post(`/api/todos/`, body);
    return response.data;
};