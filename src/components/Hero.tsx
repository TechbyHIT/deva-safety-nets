import { PriorityImage } from "./PriorityImage";
import { HeroCarousel } from "./HeroCarousel";
import { HERO_SLIDES, heroSlideImage } from "@/lib/hero-slides";

/** Server-rendered LCP hero background + client carousel controls. */
export function Hero() {
  const initialImage = heroSlideImage(HERO_SLIDES[0]);

  return (
    <section className="home-hero relative overflow-hidden border-b">
      <div className="home-hero__bg absolute inset-0">
        <PriorityImage
          src={initialImage.src}
          alt={initialImage.alt}
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <HeroCarousel initialImage={initialImage} />
    </section>
  );
}
