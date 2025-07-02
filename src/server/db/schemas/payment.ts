import {
  type PAYMENT_STATUS,
  type PLAN_TYPE,
  type SUPPORTED_CHAIN,
  type WITHDRAWAL_STATUS,
} from "@/types/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  numeric,
  timestamp,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { profiles } from "./profile";

export const paymentAddresses = pgTable(
  "payment_addresses",
  {
    address: varchar("address", { length: 255 }).unique().primaryKey(),
    chain: varchar("chain", { length: 255 })
      .$type<SUPPORTED_CHAIN>()
      .default("ETH"),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("address_idx").on(table.address),
    index("chain_idx").on(table.chain),
    index("enabled_idx").on(table.enabled),
  ],
).enableRLS();

export const paymentAddressesRelations = relations(
  paymentAddresses,
  ({ many }) => ({
    payments: many(payments),
  }),
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    receiverAddress: varchar("receiver_address", { length: 255 })
      .references(() => paymentAddresses.address)
      .notNull(),
    chain: varchar("chain", { length: 255 }).$type<SUPPORTED_CHAIN>().notNull(),
    planType: varchar("plan_type", { length: 255 })
      .$type<PLAN_TYPE>()
      .notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    txHash: varchar("tx_hash", { length: 255 }),
    status: varchar("status", { length: 255 })
      .$type<PAYMENT_STATUS>()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("payments_user_id_idx").on(table.userId),
    index("payments_receiver_address_idx").on(table.receiverAddress),
    index("payments_chain_idx").on(table.chain),
    index("payments_plan_type_idx").on(table.planType),
  ],
).enableRLS();

export const paymentsRelations = relations(payments, ({ one }) => ({
  receiverAddress: one(paymentAddresses, {
    fields: [payments.receiverAddress],
    references: [paymentAddresses.address],
  }),
  user: one(profiles, {
    fields: [payments.userId],
    references: [profiles.id],
  }),
}));

export const incomeRecords = pgTable(
  "income_records",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    paymentId: uuid("payment_id")
      .references(() => payments.id),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("income_records_user_id_idx").on(table.userId),
    index("income_records_payment_id_idx").on(table.paymentId),
    index("income_records_created_at_idx").on(table.createdAt),
  ],
).enableRLS();

export const incomeRecordsRelations = relations(incomeRecords, ({ one }) => ({
  user: one(profiles, {
    fields: [incomeRecords.userId],
    references: [profiles.id],
  }),
  payment: one(payments, {
    fields: [incomeRecords.paymentId],
    references: [payments.id],
  }),
}));

export const withdrawalRecords = pgTable(
  "withdrawal_records",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 255 })
      .$type<WITHDRAWAL_STATUS>()
      .default("pending")
      .notNull(),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("withdrawal_records_user_id_idx").on(table.userId),
    index("withdrawal_records_status_idx").on(table.status),
    index("withdrawal_records_created_at_idx").on(table.createdAt),
  ],
).enableRLS();

export const withdrawalRecordsRelations = relations(withdrawalRecords, ({ one }) => ({
  user: one(profiles, {
    fields: [withdrawalRecords.userId],
    references: [profiles.id],
  }),
}));

export const configs = pgTable(
  "configs",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    // 返佣比例，默认20%，可精确到小数点后两位
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("20.00").notNull(),
    // 可扩展更多配置项
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  }
).enableRLS();

export const systemLogs = pgTable(
  "system_logs",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    logName: varchar("log_name", { length: 255 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("system_logs_log_name_idx").on(table.logName),
    index("system_logs_created_at_idx").on(table.createdAt),
  ],
).enableRLS();

export const systemLogsRelations = relations(systemLogs, ({}) => ({}));
