export interface RegisterDTO{
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
}

export interface LoginDTO{
    username: string;
    password: string;
}