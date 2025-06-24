import {
  boolean,
  index,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { pgTable } from "./base";
import { relations } from "drizzle-orm";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => users.id),
    username: varchar("username", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
    inviteCode: varchar("invite_code", { length: 10 })
      .unique()
      .$defaultFn(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }),
    inviterId: uuid("inviter_id").references((): any => profiles.id),
    inviterSkipped: boolean("inviter_skipped").default(false),
    avatarUrl: varchar("avatar_url", { length: 256 }),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),

    // 新增积分字段
    rewardPoints: integer("reward_points").default(0).notNull(),

    // 上次积分发放日期
    lastPointsDate: varchar("last_points_date", { length: 10 }), // YYYY-MM-DD

    // 代理商信息
    agentCode: varchar("agent_code", { length: 10 }).unique(), // 代理商自己的编号，唯一且可空
    referrerCode: varchar("referrer_code", { length: 10 }), // 推荐此用户的代理商编号

    // 会员有效期
    membershipExpiredAt: timestamp("membership_expired_at", {
      withTimezone: true,
    }),

    // EVM 钱包地址
    evmAddress: varchar("evm_address", { length: 255 }), // 以太坊/EVM 兼容链地址

    // 杂项设置
    enableNotification: boolean("enable_notification").default(true),
    notificationSound: varchar("notification_sound", { length: 256 }),
  },
  (table) => [
    index("invite_code_idx").on(table.inviteCode),
    index("inviter_id_idx").on(table.inviterId),
    index("email_idx").on(table.email),
    index("agent_code_idx").on(table.agentCode),
    index("referrer_code_idx").on(table.referrerCode),
    index("evm_address_idx").on(table.evmAddress),
  ],
).enableRLS();

export const profilesRelations = relations(profiles, ({ one }) => ({
  inviter: one(profiles, {
    fields: [profiles.inviterId],
    references: [profiles.id],
  }),
}));
