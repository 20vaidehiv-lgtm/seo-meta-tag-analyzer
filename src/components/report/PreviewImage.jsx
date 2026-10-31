import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted to-secondary text-muted-foreground",
          className
        )}
      >
        <ImageOff className="h-5 w-5 opacity-70" />
        <span className="text-[10.5px]">{failed ? "Image failed to load" : "No preview image"}</span>
      </div>
    );
  }}