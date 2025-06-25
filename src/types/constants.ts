/**
 * 支持的链
 */
export type SUPPORTED_CHAIN = "BSC" | "ETH" | "ARB" | "BASE" | "POLYGON";

/**
 * 支付状态
 */
export type PAYMENT_STATUS = "pending" | "paid" | "confirmed" | "failed";

/**
 * 计划类型
 */
export type PLAN_TYPE = "monthly" | "quarterly" | "yearly";

/**
 * 发布状态
 */
export type PUBLISH_STATUS = "draft" | "published" | "rejected";

/**
 * 信号提供者类型
 */
export type SIGNAL_PROVIDER_TYPE = "twitter" | "announcement" | "news";

/**
 * 用户类型
 */
export type USER_TYPE = "super_influencer" | "institution_projects" | "kol_opinions" | "user_follow";

/**
 * 提现状态
 */
export type WITHDRAWAL_STATUS = "pending" | "processing" | "completed" | "failed";
export const WITHDRAWAL_STATUS_LIST: WITHDRAWAL_STATUS[] = [
  "pending", "processing", "completed", "failed"
];
