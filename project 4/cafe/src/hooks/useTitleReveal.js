import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Splits a heading into masked lines and slides them up when it scrolls
 * into view (port of script.js initTitleReveals). Pass a ref to the
 * `.title-reveal` element.
 */
export default function useTitleReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      })
      gsap.set(split.lines, { y: '100%' })

      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(split.lines, {
            y: '0%',
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
          })
        },
      })
    })

    return () => ctx.revert()
  }, [ref])
}
