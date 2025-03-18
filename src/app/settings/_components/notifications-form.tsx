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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationsForm() {
  const t = useTranslations("profile.sections.notifications");
  const commonT = useTranslations("common");

  const notificationsFormSchema = z.object({
    enable_signal_notifications: z.boolean().default(false).optional(),
    notify_sounds: z
      .enum([
        "coin.wav",
        "cow.wav",
        "ding.wav",
        "frog.wav",
        "girl.wav",
        "spring.wav",
      ])
      .default("coin.wav")
      .optional(),
  });

  type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

  const defaultValues: Partial<NotificationsFormValues> = {
    enable_signal_notifications: false,
    notify_sounds: "coin.wav",
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  function onSubmit(_: NotificationsFormValues) {
    toast.success(t("updateSuccess"));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="enable_signal_notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("enableSignalNotifications")}
                  </FormLabel>
                  <FormDescription>
                    {t("enableSignalNotificationsDescription")}
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
          <FormField
            control={form.control}
            name="notify_sounds"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("notifySounds")}
                  </FormLabel>
                  <FormDescription>
                    {t("notifySoundsDescription")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">{commonT("update")}</Button>
      </form>
    </Form>
  );
}
