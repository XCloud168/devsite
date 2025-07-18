"use client";

import { CheckIcon, Loader2, TimerIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { QRCode } from "@/components/qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ErrorCode,
  SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { checkout, confirmPayment } from "@/server/api/routes/payment";
import { type PLAN_TYPE, type SUPPORTED_CHAIN } from "@/types/constants";
import { useRouter } from "next/navigation";
interface PaymentDialogProps {
  planType: PLAN_TYPE;
  plan: {
    name: string;
    price: number;
  };
}

interface PaymentData {
  id: number;
  receiverAddress: string;
  amount: string;
  planType: PLAN_TYPE;
  chain: SUPPORTED_CHAIN;
}

export function PaymentDialog({ planType, plan }: PaymentDialogProps) {
  const t = useTranslations("payment");
  const pt = useTranslations("pricing");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] =
    useState<SUPPORTED_CHAIN>("ETH");
  const [orderData, setOrderData] = useState<PaymentData | null>(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const qrCode = useMemo(() => {
    if (!orderData) return null;
    return (
      <QRCode
        text={orderData.receiverAddress}
        width={200}
        logo={`/images/usdt.png`}
        logoWidth={50}
      />
    );
  }, [orderData]);

  // 清理定时器
  const clearCountdownTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(undefined);
    }
  };

  // 重置倒计时
  const resetCountdown = () => {
    clearCountdownTimer();
    setCountdown(900);
    const newTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearCountdownTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => clearCountdownTimer();
  }, []);

  // Dialog 关闭时清理定时器
  useEffect(() => {
    if (!open) {
      clearCountdownTimer();
    }
  }, [open]);

  const handleOpen = async () => {
    setLoading(true);
    const result = await checkout(planType, selectedNetwork);
    if (result.error) {
      setOrderData(null);
      clearCountdownTimer();
      toast.error(t("toast.create_order.error"), {
        description: result.error.message ?? t("toast.create_order.retry"),
      });
      if (result.error.code === ErrorCode.UNAUTHORIZED) {
        router.push("/auth/login");
      }
      setLoading(false);
      return;
    }
    setOrderData(result.data as unknown as PaymentData);
    setOpen(true);
    resetCountdown();
    setLoading(false);
  };

  const handleNetworkChange = async (network: SUPPORTED_CHAIN) => {
    if (network === selectedNetwork) return;

    setSelectedNetwork(network);
    setLoading(true);

    const result = await checkout(planType, network);
    if (result.error) {
      setOrderData(null);
      clearCountdownTimer();
      toast.error(t("dialog.network.unavailable"), {
        description: result.error.message ?? t("toast.update_order.retry"),
      });
      setLoading(false);
      return;
    }

    setOrderData(result.data as unknown as PaymentData);
    resetCountdown();
    setLoading(false);
  };

  const handlePaymentSubmit = async () => {
    if (!orderData) return;

    setLoading(true);
    const result = await confirmPayment(String(orderData.id));
    if (result.error) {
      toast.error(t("toast.confirm_payment.error"), {
        description: result.error.message ?? t("toast.confirm_payment.retry"),
      });
      setLoading(false);
      return;
    }

    toast.success(t("toast.confirm_payment.success"), {
      description: t("toast.confirm_payment.success_description"),
    });
    setOpen(false);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Button className="w-full" disabled={loading} onClick={handleOpen}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {pt("loading")}
          </>
        ) : (
          <>
            {pt("select")} {plan.name}
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-transparent p-5 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              {t("dialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-base font-medium">
                {plan.name} - {plan.price} USDT
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-center">
                <span className="text-sm font-medium">
                  {t("dialog.network.selected")}
                  {
                    SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[selectedNetwork]
                      .chainName
                  }
                </span>
              </div>
              <div className="flex space-x-2 overflow-x-auto py-2">
                {Object.entries(SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS).map(
                  ([network, { logo, chainName }]) => (
                    <TooltipProvider key={network}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant={
                              selectedNetwork === network
                                ? "default"
                                : "outline"
                            }
                            className="flex items-center justify-center p-2"
                            onClick={() =>
                              handleNetworkChange(network as SUPPORTED_CHAIN)
                            }
                            disabled={loading}
                          >
                            <img src={logo} alt={network} className="h-6 w-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{chainName}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ),
                )}
              </div>

              {!loading && orderData ? (
                qrCode
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="rounded-lg border bg-muted p-4">
                    <div className="flex h-[200px] w-[200px] items-center justify-center">
                      {loading ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      ) : (
                        <div className="h-full w-full animate-pulse bg-muted-foreground/20" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {loading
                      ? t("dialog.network.switching_message")
                      : t("dialog.network.unavailable")}
                  </div>
                </div>
              )}
            </div>

            {orderData && (
              <div className="text-center">
                <div className="mb-1 text-sm text-muted-foreground">
                  <TimerIcon className="mr-1 inline-block h-4 w-4" />
                  {t("dialog.countdown.title")}
                </div>
                <div className="font-mono text-xl font-semibold">
                  {formatTime(countdown)}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="shrink-0">{t("dialog.order.id")}:</span>
                {loading ? (
                  <div className="h-4 w-16 animate-pulse rounded bg-muted-foreground/20" />
                ) : (
                  <span className="text-right font-mono">
                    {orderData?.id || "- -"}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0">{t("dialog.order.address")}:</span>
                {loading ? (
                  <div className="h-4 w-32 animate-pulse rounded bg-muted-foreground/20" />
                ) : (
                  <span className="break-all text-right font-mono text-xs">
                    {orderData?.receiverAddress || "- -"}
                  </span>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <span className="shrink-0">{t("dialog.order.network")}:</span>
                {loading ? (
                  <div className="h-4 w-12 animate-pulse rounded bg-muted-foreground/20" />
                ) : (
                  <span className="text-right font-semibold">
                    {
                      SUPPORTED_CHAIN_USDT_CONTRACT_ADDRESS[selectedNetwork]
                        .chainName
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col !justify-center gap-2 sm:flex-row sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <XIcon className="mr-2 h-4 w-4" />
              {t("dialog.button.cancel")}
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={loading || !orderData}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("dialog.button.confirming")}
                </div>
              ) : (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  {t("dialog.button.confirm")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
