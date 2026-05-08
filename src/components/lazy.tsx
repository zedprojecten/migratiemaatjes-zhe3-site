/**
 * Lazy-loaded wrappers voor zware componenten. Deze wrappers houden de
 * bundle klein: three.js (~200KB gzip), @react-three/fiber (~60KB),
 * @tsparticles/slim (~60KB) en embla-carousel komen pas binnen als de
 * gebruiker een pagina opent die ze echt nodig heeft.
 *
 * Gebruik in je pagina:
 *   import { HeroShaderLazy } from "@/components/lazy";
 *   import { Suspense } from "react";
 *
 *   <Suspense fallback={<div className="h-screen bg-muted" />}>
 *     <HeroShaderLazy colors={...} />
 *   </Suspense>
 *
 * De "niet-zware" heroes (HeroGlass, HeroTopo, HeroExpand, HeroTypewriter,
 * HeroPaths, HeroAurora, HeroShapes) kun je gewoon direct importeren uit
 * `@/components/heroes/Name`, die hebben geen three.js in de weg.
 */

import { lazy } from "react";

// Heroes met @react-three/fiber + three (~350KB totaal gzip)
export const HeroShaderLazy = lazy(() => import("./heroes/HeroShader"));
export const HeroCinematicLazy = lazy(() => import("./heroes/HeroCinematic"));

// Achtergrond shaders met three (~350KB gzip, wil je echt alleen on-demand)
export const BgRippleShaderLazy = lazy(
  () => import("./effects/BgRippleShader"),
);
export const BgWaveShaderLazy = lazy(() => import("./effects/BgWaveShader"));

// tsparticles (~60KB gzip)
export const BgSparklesLazy = lazy(() => import("./effects/BgSparkles"));

// embla-carousel (~20KB gzip)
export const ImageGalleryLazy = lazy(
  () => import("./interactive/ImageGallery"),
);
