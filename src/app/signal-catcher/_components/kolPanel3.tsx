"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { AngleIcon } from "@/components/ui/icon";

const tableData = [
  {
    name: "INV001",
    id: "1",
    followers: "$250.00",
    time: "Credit Card",
    project: "123",
    action: "123",
  },
  {
    name: "INV001",
    id: "2",
    followers: "$250.00",
    time: "Credit Card",
    project: "123",
    action: "123",
  },
  {
    name: "INV001",
    id: "3",
    followers: "$250.00",
    time: "Credit Card",
    project: "123",
    action: "123",
  },
];

export function KolPanel3() {
  const [showTable, setShowTable] = useState(false);
  return (
    <>
      {!showTable ? (
        <div className="p-5">
          <div className="flex gap-3 p-3">
            <div className="flex w-[240px] items-center justify-between border px-6">
              <p>代币相关</p>
              <div>
                <Switch id="airplane-mode" />
              </div>
            </div>
            <div className="flex w-[240px] items-center justify-between border px-6 py-4">
              <p>监控列表</p>
              <div
                className="cursor-pointer"
                onClick={() => setShowTable(true)}
              >
                <AngleIcon className="h-4 w-2 fill-black stroke-[#494949]" />
              </div>
            </div>
          </div>
          <p className="text-xs">2024-09-17 23:34:45</p>
          <div className="mt-2">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                <div>
                  <p>Elon Musk</p>
                  <div className="flex gap-3">
                    <p className="text-xs">@elonmusk</p>
                    <p className="text-xs">2.1亿 粉丝</p>
                  </div>
                </div>
              </div>
              <Button variant="outline">添加监控</Button>
            </div>
            <div></div>
          </div>
          <div className="mt-4 rounded-sm border border-[#494949]">
            <p className="mb-1.5 px-3 pt-3">
              In support of the policies of President @realDonaldTrump and to
              demonstrate our confidence in the future of the United States,
              @Tesla commits to doubling vehicle production in the US within 2
              years!
            </p>
            <p className="text-sx mb-1.5 px-3 text-xs text-[#01A4D9]">
              隐藏翻译
            </p>
            <div className="bg-[#494949] p-3">
              <p>
                为了支持唐纳德・特朗普总统（@realDonaldTrump）的政策，并展现我们对美国未来的信心，特斯拉公司（@Tesla）承诺在两年内将其在美国的汽车产量提高一倍！
              </p>
            </div>
            <div className="flex gap-10 p-4">
              <p className="text-xs text-white/60">显示原文</p>
              <p className="text-xs text-white/60">分享</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-3 py-4">
            <div className="cursor-pointer" onClick={() => setShowTable(false)}>
              <AngleIcon className="h-4 w-2 rotate-180 fill-black stroke-[#fff]" />
            </div>
            <p>我的监控</p>
          </div>
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>followers</TableHead>
                <TableHead>time</TableHead>
                <TableHead>project</TableHead>
                <TableHead>action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.followers}</TableCell>
                  <TableCell>{data.time}</TableCell>
                  <TableCell>{data.project}</TableCell>
                  <TableCell>{data.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/*<TableFooter>*/}
            {/*  <TableRow>*/}
            {/*    <TableCell colSpan={3}>Total</TableCell>*/}
            {/*    <TableCell className="text-right">$2,500.00</TableCell>*/}
            {/*  </TableRow>*/}
            {/*</TableFooter>*/}
          </Table>
        </div>
      )}
    </>
  );
}
