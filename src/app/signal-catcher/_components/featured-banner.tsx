"use client";

import { Pagination } from "../../../components/pagination";
import type { Blog } from "@/types/blogs";
import type { Paginated } from "@/types/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 假设有一个获取博客数据的函数返回值可以用来推导类型
type BlogsListProps = {
  data: Paginated<Blog>;
};

export function FeaturedBanner({ data }: BlogsListProps) {
  const { data: allBlogs, pagination } = data;

  return (
    <>
      <div className="flex border-b border-[#49494980] p-5">
        <p className="text-white">精选信号</p>
        <p className="text-white/50">（非会员只能查看前一天数据）</p>
      </div>
      <div className="flex border-b border-[#49494980] px-5">
        <div className="grid grid-cols-6 gap-8">
          <div className="border-b-2 border-primary pb-2 pt-5 text-center text-primary">
            交易所
          </div>
          <div className="border-b-2 border-transparent pb-2 pt-5 text-center text-primary">
            KOL观点
          </div>
          <div className="border-b-2 border-transparent pb-2 pt-5 text-center text-primary">
            意见领袖
          </div>
          <div className="border-b-2 border-transparent pb-2 pt-5 text-center text-primary">
            项目方
          </div>
          <div className="border-b-2 border-transparent pb-2 pt-5 text-center text-primary">
            宏观风向
          </div>
          <div className="border-b-2 border-transparent pb-2 pt-5 text-center text-primary">
            链上动向
          </div>
        </div>
      </div>
      <div className="px-5 pt-5">
        <Tabs defaultValue="1" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1">Binance</TabsTrigger>
            <TabsTrigger value="2">OKX</TabsTrigger>
            <TabsTrigger value="3">Coinbase</TabsTrigger>
            <TabsTrigger value="4">Upbit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-5 border-b border-[#49494980] p-3">
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
    </>
  );
}
