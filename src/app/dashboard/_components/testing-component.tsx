"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, CircleCheckBig, Loader } from "lucide-react";
import Link from "next/link";

export function TestingComponent() {
  return (
    <div className="relative mt-10 flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <p>KOL评测</p>
        <p className="mt-2">Hi~ 今天，您是第 928421 个来进行测评的人 </p>
        <div className="mt-5 flex w-[600px]">
          <Input className="rounded-br-none rounded-tr-none"></Input>
          <Button className="rounded-bl-none rounded-tl-none">测评</Button>
        </div>
        <div className="mt-10 h-[1px] w-full bg-border"></div>
        <div className="mt-8 w-full rounded-lg bg-[#4949493a]">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full ring-1"></div>
              <div>
                <p>蛙丑丑</p>
                <p className="text-xs">@zhuilong888</p>
              </div>
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full ring-1">
              <ChevronRight size={20} />
            </div>
          </div>
          <div className="my-3 h-[1px] w-full bg-white"></div>
          <div className="space-y-1 px-6 pb-3">
            <div className="flex items-center gap-2">
              <CircleCheckBig className="text-primary" size={16} />
              <p>检测30D内容含有代币信息的推文</p>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheckBig className="text-primary" size={16} />
              <p>已获取代币的价格，分析数据</p>
            </div>
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              <p>获取代币的价格，分析数据</p>
            </div>
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              <p>已测评完成</p>
            </div>
          </div>
        </div>
        <p className="mt-8 w-full text-left">测评记录</p>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="mt-4 grid w-full grid-cols-6 items-center justify-center gap-1 rounded-lg bg-[#4949493a]"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="h-8 w-8 rounded-full ring-1"></div>
              <div>
                <p>蛙丑丑</p>
                <p className="text-xs">@zhuilong888</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs">胜率</p>
              <p className="text-primary">82.17%</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs">喊单总数</p>
              <p className="text-primary">32</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs">(30D)最大涨幅</p>
              <p>SPX</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs">(30D)最大回测</p>
              <p>Moo</p>
            </div>
            <div className="flex h-full cursor-pointer items-center justify-center">
              <Link className="rounded-full ring-1" href={"/dashboard/123"}>
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
