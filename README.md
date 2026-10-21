# Sales Order Monitoring

A responsive web app for monitoring sales orders across branches. The dashboard shows overall order metrics; the order list supports search, filters, and pagination.

## Status

The frontend uses the sales orders API for dashboard metrics, order listings, filter options, and order details.

## Run locally

```bash
npm install
cp apps/web/.env.example apps/web/.env
# Fill in apps/web/.env using the API settings in docs/API_DOCS.md.
npm run dev:web
```

Open <http://localhost:3001>. Other root commands: `npm run build` and `npm run check-types`.

Set `SALES_ORDERS_API_URL` and `SALES_ORDERS_API_KEY` in the hosting provider before building. Both values are included in the browser bundle.

## Architecture

The frontend uses React, TypeScript, Vite, and TanStack Router in `apps/web`. Shared components live in `packages/ui`.

Order data comes from the read-only [sales orders API](docs/API_DOCS.md). A list request supplies both the global dashboard summary and the filtered, paginated order records. The frontend uses the API for search and filters; it does not keep a separate order database or embed the dataset.

See the [project plan](docs/PROJECT_PLAN.md) for remaining work.
