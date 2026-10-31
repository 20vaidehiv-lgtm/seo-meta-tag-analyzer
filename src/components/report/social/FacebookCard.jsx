import PreviewImage from "@/components/report/PreviewImage";

export default function FacebookCard({ title, description, image, host }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#dadde1] bg-white">
      <PreviewImage src={image} alt={title} className="aspect-[1.91/1] w-full" />
      <div className="border-t border-[#dadde1] bg-[#f2f3f5] px-3 py-2">
        <p className="truncate text-[11px] uppercase tracking-wide text-[#606770]">{host}</p>
      </div>
      <div className="bg-[#f2f3f5] px-3 pb-3">
        <p className="line-clamp-2 text-[16px] font-semibold leading-snug text-[#1d2129]">{title}</p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[#606770]">{description}</p>
      </div>
    </div>
  );
}