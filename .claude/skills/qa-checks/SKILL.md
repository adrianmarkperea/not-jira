---
name: qa-checks
description: This skill should be used when the user asks to "run checks", "run QA", "run quality checks", "verify the build", or after completing a feature change. Runs lint, formatting, unit tests, and end-to-end tests to verify code quality.
version: 1.0.0
---

# QA Checks

Run all quality checks after every feature change: lint, formatting, unit tests, build, and end-to-end tests.

## Assumptions

- The dev server must be running before E2E tests can execute. The default port is `3000`. If the user specifies a different port, use that instead.

Before running any checks, verify the server is reachable on the expected port:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>
```

If the response is not `200`, stop immediately and tell the user the dev server does not appear to be running on port `<port>`, then ask them to start it with `pnpm dev` before proceeding.

## Steps

Run lint and unit tests in parallel, then format, then build, then E2E tests:

```bash
pnpm lint
pnpm test
pnpm format
pnpm build
pnpm test:e2e
```

Run lint and unit tests together in parallel since they are independent. Run format after — Prettier may reformat files that affect subsequent steps. Run build after format to catch TypeScript errors on the formatted code. Run E2E tests last.

## Interpreting Results

- **Lint:** Errors are blocking. Warnings are acceptable but note them to the user.
- **Format:** If Prettier rewrites files, report which files changed.
- **Unit tests:** All must pass. Any failure is blocking.
- **Build:** Must succeed with no TypeScript errors. Any failure is blocking.
- **E2E tests:** All must pass. Any failure is blocking.

Report a concise summary of all five results to the user.
