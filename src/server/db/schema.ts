import { pgRole } from "drizzle-orm/pg-core";

import { blogs, blogsRelations } from "./schemas/blog";
import {
  announcement,
  announcementRelations,
  exchange,
  exchangeRelations,
} from "./schemas/exchange";
import { profiles, profilesRelations } from "./schemas/profile";
import {
  projects,
  projectsRelations,
  signals,
  signalsCategory,
  signalsRelations,
} from "./schemas/signal";
import {
  tweetInfo,
  tweetInfoRelations,
  tweetUsers,
  tweetUsersRelations,
  watchlist,
  watchlistRelations,
} from "./schemas/tweet";
import {
  paymentAddresses,
  payments,
  paymentsRelations,
  incomeRecords,
  incomeRecordsRelations,
  withdrawalRecords,
  withdrawalRecordsRelations,
  configs,
  systemLogs,
} from "./schemas/payment";
import {
  news,
  newsRelations,
  newsEntity,
  newsEntityRelations,
} from "./schemas/news";

export const authenticated = pgRole("authenticated").existing();

export {
  announcement,
  announcementRelations,
  blogs,
  blogsRelations,
  exchange,
  exchangeRelations,
  profiles,
  profilesRelations,
  projects,
  projectsRelations,
  signals,
  signalsRelations,
  signalsCategory,
  tweetInfo,
  tweetInfoRelations,
  tweetUsers,
  tweetUsersRelations,
  watchlist,
  watchlistRelations,
  paymentAddresses,
  payments,
  paymentsRelations,
  news,
  newsRelations,
  newsEntity,
  newsEntityRelations,
  incomeRecords,
  incomeRecordsRelations,
  withdrawalRecords,
  withdrawalRecordsRelations,
  configs,
  systemLogs,
};
