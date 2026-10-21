# Sales Order Monitoring

A responsive web app for monitoring sales orders across branches. The dashboard shows overall order metrics; the order list supports search, filters, and pagination.

## Status

The repository currently contains the frontend scaffold. The dashboard and API integration are planned but not yet implemented.

## Run locally

```bash
npm install
npm run dev:web
```

Open <http://localhost:3001>. Other root commands: `npm run build` and `npm run check-types`.

## Architecture

The frontend uses React, TypeScript, Vite, and TanStack Router in `apps/web`. Shared components live in `packages/ui`.

Order data comes from the read-only [sales orders API](docs/API_DOCS.md). A list request supplies both the global dashboard summary and the filtered, paginated order records. The frontend uses the API for search and filters; it does not keep a separate order database or embed the dataset.

See the [project plan](docs/PROJECT_PLAN.md) for remaining work.
