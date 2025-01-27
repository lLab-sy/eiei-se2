import { Response } from 'express';
import { ResponseDTO } from '../dtos/responseDTO';

export type ResponseStatus = 'success' | 'error' | 'not_found' | 'unauthorized' | 'forbidden' | 'validation_error';

export const sendResponse = <T>(res: Response, status: ResponseStatus, data: T | null = null, message: string = '', httpStatus: number = 200) => {
  const response: ResponseDTO<T> = {
    status,
    data,
    message,
  };

  // Map status to corresponding HTTP status code
  const statusCodeMapping: { [key in ResponseStatus]: number } = {
    success: 200,
    error: 400,
    not_found: 404,
    unauthorized: 401,
    forbidden: 403,
    validation_error: 422,
  };

  const statusCode = statusCodeMapping[status] || 500; // Default to 500 if status is not found

  return res.status(httpStatus || statusCode).json(response);
};
