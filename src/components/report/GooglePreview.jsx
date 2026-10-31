import { Info, Search } from "lucide-react";

function Breadcrumb({ url }) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#dadce0] bg-[#f1f3f4] text-[11px] font-medium text-[#5f6368]">
          {parsed.hostname.replace(/^www\./, "").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] text-[#202124]">{parsed.hostname.replace(/^www\./, "")}</p>
          <p className="truncate text-[11.5px] text-[#4d5156]">
            {parsed.hostname}
            {segments.length > 0 && ` › ${segments.slice(0, 3).join(" › ")}`}
          </p>
        </div>
      </div>
    );
  } catch {
    return null;
  }
}