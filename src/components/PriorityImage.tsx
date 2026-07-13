import { optimizedImageProps } from "@/lib/optimized-image-props";

type PriorityImageProps = {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain";
};

/** Server-only LCP image — no client JS, no fade transition. */
export function PriorityImage({
  src,
  alt,
  title,
  className = "",
  fill,
  sizes,
  objectFit = "cover",
}: PriorityImageProps) {
  const img = optimizedImageProps({
    src,
    alt,
    title,
    priority: true,
    sizes,
    preset: "hero",
  });
  const shared = {
    ...img,
    fetchPriority: "high" as const,
    loading: "eager" as const,
  };

  if (fill) {
    return (
      <img
        {...shared}
        className={className}
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

  return <img {...shared} className={className} style={{ objectFit }} />;
}
