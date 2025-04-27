"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Clock() {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeParts = {
    year: time.format("YYYY"),
    month: time.format("MM"),
    day: time.format("DD"),
    hour: time.format("HH"),
    minute: time.format("mm"),
    second: time.format("ss"),
  };

  const labelStyle =
    "py-1 px-2 bg-black/20 dark:bg-[#18191A] rounded-lg dark:text-white text-black";

  return (
    <div className="flex items-center justify-center gap-1 text-center font-mono">
      <span className={labelStyle}>{timeParts.year}</span>-
      <span className={labelStyle}>{timeParts.month}</span>-
      <span className={labelStyle}>{timeParts.day}</span>&nbsp;
      <span className={labelStyle}>{timeParts.hour}</span>:
      <span className={labelStyle}>{timeParts.minute}</span>:
      <span className={labelStyle}>{timeParts.second}</span>
    </div>
  );
}
