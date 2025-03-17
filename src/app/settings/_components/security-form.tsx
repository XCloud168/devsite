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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function SecurityForm() {
  const t = useTranslations("profile.sections.security");
  const commonT = useTranslations("common");

  const securityFormSchema = z.object({
    currentPassword: z.string().min(8, {
      message: t("validation.passwordMin"),
    }),
    newPassword: z.string().min(8, {
      message: t("validation.passwordMin"),
    }),
    twoFactor: z.boolean().default(false).optional(),
  });

  type SecurityFormValues = z.infer<typeof securityFormSchema>;

  const defaultValues: Partial<SecurityFormValues> = {
    twoFactor: false,
  };

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues,
  });

  function onSubmit(_: SecurityFormValues) {
    toast.success(t("updateSuccess"));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("currentPassword")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("currentPasswordPlaceholder")}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("newPasswordPlaceholder")}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twoFactor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t("twoFactor")}</FormLabel>
                <FormDescription>{t("twoFactorDescription")}</FormDescription>
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
