import { Separator } from "@/components/ui/separator";
import { type Metadata } from "next";
import { useTranslations } from "next-intl";
import { SidebarNav } from "./_components/sidebar-nav";

export const metadata: Metadata = {
  title: "个人设置",
  description: "管理您的个人信息和设置",
};

const sidebarNavItems = [
  {
    title: "profile.sections.profile.title",
    href: "/settings",
  },
  {
    title: "profile.sections.account.title",
    href: "/settings/account",
  },
  {
    title: "profile.sections.notifications.title",
    href: "/settings/notifications",
  },
  {
    title: "profile.sections.security.title",
    href: "/settings/security",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = useTranslations("profile");

  return (
    <div className="container space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
