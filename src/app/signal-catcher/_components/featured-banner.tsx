"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type FeaturedMenu = {
  label: string;
  id: string;
  children: {
    label: string;
    id: string;
    selected: boolean;
  }[];
};
const menu: FeaturedMenu[] = [
  {
    label: "交易所",
    id: "1",
    children: [
      {
        label: "Binance",
        id: "1-1",
        selected: true,
      },
      {
        label: "OKX",
        id: "1-2",
        selected: false,
      },
      {
        label: "Coinbase",
        id: "1-3",
        selected: false,
      },
      {
        label: "Upbit",
        id: "1-4",
        selected: false,
      },
    ],
  },
  {
    label: "KOL观点",
    id: "2",
    children: [
      {
        label: "KOL观点",
        id: "2-1",
        selected: false,
      },
    ],
  },
  {
    label: "意见领袖",
    id: "3",
    children: [
      {
        label: "意见领袖",
        id: "3-1",
        selected: false,
      },
    ],
  },
  {
    label: "项目方",
    id: "4",
    children: [
      {
        label: "项目方",
        id: "4-1",
        selected: false,
      },
    ],
  },
  {
    label: "宏观风向",
    id: "5",
    children: [
      {
        label: "宏观风向",
        id: "5-1",
        selected: false,
      },
    ],
  },
  {
    label: "链上动向",
    id: "6",
    children: [
      {
        label: "链上动向",
        id: "6-1",
        selected: false,
      },
    ],
  },
];

export function FeaturedBanner() {
  const [selectedMenu, setSelectedMenu] = useState<FeaturedMenu>({
    label: "交易所",
    id: "1",
    children: [
      {
        label: "Binance",
        id: "1-1",
        selected: true,
      },
      {
        label: "OKX",
        id: "1-2",
        selected: false,
      },
      {
        label: "Coinbase",
        id: "1-3",
        selected: false,
      },
      {
        label: "Upbit",
        id: "1-4",
        selected: false,
      },
    ],
  });
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <div className="flex border-b border-[#49494980] p-5">
        <p className="text-white">精选信号</p>
        <p className="text-white/50">（非会员只能查看前一天数据）</p>
      </div>
      <div className="flex border-b border-[#49494980] px-5">
        <div className="grid grid-cols-6 gap-8">
          {menu.map((menu) => (
            <div
              key={menu.id}
              className={`${selectedMenu.id === menu.id ? "border-primary text-primary" : "border-transparent text-white"} cursor-pointer border-b-2 pb-2 pt-5 text-center hover:text-primary`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu.label}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        <Tabs
          defaultValue={
            selectedMenu.children.filter((item) => item.selected)[0]?.id
          }
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-4">
            {selectedMenu.children.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="relative mb-5 border-b border-[#49494980] p-3">
        <div
          className="absolute bottom-[-8px] left-1/2 h-2 w-10 -translate-x-1/2 cursor-pointer bg-[url('/images/signal/triangle.svg')] bg-contain bg-center bg-no-repeat transition-transform duration-500 hover:scale-125"
          onClick={() => setShowDetails((prev) => !prev)}
        ></div>
        <div
          className={`grid w-full grid-cols-4 gap-3 overflow-hidden transition-all duration-1000 ease-in-out ${
            showDetails ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="text-[#FFF28B]">12</p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="text-[#FFF28B]">12</p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="text-[#FFF28B]">12</p>
          </div>
          <div className="relative w-full px-3">
            <p className="text-xs">Total New Token Listings</p>
            <p className="text-[#FFF28B]">12</p>
          </div>
        </div>
      </div>
    </>
  );
}
