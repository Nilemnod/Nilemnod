# Security Policy

We take the security of Nilemnod and our users seriously. If you believe you
have found a security vulnerability, please report it to us as described below.

## Scope

This policy covers:

- The website **[nilemnod.com](https://nilemnod.com)** and the source code in
  this repository.
- Mobile apps published by Nilemnod for iOS and Android (for example,
  **Autophy**).

Out of scope:

- Third-party services we rely on (e.g. GitHub Pages, Formspree, Apple App
  Store, Google Play). Please report issues in those services directly to
  their vendors.
- Findings from automated scanners without a demonstrated, practical impact.
- Missing security headers or best-practice recommendations without a
  concrete exploit.
- Social engineering, phishing, or physical attacks.
- Denial-of-service (DoS/DDoS) or volumetric attacks.

## Supported Versions

| Component             | Supported                          |
| --------------------- | ---------------------------------- |
| nilemnod.com website  | :white_check_mark: current version |
| Mobile apps           | :white_check_mark: latest release  |
| Older app releases    | :x: please update first            |

Before reporting an issue in a mobile app, please check that it is still
reproducible in the latest version available in the App Store or Google Play.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
pull requests, or discussions.**

Use one of the following private channels:

1. **GitHub** — open a private report via
   [Security → Report a vulnerability](../../security/advisories/new)
   in this repository.
2. **Email** — send a message to
   [support@nilemnod.com](mailto:support@nilemnod.com) with the subject line
   starting with `[SECURITY]`.

Please include as much of the following as you can:

- Affected component (website page, app name, platform, and version).
- Type of issue (e.g. XSS, data exposure, authentication bypass).
- Step-by-step instructions to reproduce the issue.
- Proof of concept, screenshots, or logs, if available.
- The potential impact and how an attacker could exploit it.

Reports in English or Russian are welcome.

## What to Expect

| Stage                         | Target timeframe              |
| ----------------------------- | ----------------------------- |
| Acknowledgement of the report | within **3 business days**    |
| Initial assessment            | within **10 business days**   |
| Status updates                | at least **every 14 days**    |
| Fix for confirmed issues      | depends on severity, typically within **90 days** |

- **If the report is accepted**, we will work on a fix, keep you informed of
  progress, and let you know when it has been released. With your permission,
  we will credit you for the discovery.
- **If the report is declined**, we will explain why (for example, it is out
  of scope or not reproducible).

We do not currently run a paid bug bounty program.

## Coordinated Disclosure

We ask that you give us a reasonable amount of time to investigate and fix
the issue before disclosing it publicly. We are happy to coordinate a
disclosure date with you once a fix is available.

## Safe Harbor

We will not pursue legal action against researchers who, in good faith:

- Follow this policy and report vulnerabilities privately.
- Avoid privacy violations, data destruction, and service disruption.
- Access only the minimum data needed to demonstrate the issue, and do not
  keep, share, or misuse any user data they encounter.
- Do not exploit the vulnerability beyond what is necessary to confirm it.

Thank you for helping keep Nilemnod and its users safe.
