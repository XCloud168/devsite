"use client";

import { FEE_CONFIG } from "@/lib/constants";
import { getUserLocale } from "@/server/locale";
import {
  createOkxSwapWidget,
  ITokenPair,
  IWidgetParams,
  OkxEvents,
  ProviderType,
  THEME,
  TradeType,
} from "@okxweb3/dex-widget";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Extend Window interface to include ethereum and solana
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

// Language mapping from Next.js locale to OKX Widget lang
const LOCALE_LANG_MAP: { [key: string]: string } = {
  en: "en_us",
  "zh-CN": "zh_cn",
};

// Chain ID to provider type mapping
const CHAIN_PROVIDER_MAP: { [key: string]: ProviderType } = {
  "1": ProviderType.EVM, // Ethereum
  "56": ProviderType.EVM, // BSC
  "42161": ProviderType.EVM, // Arbitrum
  "10": ProviderType.EVM, // Optimism
  "8453": ProviderType.EVM, // Base
  "501": ProviderType.SOLANA, // Solana
};

export default function SwapPage() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [instance, setInstance] = useState<any>(null);
  const t = useTranslations("Swap");

  // 获取当前语言设置并更新widget
  useEffect(() => {
    if (!instance) return;

    const updateWidgetLang = async () => {
      const userLocale = await getUserLocale();
      instance.updateParams({
        lang: LOCALE_LANG_MAP[userLocale] || "en_us",
      });
    };

    updateWidgetLang();
  }, [instance]);

  const handleWalletError = (error: any) => {
    // 处理 EVM 钱包错误
    if (error?.code) {
      const message = t(`errors.${error.code}`) || t("errors.default");
      console.warn(`Wallet Error (${error.code}): ${message}`);
      return;
    }

    // 处理 Solana 钱包错误
    if (error?.name === "WalletConnectionError") {
      console.warn("Solana Wallet Error:", error.message);
      return;
    }

    // 处理其他未知错误
    console.error("Unexpected wallet error:", error);
  };

  useEffect(() => {
    const initWidget = async () => {
      if (!widgetRef.current) return;

      // Get URL parameters
      const fromChain = searchParams.get("fromChain");
      const toChain = searchParams.get("toChain");
      const fromToken = searchParams.get("fromToken");
      const toToken = searchParams.get("toToken");

      // Determine provider type based on fromChain
      const providerType = fromChain
        ? CHAIN_PROVIDER_MAP[fromChain]
        : ProviderType.EVM;

      // Get appropriate provider based on chain type
      const provider =
        providerType === ProviderType.SOLANA ? window.solana : window.ethereum;

      // Check if provider exists
      if (!provider) {
        console.warn(
          t("walletNotInstalled", {
            type: providerType === ProviderType.SOLANA ? "Solana" : "EVM",
          }),
        );
        return;
      }

      // Configure token pair if parameters exist
      const tokenPair: ITokenPair | undefined = fromChain
        ? {
            fromChain: fromChain,
            toChain: toChain || fromChain,
            ...(fromToken && { fromToken }),
            ...(toToken && { toToken }),
          }
        : undefined;

      const userLocale = await getUserLocale();
      const params: IWidgetParams = {
        width: 450,
        theme: THEME.LIGHT,
        lang: LOCALE_LANG_MAP[userLocale] || "en_us",
        providerType,
        tradeType: TradeType.AUTO,
        feeConfig: FEE_CONFIG,
        ...(tokenPair && { tokenPair }),
      };

      // Initialize widget instance
      const newInstance = createOkxSwapWidget(widgetRef.current!, {
        params,
        provider,
        listeners: [
          {
            event: OkxEvents.ON_CONNECT_WALLET,
            handler: async () => {
              try {
                if (providerType === ProviderType.SOLANA) {
                  await window.solana?.connect();
                } else {
                  await window.ethereum?.request({
                    method: "eth_requestAccounts",
                  });
                }
              } catch (error) {
                handleWalletError(error);
              }
            },
          },
        ],
      });

      setInstance(newInstance);

      // Cleanup on unmount
      return () => {
        newInstance.destroy();
        setInstance(null);
      };
    };

    initWidget();
  }, [searchParams, t]);

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-[500px] rounded-lg bg-white p-4 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">{t("title")}</h1>
        <div ref={widgetRef} className="w-full" />
      </div>
    </div>
  );
}
