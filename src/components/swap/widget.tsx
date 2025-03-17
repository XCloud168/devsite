import { FEE_CONFIG } from "@/lib/constants";
import { getUserLocale } from "@/server/locale";
import {
  createOkxSwapWidget,
  type ITokenPair,
  type IWidgetParams,
  OkxEvents,
  ProviderType,
  THEME,
  TradeType,
} from "@okxweb3/dex-widget";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Extend Window interface to include ethereum and solana
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

// Language mapping from Next.js locale to OKX Widget lang
const LOCALE_LANG_MAP: Record<string, string> = {
  en: "en_us",
  "zh-CN": "zh_cn",
  "zh-TW": "zh_tw",
  zh: "zh_cn",
};

// Chain ID to provider type mapping
const CHAIN_PROVIDER_MAP: Record<string, ProviderType> = {
  "1": ProviderType.EVM, // Ethereum
  "56": ProviderType.EVM, // BSC
  "42161": ProviderType.EVM, // Arbitrum
  "10": ProviderType.EVM, // Optimism
  "8453": ProviderType.EVM, // Base
  "501": ProviderType.SOLANA, // Solana
};

interface SwapWidgetProps {
  fromChain?: string;
  toChain?: string;
  fromToken?: string;
  toToken?: string;
  className?: string;
}

export default function SwapWidget({
  fromChain,
  toChain,
  fromToken,
  toToken,
  className,
}: SwapWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<any>(null);
  const [providerType, setProviderType] = useState<ProviderType>(
    ProviderType.EVM,
  );
  const [provider, setProvider] = useState<any>(null);
  const t = useTranslations("Swap");
  const { theme } = useTheme();

  // Update widget theme and language
  useEffect(() => {
    if (!instance) return;

    const updateWidgetParams = async () => {
      const userLocale = await getUserLocale();
      instance.updateParams({
        lang: LOCALE_LANG_MAP[userLocale] || "en_us",
        theme: theme === "dark" ? THEME.DARK : THEME.LIGHT,
      });
    };

    updateWidgetParams();
  }, [instance, theme]);

  useEffect(() => {
    if (!instance) return;

    const _provider =
      providerType === ProviderType.SOLANA ? window.solana : window.ethereum;
    setProvider(_provider);
    instance.updateProvider(_provider, providerType);
  }, [providerType, instance]);

  const handleWalletError = (error: any) => {
    // Handle EVM wallet errors
    if (error?.code) {
      const message = t(`errors.${error.code}`) || t("errors.default");
      console.warn(`Wallet Error (${error.code}): ${message}`);
      return;
    }

    // Handle Solana wallet errors
    if (error?.name === "WalletConnectionError") {
      console.warn("Solana Wallet Error:", error.message);
      return;
    }

    // Handle other unexpected errors
    console.error("Unexpected wallet error:", error);
  };

  useEffect(() => {
    const initWidget = async () => {
      if (!widgetRef.current) return;

      // Determine provider type based on fromChain
      const providerType = fromChain
        ? CHAIN_PROVIDER_MAP[fromChain]
        : ProviderType.EVM;

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
        theme: theme === "dark" ? THEME.DARK : THEME.LIGHT,
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
            handler: () => {
              (async () => {
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
              })();
            },
          },
          {
            event: OkxEvents.ON_FROM_CHAIN_CHANGE,
            handler: (payload) => {
              const params = JSON.parse(payload[0].params[0]);
              if (
                params.preToken &&
                params.token.chainId !== params.preToken.chainId
              ) {
                const newProviderType =
                  CHAIN_PROVIDER_MAP[params.token.chainId];
                // Update the provider type state
                setProviderType(newProviderType || ProviderType.EVM);
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
  }, [fromChain, toChain, fromToken, toToken, t, theme, providerType]);

  return (
    <div className={className}>
      <div
        ref={widgetRef}
        className="flex w-full items-center justify-center"
      />
    </div>
  );
}
