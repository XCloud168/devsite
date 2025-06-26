import { type IFeeConfig } from "@okxweb3/dex-widget";

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
    price: 0.1,
    originalPrice: 0.1,
  },
  quarterly: {
    id: "quarterly",
    price: 127.5,
    originalPrice: 150,
  },
  yearly: {
    id: "yearly",
    price: 449.5,
    originalPrice: 599,
  },
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

export enum SIGNAL_PROVIDER_TYPE {
  ANNOUNCEMENT = "announcement",
  TWITTER = "twitter",
  NEWS = "news",
}

export enum NOTIFY_SOUNDS {
  COIN = "coin.wav",
  COW = "cow.wav",
  DING = "ding.wav",
  FROG = "frog.wav",
  GIRL = "girl.wav",
  SPRING = "spring.wav",
}

export const SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS = {
  ETH: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logo: "/images/ether.webp",
    chain: "ETH",
    chainName: "Ethereum",
    chainId: "0x1",
    decimals: 6,
  },
  BSC: {
    address: "0x55d398326f99059ff775485246999027b3197955",
    logo: "/images/bsc.webp",
    chain: "BSC",
    chainName: "Binance Smart Chain",
    chainId: "0x38",
    decimals: 18,
  },
  ARB: {
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    logo: "/images/arb.webp",
    chain: "ARB",
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    decimals: 6,
  },
  BASE: {
    address: "0x4200000000000000000000000000000000000006",
    logo: "/images/base.webp",
    chain: "BASE",
    chainId: "0x2105",
    chainName: "Base",
    decimals: 18,
  },
  POLYGON: {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    logo: "/images/polygon.webp",
    chain: "POLYGON",
    chainId: "0x89",
    chainName: "Polygon",
    decimals: 6,
  },
};
