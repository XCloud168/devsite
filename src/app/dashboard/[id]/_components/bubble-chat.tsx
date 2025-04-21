"use client";
import React, { useMemo } from "react";
import BubbleChart from "@/components/BubbleChart";

interface Props {
  chartData: {
    content: string;
    highRate: string;
    id: string;
    lowRate: string;
    projectId: string;
    projectLogo: string;
    projectSymbol: string;
    tweetCreatedAt: Date;
  }[];
}
export function BubbleChat({ chartData }: Props) {
  const bubbleData = useMemo(() => {
    return chartData.map((item) => ({
      name: item.projectSymbol,
      radius: 40,
      color: "rgba(235, 159, 164, 0.6)",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      imageUrl: item.projectLogo,
      label1: item.projectSymbol,
      label2: item.highRate + "%",
      label3: item.lowRate + "%",
      labelColor2: "#00ff88",
      labelColor3: "#ff5151",
    }));
  }, [chartData]);
  return (
    <div className="mt-3 flex h-96 items-center justify-center rounded-xl bg-[#4949493a]">
      <BubbleChart data={bubbleData} width={800} height={96 * 4} speed={4} />
    </div>
  );
}
