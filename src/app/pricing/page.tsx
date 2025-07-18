import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/constants";
import { type PLAN_TYPE } from "@/types/constants";
import { getTranslations } from "next-intl/server";
import { PaymentDialog } from "./_components/payment-dialog";

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Card key={key} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                {t(`plans.${key}.name`)}
                {plan.originalPrice !== plan.price ? (
                  <Badge
                    variant="destructive"
                    className="ml-2 bg-[#FA5B5B] dark:bg-[#F95F5F]"
                  >
                    {t("save")}{" "}
                    {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                  </Badge>
                ) : null}
              </CardTitle>
              <CardDescription>
                {plan.originalPrice !== plan.price ? (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold text-black dark:text-white">
                      {plan.price} USDT
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice} USDT
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-black dark:text-white">
                    {plan.price} USDT
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {(t.raw(`plans.${key}.features`) as unknown as string[]).map(
                  (feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                      <span className="text-sm text-black/80 dark:text-white/80">
                        {feature}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <PaymentDialog
                planType={plan.id as PLAN_TYPE}
                plan={{
                  name: t(`plans.${key}.name`),
                  price: plan.price,
                }}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
