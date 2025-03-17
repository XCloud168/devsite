"use client";

import { type KolMenu } from "@/app/signal-catcher/_components/kol-banner";
import { KolPanel3 } from "@/app/signal-catcher/_components/kolPanel3";
import { KolPanel2 } from "@/app/signal-catcher/_components/kolPanel2";
import { KolPanel1 } from "@/app/signal-catcher/_components/kolPanel1";
interface Props {
  menu: KolMenu;
}
export function KolList(props: Props) {
  if (props.menu.value === "1") {
    return <KolPanel1></KolPanel1>;
  } else if (props.menu.value === "2") {
    return <KolPanel2></KolPanel2>;
  }
  return <KolPanel3></KolPanel3>;
}
