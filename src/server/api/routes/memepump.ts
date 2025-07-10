// devsite/src/server/api/routes/memepump.ts

"use server";

/**
 * 获取 OKX memepump 榜单（精简字段版）
 * @param chainId 链ID（如501为Solana）
 * @returns 精简后的榜单列表
 */
export async function getOkxMemepumpList(chainId: string) {
  // 构造接口URL
  const url = `https://web3.okx.com/priapi/v1/dx/market/v2/memefun/ranking/list?rankType=4&chainId=${chainId}&protocolIdList=&t=${Date.now()}`;
  console.log("[memepump] 请求URL:", url);

  // 发起请求
  let response;
  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });
  } catch (err) {
    console.error("[memepump] 请求异常:", err);
    throw new Error("OKX榜单请求异常");
  }

  console.log("[memepump] 响应状态:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("[memepump] 响应失败:", text);
    throw new Error("获取OKX榜单失败");
  }

  let result;
  try {
    result = await response.json();
  } catch (err) {
    console.error("[memepump] JSON解析失败:", err);
    throw new Error("OKX榜单响应解析失败");
  }

  console.log("[memepump] 返回数据data长度:", Array.isArray(result.data) ? result.data.length : "无data字段");

  // 只保留需要的字段
  const filteredList = (result.data || []).map((item: any) => ({
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
    // 你可以根据需要添加更多字段
  }));

  console.log("[memepump] 精简后返回条数:", filteredList.length);

  return filteredList;
}
