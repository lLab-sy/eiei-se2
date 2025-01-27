export interface ResponseDTO<T> {
    status: string;
    data: T | null;
    message: string;
}