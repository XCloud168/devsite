import { type ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

import { ErrorCode } from "./constants";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const createError = {
  fromCode: (code: ErrorCode, message?: string, data?: any) => {
    return new AppError(code, message || getDefaultMessage(code), data);
  },

  invalidParams: (message = "Invalid parameters", data?: any) => {
    return new AppError(ErrorCode.INVALID_PARAMS, message, data);
  },

  unauthorized: (message = "Unauthorized", data?: any) => {
    return new AppError(ErrorCode.UNAUTHORIZED, message, data);
  },

  forbidden: (message = "Forbidden", data?: any) => {
    return new AppError(ErrorCode.FORBIDDEN, message, data);
  },

  notFound: (message = "Resource not found", data?: any) => {
    return new AppError(ErrorCode.NOT_FOUND, message, data);
  },

  server: (message = "Internal server error", data?: any) => {
    return new AppError(ErrorCode.SERVER_ERROR, message, data);
  },

  network: (message = "Network error", data?: any) => {
    return new AppError(ErrorCode.NETWORK_ERROR, message, data);
  },

  payment: (message = "Payment error", data?: any) => {
    return new AppError(ErrorCode.PAYMENT_ERROR, message, data);
  },

  rateLimit: (message = "Too many requests", data?: any) => {
    return new AppError(ErrorCode.RATE_LIMIT, message, data);
  },
};

function getDefaultMessage(code: ErrorCode): string {
  switch (code) {
    case ErrorCode.INVALID_PARAMS:
      return "Invalid parameters";
    case ErrorCode.UNAUTHORIZED:
      return "Unauthorized";
    case ErrorCode.FORBIDDEN:
      return "Forbidden";
    case ErrorCode.NOT_FOUND:
      return "Resource not found";
    case ErrorCode.SERVER_ERROR:
      return "Internal server error";
    case ErrorCode.NETWORK_ERROR:
      return "Network error";
    case ErrorCode.PAYMENT_ERROR:
      return "Payment error";
    case ErrorCode.RATE_LIMIT:
      return "Too many requests";
    case ErrorCode.UNKNOWN_ERROR:
      return "An unexpected error occurred";
    default:
      return "An error occurred";
  }
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export function fromZodError(error: ZodError): ErrorResponse {
  return {
    error: {
      code: "unprocessable_entity",
      message: generateErrorMessage(error.issues, {
        maxErrors: 1,
        delimiter: {
          component: ": ",
        },
        path: {
          enabled: true,
          type: "objectNotation",
          label: "",
        },
        code: {
          enabled: true,
          label: "",
        },
        message: {
          enabled: true,
          label: "",
        },
      }),
    },
  };
}
