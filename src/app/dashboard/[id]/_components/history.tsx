"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

interface Props {
  projectStats: {
    signalPrice: string;
    highPrice: string;
    highRate: string;
    logo: string;
    mentionCount: number;
    projectId: string;
    symbol: string;
  }[];
}
export function History({ projectStats }: Props) {
  const t = useTranslations();
  return (
    <Table className="mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">
            {t("dashboard.details.token")}
          </TableHead>
          <TableHead className="whitespace-nowrap">
            {t("dashboard.details.totalMentions")}
          </TableHead>
          <TableHead className="whitespace-nowrap">
            {t("dashboard.details.firstMentionPrice")}
          </TableHead>
          <TableHead className="whitespace-nowrap">
            {t("dashboard.details.highestPrice")}
          </TableHead>
          <TableHead className="whitespace-nowrap">
            {t("dashboard.details.maxPNL")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectStats.map((data, index) => (
          <TableRow key={data.symbol + index}>
            <TableCell className="flex items-center gap-2 py-3">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data.logo ?? ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p>{data.symbol}</p>
            </TableCell>
            <TableCell className="py-3">{data.mentionCount}</TableCell>
            <TableCell className="py-3"> {data.signalPrice}</TableCell>
            <TableCell className="py-3">{data.highPrice}</TableCell>
            <TableCell className="py-3">{data.highRate}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
