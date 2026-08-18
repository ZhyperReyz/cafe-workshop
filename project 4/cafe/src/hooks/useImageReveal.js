import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Clip-path unroll + scale settle for images (port of script.js
 * initImageReveals). Pass a ref to the `.img-reveal` wrapper element.
 */
export default function useImageReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const img = el.querySelector('img')

      gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' })

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power4.inOut',
          })
          gsap.to(img, {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out',
          })
        },
      })
    })

    return () => ctx.revert()
  }, [ref])
}
