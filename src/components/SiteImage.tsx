import { optimizedImageProps, type OptimizedImageOptions } from "@/lib/optimized-image-props";

type SiteImageProps = OptimizedImageOptions & {
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
};

/** Server-friendly image — plain img, no client JS, optional responsive WebP srcSet. */
export function SiteImage({
  src,
  alt,
  title,
  width = 1200,
  height = 900,
  className = "",
  priority,
  fill,
  sizes,
  preset,
  objectFit = "cover",
}: SiteImageProps) {
  const img = optimizedImageProps({ src, alt, title, priority, preset, sizes });
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const imgClass = [fitClass, className].filter(Boolean).join(" ");

  if (fill) {
    return (
      <img
        {...img}
        className={imgClass}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit,
        }}
      />
    );
  }

  return <img {...img} width={width} height={height} className={imgClass} />;
}
