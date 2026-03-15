# Not JIRA

## Getting Started

1. Install [pnpm](https://pnpm.io/installation) and [docker](https://docs.docker.com/desktop/setup/install/mac-install/)
2. Run `pnpm install` && `pnpm exec playwright install`
3. Run `pnpx supabase start`. Take note the local URL and publish key and update. Make a copy of `.env.example`, save it as `.env.local`, and input the required values.
4. Run `pnpm run dev`
5. Access the website via `http://localhost:3000`

## Coding Standards

1. Use `pnpm run lint` to lint
2. Use `pnpm run format` to format
3. Use `pnpm run test` to run component tests
4. Use `pnpm run test:e2e` to run end-to-end tests.

### Running end-to-end tests against production build

To run end-to-end tests in an environment similar to production, you need to build the application locally:

1. Run `pnpm run build` to build the package
2. Run `pnpm run start` to start the production server
3. Run `pnpx supabase db reset` to make sure the DB is in a clean state

## Architecture

- Front-end: Next.js
- Back-end: Supabase
- Component Testing: Vitest
- E2E Testing: Playwright
