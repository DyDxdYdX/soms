import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  Clock3,
  MapPin,
  RefreshCw,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  field,
  formatDate,
  formatMoney,
  numericField,
  type Order,
} from "@/lib/sales-orders";
import { StatusBadge } from "./status-badge";

export function OrderDrawer({
  order,
  loading,
  error,
  onClose,
}: {
  order: Order;
  loading: boolean;
  error: string;
  onClose: () => void;
}) {
  const raw = order.raw;
  const amount = numericField(raw, "HAR_TotalSOAmount") ?? order.amount;
  const invoiced = numericField(raw, "HAR_InvoicedAmount");
  const outstanding =
    numericField(raw, "HAR_BalanceAmount") ??
    (invoiced === null ? null : amount - invoiced);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close order details"
        className="absolute inset-0 bg-[#10251b]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Order details for ${order.id}`}
        className="relative flex h-full w-full flex-col bg-[#fbfcf8] shadow-2xl sm:max-w-[520px]"
      >
        <div className="border-b border-[#e6ece3] bg-white px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#87a08b]">
                Order details
              </div>
              <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight text-[#23442f]">
                {order.id}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                <span className="rounded-full bg-[#edf3eb] px-2.5 py-1 font-mono text-xs font-bold text-[#6a896e]">
                  {order.site}
                </span>
              </div>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg p-2 text-[#719079] hover:bg-[#edf3eb]"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {loading && (
            <div className="mb-5 flex items-center gap-2 text-xs text-[#7d927f]">
              <RefreshCw size={14} className="animate-spin" /> Loading full
              record…
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-xl border border-[#f1d1c5] bg-[#fff0eb] p-3 text-xs text-[#9c4d3c]">
              Full details could not be loaded. Showing the information from the
              order list.
            </div>
          )}
          <div className="rounded-2xl bg-[#1e4831] p-5 text-white">
            <div className="text-[10px] font-bold uppercase tracking-[.19em] text-[#a8d6ae]">
              Total order value
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">
              <span className="mr-2 text-sm font-medium text-[#b7d6bb]">
                MYR
              </span>
              {formatMoney(amount)}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-[#c9dfc8]">
              <Clock3 size={15} /> Recorded {formatDate(order.date)}
            </div>
          </div>
          <DetailSection
            title="Order information"
            icon={<ClipboardList size={16} />}
          >
            <DetailRow label="Order number" value={order.id} />
            <DetailRow label="Status" value={order.status} />
            <DetailRow label="Created date" value={formatDate(order.date)} />
            <DetailRow
              label="Document status"
              value={field(raw, "DocumentStatus")}
            />
            <DetailRow
              label="Validation status"
              value={field(raw, "DOT_ValidationStatus")}
            />
            <DetailRow
              label="Requested shipping"
              value={formatDate(field(raw, "ShippingDateRequested"))}
            />
          </DetailSection>
          <DetailSection title="Customer" icon={<Activity size={16} />}>
            <DetailRow label="Customer name" value={order.customer} />
            <DetailRow label="Account" value={field(raw, "CustAccount")} />
            <DetailRow label="Reference" value={field(raw, "CustomerRef")} />
            <DetailRow
              label="Sales representative"
              value={field(raw, "SalesTaker")}
            />
          </DetailSection>
          <DetailSection title="Financials" icon={<ArrowUpRight size={16} />}>
            <DetailRow
              label="Invoiced amount"
              value={invoiced === null ? "—" : `MYR ${formatMoney(invoiced)}`}
            />
            <DetailRow
              label="Outstanding balance"
              value={
                outstanding === null ? "—" : `MYR ${formatMoney(outstanding)}`
              }
            />
          </DetailSection>
          <DetailSection title="Branch & delivery" icon={<MapPin size={16} />}>
            <DetailRow label="Site / warehouse" value={order.site} />
            <DetailRow
              label="Sales district"
              value={field(raw, "SalesDistrictDescription")}
            />
            <DetailRow
              label="Delivery district"
              value={field(raw, "HAR_DeliveryDistrictDescription")}
            />
          </DetailSection>
        </div>
      </aside>
    </div>
  );
}
function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#718e76]">
        {icon}
        {title}
      </h3>
      <dl className="overflow-hidden rounded-xl border border-[#e5ebe2] bg-white px-4">
        {children}
      </dl>
    </section>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-5 border-b border-[#eef1eb] py-3 text-sm last:border-0">
      <dt className="text-[#899b8c]">{label}</dt>
      <dd className="max-w-[60%] text-right font-semibold text-[#2c4734]">
        {value}
      </dd>
    </div>
  );
}
