export interface RegisterDTO{
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
}

export interface LoginDTO{
    username: string;
    password: string;
}

export interface ReturnLoginDTO {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
    };
}
