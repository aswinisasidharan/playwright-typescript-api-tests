# Playwright + TypeScript API Test Framework

Automated API testing framework built with [Playwright](https://playwright.dev/) and TypeScript. It demonstrates **smoke**, **end-to-end**, and **destructive (negative)** testing against a REST API, organised with a maintainable service-object architecture and wired into GitHub Actions CI.

The suite runs against the public [Restful-Booker](https://restful-booker.herokuapp.com/) API — a free, real REST service with authentication and full CRUD — so the tests exercise genuine network behaviour, tokens, and status codes.

## Tech stack

| Purpose                  | Tool                                                     |
| ------------------------ | -------------------------------------------------------- |
| Test runner & assertions | Playwright Test (`@playwright/test`)                     |
| Language                 | TypeScript                                               |
| HTTP layer               | Playwright `request` / `APIRequestContext` (no browser)  |
| CI                       | GitHub Actions                                           |

## What this framework demonstrates

- **API automation in TypeScript** using Playwright's `request` context (browserless, fast).
- **Smoke vs. End-to-End separation** via test tags, run independently in CI.
- **Destructive / negative testing** — auth failures, malformed payloads, invalid IDs.
- **Service-object architecture** — the API equivalent of the Page Object Model.
- **Custom Playwright fixtures** for dependency injection of clients and auth tokens.
- **Test-data builder** for readable, low-duplication test setup.
- **CI deploy-gate pattern** — smoke tests must pass before the full suite runs.

## Project structure

```
playwright-typescript-api-tests/
├── .github/workflows/ci.yml       # Smoke gate → full suite, report artifact
├── src/
│   ├── clients/                   # Service objects (one per API resource)
│   │   ├── auth.client.ts
│   │   └── booking.client.ts
│   ├── models/
│   │   └── booking.model.ts       # TypeScript interfaces = the API contract
│   ├── fixtures/
│   │   └── api.fixtures.ts         # Custom fixtures inject clients + token
│   └── utils/
│       └── booking.builder.ts      # Test-data builder with sensible defaults
├── tests/
│   ├── smoke.spec.ts               # @smoke — fast critical-path checks
│   ├── booking.crud.spec.ts        # @e2e — each CRUD op in isolation
│   ├── booking.e2e.spec.ts         # @e2e — full create→read→update→delete
│   └── booking.negative.spec.ts    # @negative — destructive testing
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

### Prerequisites

- Node.js 18+ (20 LTS recommended)

### Install

```bash
npm install
```

> API tests use Playwright's `request` context and never launch a browser, so `npx playwright install` is **not** required.

### Run the tests

```bash
npm test              # everything
npm run test:smoke    # @smoke only
npm run test:e2e      # @e2e only
npm run test:negative # @negative only
npm run report        # open the last HTML report
npm run typecheck     # tsc --noEmit, no tests run
```

Point the suite at a different environment with an env var:

```bash
BASE_URL=https://your-api.example.com npm run test:smoke
```

## Test suites

### Smoke (`@smoke`)

The critical-path check that answers "is the API up?" — health endpoint, list endpoint returns a valid array, auth issues a token. Fast and stable; the kind of suite you gate a deployment on.

### End-to-end (`@e2e`)

CRUD verified both in isolation (`booking.crud.spec.ts`) and as one continuous lifecycle (`booking.e2e.spec.ts`): create a booking, read it back, update it with an authenticated request, delete it, and confirm it's gone.

### Negative / destructive (`@negative`)

Deliberate misuse, asserting the API fails safely: reading a non-existent booking (404), writing without a valid token (403), malformed payloads, and non-numeric IDs that must never crash the server (no 5xx).

## Architecture notes

**Service objects (`src/clients`)** encapsulate each API resource. A client owns the endpoint URLs, payload shapes, and auth wiring, and returns the raw `APIResponse` so each test stays in control of its own assertions. This is the API analogue of the Page Object Model: tests describe _intent_, clients handle _transport_.

**Custom fixtures (`src/fixtures/api.fixtures.ts`)** extend Playwright's base `test` to inject ready-to-use clients and a fresh auth token per test. The `authToken` fixture depends on `authClient`, and Playwright resolves that dependency graph automatically — so a test just declares what it needs.

**Test-data builder (`src/utils/booking.builder.ts`)** returns a valid booking with sensible defaults and accepts overrides, so a test only specifies the fields it actually cares about.

**Config (`playwright.config.ts`)** sets the `baseURL`, default JSON headers, retries and parallelism on CI, trace capture on retry, and an HTML report. Suites are separated by tag rather than by browser project, since no browser is involved.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. **Smoke job** installs dependencies and runs `@smoke`.
2. **Full-suite job** runs only after smoke passes (`needs: smoke`) — a deploy-gate pattern — then uploads the HTML report as an artifact.

> The workflow uses `npm ci`, which requires a committed `package-lock.json`. Run `npm install` once locally and commit the generated lock file before pushing.

## Notes on the target API

Restful-Booker is a free sandbox and can be slow to spin up or intermittently flaky, which is why CI runs with retries. Some endpoints return non-obvious status codes by design (e.g. `/ping` and a successful `DELETE` both return `201`); the tests document these explicitly. If you point the suite at a different API, review the expected status codes against that API's actual contract.
