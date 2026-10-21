function statusTone(status: string): string {
  const name = status.toLowerCase();
  if (name.includes("open"))
    return "bg-[#fff0d8] text-[#9c5b10] border-[#f5d6a7]";
  if (name.includes("deliver"))
    return "bg-[#e0f3e7] text-[#246b4b] border-[#bfe4cb]";
  if (name.includes("invoice"))
    return "bg-[#e5edfb] text-[#315c9b] border-[#cbdcf6]";
  if (name.includes("cancel"))
    return "bg-[#fbe9e6] text-[#aa493d] border-[#f2cfc9]";
  return "bg-[#f0f1ed] text-[#53615a] border-[#dfe4dd]";
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
