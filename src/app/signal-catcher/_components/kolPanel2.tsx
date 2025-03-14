"use client";

import { Button } from "@/components/ui/button";
export function KolPanel2() {
  return (
    <>
      <div className="p-5">
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
          <p className="text-sx mb-1.5 px-3 text-xs text-[#01A4D9]">隐藏翻译</p>
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
    </>
  );
}
