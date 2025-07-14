// devsite/src/server/api/routes/memepump.ts

"use server";

import axios from 'axios';

/**
 * 获取 OKX memepump 榜单（支持多条件筛选）
 * @param params 查询参数
 * @param params.chainId 链ID（如501为Solana）
 * @param params.protocolIdList 协议ID列表（逗号分隔字符串，直接传给接口）
 * @param params.change5Min 5分钟涨跌区间（如"20,30"）
 * @param params.marketCap 市值区间（如"10000,50000"）
 * @param params.tokenCreateTime 创建时间区间（如"1751534995000,1751535995000"）
 * @returns 精简后的榜单列表
 */
export async function getOkxMemepumpList(params: {
  chainId: string;
  protocolIdList?: string;
  change5Min?: string;
  marketCap?: string;
  tokenCreateTime?: string;
}) {
  const { chainId, protocolIdList, change5Min, marketCap, tokenCreateTime } = params;

  // 构造接口URL
  const url = `https://web3.okx.com/priapi/v1/dx/market/v2/memefun/ranking/list?rankType=4&chainId=${chainId}&protocolIdList=${protocolIdList ?? ""}&t=${Date.now()}`;
  console.log("[memepump] 请求URL:", url);

  // 发起请求
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      // 代理配置 - 根据你的实际代理地址修改
      proxy: {
        host: '192.168.3.8',
        port: 7890,  // 常见的代理端口：7890(Clash), 1080(SOCKS), 8080(HTTP)
        protocol: 'http'
      },
      timeout: 30000,
    });
  } catch (err) {
    console.error("[memepump] 请求异常:", err);
    throw new Error("OKX榜单请求异常");
  }

  console.log("[memepump] 响应状态:", response.status);

  if (response.status !== 200) {
    console.error("[memepump] 响应失败:", response.data);
    throw new Error("获取OKX榜单失败");
  }

  const result = response.data;
  console.log("[memepump] 返回数据data长度:", Array.isArray(result.data) ? result.data.length : "无data字段");

  // 只保留需要的字段
  let filteredList = (result.data || []).map((item: any) => ({
    tokenName: item.tokenName,
    tokenSymbol: item.tokenSymbol,
    tokenLogoUrl: item.tokenLogoUrl,
    tokenContractAddress: item.tokenContractAddress,
    price: item.price,
    marketCap: item.marketCap,
    holders: item.holders,
    change1H: item.change1H,
    change24H: item.change24H,
    change4H: item.change4H,
    change5Min: item.change5Min,
    volume: item.volume,
    projectLink: item.projectLink,
    top10HoldAmountPercentage: item.top10HoldAmountPercentage,
    tokenCreateTime: item.tokenCreateTime,
    txs1H: item.txs1H,
    txsBuy1H: item.txsBuy1H,
    txsSell1H: item.txsSell1H,
  }));

  // 本地筛选
  // change5Min
  if (change5Min) {
    const [minStr, maxStr] = change5Min.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.change5Min);
      if (isNaN(val)) return false;
      if (min !== undefined && max !== undefined) return val >= min && val <= max;
      if (min !== undefined) return val >= min;
      if (max !== undefined) return val <= max;
      return true;
    });
  }

  // marketCap
  if (marketCap) {
    const [minStr, maxStr] = marketCap.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.marketCap);
      if (isNaN(val)) return false;
      if (min !== undefined && max !== undefined) return val >= min && val <= max;
      if (min !== undefined) return val >= min;
      if (max !== undefined) return val <= max;
      return true;
    });
  }

  // tokenCreateTime
  if (tokenCreateTime) {
    const [minStr, maxStr] = tokenCreateTime.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.tokenCreateTime);
      if (isNaN(val)) return false;
      if (min !== undefined && max !== undefined) return val >= min && val <= max;
      if (min !== undefined) return val >= min;
      if (max !== undefined) return val <= max;
      return true;
    });
  }

  console.log("[memepump] 精简后返回条数:", filteredList.length);

  return filteredList;
}
