import { Check } from "lucide-react";

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
import { PRICING_PLANS } from "@/lib/constants";
import { PLAN_TYPE } from "@/types/constants";
import { PaymentDialog } from "./_components/payment-dialog";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">选择您的订阅计划</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          选择最适合您需求的计划。所有计划都提供完整功能访问，区别在于订阅时长和优惠力度。
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Card key={key} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>
                {plan.originalPrice !== plan.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {plan.price} USDT
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice} USDT
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      省{" "}
                      {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                    </Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{plan.price} USDT</span>
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
            <CardFooter className="flex justify-center">
              <PaymentDialog planType={plan.id as PLAN_TYPE} plan={plan}>
                <Button className="w-full">选择{plan.name}</Button>
              </PaymentDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
