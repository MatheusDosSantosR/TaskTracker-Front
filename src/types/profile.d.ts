export interface UpdateUser {
    name?: string;
    password?: string;
    email?: string
}

export interface GetUser {
    name: string;
    email: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
}

export interface ResponseCreateUser {
    msg: string;
    data: GetUser
}

export interface IDefaultResponse {
    status: "success" | "error";
    message: string;
    data?: object;
    details?: string;
}