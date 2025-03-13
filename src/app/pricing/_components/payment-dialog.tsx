"use client";

import { CheckIcon, TimerIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

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
import { PLAN_TYPE, SUPPORTED_CHAIN } from "@/types/constants";
import { toast } from "sonner";
import { checkout, confirmPayment } from "@/server/api/routes/payment";

interface PaymentDialogProps {
  children: ReactNode;
  planType: PLAN_TYPE;
  plan: {
    name: string;
    price: number;
  };
}

interface NetworkDetails {
  qrCode: string;
  conversionRate: number;
  currency: string;
}

interface PaymentData {
  id: number;
  receiverAddress: string;
  amount: string;
}

const networkDetails: Record<SUPPORTED_CHAIN, NetworkDetails> = {
  BTC: {
    qrCode: "/placeholder.svg?height=200&width=200",
    conversionRate: 0.000023,
    currency: "BTC",
  },
  ETH: {
    qrCode: "/placeholder.svg?height=200&width=200",
    conversionRate: 0.00042,
    currency: "ETH",
  },
  SOL: {
    qrCode: "/placeholder.svg?height=200&width=200",
    conversionRate: 0.0089,
    currency: "SOL",
  },
  TRX: {
    qrCode: "/placeholder.svg?height=200&width=200",
    conversionRate: 14.5,
    currency: "TRX",
  },
};

export function PaymentDialog({
  children,
  planType,
  plan,
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] =
    useState<SUPPORTED_CHAIN>("ETH");
  const [orderData, setOrderData] = useState<PaymentData | null>(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes

  const handleOpen = async () => {
    setLoading(true);
    try {
      const result = await checkout(planType, selectedNetwork);
      if (result.error) throw new Error(String(result.error));
      if (!result.data) throw new Error("创建订单失败");

      setOrderData(result.data as unknown as PaymentData);
      setOpen(true);
      // Reset countdown
      setCountdown(900);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      toast.error("创建订单失败", {
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkChange = async (network: SUPPORTED_CHAIN) => {
    setSelectedNetwork(network);
    if (!orderData) return;

    setLoading(true);
    try {
      const result = await checkout(planType, network);
      if (result.error) throw new Error(String(result.error));
      if (!result.data) throw new Error("更新订单失败");

      setOrderData(result.data as unknown as PaymentData);
    } catch (error) {
      toast.error("更新订单失败", {
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!orderData) return;

    setLoading(true);
    try {
      const result = await confirmPayment(orderData.id);
      if (result.error) throw new Error(String(result.error));

      toast.success("订单已提交", {
        description: "我们将在确认付款后为您开通服务",
      });
      setOpen(false);
    } catch (error) {
      toast.error("确认订单失败", {
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div onClick={handleOpen}>{children}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>支付订单</DialogTitle>
            <DialogDescription>
              请使用加密货币支付以下金额，支付完成后点击"我已支付"按钮。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-medium">
                {plan.name} - ¥{plan.price}
              </div>
              {orderData && (
                <div className="text-sm text-muted-foreground">
                  约{" "}
                  {(
                    plan.price * networkDetails[selectedNetwork].conversionRate
                  ).toFixed(6)}{" "}
                  {networkDetails[selectedNetwork].currency}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex w-full items-center justify-center gap-2">
                {(Object.keys(networkDetails) as SUPPORTED_CHAIN[]).map(
                  (network) => (
                    <Button
                      key={network}
                      variant={
                        selectedNetwork === network ? "default" : "outline"
                      }
                      className="flex-1"
                      onClick={() => handleNetworkChange(network)}
                      disabled={loading}
                    >
                      {network} 网络
                    </Button>
                  ),
                )}
              </div>

              {orderData && (
                <div className="rounded-lg border bg-white p-4">
                  <Image
                    src={networkDetails[selectedNetwork].qrCode}
                    alt={`${selectedNetwork} 支付二维码`}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="mb-1 text-sm text-muted-foreground">
                <TimerIcon className="mr-1 inline-block h-4 w-4" />
                请在以下时间内完成支付
              </div>
              <div className="font-mono text-xl font-semibold">
                {formatTime(countdown)}
              </div>
            </div>

            {orderData && (
              <>
                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>订单编号:</span>
                    <span className="font-mono">{orderData.id}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span>收款地址:</span>
                    <span className="max-w-[200px] break-all text-right font-mono text-xs">
                      {orderData.receiverAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>支付网络:</span>
                    <span className="font-semibold">{selectedNetwork}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <XIcon className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={loading || !orderData}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              我已支付
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
