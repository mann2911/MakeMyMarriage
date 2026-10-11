import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard";
import { getWorkspaceSession } from "@/lib/workspace-session";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Owner dashboard preview · MakeMyMarriage",
  description: "Preview the MakeMyMarriage owner planning dashboard with fictional wedding data.",
  robots: { index: false, follow: false },
};

// Authentication protects the page; its fictional data grants no wedding permissions.
export default async function DashboardPreviewPage() {
  let session;
  try {
    session = await getWorkspaceSession();
  } catch {
    redirect("/login?error=unavailable");
  }
  if (!session?.user.emailVerified) redirect("/login");

  return <OwnerDashboard displayName={session.user.name} />;
}
