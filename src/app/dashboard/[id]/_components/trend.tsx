"use client";

import React, { useMemo } from "react";
import { LineChart, Line, YAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Value",
    color: "#2563eb",
  },
} satisfies ChartConfig;
interface Props {
  dailyWinRate: { date: string; tweetsCount: number; winRate: string }[];
}
export function Trend({ dailyWinRate }: Props) {
  const chartData = useMemo(() => {
    return dailyWinRate.map((item) => ({
      time: item.date,
      value: item.winRate,
    }));
  }, [dailyWinRate]);
  return (
    <div className="mt-3 h-52 rounded-xl bg-[#4949493a]">
      <ChartContainer config={chartConfig} className="h-52 w-full">
        <LineChart accessibilityLayer data={chartData} height={200}>
          <YAxis dataKey="value" domain={[-200, 200]} />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
