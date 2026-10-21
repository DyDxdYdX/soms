import { ENV } from "@/env";

const BASE_URL = ENV.SALES_ORDERS_API_URL.replace(/\/$/, "");
const API_KEY = ENV.SALES_ORDERS_API_KEY;
export const PAGE_SIZE = 10;

type ApiRecord = Record<string, unknown>;

export type Summary = {
  totalOrders: number;
  openOrders: number;
  invoicedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalOrderValue: number;
};

export type Order = {
  id: string;
  customer: string;
  site: string;
  date: string;
  status: string;
  amount: number;
  raw: ApiRecord;
};

export type OrderList = {
  data: Order[];
  summary: Summary;
  total: number;
  totalPages: number;
};

export type FilterOption = { value: string; label: string };
export type OrderMeta = { statuses: FilterOption[]; sites: FilterOption[] };

const asRecord = (value: unknown): ApiRecord =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : {};

const asText = (value: unknown, fallback = "—"): string =>
  value === undefined || value === null || value === ""
    ? fallback
    : String(value);

const asNumber = (value: unknown): number => {
  const parsed = Number(
    typeof value === "string" ? value.replace(/,/g, "") : value,
  );
  return Number.isFinite(parsed) ? parsed : 0;
};

export function field(record: ApiRecord, key: string): string {
  return asText(record[key]);
}

export function numericField(record: ApiRecord, key: string): number | null {
  const value = record[key];
  return value === undefined || value === null || value === ""
    ? null
    : asNumber(value);
}

function normalizeOrder(value: unknown): Order {
  const raw = asRecord(value);
  return {
    id: field(raw, "SalesId"),
    customer: field(raw, "SalesName"),
    site: field(raw, "InventSiteId"),
    date: field(raw, "CreatedDateTime1"),
    status: field(raw, "SalesStatus"),
    amount: asNumber(raw.HAR_TotalSOAmount),
    raw,
  };
}

async function request(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-assessment-key": API_KEY },
    signal,
  });
  if (!response.ok)
    throw new Error(`The sales orders service returned ${response.status}.`);
  return response.json();
}

export async function fetchOrders(
  params: {
    page: number;
    pageSize: number;
    q: string;
    site: string;
    status: string;
  },
  signal?: AbortSignal,
): Promise<OrderList> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  query.set("sort", "CreatedDateTime1");
  query.set("order", "desc");
  if (params.q.trim()) query.set("q", params.q.trim());
  if (params.site) query.set("site", params.site);
  if (params.status) query.set("status", params.status);

  const payload = asRecord(await request(`?${query}`, signal));
  if (!Array.isArray(payload.data))
    throw new Error(
      "The sales orders response was not in the expected format.",
    );
  const summary = asRecord(payload.summary);

  return {
    data: payload.data.map(normalizeOrder),
    total: asNumber(payload.total),
    totalPages: Math.max(1, asNumber(payload.totalPages)),
    summary: {
      totalOrders: asNumber(summary.total_orders),
      openOrders: asNumber(summary.open_orders),
      invoicedOrders: asNumber(summary.invoiced_orders),
      deliveredOrders: asNumber(summary.delivered_orders),
      cancelledOrders: asNumber(summary.cancelled_orders),
      totalOrderValue: asNumber(summary.total_order_value),
    },
  };
}

function options(value: unknown): FilterOption[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      const optionValue = asText(record.value, "");
      return { value: optionValue, label: optionValue };
    })
    .filter((item) => item.value);
}

export async function fetchMeta(signal?: AbortSignal): Promise<OrderMeta> {
  const payload = asRecord(await request("/meta", signal));
  const facets = asRecord(payload.facets);
  return {
    statuses: options(facets.statuses),
    sites: options(facets.sites),
  };
}

export async function fetchOrderDetail(
  id: string,
  signal?: AbortSignal,
): Promise<Order> {
  const payload = asRecord(await request(`/${encodeURIComponent(id)}`, signal));
  if (!payload.data)
    throw new Error("The order detail response was incomplete.");
  return normalizeOrder(payload.data);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string): string {
  if (value === "—") return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-MY", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}
