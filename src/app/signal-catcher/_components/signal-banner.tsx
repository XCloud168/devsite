"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function SignalBanner() {
  return (
    <>
      <div className="flex border-b border-[#49494980] px-5 pt-5">
        <div className="grid grid-cols-6 gap-10">
          <div className="break-keep border-b-2 border-primary pb-[18px] text-center text-primary">
            CRYPTO速递
          </div>
          <div className="border-b-2 border-transparent pb-[18px] text-center text-primary">
            KOL观点
          </div>
          <div className="border-b-2 border-transparent pb-[18px] text-center text-primary">
            我的监控
          </div>
        </div>
      </div>
    </>
  );
}
