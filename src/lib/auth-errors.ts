export function getSignInError(error?: string) {
  if (!error) return null;
  if (error === "access_denied") return "Sign-in was cancelled. You can try again.";
  if (error === "email_not_verified") return "Please use a Google account with a verified email address.";
  if (error === "AUTH_NOT_CONFIGURED") return "Google sign-in is not configured yet. Please try again later.";
  if (error === "RATE_LIMITED") return "Too many sign-in attempts. Please wait a minute and try again.";
  return "We couldn’t sign you in. Please try again.";
}
