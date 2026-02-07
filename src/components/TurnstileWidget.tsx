"use client";

import Script from "next/script";

export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  // Cloudflare Turnstile injects a hidden field named `cf-turnstile-response` into the form.
  return (
    <div className="space-y-2">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="auto"
      />
      <p className="text-xs text-slate-500 dark:text-slate-500">
        Spam védelem (Cloudflare Turnstile)
      </p>
    </div>
  );
}
