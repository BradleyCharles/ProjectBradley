"use client";

import { useEffect, useState } from "react";

// Email stored as char codes — prevents regex scrapers from harvesting
// 'bradgcharles@gmail.com'.split('').map(c => c.charCodeAt(0))
const ENCODED = [98,114,97,100,103,99,104,97,114,108,101,115,64,103,109,97,105,108,46,99,111,109];

export default function ObfuscatedEmail({ className }: { className?: string }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(ENCODED.map((c) => String.fromCharCode(c)).join(""));
  }, []);

  return (
    <a href={email ? `mailto:${email}` : "#"} className={className}>
      {email || "\u00A0"}
    </a>
  );
}
