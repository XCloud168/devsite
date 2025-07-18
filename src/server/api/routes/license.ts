import { getUserProfile } from "./auth"; // 你需要实现，返回 { id, name, membershipExpiredAt }

const API_BASE = "https://xmsbatedys.masbate.xyz";
const API_TOKEN = "9iZOy42f_017XQuRae95UiY7jXeAVmvWvcn6a3puDyY";

// 检查会员有效性
async function checkMembership() {
  const user = await getUserProfile();
  if (
    !user?.membershipExpiredAt ||
    isNaN(new Date(user.membershipExpiredAt).getTime()) ||
    new Date(user.membershipExpiredAt) < new Date()
  ) {
    throw new Error("会员未激活或已过期，无法操作证书");
  }
  return user;
}

// 计算会员剩余天数
function calcValidDays(expiredAt: string | Date | null | undefined): number {
  if (!expiredAt || isNaN(new Date(expiredAt).getTime())) return 0;
  const now = new Date();
  const end = new Date(expiredAt);
  const diff = end.getTime() - now.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

// 1. 生成 License
export async function generateLicense(params?: {
  customer_name?: string;
  valid_days?: number;
  features?: { max_users?: number; max_wallets?: number };
}) {
  const user = await checkMembership();
  const valid_days = params?.valid_days ?? calcValidDays(user.membershipExpiredAt);
  const features = {
    max_users: params?.features?.max_users ?? 5,
    max_wallets: params?.features?.max_wallets ?? 10,
  };
  const data = {
    customer_name: params?.customer_name ?? user.username ?? "未命名用户",
    customer_email: user.id, // 用唯一id
    valid_days,
    features,
  };
  const res = await fetch(`${API_BASE}/generate-license`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Secret": API_TOKEN,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("生成License失败");
  return res.json();
}

// 2. 查询所有生成记录
export async function getAllLicenseRecords() {
  const user = await checkMembership();
  const res = await fetch(
    `${API_BASE}/license-records?customer_email=${encodeURIComponent(user.id)}`,
    {
      headers: {
        "X-API-Secret": API_TOKEN,
      },
    }
  );
  if (!res.ok) throw new Error("查询证书记录失败");
  return res.json();
}

// 3. 按邮箱（用户id）查询生成记录
export async function getLicenseRecordsByEmail(email?: string) {
  const user = await checkMembership();
  const targetId = email ?? user.id;
  const res = await fetch(
    `${API_BASE}/license-records?customer_email=${encodeURIComponent(targetId)}`,
    {
      headers: {
        "X-API-Secret": API_TOKEN,
      },
    }
  );
  if (!res.ok) throw new Error("查询证书记录失败");
  return res.json();
}

// 4. 分页查询生成记录
export async function getLicenseRecordsByPage(skip = 0, limit = 10) {
  const user = await checkMembership();
  const res = await fetch(
    `${API_BASE}/license-records?customer_email=${encodeURIComponent(user.id)}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        "X-API-Secret": API_TOKEN,
      },
    }
  );
  if (!res.ok) throw new Error("分页查询证书记录失败");
  return res.json();
}

// 5. 下载证书
export async function downloadLicense(email?: string) {
  const user = await checkMembership();
  const targetId = email ?? user.id;
  const res = await fetch(
    `${API_BASE}/download-license/${encodeURIComponent(targetId)}`,
    {
      headers: {
        "X-API-Secret": API_TOKEN,
      },
    }
  );
  if (!res.ok) throw new Error("下载证书失败");
  return res.blob();
}
