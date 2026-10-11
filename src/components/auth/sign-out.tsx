"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOut({ className = "sign-in-action", buttonClassName = "google-button" }: {
  className?: string;
  buttonClassName?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function signOut() {
    if (pending) return;
    setPending(true);
    setError(false);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign-out failed");
      // Start a fresh document request after revocation, clearing the client router cache.
      window.location.replace("/login");
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className={className}>
      <button type="button" className={buttonClassName} onClick={signOut} disabled={pending} aria-busy={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p className="sign-in-notice" role="alert">We couldn’t sign you out. Please try again.</p>}
    </div>
  );
}
