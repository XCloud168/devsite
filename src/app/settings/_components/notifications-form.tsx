"use client";

import { Howl } from "howler";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NOTIFY_SOUNDS } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/server/api/routes/auth";
import { updateUserNotificationSettings } from "@/server/api/routes/profile";
export function NotificationsForm() {
  const t = useTranslations("profile");
  const commonT = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const notificationsFormSchema = z.object({
    enable_signal_notification: z.boolean().default(false).optional(),
    notify_sound: z
      .enum(Object.values(NOTIFY_SOUNDS) as [string, ...string[]])
      .default(NOTIFY_SOUNDS.COIN)
      .optional(),
  });

  type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

  const defaultValues: Partial<NotificationsFormValues> = {
    enable_signal_notification: false,
    notify_sound: NOTIFY_SOUNDS.COIN,
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  const handleSoundChange = (value: string) => {
    const newAudio = new Howl({
      src: [`/audios/${value}`],
      volume: 1,
      preload: true,
    });
    newAudio.play();
    form.setValue("notify_sound", value);
  };

  const handleEnableSignalNotifications = (value: boolean) => {
    if (value && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    form.setValue("enable_signal_notification", value);
  };

  async function onSubmit(_: NotificationsFormValues) {
    const { enable_signal_notification, notify_sound } = form.getValues();
    const result = await updateUserNotificationSettings(
      enable_signal_notification ?? false,
      notify_sound ?? NOTIFY_SOUNDS.COIN,
    );
    if (!result.error) {
      toast.success(t("updateSuccess"));
    } else {
      toast.error(t("updateError"), {
        description: result.error.message,
      });
    }
  }

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          form.reset({
            enable_signal_notification: profile.enableNotification ?? false,
            notify_sound: profile.notificationSound ?? NOTIFY_SOUNDS.COIN,
          });
          setIsMember(
            profile.membershipExpiredAt
              ? profile.membershipExpiredAt > new Date()
              : false,
          );
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error(t("loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [form, t]);

  if (isLoading) {
    return <div>{commonT("loading")}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="enable_signal_notification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("sections.notifications.enableSignalNotifications")}
                  </FormLabel>
                  <FormDescription>
                    {t(
                      "sections.notifications.enableSignalNotificationsDescription",
                    )}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleEnableSignalNotifications}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notify_sound"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("sections.notifications.notifySounds")}
                  </FormLabel>
                  <FormDescription>
                    {t("sections.notifications.notifySoundsDescription")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={handleSoundChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(NOTIFY_SOUNDS).map((sound) => (
                        <SelectItem key={sound} value={sound}>
                          {sound}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
