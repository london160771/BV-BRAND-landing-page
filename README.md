# THE BV BRAND

A photography-led fashion campaign landing page built with React, Vite, TypeScript, Tailwind CSS, GSAP/ScrollTrigger and Lenis.

## Run

```sh
npm install
npm run dev
```

Use Node 20.19+ or 22.12+. The development preview runs on localhost. Create the deployable static site with `npm run build`; output is `dist/`. `npm run preview` serves that build locally.

## Project

- `src/App.tsx`: page, intro, responsive collection controls, media lifecycle and motion.
- `src/styles.css`: visual system and responsive editorial compositions.
- `DESIGN.md`: asset inspection, reference analysis and decisions made before implementation.
- `public/assets`: all supplied originals, retained intact.
- `public/assets/optimized`: responsive WebP images, silent streaming-ready film encodes and real frames extracted from supplied footage.

No generated product imagery, invented product names, prices, materials or production claims. No checkout or product data is duplicated: shop actions open the supplied Bumpa store.

## Behavior

The 4.5-second brand intro plays on every full page load or refresh and can be skipped; Escape also skips it. Anchor navigation does not replay it. The hero begins revealing during the intro exit. It is bypassed for reduced motion. The intro has a timeout independent of animation frames, so background-tab throttling cannot trap the visitor.

At sufficiently wide and tall viewports, scrolling progresses through five signature colours. Buttons provide direct colour selection. Narrow screens, short desktop windows and reduced-motion mode use manual controls and normal document scrolling.

Lenis is limited to desktop under no-preference. Films are muted and inline with native controls disabled. The lifestyle film uses autoplay, eager loading, and loaded-data/canplay playback retries. Below-fold sources attach near the viewport; films pause out of view or when the document is hidden and retain visible pause/play controls. Reduced motion and save-data begin with poster imagery. A footer control lets visitors reduce motion for the session.

## Publishing

Deploy `dist/` to a static host. Once the public domain is known, make `og:image` absolute and add the canonical URL/`og:url` in `index.html`. Verify host compression, cache headers and real network performance after deployment.
