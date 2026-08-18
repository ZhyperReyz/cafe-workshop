import { useRef, useState } from 'react'
import useTitleReveal from '../hooks/useTitleReveal'
import Magnetic from './Magnetic'

export default function Contact() {
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const [sent, setSent] = useState(false)
  useTitleReveal(titleRef)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    formRef.current?.reset()
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-left">
        <p className="section-label">Contact · 連絡先</p>
        <h2 className="title-reveal" ref={titleRef}>
          Come say hello
        </h2>
        <p className="contact-intro">
          Visit us, write to us, or book a free trial lesson. We answer within
          one business day — 日本語でも英語でも大丈夫.
        </p>
        <div className="contact-details">
          <p>教室 · 2-11-3 Sakura-dori, Kyoto</p>
          <p>電話 · +81 75 000 0000</p>
          <p>メール · hello@nihongo-class.jp</p>
        </div>
      </div>

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-row">
          <input type="text" name="name" placeholder="Your name 名前" required />
        </div>
        <div className="form-row">
          <input type="email" name="email" placeholder="Email メール" required />
        </div>
        <div className="form-row">
          <select name="level" required defaultValue="">
            <option value="" disabled>
              Your level レベル
            </option>
            <option>Beginner 入門 (N5)</option>
            <option>Intermediate 中級 (N4–N3)</option>
            <option>Advanced 上級 (N2–N1)</option>
            <option>Not sure — help me choose</option>
          </select>
        </div>
        <div className="form-row">
          <textarea
            name="message"
            rows="4"
            placeholder="Tell us about you メッセージ"
          />
        </div>
        <div className="form-submit magnetic-wrap">
          <Magnetic type="submit">Send 送信</Magnetic>
        </div>
        <p className="form-success" hidden={!sent}>
          ありがとうございます! We'll be in touch soon.
        </p>
      </form>
    </section>
  )
}
