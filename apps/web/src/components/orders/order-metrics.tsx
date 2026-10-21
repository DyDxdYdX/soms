import {
  ArrowUpRight,
  ClipboardList,
  Clock3,
  PackageCheck,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatMoney, type Summary } from "@/lib/sales-orders";

const count = new Intl.NumberFormat("en-MY");

export function OrderMetrics({
  summary,
  loading,
}: {
  summary: Summary | null;
  loading: boolean;
}) {
  const completed =
    (summary?.invoicedOrders ?? 0) + (summary?.deliveredOrders ?? 0);
  return (
    <section
      aria-label="Order statistics"
      className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      <Metric
        label="Total orders"
        value={summary ? count.format(summary.totalOrders) : "—"}
        note="Across all branches"
        icon={<ClipboardList size={19} />}
        tone="green"
        loading={loading}
      />
      <Metric
        label="Open orders"
        value={summary ? count.format(summary.openOrders) : "—"}
        note="Awaiting fulfillment"
        icon={<Clock3 size={19} />}
        tone="amber"
        loading={loading}
      />
      <Metric
        label="Completed"
        value={summary ? count.format(completed) : "—"}
        note={
          summary
            ? `${count.format(summary.invoicedOrders)} invoiced · ${count.format(summary.deliveredOrders)} delivered`
            : "Invoiced and delivered"
        }
        icon={<PackageCheck size={19} />}
        tone="mint"
        loading={loading}
      />
      <Metric
        label="Cancelled"
        value={summary ? count.format(summary.cancelledOrders) : "—"}
        note="Cancelled orders"
        icon={<X size={19} />}
        tone="coral"
        loading={loading}
      />
      <Metric
        label="Order value"
        value={summary ? formatMoney(summary.totalOrderValue) : "—"}
        note="MYR · all orders"
        icon={<ArrowUpRight size={19} />}
        tone="green"
        loading={loading}
        money
        className="sm:col-span-2 xl:col-span-1"
      />
    </section>
  );
}

function Metric({
  label,
  value,
  note,
  icon,
  tone,
  loading,
  money = false,
  className = "",
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone: "green" | "amber" | "mint" | "coral";
  loading: boolean;
  money?: boolean;
  className?: string;
}) {
  const tones = {
    green: "bg-[#e8f0df] text-[#396b44]",
    amber: "bg-[#fff0d6] text-[#bd8126]",
    mint: "bg-[#e1f2e9] text-[#428566]",
    coral: "bg-[#fae9e3] text-[#ba6959]",
  };
  return (
    <div
      className={`min-w-0 rounded-[18px] border border-[#e2e8df] bg-white p-5 shadow-[0_8px_24px_-20px_#28493666] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-bold uppercase tracking-[.11em] text-[#87988b]">
          {label}
        </div>
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="mt-6 h-9 w-28 animate-pulse rounded bg-[#edf3eb]" />
      ) : (
        <div
          className={`mt-4 truncate font-bold tracking-[-.05em] text-[#203b2c] ${money ? "text-[24px] 2xl:text-[28px]" : "text-[32px]"}`}
        >
          {value}
        </div>
      )}
      <div className="mt-2 truncate text-xs text-[#91a094]">{note}</div>
    </div>
  );
}
