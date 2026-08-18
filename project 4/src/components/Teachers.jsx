import { useRef } from 'react'
import useTitleReveal from '../hooks/useTitleReveal'
import useImageReveal from '../hooks/useImageReveal'

const TEACHERS = [
  {
    img: '/teacher-1.jpg',
    alt: 'Portrait of Yuki Sato',
    name: 'Yuki Sato · 佐藤 優希',
    role: 'Head teacher — conversation & culture',
  },
  {
    img: '/teacher-2.jpg',
    alt: 'Portrait of Hiro Nakamura',
    name: 'Hiro Nakamura · 中村 浩',
    role: 'Grammar & kanji specialist',
  },
  {
    img: '/teacher-3.jpg',
    alt: 'Portrait of Emi Kobayashi',
    name: 'Emi Kobayashi · 小林 恵美',
    role: 'JLPT prep & business Japanese',
  },
]

function TeacherCard({ teacher }) {
  const imgRef = useRef(null)
  useImageReveal(imgRef)

  return (
    <article className="teacher-card">
      <div className="teacher-img img-reveal" ref={imgRef}>
        <img src={teacher.img} alt={teacher.alt} />
      </div>
      <p className="teacher-name">{teacher.name}</p>
      <p className="teacher-role">{teacher.role}</p>
    </article>
  )
}

export default function Teachers() {
  const titleRef = useRef(null)
  useTitleReveal(titleRef)

  return (
    <section className="teachers" id="teachers">
      <div className="section-head">
        <p className="section-label">Teachers · 先生</p>
        <h2 className="title-reveal" ref={titleRef}>
          Learn from people who live the language
        </h2>
      </div>

      <div className="teachers-grid">
        {TEACHERS.map((teacher) => (
          <TeacherCard key={teacher.name} teacher={teacher} />
        ))}
      </div>
    </section>
  )
}
