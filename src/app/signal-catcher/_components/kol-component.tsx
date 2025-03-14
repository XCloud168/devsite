"use client";

import { KolBanner, KolMenu } from "./kol-banner";
import { KolList } from "./kol-list";
import { useState } from "react";

export function KolComponent() {
  const [kolMenu, setKolMenu] = useState<KolMenu>({
    label: "CRYPTO速递",
    value: "1",
  });
  return (
    <>
      <KolBanner onKolMenuChange={(menu: KolMenu) => setKolMenu(menu)} />
      <KolList menu={kolMenu} />
    </>
  );
}
