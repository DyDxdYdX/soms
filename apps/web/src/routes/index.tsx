import { createFileRoute } from "@tanstack/react-router";
import { Activity, CircleAlert, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchMeta,
  fetchOrderDetail,
  fetchOrders,
  PAGE_SIZE,
  type Order,
  type OrderList as OrderListData,
  type OrderMeta,
} from "@/lib/sales-orders";
import { OrderDrawer } from "@/components/orders/order-drawer";
import { OrderList } from "@/components/orders/order-list";
import { OrderMetrics } from "@/components/orders/order-metrics";

export const Route = createFileRoute("/")({ component: Dashboard });
function Dashboard() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [site, setSite] = useState("");
  const [status, setStatus] = useState("");
  const [reload, setReload] = useState(0);
  const [list, setList] = useState<OrderListData | null>(null);
  const [meta, setMeta] = useState<OrderMeta>({ sites: [], statuses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    const controller = new AbortController();
    fetchMeta(controller.signal)
      .then(setMeta)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchOrders(
      { page, pageSize: PAGE_SIZE, q: search, site, status },
      controller.signal,
    )
      .then((result) => {
        setList(result);
        setUpdatedAt(new Date());
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load sales orders.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, search, site, status, reload]);
  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    const controller = new AbortController();
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    fetchOrderDetail(selected.id, controller.signal)
      .then(setDetail)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setDetailError(
            reason instanceof Error
              ? reason.message
              : "Unable to load details.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });
    return () => controller.abort();
  }, [selected]);
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSite("");
    setStatus("");
    setPage(1);
  };
  return (
    <div className="min-h-screen bg-[#f6f5ef] text-[#20352c]">
      <header className="border-b border-[#e5e8de] bg-[#fbfaf6]">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-12">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#d8ec99] text-[#18382d]">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold leading-5 tracking-tight text-[#20402e] sm:text-[17px]">
                Harrisons Sabah
              </div>
              <div className="hidden text-[10px] font-bold uppercase tracking-[.18em] text-[#88a18c] sm:block">
                Sales intelligence
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 text-xs text-[#6f8577] md:flex">
              <span className="size-2 rounded-full bg-[#6dba80]" />
              {updatedAt
                ? `Updated ${updatedAt.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}`
                : "Connecting to data"}
            </div>
            <button
              onClick={() => setReload((value) => value + 1)}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[#dbe3d8] bg-white px-3 py-2 text-xs font-semibold text-[#315240] shadow-sm transition hover:bg-[#f2f6ee] disabled:opacity-50 sm:px-4"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh data</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 xl:px-12 xl:py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.22em] text-[#718d75]">
              <span className="h-px w-6 bg-[#83a67e]" /> Operations / Live
              overview
            </div>
            <h1 className="text-[32px] font-bold tracking-[-.045em] text-[#1c3529] sm:text-[40px]">
              Sales order overview<span className="text-[#a4bb78]">.</span>
            </h1>
            <p className="mt-2 text-sm text-[#758579]">
              Your branch activity, all in one place.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#dae5d7] bg-[#eef4e9] px-3 py-2 text-[11px] font-semibold text-[#4b7456]">
            <span className="size-2 rounded-full bg-[#6caa73]" /> Metrics
            include all branches
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className="mt-7 flex flex-wrap items-center gap-3 rounded-2xl border border-[#f1c9be] bg-[#fff0eb] p-4 text-sm text-[#9c4d3c]"
          >
            <CircleAlert size={19} />
            <span className="flex-1">
              {error} Check your connection and try again.
            </span>
            <button
              className="font-bold underline"
              onClick={() => setReload((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        )}
        <OrderMetrics
          summary={list?.summary ?? null}
          loading={loading && !list}
        />
        <OrderList
          list={list}
          meta={meta}
          loading={loading}
          error={error}
          searchInput={searchInput}
          site={site}
          status={status}
          page={page}
          onSearchChange={setSearchInput}
          onSiteChange={(value) => {
            setSite(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onClearFilters={clearFilters}
          onPageChange={setPage}
          onSelectOrder={setSelected}
        />
      </main>
      {selected && (
        <OrderDrawer
          order={detail ?? selected}
          loading={detailLoading}
          error={detailError}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
