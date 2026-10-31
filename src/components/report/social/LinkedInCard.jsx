import PreviewImage from "@/components/report/PreviewImage";

export default function LinkedInCard({ title, description, image, host }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
      <PreviewImage src={image} alt={title} className="aspect-[1.91/1] w-full" />
      <div className="px-3 py-2.5">
        <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#000000e6]">{title}</p>
        <p className="mt-1 truncate text-[12px] text-[#00000099]">{host}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#00000099]">{description}</p>
      </div>
    </div>
  );
}