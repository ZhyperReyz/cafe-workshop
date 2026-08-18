import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Magnetic button — leans toward the cursor while hovered and springs back
 * on leave (Physics Effects/3), ported from script.js initMagneticButtons.
 */
export default function Magnetic({ className = '', children, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const xTo = gsap.quickTo(el, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    })
    const yTo = gsap.quickTo(el, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    })

    const onMove = (e) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = el.getBoundingClientRect()
      xTo(clientX - (left + width / 2))
      yTo(clientY - (top + height / 2))
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <button
      ref={ref}
      className={`btn-magnetic${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
