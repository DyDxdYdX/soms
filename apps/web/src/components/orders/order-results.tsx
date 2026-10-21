import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  formatDate,
  formatMoney,
  PAGE_SIZE,
  type Order,
  type OrderList,
} from "@/lib/sales-orders";
import { StatusBadge } from "./status-badge";

const count = new Intl.NumberFormat("en-MY");

type Props = {
  list: OrderList | null;
  loading: boolean;
  error: string;
  hasFilters: boolean;
  page: number;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onSelectOrder: (order: Order) => void;
};

export function OrderResults({
  list,
  loading,
  error,
  hasFilters,
  page,
  onClearFilters,
  onPageChange,
  onSelectOrder,
}: Props) {
  if (loading && !list) {
    return (
      <div className="space-y-3 p-6" aria-label="Loading orders">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-lg bg-[#f2f5ef]"
          />
        ))}
      </div>
    );
  }

  if (!list || (error && !loading)) {
    return (
      <div className="px-6 py-20 text-center text-sm text-[#819084]">
        Orders are unavailable right now.
      </div>
    );
  }

  if (list.data.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#edf4e9] text-[#699071]">
          <Search size={25} />
        </div>
        <h3 className="mt-4 text-lg font-bold">No matching orders</h3>
        <p className="mt-1 text-sm text-[#849287]">
          Try a different search or clear your filters.
        </p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 text-sm font-bold text-[#3e7852] underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const totalPages = list.totalPages;
  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, list.total);
  const pageNumbers = [
    ...new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (item) => item >= 1 && item <= totalPages,
      ),
    ),
  ];

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-[#f7f9f5] text-[10px] font-bold uppercase tracking-[.13em] text-[#88998b]">
            <tr>
              <th className="px-7 py-4">Order number</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Branch</th>
              <th className="px-4 py-4">Order date</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Amount (MYR)</th>
              <th className="px-7 py-4 text-right"> </th>
            </tr>
          </thead>
          <tbody>
            {list.data.map((order) => (
              <tr
                key={order.id}
                className="group border-t border-[#eef1eb] transition hover:bg-[#fafcf8]"
              >
                <td className="px-7 py-4">
                  <button
                    onClick={() => onSelectOrder(order)}
                    className="font-mono text-xs font-bold text-[#347a51] hover:underline"
                  >
                    {order.id}
                  </button>
                </td>
                <td className="max-w-[240px] truncate px-4 py-4 text-sm font-semibold text-[#2c4234]">
                  {order.customer}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-[#edf3ed] px-2 py-1 font-mono text-xs font-bold text-[#5c7965]">
                    {order.site}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-[#6f8174]">
                  {formatDate(order.date)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm font-semibold tabular-nums">
                  {formatMoney(order.amount)}
                </td>
                <td className="px-7 py-4 text-right">
                  <button
                    aria-label={`View ${order.id}`}
                    onClick={() => onSelectOrder(order)}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-[#7b9980] hover:bg-[#e8f1e6] hover:text-[#386c49]"
                  >
                    <ArrowRight size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#edf0e8] md:hidden">
        {list.data.map((order) => (
          <button
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="w-full p-5 text-left transition hover:bg-[#fafcf8]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-xs font-bold text-[#347a51]">
                  {order.id}
                </div>
                <div className="mt-1 text-sm font-bold text-[#2e4436]">
                  {order.customer}
                </div>
              </div>
              <ArrowRight size={17} className="mt-1 shrink-0 text-[#8da592]" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#7b8c7e]">
                <span className="font-mono font-bold">{order.site}</span>
                <span>·</span>
                {formatDate(order.date)}
              </div>
              <div className="font-mono text-sm font-bold tabular-nums">
                {formatMoney(order.amount)}
              </div>
            </div>
            <div className="mt-3">
              <StatusBadge status={order.status} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e9eee7] px-5 py-4 sm:px-7">
        <p className="text-xs text-[#829186]">
          Showing{" "}
          <strong className="text-[#395744]">
            {count.format(firstItem)}–{count.format(lastItem)}
          </strong>{" "}
          of{" "}
          <strong className="text-[#395744]">{count.format(list.total)}</strong>{" "}
          orders
        </p>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            disabled={page === 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="flex size-9 items-center justify-center rounded-lg text-[#6e8574] hover:bg-[#edf4e9] disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          {pageNumbers.map((item, index) => (
            <div key={item} className="flex items-center gap-1">
              {index > 0 && item - pageNumbers[index - 1] > 1 && (
                <span className="px-1 text-[#9dac9e]">…</span>
              )}
              <button
                aria-label={`Page ${item}`}
                aria-current={page === item ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`size-9 rounded-lg text-xs font-bold ${page === item ? "bg-[#275a3d] text-white" : "text-[#6e8574] hover:bg-[#edf4e9]"}`}
              >
                {item}
              </button>
            </div>
          ))}
          <button
            aria-label="Next page"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="flex size-9 items-center justify-center rounded-lg text-[#6e8574] hover:bg-[#edf4e9] disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
