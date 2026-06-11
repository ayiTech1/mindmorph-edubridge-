"use client";

import { useEffect, useRef } from "react";

interface CalEmbedProps {
  /** e.g. "mindmorph" — the Cal.com username/team. */
  user: string;
  /** e.g. "consultation" — the event-type slug under the user/team. */
  event: string;
  /** Optional theme — Cal supports "light" | "dark" | "auto". */
  theme?: "light" | "dark" | "auto";
}

declare global {
  interface Window {
    // Cal.com embed.js attaches a global `Cal` function.
    Cal?: ((...args: unknown[]) => void) & {
      ns?: Record<string, unknown>;
      loaded?: boolean;
    };
  }
}

/**
 * Inline Cal.com embed (spec §4.4 step 2).
 *
 * Uses the official embed.js loader without the React SDK to avoid pulling
 * an extra dependency. The widget initialises once per mount and tears down
 * cleanly if the host page reroutes.
 *
 * If `NEXT_PUBLIC_CALCOM_USER` isn't set, the calling page should render the
 * placeholder dropbox instead of mounting this component.
 */
export function CalEmbed({ user, event, theme = "light" }: CalEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the loader once (idempotent — Cal sets `loaded` itself).
    const existing = document.getElementById("cal-embed-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "cal-embed-script";
      script.type = "text/javascript";
      script.text = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`;
      document.body.appendChild(script);
    }

    // Initialise inline embed in our container.
    const Cal = window.Cal;
    const node = ref.current;
    if (!Cal || !node) return;
    Cal("init", { origin: "https://cal.com" });
    Cal("inline", {
      elementOrSelector: node,
      calLink: `${user}/${event}`,
      layout: "month_view"
    });
    Cal("ui", {
      hideEventTypeDetails: false,
      theme,
      styles: { branding: { brandColor: "#0C447C" } }
    });

    return () => {
      // Cal.com doesn't expose a teardown — clear the container so the next
      // mount renders fresh.
      node.innerHTML = "";
    };
  }, [user, event, theme]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Consultation calendar"
      className="min-h-[640px] bg-white rounded-lg overflow-hidden"
    />
  );
}
