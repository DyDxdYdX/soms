import {
  ClipboardList,
  FilterX,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  type Order,
  type OrderList as OrderListData,
  type OrderMeta,
} from "@/lib/sales-orders";
import { OrderResults } from "./order-results";

const count = new Intl.NumberFormat("en-MY");

type Props = {
  list: OrderListData | null;
  meta: OrderMeta;
  loading: boolean;
  error: string;
  searchInput: string;
  site: string;
  status: string;
  page: number;
  onSearchChange: (value: string) => void;
  onSiteChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onSelectOrder: (order: Order) => void;
};

export function OrderList({
  list,
  meta,
  loading,
  error,
  searchInput,
  site,
  status,
  page,
  onSearchChange,
  onSiteChange,
  onStatusChange,
  onClearFilters,
  onPageChange,
  onSelectOrder,
}: Props) {
  const hasFilters = Boolean(searchInput || site || status);

  return (
    <section
      id="sales-orders"
      className="mt-7 scroll-mt-5 overflow-hidden rounded-[22px] border border-[#e1e7dc] bg-white shadow-[0_10px_35px_-24px_#29433155]"
    >
      <div className="border-b border-[#edf0e9] px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#eaf1e6] text-[#3d6f50]">
                <ClipboardList size={18} />
              </span>
              <h2 className="text-xl font-bold tracking-tight">Sales orders</h2>
            </div>
            <p className="mt-2 text-sm text-[#849287]">
              Browse and track orders across your network.
            </p>
          </div>
          <div className="rounded-lg bg-[#f1f4ed] px-3 py-2 text-xs font-semibold text-[#597062]">
            {loading && !list
              ? "Loading records"
              : `${count.format(list?.total ?? 0)} matching records`}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d90]"
            />
            <span className="sr-only">Search orders</span>
            <input
              value={searchInput}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search order, customer, reference..."
              className="h-11 w-full rounded-xl border border-[#dfe7dd] bg-[#fbfcf9] pl-11 pr-4 text-sm text-[#254131] outline-none transition placeholder:text-[#9daa9e] focus:border-[#80a686] focus:ring-3 focus:ring-[#d9e9d7]"
            />
          </label>
          <div className="flex gap-3">
            <label className="relative flex min-w-0 flex-1 items-center lg:w-44 lg:flex-none">
              <MapPin
                size={15}
                className="pointer-events-none absolute left-3 text-[#789180]"
              />
              <span className="sr-only">Filter by branch</span>
              <select
                value={site}
                onChange={(event) => onSiteChange(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#dfe7dd] bg-white pl-9 pr-7 text-sm font-medium text-[#3d5948] outline-none focus:border-[#80a686]"
              >
                <option value="">All branches</option>
                {meta.sites.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative flex min-w-0 flex-1 items-center lg:w-44 lg:flex-none">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3 text-[#789180]"
              />
              <span className="sr-only">Filter by status</span>
              <select
                value={status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#dfe7dd] bg-white pl-9 pr-7 text-sm font-medium text-[#3d5948] outline-none focus:border-[#80a686]"
              >
                <option value="">All statuses</option>
                {meta.statuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold text-[#64846b] hover:bg-[#f3f7f1]"
            >
              <FilterX size={16} /> Clear
            </button>
          )}
        </div>
      </div>
      <OrderResults
        list={list}
        loading={loading}
        error={error}
        hasFilters={hasFilters}
        page={page}
        onClearFilters={onClearFilters}
        onPageChange={onPageChange}
        onSelectOrder={onSelectOrder}
      />
    </section>
  );
}
