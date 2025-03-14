import { PAYMENT_STATUS, PLAN_TYPE, SUPPORTED_CHAIN } from "@/types/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { profiles } from "./profile";

export const paymentAddresses = pgTable("payment_addresses", {
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
}).enableRLS();

export const paymentAddressesRelations = relations(
  paymentAddresses,
  ({ many }) => ({
    payments: many(payments),
  }),
);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  receiverAddress: varchar("receiver_address", { length: 255 }).references(
    () => paymentAddresses.address,
  ),
  chain: varchar("chain", { length: 255 }).$type<SUPPORTED_CHAIN>().notNull(),
  planType: varchar("plan_type", { length: 255 }).$type<PLAN_TYPE>().notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  txHash: varchar("tx_hash", { length: 255 }),
  status: varchar("status", { length: 255 }).$type<PAYMENT_STATUS>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}).enableRLS();

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
