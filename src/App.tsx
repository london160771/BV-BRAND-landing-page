import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)
// Keep cinematic timings and Lenis aligned with elapsed time when frames throttle.
gsap.ticker.lagSmoothing(0)

const LINKS = {
  shop: 'https://thebvbrand.bumpa.shop/',
  whatsapp: 'https://wa.me/message/I4WCG2JNR4AMC1',
  instagram: 'https://www.instagram.com/thebvbrand',
  tiktok: 'https://tiktok.com/@thebvbrand',
  email: 'mailto:thebvbrandd@gmail.com',
}
const ASSETS = '/assets/optimized/'

function Arrow({ diagonal = false, left = false }: { diagonal?: boolean; left?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`arrow ${left ? 'arrow-left' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5">
    {diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M3 12h17m-7-7 7 7-7 7" />}
  </svg>
}

function Link({ href, children, className = '', diagonal = false }: { href: string; children: ReactNode; className?: string; diagonal?: boolean }) {
  return <a href={href} className={`editorial-link ${className}`}><span>{children}</span><Arrow diagonal={diagonal} /></a>
}

function Photo({ name, alt, className = '', eager = false, sizes = '(max-width: 608px) 90vw, 50vw' }: { name: string; alt: string; className?: string; eager?: boolean; sizes?: string }) {
  const travel = name.startsWith('duffel')
  return <img
    className={className}
    src={`${ASSETS}${name}-800.webp`}
    srcSet={`${ASSETS}${name}-480.webp 480w, ${ASSETS}${name}-800.webp 800w, ${ASSETS}${name}-1080.webp 1080w`}
    sizes={sizes} width="1080" height={travel ? '1100' : '1080'} alt={alt}
    loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'}
  />
}

function useReducedMotion() {
  const read = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce'
  const [reduced, setReduced] = useState(read)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(read())
    mq.addEventListener('change', update)
    window.addEventListener('bv-motion-change', update)
    return () => { mq.removeEventListener('change', update); window.removeEventListener('bv-motion-change', update) }
  }, [])
  return reduced
}

function Film({ name, poster, label, className = '', eager = false }: { name: string; poster: string; label: string; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const [loaded, setLoaded] = useState(eager && !reduced && !saveData)
  const [visible, setVisible] = useState(eager)
  const [playing, setPlaying] = useState(false)
  const [manual, setManual] = useState(false)
  const [pausedByUser, setPausedByUser] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const near = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced && !saveData) setLoaded(true)
    }, { rootMargin: '200px' })
    const onscreen = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= 0.15
      setVisible(inView)
      if (!inView) el.pause()
    }, { threshold: 0.15 })
    near.observe(el)
    onscreen.observe(el)
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      near.disconnect()
      onscreen.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      el.pause()
    }
  }, [reduced, saveData])

  useEffect(() => {
    if (reduced) setManual(false)
  }, [reduced])

  const shouldPlay = loaded && visible && pageVisible && !pausedByUser && (manual || (!reduced && !saveData))
  const playWhenReady = useCallback(() => {
    const el = ref.current
    if (!el || !shouldPlay || !el.paused) return
    // Set the properties before every attempt, including readiness retries.
    el.muted = true
    el.defaultMuted = true
    void el.play().catch(() => {
      // Readiness events retry interrupted loads. If autoplay is blocked,
      // the real poster and accessible Play button remain available.
    })
  }, [shouldPlay])

  useEffect(() => {
    if (shouldPlay) playWhenReady()
    else ref.current?.pause()
  }, [shouldPlay, playWhenReady])

  function toggle() {
    const el = ref.current
    if (!el) return
    if (!el.paused) {
      setPausedByUser(true)
      el.pause()
    } else {
      setLoaded(true)
      setManual(true)
      setPausedByUser(false)
      // A direct play preserves the user gesture when the source is already attached.
      if (el.currentSrc) {
        el.muted = true
        void el.play().catch(() => { /* Poster and Play control remain available. */ })
      }
    }
  }

  return <div className={`film ${className}`}>
    <video ref={ref} src={loaded ? `${ASSETS}${name}.mp4` : undefined} poster={`${ASSETS}${poster}.webp`} width="464" height="848"
      autoPlay={shouldPlay} muted playsInline loop controls={false} preload={eager && !reduced && !saveData ? 'auto' : 'none'}
      onLoadedData={playWhenReady} onCanPlay={playWhenReady}
      aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className="film-control" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}>
      <span aria-hidden="true" className={playing ? 'pause-icon' : 'play-icon'} />{playing ? 'Pause' : 'Play'}
    </button>
  </div>
}

function Intro({ finish, beginHero }: { finish: () => void; beginHero: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const finishIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    finish()
  }, [finish])
  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const previousRestoration = window.history.scrollRestoration
    // Every full-load opening hands off to the hero, including a mid-page refresh.
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.body.style.overflow = 'hidden'
    skip.current?.focus({ preventScroll: true })
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: finishIntro })
        .fromTo('.intro-logo', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.7)
        .fromTo('.intro-name', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 2.1)
        .fromTo('.intro-caption', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 2.1)
        .call(() => {
          // Fragment navigation can restore a section after the first layout.
          window.scrollTo({ top: 0, behavior: 'instant' })
          beginHero()
        }, [], 3.3)
        .to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut' }, 3.3)
    }, ref)
    // Background-tab frame throttling must never leave the opening over the shop.
    const failsafe = window.setTimeout(finishIntro, 5000)
    return () => {
      window.clearTimeout(failsafe)
      ctx.revert()
      document.body.style.overflow = previousOverflow
      window.history.scrollRestoration = previousRestoration
      previous?.focus({ preventScroll: true })
    }
  }, [finishIntro, beginHero])
  return <div ref={ref} className="intro" role="dialog" aria-modal="true" aria-label="Welcome to THE BV BRAND" onKeyDown={event => {
    if (event.key === 'Escape') finishIntro()
    if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus() }
  }}>
    <img className="intro-logo" src="/assets/brand/bv-logo.jpg" width="400" height="400" alt="THE BV BRAND gold monogram" />
    <p className="intro-name">The BV Brand</p>
    <button ref={skip} onClick={finishIntro} className="intro-skip">Skip intro <Arrow /></button>
    <span className="intro-caption">Colour. Character. Craft.</span>
  </div>
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menu.current?.open) {
        menu.current.open = false
        menu.current.querySelector('summary')?.focus()
      }
    }
    window.addEventListener('keydown', escape)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('keydown', escape) }
  }, [])
  function closeMenu() { if (menu.current) menu.current.open = false }
  return <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
    <nav className="desktop-nav" aria-label="Main"><a href="#collection">Collection</a><a href="#story">Our story</a></nav>
    <details ref={menu} className="mobile-menu">
      <summary>Menu <span aria-hidden="true">＋</span></summary>
      <nav aria-label="Mobile" onClick={closeMenu}><a href="#collection">Collection</a><a href="#story">Our story</a><a href={LINKS.instagram}>Instagram <Arrow diagonal /></a><a href={LINKS.whatsapp}>WhatsApp <Arrow diagonal /></a></nav>
    </details>
    <a href="#top" className="brand" aria-label="THE BV BRAND home"><img src="/assets/brand/bv-logo.jpg" width="400" height="400" alt="" /><span>The BV Brand</span></a>
    <a className="header-shop" href={LINKS.shop}>Shop <span className="desktop-only">collection</span><Arrow diagonal /></a>
  </header>
}

const colours = [
  { name: 'Red', file: 'red-bags', hex: '#a82a26', caption: 'A little boldness goes a long way.' },
  { name: 'Brown', file: 'brown-bags', hex: '#6d4939', caption: 'Warm tones. A lasting impression.' },
  { name: 'Navy', file: 'navy-bags', hex: '#27324a', caption: 'Quiet colour. Distinct character.' },
  { name: 'Pink', file: 'pink-bags', hex: '#b82b72', caption: 'For days that call for colour.' },
  { name: 'Black', file: 'black-bags', hex: '#252522', caption: 'A classic, with its own point of view.' },
]

function Collection() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  useLayoutEffect(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 58rem) and (min-height: 48rem) and (prefers-reduced-motion: no-preference)', () => {
      trigger.current = ScrollTrigger.create({
        trigger: ref.current, start: () => `top top+=${document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 72}`, end: 'bottom bottom',
        onUpdate: self => setActive(Math.min(4, Math.floor(self.progress * 5))),
      })
      return () => { trigger.current = null }
    })
    return () => mm.revert()
  }, [reduced])

  function select(index: number) {
    const current = trigger.current
    if (current) {
      const top = current.start + (current.end - current.start) * (index + 0.3) / 5
      window.scrollTo({ top, behavior: 'instant' })
    }
    setActive(index)
  }
  const item = colours[active]
  return <section ref={ref} id="collection" className="collection-scroll" aria-labelledby="collection-heading">
    <div className="collection-stage">
      <div className="collection-copy">
        <p className="eyebrow"><span className="chapter">01</span> The signature collection</p>
        <h2 id="collection-heading">An expression <br />of <em>you.</em></h2>
        <p className="collection-description">One collection.<br />A world of character.</p>
        <div className="colour-selector" role="group" aria-label="Choose a handbag colour">
          {colours.map((colour, index) => <button key={colour.name} onClick={() => select(index)} aria-pressed={active === index}>
            <span className="swatch" style={{ backgroundColor: colour.hex }} aria-hidden="true" />
            <span>{colour.name}</span><span className="colour-mark" aria-hidden="true">{active === index ? '↗' : ''}</span>
          </button>)}
        </div>
        <Link href={LINKS.shop}>Explore the collection</Link>
      </div>
      <div className="collection-art">
        <div className="collection-images">
          {colours.map((colour, i) => <div key={colour.name} className={`collection-image ${i === active ? 'is-active' : ''}`} aria-hidden={i !== active}>
            <Photo name={colour.file} alt={`${colour.name} THE BV BRAND handbags photographed on warm beige plinths`} sizes="(max-width: 928px) 92vw, 54vw" />
          </div>)}
        </div>
        <div className="collection-caption"><span className="caption-text" aria-live="polite">{item.name} — {item.caption}</span><span className="counter">0{active + 1} <span>/ 05</span></span></div>
        <div className="collection-mobile-controls"><button onClick={() => select((active + 4) % 5)} aria-label="Previous handbag colour"><Arrow left /></button><span>Find your colour</span><button onClick={() => select((active + 1) % 5)} aria-label="Next handbag colour"><Arrow /></button></div>
        <p className="collection-scroll-cue">Scroll to discover the colours <span aria-hidden="true">↓</span></p>
      </div>
    </div>
  </section>
}

function App() {
  const reduced = useReducedMotion()
  const [intro, setIntro] = useState(!reduced)
  const [heroReady, setHeroReady] = useState(!intro)
  const root = useRef<HTMLDivElement>(null)
  const beginHero = useCallback(() => setHeroReady(true), [])
  const finish = useCallback(() => {
    setHeroReady(true)
    setIntro(false)
  }, [])
  useEffect(() => { if (reduced && intro) finish() }, [reduced, intro, finish])

  useLayoutEffect(() => {
    if (!heroReady || reduced) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-line > span', { yPercent: 108, duration: 1.1, stagger: 0.11, ease: 'power3.out', clearProps: 'transform' })
      gsap.from('.hero-film', { clipPath: 'inset(10% 0 90% 0)', duration: 1.3, delay: 0.15, ease: 'power3.inOut', clearProps: 'clipPath' })
      gsap.from('.hero-product', { y: 24, opacity: 0, duration: 1, delay: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' })
      gsap.utils.toArray<HTMLElement>('.reveal-line').forEach(line => {
        gsap.from(line.children, { yPercent: 105, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 92%', once: true }, clearProps: 'transform' })
      })
      gsap.utils.toArray<HTMLElement>('.image-reveal').forEach(el => {
        gsap.from(el, { clipPath: 'inset(12% 0 88% 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, clearProps: 'clipPath' })
      })
    }, root)
    mm.add('(min-width: 58rem) and (prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
        gsap.fromTo(el, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } })
      })
      gsap.fromTo('.social-gallery', { xPercent: 3 }, { xPercent: -3, ease: 'none', scrollTrigger: { trigger: '.social', start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
      return () => { gsap.ticker.remove(tick); lenis.destroy() }
    }, root)
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })
    return () => { mm.revert(); window.removeEventListener('load', refresh) }
  }, [heroReady, reduced])

  function toggleMotion() {
    const next = document.documentElement.dataset.motion !== 'reduce'
    document.documentElement.dataset.motion = next ? 'reduce' : ''
    try { sessionStorage.setItem('bv-reduce-motion', next ? '1' : '0') } catch { /* Optional preference. */ }
    window.dispatchEvent(new Event('bv-motion-change'))
  }

  return <>
    {intro && <Intro finish={finish} beginHero={beginHero} />}
    <div ref={root} inert={intro}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="small-rule" /> Colour. Character. Craft.</p>
            <h1 id="hero-heading">
              <span className="hero-line"><span>Crafted to</span></span>
              <span className="hero-line"><span>be carried.</span></span>
              <span className="hero-line hero-italic"><span>Designed to</span></span>
              <span className="hero-line hero-italic"><span>be noticed.</span></span>
            </h1>
            <p className="hero-description">Handcrafted bags, footwear and accessories made with colour, character and craftsmanship.</p>
            <div className="hero-actions flex flex-wrap items-center gap-8"><Link href={LINKS.shop} className="link-solid">Shop collection</Link><Link href={LINKS.whatsapp} diagonal>WhatsApp</Link></div>
          </div>
          <div className="hero-media">
            <span className="hero-film-label">The art of carrying character</span>
            <Film name="lifestyle" poster="lifestyle-poster" label="BV lifestyle film" eager className="hero-film" />
          </div>
          <figure className="hero-product"><Photo name="red-bags" alt="Red BV handbags with colourful striped panels" eager sizes="(max-width: 608px) 34vw, 21vw" /><figcaption>Distinctly BV.</figcaption></figure>
          <div className="hero-bottom"><span>Handcrafted. Unmistakable.</span><a href="#statement">Discover the world of BV <span aria-hidden="true">↓</span></a><span> bags · footwear · accessories</span></div>
        </section>

        <section className="statement" id="statement" aria-labelledby="statement-heading">
          <p className="eyebrow">A character all its own</p>
          <h2 id="statement-heading"><span className="reveal-line"><span>Timeless beauty.</span></span><span className="reveal-line statement-indent"><span>Unique <em>craftsmanship.</em></span></span></h2>
          <div className="statement-foot"><figure className="statement-small image-reveal" data-parallax><Photo name="brown-bags" alt="Brown BV handbags with gold-toned clasps and striped accents" sizes="(max-width: 608px) 39vw, 20vw" /></figure><p>For the way you move.<br />For the way you express yourself.<br /><span>For the moments that are yours.</span></p><figure className="statement-large image-reveal" data-parallax><Photo name="navy-bags" alt="Navy handbags from the BV signature collection" sizes="(max-width: 608px) 48vw, 29vw" /></figure></div>
        </section>

        <Collection />

        <section id="motion" className="motion-section" aria-labelledby="motion-heading">
          <div className="motion-copy"><p className="eyebrow"><span className="chapter">02</span> BV, in motion</p><h2 id="motion-heading"><span className="reveal-line"><span>Colour,</span></span><span className="reveal-line"><span>craft &</span></span><span className="reveal-line"><span><em>character.</em></span></span></h2><p>A change of colour.<br />A change of mood.</p><span className="film-note">A short film by THE BV BRAND</span></div>
          <div className="motion-film-wrap image-reveal"><Film name="colour-transition" poster="colour-poster" label="BV colour film" /><span className="motion-side-note">Let your colour do the talking.</span></div>
        </section>

        <section id="travel" className="travel" aria-labelledby="travel-heading">
          <div className="travel-heading"><p className="eyebrow"><span className="chapter">03</span> The travel collection</p><h2 id="travel-heading"><span className="reveal-line"><span>Good company.</span></span><span className="reveal-line"><span><em>Wherever you go.</em></span></span></h2></div>
          <div className="travel-editorial"><figure className="travel-lead image-reveal"><Photo name="duffel-purple" alt="Purple and black striped BV travel bag on a dark wooden stool" sizes="(max-width: 608px) 92vw, 52vw" /><figcaption><span>Room for a little adventure.</span><span>01 / 03</span></figcaption></figure><div className="travel-aside"><p>Carry your character<br />a little further.</p><figure className="travel-second image-reveal"><Photo name="duffel-red" alt="BV travel bag with red, yellow, white and black stripes" sizes="(max-width: 608px) 65vw, 29vw" /><figcaption>02 / 03</figcaption></figure></div></div>
          <div className="travel-bottom"><div className="travel-invitation"><p>From the everyday<br />to the <em>away.</em></p><Link href={LINKS.shop}>Explore the travel collection</Link></div><figure className="travel-third image-reveal"><Photo name="duffel-blue" alt="Blue striped BV travel bag photographed in a bright interior" sizes="(max-width: 608px) 70vw, 38vw" /><figcaption><span>Take colour with you.</span><span>03 / 03</span></figcaption></figure></div>
        </section>

        <section id="story" className="story" aria-labelledby="story-heading">
          <div className="story-copy"><p className="eyebrow">The BV story</p><h2 id="story-heading"><span className="reveal-line"><span>Made by hand.</span></span><span className="reveal-line"><span>Made with <em>intention.</em></span></span></h2><p>Colour is personal. So is what you carry.</p><p>At THE BV BRAND, handcrafted bags, footwear and accessories bring craftsmanship and individuality together. Pieces with character, made to become part of your own story.</p></div>
          <div className="story-media">
            <div className="story-visual image-reveal"><img src={`${ASSETS}lifestyle-detail.webp`} width="464" height="848" loading="lazy" decoding="async" alt="A woman in a red dress holding a colourful striped BV handbag" /><span className="story-image-label">Carried with character.</span></div>
            <figure className="story-detail"><Photo name="black-bags" alt="Black BV handbags with multicoloured striped panels" sizes="(max-width: 608px) 36vw, 18vw" /></figure>
          </div>
          <Link href={LINKS.whatsapp} className="story-cta" diagonal>Say hello to BV</Link>
        </section>

        <section id="social" className="social" aria-labelledby="social-heading">
          <div className="social-heading"><div><p className="eyebrow">Behind the brand</p><h2 id="social-heading">A little more <em>BV.</em></h2></div><div className="social-links"><Link href={LINKS.instagram} diagonal>Instagram</Link><Link href={LINKS.tiktok} diagonal>TikTok</Link></div></div>
          <div className="social-gallery"><figure className="social-one"><Photo name="pink-bags" alt="Pink BV handbags with striped details" sizes="(max-width: 608px) 46vw, 25vw" /></figure><figure className="social-two"><img src={`${ASSETS}lifestyle-detail.webp`} width="464" height="848" alt="A woman in a red outfit holding a colourful striped BV handbag" loading="lazy" decoding="async" /></figure><figure className="social-three"><Photo name="duffel-blue" alt="Blue BV travel bag" sizes="(max-width: 608px) 46vw, 23vw" /></figure><figure className="social-four"><Photo name="red-bags" alt="Red BV handbags in the studio" sizes="(max-width: 608px) 46vw, 25vw" /></figure></div>
          <div className="social-caption"><span>Colour in the everyday.</span><a href={LINKS.instagram}>@thebvbrand <Arrow diagonal /></a></div>
        </section>

        <section id="finale" className="finale" aria-labelledby="finale-heading">
          <img className="finale-logo" src="/assets/brand/bv-logo.jpg" width="400" height="400" alt="THE BV BRAND gold monogram" loading="lazy" />
          <p className="eyebrow">Make it yours</p><h2 id="finale-heading"><span className="reveal-line"><span>Find your next</span></span><span className="reveal-line"><span><em>favourite.</em></span></span></h2>
          <div className="finale-actions flex flex-wrap items-center justify-center gap-8"><Link className="link-solid light" href={LINKS.shop}>Shop collection</Link><Link href={LINKS.whatsapp} diagonal>Order on WhatsApp</Link></div>
        </section>
      </main>
      <footer className="footer"><div className="footer-top"><a href="#top" className="footer-brand">The BV Brand</a><nav aria-label="Social and contact"><a href={LINKS.instagram}>Instagram <Arrow diagonal /></a><a href={LINKS.tiktok}>TikTok <Arrow diagonal /></a><a href={LINKS.email}>Email <Arrow diagonal /></a></nav></div><div className="footer-bottom"><span>© 2026 THE BV BRAND</span><span>Colour. Character. Craftsmanship.</span><button className="motion-preference" onClick={toggleMotion} aria-pressed={reduced} disabled={window.matchMedia('(prefers-reduced-motion: reduce)').matches}>{reduced ? 'Motion reduced' : 'Reduce motion'}</button><a href="#top">Back to top ↑</a></div></footer>
    </div>
  </>
}

export default App
