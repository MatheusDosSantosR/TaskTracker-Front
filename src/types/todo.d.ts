// src/types/todo.d.ts
export interface Todo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    updatedAt?: string;
    createdAt?: string;
    deletedAt?: string | null;
    priority: "low" | "medium" | "high";
    dueDate: string | null;
    subtasks: Array<any>
}

export interface ResponseCreateTodo {
    msg: string;
    data: Todo;
}

export interface UpdateTodo {
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface DeleteTodo {
    message: string;
    data: any;
}