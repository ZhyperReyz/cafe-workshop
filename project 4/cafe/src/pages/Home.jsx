import Hero from '../components/Hero'
import About from '../components/About'
import Marquee from '../components/Marquee'
import Voices from '../components/Voices'

/** Home — pinned hero reveal, statement, marquee and student voices. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Marquee />
      <Voices />
    </>
  )
}
