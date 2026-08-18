import { useRef } from 'react'
import useTitleReveal from '../hooks/useTitleReveal'
import useImageReveal from '../hooks/useImageReveal'

const LEVELS = [
  {
    img: '/level-1.jpg',
    tag: 'N5 · Starter',
    title: 'Beginner 入門',
    desc: 'Hiragana, katakana and the first building blocks of grammar. Walk away able to introduce yourself, order food and read signs in the city.',
  },
  {
    img: '/level-2.jpg',
    tag: 'N4 – N3 · Core',
    title: 'Intermediate 中級',
    desc: 'Real conversations, keigo basics and the kanji you actually meet in daily life. Start thinking in Japanese instead of translating.',
  },
  {
    img: '/level-3.jpg',
    tag: 'N2 – N1 · Fluent',
    title: 'Advanced 上級',
    desc: 'Nuance, business Japanese and JLPT mastery. Discuss news, culture and ideas with confidence and natural rhythm.',
  },
]

function LevelCard({ level }) {
  const imgRef = useRef(null)
  useImageReveal(imgRef)

  return (
    <article className="level-card">
      <div className="level-img img-reveal" ref={imgRef}>
        <img src={level.img} alt="" />
      </div>
      <div className="level-info">
        <div className="level-tag">{level.tag}</div>
        <h3>{level.title}</h3>
        <p>{level.desc}</p>
      </div>
    </article>
  )
}

export default function Levels() {
  const titleRef = useRef(null)
  useTitleReveal(titleRef)

  return (
    <section className="levels" id="levels">
      <div className="section-head">
        <p className="section-label">Levels · レベル</p>
        <h2 className="title-reveal" ref={titleRef}>
          Find your starting point
        </h2>
      </div>

      <div className="levels-grid">
        {LEVELS.map((level) => (
          <LevelCard key={level.title} level={level} />
        ))}
      </div>
    </section>
  )
}
