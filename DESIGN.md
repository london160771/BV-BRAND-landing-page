# THE BV BRAND — campaign direction

## Recon completed before implementation

All eleven supplied files inspected. Logo: 400 × 400. Five studio photos: 1080 × 1080. Three travel photos: 1080 × 1100. Lifestyle film: 464 × 848, 43 seconds; colour film: 464 × 848, retimed to 11.5 seconds to even out the colour transitions. Contact sheets were used to inspect every image and representative frames across both films. Original files remain intact. Optimized derivatives are resize/transcode operations on these assets only.

No existing application, conventions or AGENTS.md found in this workspace.

The requested skills are already installed under C:/Users/uk/.agents/skills: better-ui, better-typography, better-layout, better-accessibility, better-interface, better-colors, better-writing, explain-interface, variant, interface-review, shadcn. Read their instructions before design. Premium Frontend Builder also applied. The user's complete nine-section brief authorizes the implementation phase after research; no extra phase approval is needed.

## Reference observations

Live desktop and mobile browser inspection, with text/content reads as supporting evidence:

- [Sophia Anthony](https://www.sophiaanthonyy.com/): primary reference. Cream campaign opening; video dominant on the right; expressive serif headline; black campaign-film section with portrait media and a swipe cue; studio products followed by philosophy. Measured desktop hero type: Cormorant Garamond, 83.2px with 74.88px line height in the observed viewport. Muted looping videos use object-fit cover. Mobile hero changes to video under the copy; campaign gallery remains portrait and horizontally browsable. BV takes the fashion-film rhythm and restrained entrance sequencing, with a different typeface and an offset, framed media composition.
- [Jacquemus](https://www.jacquemus.com/): oversized paired campaign images, extremely little text on imagery; product/media alternation; compact header, simple image interactions. Desktop product row becomes two columns on mobile; navigation contracts. BV takes visual restraint and image scale, without importing shop cards, prices or catalog chrome.
- [Enter the Playground](https://www.entertheplayground.co/): real faces arranged at different scales, with overlap and slight rotation around central statements. Photography introduces a room before copy explains it. Mobile repositions the collage around the statement. BV takes staggered scale and person/product alternation, avoiding the saturated red canvas and text over busy imagery. The browser loaded successfully although the text web-fetch tool could not access it.
- [QuickFleet](https://www.quickfleet.co/): each statement develops the previous idea: network → hubs → electricity → practical benefits → product. Large visual chapters alternate with quieter explanation. Desktop narratives use paired text/media; mobile linearizes the content and keeps conversion actions obvious. BV takes connected sequencing and changes of pace; none of the software/product UI styling.

These are observations, not claims about original authoring techniques or exact motion durations. Browser animation introspection was unavailable; motion mechanisms below are our own implementation decisions.

## Composition options considered

On the structure axis: full-bleed film, clean equal split, and offset editorial composition. The offset composition uses the portrait film without stretching, brings studio product into the first screen, and gives the long headline room. No production variant picker is needed for the commissioned single-page result.

## Visual and typography systems

Ivory #f3efe6, ink #181813, muted copy #686258, sand #e6ded0, restrained accent #80632e. Black logo grounds dark compositions. Gold is a detail, not a surface theme. Native logo artwork is used rather than a recreated monogram.

Bodoni Moda regular and italic for display; Manrope 400 for controls and body (polish pass removed the 500 face). Fonts served locally as WOFF2. Display scales fluidly; mobile uses deliberate line breaks and smaller editorial statements. Copy measure stays short. Minimum controls 44px; labels at least 12px, body 16px. Text remains selectable.

Sharp image edges, no generic card shells, no pills, no gratuitous gradients, no stock imagery. Grid establishes shared edges; photographic overlaps are intentional. Spacing: 8/16/24/32/48/64/96/128px with fluid page gutters.

## Sequence and responsive behavior

1. 4.5s black opening on every full load/refresh, real gold logo, brand title, visible skip; reduced motion bypasses it. The hero reveal starts during the exit, at 3.3s. In-page anchors do not replay the opening.
2. Ivory hero: large headline on leading edge, portrait lifestyle film on trailing edge, smaller studio image offset into the composition. Mobile becomes headline → portrait film → actions with a small product inset; shop also stays in the header.
3. Brand statement: two large statements and two image accents. Short masked entrance, a small scroll-linked image movement on wide screens.
4. Signature: sticky desktop text and photographic stage; five colours progress over a bounded scroll sequence. Explicit colour buttons also work by keyboard. Mobile and reduced motion use an unpinned manual editorial carousel with arrows and labelled selectors.
5. In motion: near-black breathing room, single portrait colour film, oversized statement outside the image; visible pause/play.
6. Travel: a large image followed by differently sized staggered portraits, all three duffels visible. No uniform card grid.
7. Story: large portrait lifestyle still and concise text, with a smaller studio image detail.
8. Social: staggered gallery of supplied product photos and real film stills. Small differential movement only on large screens. Instagram and TikTok links are explicit.
9. Dark finale: prominent supplied logo, short headline, shop and WhatsApp, contact/social links and minimal footer.

Breakpoints at 58rem (hero/sticky stage no longer fits) and 38rem (mobile composition). At 320px, no page-wide horizontal overflow. Product selection changes retain a text label and active border in addition to colour.

## Motion and media contract

GSAP + ScrollTrigger in matchMedia with cleanup. Lenis desktop-only and only under no-preference; touch retains native scrolling. Text enters in semantic lines, image entrances use a clip reveal, collections crossfade, and travel is mostly calm. No animated cursor or perpetual decoration. UI feedback uses an interruptible 150ms transition and cubic-bezier(0.2,0,0,1).

Video is muted and playsInline, pauses when out of view or document hidden, and has a visible pause/play button. Below-fold films attach their sources only near the viewport. Reduced motion and save-data start on posters and require explicit play. Lifestyle used once as a video; later lifestyle media are actual extracted film frames to avoid duplicate video decoders. Posters and frame derivatives are from supplied footage. Product derivatives have responsive widths and fixed aspect ratios.

Primary destination: https://thebvbrand.bumpa.shop/. Secondary: https://wa.me/message/I4WCG2JNR4AMC1. No invented product facts, founding history, pricing or materials.

## Review scope

Entire landing page, intro, collection interaction, both videos, navigation and external destinations at desktop/tablet/mobile plus reduced motion. Apply all six better-interface domains. Build and TypeScript must pass; no claim of real-user Core Web Vitals before deployment.

## Requested polish pass — 6 October 2026

The original compositions, palette, copy, product photography, page sequence and mobile headline scale are retained. Desktop display sizes step back by 12%, with 400 weight throughout the display and interface typography. BV Story uses the same model-holding-bag frame as the social gallery, cropped at 464:760 with object-fit cover. Muted autoplay and loadeddata/canplay retries strengthen lifestyle-film startup; native controls remain disabled. Intro replay no longer depends on session storage. The independent failsafe is 5s and GSAP uses elapsed time without lag smoothing, matching Lenis.

## Second requested polish — scale and mobile story

The current desktop headings are another 18–25% smaller than the first polish, with a 72px header and unchanged desktop media scale. Mobile headlines/media/spacing step back roughly 15%, with an 18% smaller hero and readable 12px labels. The mobile story now reads label → headline → copy → model portrait → offset black handbag support → closing WhatsApp CTA. Desktop still uses the established portrait-left/text-right composition.

## Viewport-fit and density refinement

Desktop media now respond to screen height as well as width. Hero uses an available-viewport minimum with intrinsic growth; other scenes use responsive padding and height-aware media caps without fixed section heights. Collection retains its sticky colour progression within a viewport-sized scene, with a shorter 240svh track. Mobile Motion type is 23.2% smaller with tighter copy/media spacing, bringing the film into view immediately. Travel keeps its longer sequence at roughly 12% lower scale. Fonts, colours, content, intro and media behavior remain.
