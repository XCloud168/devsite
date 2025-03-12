"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type PlanType = "monthly" | "quarterly" | "yearly";

interface PlanProps {
  type: PlanType;
  price: number;
  discount?: number;
  features: string[];
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  const [selectedNetwork, setSelectedNetwork] = useState<"TRX" | "SOL" | "ETH">(
    "ETH",
  );
  const [orderNumber, setOrderNumber] = useState<string>("");

  const plans: PlanProps[] = [
    {
      type: "monthly",
      price: 99,
      features: ["基础功能访问", "每月更新", "标准支持"],
    },
    {
      type: "quarterly",
      price: 267,
      discount: 10,
      features: ["所有月卡功能", "优先支持", "高级功能"],
    },
    {
      type: "yearly",
      price: 950,
      discount: 20,
      features: ["所有季卡功能", "专属客服", "提前体验新功能", "无限使用"],
    },
  ];

  const networkDetails = {
    ETH: {
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      qrCode: "/placeholder.svg?height=200&width=200",
      conversionRate: 0.00042,
      currency: "ETH",
    },
    SOL: {
      address: "8ZUgCKiNRgLD3XLNUUUVdBfsL1Qao9YMwNL1qgaWrTQz",
      qrCode: "/placeholder.svg?height=200&width=200",
      conversionRate: 0.0089,
      currency: "SOL",
    },
    TRX: {
      address: "TJYeasTPa6gpEEfYqzGsAN6xqhbYz1VbNS",
      qrCode: "/placeholder.svg?height=200&width=200",
      conversionRate: 14.5,
      currency: "TRX",
    },
  };

  const handleSelectPlan = (plan: PlanProps) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
    // Generate a fixed order number when opening checkout
    setOrderNumber(
      `ORD-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
    );
    // Reset countdown when opening checkout
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

    // Clear interval when dialog closes
    return () => clearInterval(timer);
  };

  const handlePaymentSubmit = () => {
    toast.success("订单已提交", {
      description: "我们将在确认付款后为您开通服务",
    });
    setCheckoutOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPlanName = (type: PlanType) => {
    switch (type) {
      case "monthly":
        return "月卡";
      case "quarterly":
        return "季卡";
      case "yearly":
        return "年卡";
    }
  };

  const getDiscountedPrice = (plan: PlanProps) => {
    if (!plan.discount) return plan.price;
    return Math.round(plan.price * (1 - plan.discount / 100));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">选择您的订阅计划</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          选择最适合您需求的计划。所有计划都提供完整功能访问，区别在于订阅时长和优惠力度。
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.type} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">
                {getPlanName(plan.type)}
              </CardTitle>
              <CardDescription>
                {plan.discount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      ¥{getDiscountedPrice(plan)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ¥{plan.price}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      省 {plan.discount}%
                    </Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">¥{plan.price}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSelectPlan(plan)}>
                选择{getPlanName(plan.type)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>支付订单</DialogTitle>
            <DialogDescription>
              请使用加密货币支付以下金额，支付完成后点击"我已支付"按钮。
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-medium">
                  {getPlanName(selectedPlan.type)} - ¥
                  {getDiscountedPrice(selectedPlan)}
                </div>
                <div className="text-sm text-muted-foreground">
                  约{" "}
                  {(
                    getDiscountedPrice(selectedPlan) *
                    networkDetails[selectedNetwork].conversionRate
                  ).toFixed(6)}{" "}
                  {networkDetails[selectedNetwork].currency}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex w-full items-center justify-center gap-2">
                  {(["ETH", "SOL", "TRX"] as const).map((network) => (
                    <Button
                      key={network}
                      variant={
                        selectedNetwork === network ? "default" : "outline"
                      }
                      className="flex-1"
                      onClick={() => setSelectedNetwork(network)}
                    >
                      {network} 网络
                    </Button>
                  ))}
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <Image
                    src={
                      networkDetails[selectedNetwork].qrCode ||
                      "/placeholder.svg"
                    }
                    alt={`${selectedNetwork} 支付二维码`}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="mb-1 text-sm text-muted-foreground">
                  请在以下时间内完成支付
                </div>
                <div className="font-mono text-xl font-semibold">
                  {formatTime(countdown)}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>订单编号:</span>
                  <span className="font-mono">{orderNumber}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span>收款地址:</span>
                  <span className="max-w-[200px] break-all text-right font-mono text-xs">
                    {networkDetails[selectedNetwork].address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>支付网络:</span>
                  <span className="font-semibold">{selectedNetwork}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={handlePaymentSubmit}>我已支付</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
