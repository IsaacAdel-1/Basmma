"use client";

import { useEffect } from "react";

let sent = false; // guards React strict-mode double invoke

export default function Tracker() {
  useEffect(() => {
    if (sent) return;
    sent = true;
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || "",
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
