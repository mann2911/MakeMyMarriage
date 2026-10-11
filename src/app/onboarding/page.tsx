import { redirect } from "next/navigation";

// Keep old bookmarks and in-flight OAuth callbacks working.
export default function OnboardingPage() {
  redirect("/app");
}
