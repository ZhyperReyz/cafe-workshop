import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Scroll typography (Text Animations/6, fx2): characters rise into place
 * with a squashed scaleY while you scroll through the element. Scrubbed so
 * the reveal is tied to scroll position, not a one-shot enter.
 */
export default function useScrollTypography(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: 'chars',
        charsClass: 'char',
      })

      gsap.fromTo(
        split.chars,
        {
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: '50% 0%',
        },
        {
          ease: 'back.inOut(2)',
          duration: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom+=10%',
            end: 'bottom top+=40%',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [ref])
}
