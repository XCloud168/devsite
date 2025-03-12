import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function UserCenterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-4/5 cursor-pointer rounded-sm px-2 leading-8 hover:bg-gray-200 hover:text-black">
            账户管理
          </div>
          <div className="h-8 w-4/5 cursor-pointer rounded-sm px-2 leading-8 hover:bg-gray-200 hover:text-black">
            奖励中心
          </div>
          <div className="h-8 w-4/5 cursor-pointer rounded-sm px-2 leading-8 hover:bg-gray-200 hover:text-black">
            订单中心
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <p>基础信息</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
            </div>
          </div>
          <div>
            <p>安全设置</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
              <div className="h-12 rounded-sm bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
