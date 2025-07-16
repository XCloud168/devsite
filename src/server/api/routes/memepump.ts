// devsite/src/server/api/routes/memepump.ts

"use server";

import axios from 'axios';

// 缓存接口
interface CacheItem {
  data: any[];
  timestamp: number;
}

// 内存缓存存储
const cache = new Map<string, CacheItem>();
const CACHE_DURATION = 30 * 1000; // 30秒缓存时间

/**
 * 获取缓存数据
 */
function getCachedData(key: string): any[] | null {
  const cached = cache.get(key);
  if (!cached) return null;
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

/**
 * 设置缓存数据
 */
function setCachedData(key: string, data: any[]): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * 生成缓存键
 * 只用chainId和protocolIdList
 */
function generateCacheKey(params: { chainId: string; protocolIdList?: string }): string {
  const { chainId, protocolIdList } = params;
  return `okx_memepump_${chainId}_${protocolIdList || 'all'}`;
}

/**
 * 获取 OKX memepump 榜单（支持多条件筛选）
 */
export async function getOkxMemepumpList(params: {
  chainId: string;
  protocolIdList?: string;
  change5Min?: string;
  marketCap?: string;
  tokenCreateTime?: string;
}) {
  const { chainId, protocolIdList, change5Min, marketCap, tokenCreateTime } = params;

  // 生成缓存键
  const cacheKey = generateCacheKey({ chainId, protocolIdList });

  // 检查缓存
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log("[memepump] 命中缓存，缓存key:", cacheKey, "缓存条数:", cachedData.length);
    return applyFilters(cachedData, { change5Min, marketCap, tokenCreateTime });
  }

  // 构造接口URL（只用rankType, chainId, protocolIdList, t）
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
      timeout: 30000,
    });
  } catch (err) {
    console.error("[memepump] 请求异常:", err);
    throw new Error("OKX榜单请求异常");
  }

  if (response.status !== 200) {
    console.error("[memepump] 响应失败:", response.data);
    throw new Error("获取OKX榜单失败");
  }

  const result = response.data;
  if (!Array.isArray(result.data)) {
    console.error("[memepump] 返回数据格式异常:", result);
    throw new Error("OKX榜单响应格式异常");
  }
  console.log("[memepump] 返回数据data长度:", result.data.length);

  // 精简字段
  const filteredList = result.data.map((item: any) => ({
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

  // 缓存原始数据
  setCachedData(cacheKey, filteredList);
  console.log("[memepump] 数据已缓存，缓存键:", cacheKey);

  // 内存筛选
  const finalResult = applyFilters(filteredList, { change5Min, marketCap, tokenCreateTime });
  console.log("[memepump] 筛选后返回条数:", finalResult.length);

  return finalResult;
}

/**
 * 内存筛选逻辑
 */
function applyFilters(
  data: any[],
  filters: {
    change5Min?: string;
    marketCap?: string;
    tokenCreateTime?: string;
  }
): any[] {
  let filteredList = [...data];
  // 只保留核心日志
  console.log('[memepump] 筛选前总数:', filteredList.length);

  // change5Min筛选
  if (filters.change5Min) {
    const [minStr, maxStr] = filters.change5Min.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.change5Min);
      if (isNaN(val)) return false;
      if (min !== undefined && val < min) return false;
      if (max !== undefined && val > max) return false;
      return true;
    });
  }

  // marketCap筛选
  if (filters.marketCap) {
    const [minStr, maxStr] = filters.marketCap.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.marketCap);
      if (isNaN(val)) return false;
      if (min !== undefined && val < min) return false;
      if (max !== undefined && val > max) return false;
      return true;
    });
  }

  // tokenCreateTime筛选
  if (filters.tokenCreateTime) {
    const [minStr, maxStr] = filters.tokenCreateTime.split(",");
    const min = minStr !== undefined && minStr !== "" ? Number(minStr) : undefined;
    const max = maxStr !== undefined && maxStr !== "" ? Number(maxStr) : undefined;
    filteredList = filteredList.filter((item: any) => {
      const val = Number(item.tokenCreateTime);
      if (isNaN(val)) return false;
      if (min !== undefined && val < min) return false;
      if (max !== undefined && val > max) return false;
      return true;
    });
  }

  console.log('[memepump] 筛选后总数:', filteredList.length);
  return filteredList;
}

/**
 * 清理过期缓存（可选：定期清理）
 */
export async function clearExpiredCache(): Promise<void> {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
  console.log("[memepump] 过期缓存已清理");
}

/**
 * 获取缓存统计信息（调试用）
 */
export async function getCacheStats(): Promise<{ size: number; keys: string[] }> {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}
