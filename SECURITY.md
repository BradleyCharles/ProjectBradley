# Security Policy

## Reporting a vulnerability

If you find a security issue in this site, please email the address in the Contact section of the site rather than opening a public issue. Include steps to reproduce and the affected URL. I aim to acknowledge reports within a few days.

## Scope

This is a static-first Next.js portfolio with no user accounts and no database. In scope: the deployed site, its response headers (including the enforced Content Security Policy) and this repository's dependencies.

## Practices

- Dependencies are monitored by Dependabot and checked with `npm audit` in CI.
- Responses carry a baseline set of security headers and an enforced CSP (see `next.config.ts`).
