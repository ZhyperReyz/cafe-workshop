import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * PageHeader — big page title for the routed pages. The title characters
 * rise into place on mount (the "enter" half of the page transition,
 * ported from Page Transitions/1 Enter.js).
 */
export default function PageHeader({ index, label, title, lede }) {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: 'chars',
        charsClass: 'char',
      })
      gsap.set(split.chars, { yPercent: 110 })
      gsap.to(split.chars, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.035,
        ease: 'expo.out',
        delay: 0.15,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <header className="page-header">
      <p className="section-label">
        {index} · {label}
      </p>
      <h1 className="page-header__title" ref={titleRef}>
        {title}
      </h1>
      {lede && <p className="page-lede">{lede}</p>}
    </header>
  )
}
