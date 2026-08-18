import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Hero — pinned clip-path slit reveal (project 3). The foreground image
 * splits open into a thin slit, rotates away, then two outro images unroll
 * while the closing line slides up. Ported from script.js.
 */
export default function Hero() {
  const rootRef = useRef(null)
  const fgRef = useRef(null)
  const overlayDarkRef = useRef(null)
  const overlayAccentRef = useRef(null)
  const bgCopyLeftRef = useRef(null)
  const bgCopyRightRef = useRef(null)
  const outroImgTopRef = useRef(null)
  const outroImgBottomRef = useRef(null)
  const outroHeaderRef = useRef(null)

  useEffect(() => {
    const hero = rootRef.current
    if (!hero) return

    const ctx = gsap.context(() => {
      const outroHeaderSplit = SplitText.create(
        hero.querySelector('.hero-outro-header h3'),
        {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line',
        }
      )
      gsap.set(outroHeaderSplit.lines, { y: '100%' })

      let areOutroLinesRevealed = false

      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress

          // Phase 1 — foreground slits open (clip-path narrows to a slit).
          const phase1Progress = gsap.utils.clamp(0, 1, scrollProgress / 0.25)
          const slitLeftEdge = gsap.utils.interpolate(0, 48, phase1Progress)
          const slitRightEdge = gsap.utils.interpolate(100, 52, phase1Progress)
          gsap.set(fgRef.current, {
            clipPath: `polygon(${slitLeftEdge}% 0%, ${slitRightEdge}% 0%, ${slitRightEdge}% 100%, ${slitLeftEdge}% 100%)`,
          })

          const darkOverlayOpacity = gsap.utils.interpolate(0, 1, phase1Progress)
          gsap.set(overlayDarkRef.current, { opacity: darkOverlayOpacity })

          // Phase 2 — slit rotates.
          const phase2Progress = gsap.utils.clamp(
            0,
            1,
            (scrollProgress - 0.25) / 0.2
          )
          const fgRotation = gsap.utils.interpolate(0, 65, phase2Progress)
          gsap.set(fgRef.current, { rotate: fgRotation })

          // Phase 3 — slit scales away, bg copy slides out to the sides.
          const phase3Progress = gsap.utils.clamp(
            0,
            1,
            (scrollProgress - 0.45) / 0.2
          )
          const fgScale = gsap.utils.interpolate(1, 0, phase3Progress)
          gsap.set(fgRef.current, { scale: fgScale })

          const bgCopyLeftX = gsap.utils.interpolate(0, 100, phase3Progress)
          const bgCopyRightX = gsap.utils.interpolate(0, -100, phase3Progress)
          gsap.set(bgCopyLeftRef.current, { x: `${bgCopyLeftX}%` })
          gsap.set(bgCopyRightRef.current, { x: `${bgCopyRightX}%` })

          const phase3OverlayProgress = gsap.utils.clamp(
            0,
            1,
            (scrollProgress - 0.45) / 0.05
          )
          const redOverlayOpacity = gsap.utils.interpolate(
            0,
            1,
            phase3OverlayProgress
          )
          gsap.set(overlayAccentRef.current, { opacity: redOverlayOpacity })

          // Phase 4 — outro images unroll toward each other.
          const phase4Progress = gsap.utils.clamp(
            0,
            1,
            (scrollProgress - 0.65) / 0.2
          )

          const topImgBottomEdge = gsap.utils.interpolate(0, 100, phase4Progress)
          gsap.set(outroImgTopRef.current, {
            clipPath: `polygon(0% 0%, 100% 0%, 100% ${topImgBottomEdge}%, 0% ${topImgBottomEdge}%)`,
          })

          const bottomImgTopEdge = gsap.utils.interpolate(100, 0, phase4Progress)
          gsap.set(outroImgBottomRef.current, {
            clipPath: `polygon(0% ${bottomImgTopEdge}%, 100% ${bottomImgTopEdge}%, 100% 100%, 0% 100%)`,
          })

          // Closing line reveals once the unroll is nearly done.
          if (scrollProgress >= 0.9 && !areOutroLinesRevealed) {
            areOutroLinesRevealed = true
            gsap.to(outroHeaderSplit.lines, {
              y: '0%',
              duration: 0.75,
              stagger: 0.1,
              ease: 'power3.out',
            })
          } else if (scrollProgress < 0.9 && areOutroLinesRevealed) {
            areOutroLinesRevealed = false
            gsap.to(outroHeaderSplit.lines, {
              y: '100%',
              duration: 0.25,
              stagger: -0.05,
              ease: 'power3.out',
            })
          }
        },
      })

      // Make sure the pinned trigger measures with the final layout.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, hero)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="hero">
      <div className="hero-fg-content" ref={fgRef}>
        <div className="hero-fg-img">
          <img src="/hero.jpg" alt="Torii gate in Japan" />
        </div>
        <div className="hero-fg-header">
          <h1>
            Learn Japanese
            <br />
            日本語
          </h1>
        </div>
        <div className="hero-fg-overlay-dark" ref={overlayDarkRef} />
        <div className="hero-fg-overlay" ref={overlayAccentRef} />
      </div>

      <div className="hero-bg-content">
        <div className="hero-bg-content-col">
          <div className="hero-bg-content-copy" ref={bgCopyLeftRef}>
            <h3>ことば</h3>
            <p>
              Language. Not just words on a page — the sounds, shapes and
              rhythm of everyday Japanese, taught the way it is really spoken.
            </p>
          </div>
        </div>
        <div className="hero-bg-content-col">
          <div className="hero-bg-content-copy" ref={bgCopyRightRef}>
            <h3>ぶんか</h3>
            <p>
              Culture. Every lesson carries the customs, manners and quiet
              details that make Japanese make sense beyond the textbook.
            </p>
          </div>
        </div>
      </div>

      <div className="hero-outro-content">
        <div className="hero-outro-img" ref={outroImgTopRef}>
          <img src="/outro-1.jpg" alt="" />
        </div>
        <div className="hero-outro-img" ref={outroImgBottomRef}>
          <img src="/outro-2.jpg" alt="" />
        </div>
        <div className="hero-outro-header" ref={outroHeaderRef}>
          <h3>Step into a language that changes how you see the world.</h3>
        </div>
      </div>
    </section>
  )
}
