# Sales orders API

## Connection

- Base URL: `https://hiring.harrisons.my/api/mock/sales-orders`
- Request header: `x-assessment-key: hssb-assessment-mock-2026`
- Alternative header: `Authorization: Bearer hssb-assessment-mock-2026`
- Methods: `GET` and `OPTIONS` only

| Request | Use |
| --- | --- |
| `GET /api/mock/sales-orders/meta` | Statuses, sites, and sorting options. |
| `GET /api/mock/sales-orders?page=1&pageSize=25` | Paginated orders and summary. |
| `GET /api/mock/sales-orders?status=Open%20order&site=B20&q=Siti` | Filtered orders. |
| `GET /api/mock/sales-orders/SO-MOCK-00001` | One order. |

List parameters: `page`, `pageSize` (maximum 100), `status`, `site` (`InventSiteId`), `q`, and optional `sort` and `order`. Use `/meta` for valid filter and sort options.

## Response behavior

The list response provides `summary`, `data`, `total`, and `totalPages`. The summary is global: site and status filters change the matching records and `total`, but not the summary. In the verified example, `status=Open order` and `site=B20` returned 54 matching records while `summary.total_orders` remained 1,200.

Use one list request for the dashboard and order list. Display `total` as the filtered result count and `totalPages` for pagination. Search and filters affect the listing; dashboard cards represent all branches.

| Dashboard metric | Calculation |
| --- | --- |
| Total orders | `summary.total_orders` |
| Open / pending | `summary.open_orders` |
| Completed | `summary.invoiced_orders + summary.delivered_orders` |
| Cancelled | `summary.cancelled_orders` |
| Total order value | `summary.total_order_value` |

“Completed” is a dashboard group; individual order statuses retain their API values. The API does not supply filtered status totals or filtered order value in the tested response, so the UI should not label global values as filtered values.

## Frontend behavior

Request a new list page when search, filters, sorting, or pagination changes. Reset to page 1 when search or filters change. Handle loading, empty results, and request errors. Direct browser access still needs CORS verification.
