// src/types/todo.d.ts
export interface Todo {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    updatedAt?: string;
    createdAt?: string;
    deletedAt?: string | null
    options?: any;
}

export interface DeleteTodo {
    message: string;
    data: any;
}