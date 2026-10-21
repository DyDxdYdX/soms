# Project plan

## Goal

Build a responsive dashboard and order list for monitoring sales orders across branches. Use the [read-only sales orders API](API_DOCS.md) as the sole data source.

## Scope

- Dashboard: total orders, open/pending, completed, cancelled, and total order value.
- Order list: order number, customer, site, date, status, and amount.
- Search, site and status filters, and server-side pagination.
- Loading, empty, error, and retry states.
- Usable desktop and mobile layouts.

Order editing, a local database, and client-side copies of the full dataset are outside the current scope. Order details and sorting can follow the core view.

## Next steps

1. Confirm response field names, date and amount formats, and browser CORS behavior.
2. Add an API request layer and response types.
3. Build the dashboard and order list using one list response.
4. Add search, filters, pagination, and request states.
5. Check the layout on desktop and mobile; build and type-check the app.

## Verification

- [ ] Dashboard metrics match the global API summary.
- [ ] Search and filters change the list and result count without changing global cards.
- [ ] Pagination and filter resets work.
- [ ] Empty results and API errors display useful messages.
- [ ] Dates, amounts, and site/status labels match the API.
- [ ] The app works at its deployed URL on desktop and mobile.
