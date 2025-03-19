import { redirect } from "next/navigation";

export default function Home() {
  redirect("/signal-catcher");
  return null;
}
