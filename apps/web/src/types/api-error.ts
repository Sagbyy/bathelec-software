import { AxiosError, isAxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export const getApiErrorMessage = (error: Error): string | undefined => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message;
  }
  return undefined;
};
