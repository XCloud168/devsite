"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function AccountForm() {
  const t = useTranslations("profile.sections.account");
  const commonT = useTranslations("common");

  const accountFormSchema = z.object({
    language: z.enum(["zh", "en"], {
      required_error: t("validation.languageRequired"),
    }),
    notifications: z.boolean().default(true).optional(),
  });

  type AccountFormValues = z.infer<typeof accountFormSchema>;

  const defaultValues: Partial<AccountFormValues> = {
    language: "zh",
    notifications: true,
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(_: AccountFormValues) {
    toast.success(t("updateSuccess"));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("language")}</FormLabel>
              <FormDescription>{t("languageDescription")}</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="zh" className="sr-only" />
                    </FormControl>
                    <div className="rounded-md border-2 border-muted p-4 hover:border-accent">
                      <div className="font-semibold">
                        {t("languages.zh.name")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("languages.zh.description")}
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="en" className="sr-only" />
                    </FormControl>
                    <div className="rounded-md border-2 border-muted p-4 hover:border-accent">
                      <div className="font-semibold">
                        {t("languages.en.name")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("languages.en.description")}
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t("notifications")}
                </FormLabel>
                <FormDescription>
                  {t("notificationsDescription")}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{commonT("update")}</Button>
      </form>
    </Form>
  );
}
