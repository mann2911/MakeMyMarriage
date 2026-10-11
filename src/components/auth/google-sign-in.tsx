"use client";

import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getSignInError } from "@/lib/auth-errors";

export function GoogleSignIn({ initialError }: { initialError: string | null }) {
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  async function signIn() {
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/app",
        errorCallbackURL: "/login",
      });
      if (result.error) {
        setError(getSignInError(result.error.status === 429 ? "RATE_LIMITED" : result.error.code || "unavailable"));
        setPending(false);
      }
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="sign-in-action">
      <button
        type="button"
        ref={button}
        className="google-button"
        onClick={signIn}
        disabled={pending}
        aria-busy={pending}
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.51 5.51 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.85Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.88l-3.87-3c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.79-2.11-6.74-4.96H1.27v3.09A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.26 14.32A7.2 7.2 0 0 1 4.88 12c0-.81.14-1.59.38-2.32V6.59H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.41l3.99-3.09Z" />
          <path fill="#EA4335" d="M12 4.72c1.76 0 3.33.61 4.58 1.8L20 3.1A11.48 11.48 0 0 0 12 0 12 12 0 0 0 1.27 6.59l3.99 3.09c.95-2.85 3.61-4.96 6.74-4.96Z" />
        </svg>
        {pending ? "Connecting to Google…" : "Continue with Google"}
      </button>
      <p className="sign-in-helper">For couples and their planning team.</p>
      <p className="sign-up-helper">
        New here? Your first Google sign-in creates your account.
      </p>
      {error && (
        <div className="sign-in-notice" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => { setError(null); button.current?.focus(); }}
            className="notice-dismiss"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
