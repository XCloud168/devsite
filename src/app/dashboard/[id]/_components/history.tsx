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
    firstPrice: string;
    highestPrice: string;
    highestRate: string;
    logo: string;
    mentionCount: number;
    projectId: string;
    symbol: string;
  }[];
}
export function History({ projectStats }: Props) {
  const t = useTranslations();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("dashboard.details.token")}</TableHead>
          <TableHead>{t("dashboard.details.totalMentions")}</TableHead>
          <TableHead>{t("dashboard.details.firstMentionPrice")}</TableHead>
          <TableHead>{t("dashboard.details.highestPrice")}</TableHead>
          <TableHead>{t("dashboard.details.maxPNL")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectStats.map((data, index) => (
          <TableRow key={data.symbol + index}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data.logo ?? ""} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <p>{data.symbol}</p>
            </TableCell>
            <TableCell>{data.mentionCount}</TableCell>
            <TableCell> {data.firstPrice}</TableCell>
            <TableCell>{data.highestPrice}</TableCell>
            <TableCell>{data.highestRate}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
