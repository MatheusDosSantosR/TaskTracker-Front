// src/api/todos.ts
import axiosInstance from './axiosInstance';
import { Todo } from '../types/todo';

//Função para obter os to-dos
export const getTodos = async (): Promise<Todo[]> => {
    const response = await axiosInstance.get('/api/todos');
    return response.data;
};

// Função para atualizar o status de um to-do
export const updateTodoStatus = async (id: string, isCompleted: boolean): Promise<void> => {
    await axiosInstance.put(`/api/todos/${id}`, { isCompleted });
};

// Função para cadastro de um to-do
export const createTodo = async (body: Todo): Promise<Todo[]> => {
    const response = await axiosInstance.post(`/api/todos/`, { body });
    return response.data;
};