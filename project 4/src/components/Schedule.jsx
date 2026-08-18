import { useRef } from 'react'
import useTitleReveal from '../hooks/useTitleReveal'

const ROWS = [
  { name: 'Beginner 入門', time: 'Tue & Thu · 18:30 – 20:00', price: '$160 / month' },
  { name: 'Intermediate 中級', time: 'Mon & Wed · 18:30 – 20:00', price: '$180 / month' },
  { name: 'Advanced 上級', time: 'Sat · 10:00 – 12:30', price: '$200 / month' },
  { name: 'Private マンツーマン', time: 'Flexible · by arrangement', price: 'from $40 / hour' },
]

export default function Schedule() {
  const titleRef = useRef(null)
  useTitleReveal(titleRef)

  return (
    <section className="schedule" id="schedule">
      <div className="section-head">
        <p className="section-label">Schedule · 時間割</p>
        <h2 className="title-reveal" ref={titleRef}>
          Pick a time that fits your life
        </h2>
      </div>

      <div className="schedule-table">
        <div className="schedule-row schedule-row--head">
          <span>Class</span>
          <span>Time</span>
          <span>Price</span>
        </div>
        {ROWS.map((row) => (
          <div className="schedule-row" key={row.name}>
            <span>{row.name}</span>
            <span>{row.time}</span>
            <span>{row.price}</span>
          </div>
        ))}
      </div>

      <p className="schedule-note">
        All levels include study materials, homework feedback and access to our
        conversation club. First lesson is always free — 体験レッスン無料.
      </p>
    </section>
  )
}
