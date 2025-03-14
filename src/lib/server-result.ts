import { ErrorCode } from "@/lib/constants";
import { AppError, createError } from "@/lib/errors";

export type ServerResult<T = any> = {
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    data?: any;
  };
};

/**
 * 包装服务端函数，统一处理错误和返回格式
 * @param handler 服务端函数
 * @returns 统一的返回格式 { data?, error? }
 */
export async function withServerResult<T>(
  handler: () => Promise<T>,
): Promise<ServerResult<T>> {
  try {
    const data = await handler();
    return { data };
  } catch (err: unknown) {
    console.error("Server error:", err);

    if (err instanceof AppError) {
      return {
        error: {
          code: err.code,
          message: err.message,
          data: err.data,
        },
      };
    }

    return {
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
    };
  }
}

/**
 * 从服务端结果中提取数据，如果有错误则抛出
 * 用于在服务端组件中处理结果
 */
export function unwrapResult<T>(result: ServerResult<T>): T {
  if (result.error) {
    throw createError.fromCode(result.error.code, result.error.message);
  }
  if (result.data === undefined) {
    throw createError.server("No data returned from server");
  }
  return result.data;
}

/**
 * 检查结果是否成功
 */
export function isSuccess<T>(result: ServerResult<T>): result is { data: T } {
  return !result.error && result.data !== undefined;
}

/**
 * 检查结果是否失败
 */
export function isError<T>(
  result: ServerResult<T>,
): result is { error: NonNullable<ServerResult<T>["error"]> } {
  return !!result.error;
}
