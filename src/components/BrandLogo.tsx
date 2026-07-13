import { PAGE_IMAGES } from "@/lib/images";
import { LOGO_DEFAULT_SRC } from "@/lib/logo";

type BrandLogoProps = {
  alt: string;
  priority?: boolean;
  variant?: "header" | "footer";
};

/** Plain img + srcset — avoids next/image hydration issues; uses small WebP variants. */
export function BrandLogo({ alt, priority = false, variant = "header" }: BrandLogoProps) {
  if (variant === "footer") {
    return (
      <img
        src={PAGE_IMAGES.logo}
        alt={alt}
        title={alt}
        decoding="async"
        loading="lazy"
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <img
      src={LOGO_DEFAULT_SRC}
      alt={alt}
      title={alt}
      width={320}
      height={96}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      className="site-logo__img"
    />
  );
}
