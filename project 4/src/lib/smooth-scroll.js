import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

/**
 * Smooth scrolling (Lenis) wired into GSAP's ticker + ScrollTrigger so the
 * pinned/scrubbed sections keep measuring correctly (same setup as project 1
 * and the original script.js). Native anchor clicks are routed through
 * lenis.scrollTo instead of instant jumps.
 */
function initSmoothScroll() {
  if (lenis) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  lenis = new Lenis({
    duration: 1.2,
    lerp: 0.1,
    smoothWheel: true,
    touchMultiplier: 1.6,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  window.lenis = lenis

  // In-page anchors → smooth Lenis scroll instead of an instant jump.
  // Hash routes ('#/...') are page links, not element anchors — leave them to
  // the router.
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]')
    if (!link) return
    const hash = link.getAttribute('href')
    if (!hash || hash.length < 2 || hash.startsWith('#/')) return
    let target
    try {
      target = document.querySelector(hash)
    } catch {
      target = null
    }
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { duration: 1.3 })
  })

  // Ensure pinned ScrollTriggers measure with the final layout + active Lenis.
  requestAnimationFrame(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll, { once: true })
} else {
  initSmoothScroll()
}
