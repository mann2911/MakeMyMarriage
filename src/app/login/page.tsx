import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { WeddingArtwork } from "@/components/auth/wedding-artwork";
import { getSignInError } from "@/lib/auth-errors";
import { getWorkspaceSession } from "@/lib/workspace-session";

export const metadata: Metadata = {
  title: "Sign in · MakeMyMarriage",
  description: "Bring your wedding plans, people, and celebrations together with MakeMyMarriage.",
};

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const params = await searchParams;
  let initialError = getSignInError(typeof params.error === "string" ? params.error : undefined);
  let session;
  try {
    session = await getWorkspaceSession();
  } catch {
    initialError = "Sign-in is temporarily unavailable. Please try again.";
  }
  if (session?.user.emailVerified) redirect("/app");
  return (
    <main className="login-page">
      <div className="login-card">
        <section className="brand-panel" aria-label="MakeMyMarriage">
          <div className="brand-lockup">
            <svg width="43" height="31" viewBox="0 0 128 88" fill="none" aria-hidden="true">
              <path d="M12 70V26c0-8 10-12 16-6l17 22 17-22c6-6 16-2 16 6v44" stroke="#695078" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M45 70V26c0-8 10-12 16-6l17 22 17-22c6-6 16-2 16 6v44" stroke="#9375A3" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="61.5" cy="38" r="4.5" fill="#695078" />
            </svg>
            <div>
              <p className="brand-name">MakeMy<span>Marriage</span></p>
              <p className="brand-description">Wedding planning</p>
            </div>
          </div>
          <div className="artwork-frame"><WeddingArtwork /></div>
          <div className="brand-story">
            <p className="brand-quote">Every family, every celebration,<br />beautifully brought together.</p>
            <p>A little planning. A lot of love.</p>
          </div>
        </section>

        <section className="sign-in-panel" aria-labelledby="sign-in-heading">
          <div className="sign-in-content">
            <p className="eyebrow"><span aria-hidden="true" />Your wedding, together</p>
            <h1 id="sign-in-heading">Your wedding,<br className="desktop-line-break" /> beautifully organised.</h1>
            <p className="sign-in-description">Bring your plans, people, and celebrations together.</p>
            <GoogleSignIn initialError={initialError} />
            <div className="workspace-note">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3 7 3v5c0 4.5-3.1 7.7-7 10-3.9-2.3-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" />
              </svg>
              <div><p>One wedding. Your whole planning team.</p><span>Each Google account belongs to one wedding.</span></div>
            </div>
          </div>
          <p className="sign-in-footer">Made for the moments that matter.</p>
        </section>
      </div>
    </main>
  );
}
