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
