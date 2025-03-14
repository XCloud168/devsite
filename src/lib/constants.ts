import { IFeeConfig } from "@okxweb3/dex-widget";

// Fee configuration for different chains
export const FEE_CONFIG: IFeeConfig = {
  // Ethereum Mainnet
  1: {
    feePercent: 0.3,
    referrerAddress: {
      default: { feePercent: 0.3 },
    },
  },
  // BNB Chain
  56: {
    feePercent: 0.3,
    referrerAddress: {
      default: { feePercent: 0.3 },
    },
  },
  // Arbitrum One
  42161: {
    feePercent: 0.3,
    referrerAddress: {
      default: { feePercent: 0.3 },
    },
  },
  // Optimism
  10: {
    feePercent: 0.3,
    referrerAddress: {
      default: { feePercent: 0.3 },
    },
  },
  // Base
  8453: {
    feePercent: 0.3,
    referrerAddress: {
      default: { feePercent: 0.3 },
    },
  },
  // Solana
  501: {
    feePercent: 0.3,
    referrerAddress: {
      "11111111111111111111111111111111": {
        feePercent: 0.3,
      },
      EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
        feePercent: 0.3,
      },
    },
  },
};

export const PRICING_PLANS = {
  monthly: {
    id: "monthly",
    price: 10,
    originalPrice: 10,
  },
  quarterly: {
    id: "quarterly",
    price: 20,
    originalPrice: 30,
  },
  yearly: {
    id: "yearly",
    price: 30,
    originalPrice: 90,
  },
};

export const SUPPORTED_CHAIN_CURRENCY = {
  ETH: "USDT",
  SOL: "USDT",
  TRX: "USDT",
  BSC: "USDT",
};

/**
 * 每页显示的条数
 */
export const ITEMS_PER_PAGE = 10;

// System error codes
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_PARAMS = "INVALID_PARAMS",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  NOT_FOUND = "NOT_FOUND",

  // 认证错误
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  LOGIN_REQUIRED = "LOGIN_REQUIRED",

  // 支付错误
  PAYMENT_ERROR = "PAYMENT_ERROR",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
  ORDER_EXPIRED = "ORDER_EXPIRED",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  PAYMENT_TIMEOUT = "PAYMENT_TIMEOUT",
  NETWORK_UNAVAILABLE = "NETWORK_UNAVAILABLE",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",

  // 限流错误
  RATE_LIMIT = "RATE_LIMIT",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  DAILY_LIMIT_EXCEEDED = "DAILY_LIMIT_EXCEEDED",

  // 业务逻辑错误
  INVALID_PLAN = "INVALID_PLAN",
  PLAN_UNAVAILABLE = "PLAN_UNAVAILABLE",
  SUBSCRIPTION_ACTIVE = "SUBSCRIPTION_ACTIVE",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
}

// Error categories for frontend handling
export const ErrorCategory = {
  // 通用错误
  COMMON: [
    ErrorCode.UNKNOWN_ERROR,
    ErrorCode.INVALID_PARAMS,
    ErrorCode.SERVER_ERROR,
    ErrorCode.NETWORK_ERROR,
    ErrorCode.NOT_FOUND,
  ],

  // 认证错误
  AUTH: [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.FORBIDDEN,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.LOGIN_REQUIRED,
  ],

  // 支付错误
  PAYMENT: [
    ErrorCode.PAYMENT_ERROR,
    ErrorCode.PAYMENT_FAILED,
    ErrorCode.ORDER_NOT_FOUND,
    ErrorCode.ORDER_EXPIRED,
    ErrorCode.INVALID_AMOUNT,
    ErrorCode.PAYMENT_TIMEOUT,
    ErrorCode.NETWORK_UNAVAILABLE,
    ErrorCode.INSUFFICIENT_BALANCE,
  ],

  // 限流错误
  RATE_LIMIT: [
    ErrorCode.RATE_LIMIT,
    ErrorCode.TOO_MANY_REQUESTS,
    ErrorCode.DAILY_LIMIT_EXCEEDED,
  ],

  // 业务逻辑错误
  BUSINESS: [
    ErrorCode.INVALID_PLAN,
    ErrorCode.PLAN_UNAVAILABLE,
    ErrorCode.SUBSCRIPTION_ACTIVE,
    ErrorCode.SUBSCRIPTION_EXPIRED,
  ],
} as const;
