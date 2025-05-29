import {
  type PAYMENT_STATUS,
  type PLAN_TYPE,
  type SUPPORTED_CHAIN,
} from "@/types/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  numeric,
  timestamp,
  uuid,
  varchar,
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
