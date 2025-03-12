"use client";

import { Pagination } from "../../../components/pagination";
import type { Blog } from "@/types/blogs";
import type { Paginated } from "@/types/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 假设有一个获取博客数据的函数返回值可以用来推导类型
type BlogsListProps = {
  data: Paginated<Blog>;
};

export function SignalBanner({ data }: BlogsListProps) {
  const { data: allBlogs, pagination } = data;

  return (
    <>
      <div>
        <Tabs defaultValue="1" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1">Binance</TabsTrigger>
            <TabsTrigger value="2">OKX</TabsTrigger>
            <TabsTrigger value="3">Coinbase</TabsTrigger>
            <TabsTrigger value="4">Upbit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mb-6 mt-5 grid grid-cols-4 gap-10">
        <div className="relative w-full bg-[#192628CC] p-3">
          <div className="absolute left-0 top-0 h-[10px] w-[7px] bg-[url(/images/signal/angle.svg)]"></div>
          <div className="absolute bottom-0 right-0 h-[10px] w-[7px] rotate-180 bg-[url(/images/signal/angle.svg)]"></div>
          <p>Total New Token Listings</p>
          <p>12</p>
        </div>

        <div className="relative w-full bg-[#192628CC] p-3">
          <div className="absolute left-0 top-0 h-[10px] w-[7px] bg-[url(/images/signal/angle.svg)]"></div>
          <div className="absolute bottom-0 right-0 h-[10px] w-[7px] rotate-180 bg-[url(/images/signal/angle.svg)]"></div>
          <p>Total New Token Listings</p>
          <p>12</p>
        </div>

        <div className="relative w-full bg-[#192628CC] p-3">
          <div className="absolute left-0 top-0 h-[10px] w-[7px] bg-[url(/images/signal/angle.svg)]"></div>
          <div className="absolute bottom-0 right-0 h-[10px] w-[7px] rotate-180 bg-[url(/images/signal/angle.svg)]"></div>
          <p>Total New Token Listings</p>
          <p>12</p>
        </div>

        <div className="relative w-full bg-[#192628CC] p-3">
          <div className="absolute left-0 top-0 h-[10px] w-[7px] bg-[url(/images/signal/angle.svg)]"></div>
          <div className="absolute bottom-0 right-0 h-[10px] w-[7px] rotate-180 bg-[url(/images/signal/angle.svg)]"></div>
          <p>Total New Token Listings</p>
          <p>12</p>
        </div>
      </div>
    </>
  );
}
