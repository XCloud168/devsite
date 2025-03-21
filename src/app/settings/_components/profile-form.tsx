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
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile } from "@/server/api/routes/auth";
import { updateUserProfile } from "@/server/api/routes/profile";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfileForm() {
  const t = useTranslations("profile.sections.profile");
  const profileT = useTranslations("profile");
  const commonT = useTranslations("common");
  const [isLoading, setIsLoading] = useState(true);

  const profileFormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: t("validation.usernameMin"),
      })
      .max(30, {
        message: t("validation.usernameMax"),
      }),
    email: z
      .string()
      .min(1, {
        message: t("validation.emailRequired"),
      })
      .email(t("validation.emailInvalid")),
    bio: z.string().max(160, {
      message: t("validation.bioMax"),
    }),
    urls: z
      .array(
        z.object({
          value: z.string().url({ message: "请输入有效的URL。" }),
        }),
      )
      .optional(),
  });

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [{ value: "https://github.com" }],
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          form.reset({
            username: profile.username || "",
            email: profile.email,
            bio: t("defaultBio"),
            urls: [{ value: "https://github.com" }],
          });
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

  async function onSubmit(_: ProfileFormValues) {
    const { username, email, bio } = form.getValues();
    const result = await updateUserProfile(username, email, bio);
    if (!result.error) {
      toast.success(profileT("updateSuccess"));
    } else {
      toast.error(profileT("updateError"), {
        description: result.error.message,
      });
    }
  }

  if (isLoading) {
    return <div>{commonT("loading")}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("usernamePlaceholder")}
                  {...field}
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
              <FormDescription>{t("usernameDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("emailPlaceholder")}
                  {...field}
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
              <FormDescription>{t("emailDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bio")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("bioPlaceholder")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("bioDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{commonT("update")}</Button>
      </form>
    </Form>
  );
}
