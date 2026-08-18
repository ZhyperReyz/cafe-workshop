import { useRef } from 'react'
import useScrollTypography from '../hooks/useScrollTypography'

export default function About() {
  const titleRef = useRef(null)
  useScrollTypography(titleRef)

  return (
    <section className="about" id="about">
      <h3 className="about__statement" ref={titleRef}>
        A small class with a big heart — built for people who want to actually
        speak Japanese.
      </h3>
    </section>
  )
}
