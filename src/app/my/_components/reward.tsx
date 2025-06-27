"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Wallet, X } from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ServerResult } from "@/lib/server-result";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Reward({
  evmAddress,
  bindAddressAction,
  total,
  balance,
  submitWithdrawalAction,
  rewardPoints,
  inviteInfo,
  getStatusAction,
}: {
  evmAddress: string | null | undefined;
  bindAddressAction: (address: string) => Promise<ServerResult>;
  submitWithdrawalAction: (amount: number) => Promise<ServerResult>;
  total?: string;
  balance?: string;
  rewardPoints?: number;
  inviteInfo: {
    commissionRate: string;
    invitedUserCount: number;
    paidUserCount: number;
  };
  getStatusAction: () => Promise<ServerResult>;
}) {
  const t = useTranslations("my");
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<
    string | null | undefined
  >(undefined);
  const [inputValue, setInputValue] = useState<string>("");
  const hasConnectedOnce = useRef(false);
  const [currentStatus, setCurrentStatus] = useState<
    undefined | "pending" | "processing" | "deducted" | "completed" | "failed"
  >(undefined);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    setCurrentAddress(evmAddress);
  }, [evmAddress]);
  useEffect(() => {
    if (getStatusAction) {
      getStatusAction().then((res) => {
        setCurrentStatus(res.data.status);
      });
    }
  }, [getStatusAction]);
  useEffect(() => {
    if (isConnected && address) {
      if (hasConnectedOnce.current) {
        setOpen(true);
      }
      hasConnectedOnce.current = true;
    }
  }, [isConnected, address]);

  const handleBind = (address?: string) => {
    if (!address || address.trim() === "") return;
    bindAddressAction(address)
      .then(() => {
        setCurrentAddress(address);
        toast.success(t("reward.bindSuccess"));
      })
      .catch(() => toast.error(t("reward.bindFailed")));
  };
  const handleSubmit = (val: string) => {
    if (isNaN(parseFloat(val))) return;
    if (parseFloat(val) < 10) {
      toast.error(t("reward.below"));
      return;
    }
    if (balance && parseFloat(val) > parseFloat(balance)) {
      toast.error(t("reward.exceeds"));
      return;
    }
    setBtnLoading(true);
    submitWithdrawalAction(parseFloat(val))
      .then(() => {
        toast.success(t("reward.withdrawSuccess"));
        getStatusAction().then((res) => {
          setCurrentStatus(res.data.status);
          setOpen(false);
        });
      })
      .catch(() => {
        toast.error(t("reward.withdrawFailed"));
      })
      .finally(() => setBtnLoading(false));
  };
  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-4">
          <p className="text- text-xs text-white/40">
            {t("reward.totalCommission")}
          </p>
          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold text-[#F0E4A2]">{total}</p>
            <p className="pb-1 text-sm text-[#F0E4A2]">USDT</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-5">
          <p className="text-xs text-white/40">{t("reward.withdrawable")}</p>
          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold text-[#09CB6F]">{balance}</p>
            <p className="pb-1 text-sm text-[#09CB6F]">USDT</p>
            {currentStatus === undefined ||
            currentStatus === "completed" ||
            currentStatus === "failed" ? (
              <Dialog open={open}>
                <DialogTrigger
                  onClick={() => setOpen(true)}
                  className="ml-auto text-sm text-[#09CB6F]"
                >
                  {t("reward.withdraw")}
                </DialogTrigger>
                <DialogContent className="w-[400px] bg-black p-5">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <p>{t("reward.withdraw")}</p>
                      <X
                        onClick={() => setOpen(false)}
                        className="cursor-pointer"
                      />
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/40">
                        {t("reward.withdrawable")}
                      </p>
                      <div className="flex items-end gap-1 space-y-4">
                        <p className="text-xl font-semibold text-[#09CB6F]">
                          {balance}
                        </p>
                        <p className="text-sm text-[#09CB6F]">USDT</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/40">
                      {t("reward.walletAddress")}
                    </p>

                    <div className="!mt-2 flex w-full items-center gap-2 rounded-lg bg-[#1E2128] p-2">
                      <Wallet size={16} />
                      <p className="w-64 overflow-hidden truncate text-sm">
                        {currentAddress
                          ? currentAddress
                          : isConnected
                            ? address
                            : t("reward.bindFirst")}
                      </p>
                      {currentAddress ? null : !isConnected ? (
                        <div
                          className="ml-auto [&>div>button]:text-xs [&>div>button]:text-[#09CB6F]"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <ConnectButton />{" "}
                        </div>
                      ) : (
                        <p
                          className="cursor-pointer break-keep text-xs text-[#09CB6F]"
                          onClick={() => handleBind(address)}
                        >
                          {t("reward.bind")}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs text-white/40">
                        {t("reward.amount")}
                      </p>
                      <p className="text-xs text-white/40">
                        *{t("reward.rewardTip1")}
                      </p>
                    </div>
                    <Input
                      placeholder={`${t("reward.input")}`}
                      disabled={!currentAddress}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="!mt-2"
                    ></Input>
                    <div className="mt-2 flex justify-center">
                      <Button
                        className="mt-2 px-4"
                        disabled={!currentAddress || btnLoading}
                        onClick={() => handleSubmit(inputValue)}
                      >
                        {currentAddress
                          ? t("reward.withdraw")
                          : t("reward.bindFirstBtn")}
                        {currentAddress && btnLoading ? (
                          <Loader2 className="h-24 w-24 animate-spin text-black" />
                        ) : null}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <p className="ml-auto text-sm text-[#09CB6F]">
                {t("reward.processing")}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-5">
          <div className="flex items-center gap-1">
            <p className="text-xs text-white/40">{t("reward.myPoint")}</p>
            <Popover>
              <PopoverTrigger asChild>
                <p className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-xs text-white">
                  ?
                </p>
              </PopoverTrigger>
              <PopoverContent className="max-w-xs p-2 text-xs text-white/80">
                {t("reward.pointTip")}
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold text-white/80">
              {rewardPoints}
            </p>
          </div>
        </div>
      </div>
      <p className="text-wihte/60 mb-4 text-sm">{t("reward.myInvitation")}</p>
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-4">
          <p className="text- text-xs text-white/40">
            {t("reward.invitedUsers")}
          </p>
          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold">
              {inviteInfo.invitedUserCount}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-4">
          <p className="text- text-xs text-white/40">{t("reward.paidUsers")}</p>
          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold">{inviteInfo.paidUserCount}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-[#2b2b2b26] px-8 py-4">
          {/*<p className="text- text-xs text-white/40">返佣比例</p>*/}
          <div className="flex items-center gap-1">
            <p className="text-xs text-white/40">
              {t("reward.commissionRate")}
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <p className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-xs text-white">
                  ?
                </p>
              </PopoverTrigger>
              <PopoverContent className="max-w-xs p-2 text-xs text-white/80">
                {t("reward.invitationTip")}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end gap-1 space-y-4">
            <p className="text-2xl font-semibold">
              {inviteInfo.commissionRate}%
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
