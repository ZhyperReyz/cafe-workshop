import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * Preloader — first-load intro: the 日本語 logo slides up in characters,
 * a 0→100 counter runs, then the dark panel wipes away. Rendered once on
 * top of everything and unmounts when done.
 */
export default function Preloader({ onDone }) {
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { val: 0 }

      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true)
          if (onDone) onDone()
        },
      })

      tl.to('.preloader__chars .char', {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
      })
        .to(
          counter,
          {
            val: 100,
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (numRef.current) {
                numRef.current.textContent = String(Math.round(counter.val)).padStart(3, '0')
              }
            },
          },
          '<'
        )
        .to('.preloader__panel', {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
          delay: 0.25,
        })
    }, rootRef)

    return () => ctx.revert()
  }, [onDone])

  if (gone) return null

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader__panel">
        <div className="preloader__logo">
          <span className="preloader__chars">日本語</span>
        </div>
        <p className="preloader__tag">NIHONGO CLASS · 日本語クラス</p>
        <span ref={numRef} className="preloader__num">
          000
        </span>
      </div>
    </div>
  )
}
