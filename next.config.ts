import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Every page is statically prerendered, so nonces aren't an option (they force
// dynamic rendering). 'unsafe-inline' covers Next's inline RSC payload scripts
// and React style={} attributes. Dev mode also needs 'unsafe-eval'.
// object-src and frame-ancestors allow 'self' for the resume's embedded PDF:
// Chrome renders an <object> PDF as a frame, so 'none'/DENY would block it.
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  // Report-only for now: violations are logged to the browser console, nothing is blocked
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  // Enforced clickjacking protection while frame-ancestors is report-only
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
