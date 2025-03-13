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
  signalsRelations,
  signalsTag,
} from "./schemas/signal";
import {
  tweetInfo,
  tweetInfoRelations,
  tweetUsers,
  tweetUsersRelations,
  watchlist,
  watchlistRelations,
} from "./schemas/tweet";

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
  signalsTag,
  tweetInfo,
  tweetInfoRelations,
  tweetUsers,
  tweetUsersRelations,
  watchlist,
  watchlistRelations,
};
