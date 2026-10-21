# Project plan

## Goal

Build a responsive dashboard and order list for monitoring sales orders across branches. Use the [sales orders API](API_DOCS.md) as the sole data source.

## Current status (21 October 2026)

The frontend is implemented. It uses the live API for the global dashboard summary, paginated orders, filter options, and individual order details. The layout uses Tailwind and has a compact header rather than a sidebar. The route, API layer, metrics, filters, results, and detail drawer are separated into readable components.

## Scope

- Dashboard: total orders, open/pending, completed, cancelled, and total order value.
- Order list: order number, customer, site, date, status, and amount.
- Search, site and status filters, and server-side pagination.
- Loading, empty, error, and retry states.
- Usable desktop and mobile layouts.

Order editing, a local database, and client-side copies of the full dataset are outside the current scope. An order detail drawer is implemented. The list requests newest orders first; a user-controlled sort is not in scope yet.

## Completed

- Confirmed response fields, sample date and amount formats, metadata facets, order details, and browser CORS behavior against the live API.
- Added an API request layer and response types. The dashboard and list use the same list response; summary cards represent all branches while the result count reflects the current query.
- Added debounced search, site and status filters, server-side pagination, refresh, and loading, empty, error, and retry states.
- Built desktop table and compact card layouts, plus an order detail drawer.
- Reviewed the desktop and compact layouts in the browser. The user confirmed that the filters, pagination, empty and error states, and responsive layouts function well. Production build and TypeScript check pass with `npm run check-types -w web`.

## Verification

- [x] Dashboard metrics match the global API summary.
- [x] Search changes the list and matching result count.
- [x] Site and status filters change the list and result count without changing global cards (user verified).
- [x] Pagination and filter resets work in the browser (user verified).
- [x] Empty results and API errors display useful messages in the browser (user verified).
- [x] Sample dates, amounts, and site/status labels match the API.
- [x] Responsive layout works on desktop and mobile (user verified).
- [x] Production build and TypeScript check pass.
- [x] The deployed app loads dashboard metrics, orders, and order details in a desktop browser.
- [x] The deployed app was checked on an iPhone (user verified).
