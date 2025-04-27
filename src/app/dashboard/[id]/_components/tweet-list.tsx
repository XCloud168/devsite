import dayjs from "dayjs";
import TranslationComponent from "@/components/translation-component";
import React from "react";
import { type TweetItem } from "@/app/dashboard/[id]/_components/detail-component";
interface Props {
  userTweet: TweetItem[];
}
export function TweetList({ userTweet }: Props) {
  return userTweet.map((tweet) => (
    <div key={tweet.id} className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-[#FFB41D] dark:text-[#FFFFA7]">
          {dayjs(tweet.tweetCreatedAt).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>
      <div className="rounded-lg bg-[#4949493a] p-3">
        <TranslationComponent content={tweet.content ?? ""} />
      </div>
    </div>
  ));
}
