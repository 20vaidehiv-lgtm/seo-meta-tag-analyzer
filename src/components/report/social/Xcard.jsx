import PreviewImage from "@/components/report/PreviewImage";

export default function XCard({ title, description, image, host }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
      <PreviewImage src={image} alt={title} className="aspect-[1.91/1] w-full" />
      <div className="px-3 py-2.5">
        <p className="truncate text-[13px] text-[#536471]">{host}</p>
        <p className="mt-0.5 line-clamp-1 text-[15px] font-semibold text-[#0f1419]">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-[15px] font-normal leading-snug text-[#536471]">{description}</p>
      </div>
    </div>
  );
}