import { useRef } from 'react'
import useTitleReveal from '../hooks/useTitleReveal'

const VOICES = [
  {
    quote:
      '“After three months I could hold a real conversation with my host family. I never thought that was possible.”',
    author: 'Maria · Beginner 入門',
  },
  {
    quote:
      '“The way they teach kanji finally made it stick. It stopped being memorizing and became understanding.”',
    author: 'Daniel · Intermediate 中級',
  },
  {
    quote:
      "“Passed N2 because of Emi-sensei's patient, practical prep. The best money I spent all year.”",
    author: 'Aisha · Advanced 上級',
  },
]

export default function Voices() {
  const titleRef = useRef(null)
  useTitleReveal(titleRef)

  return (
    <section className="voices" id="voices">
      <div className="section-head">
        <p className="section-label">Voices · 声</p>
        <h2 className="title-reveal" ref={titleRef}>
          What our students say
        </h2>
      </div>

      <div className="voices-grid">
        {VOICES.map((voice) => (
          <blockquote className="voice-card" key={voice.author}>
            <p className="voice-quote">{voice.quote}</p>
            <footer className="voice-author">{voice.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
