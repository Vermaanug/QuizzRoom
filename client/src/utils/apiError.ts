import axios from "axios";

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

export const getApiError = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return { message: fallback, fieldErrors: undefined };
  }

  if (!error.response) {
    return { message: "Unable to reach the server. Please try again.", fieldErrors: undefined };
  }

  return {
    message: error.response.data?.message || fallback,
    fieldErrors: error.response.data?.errors,
  };
};
