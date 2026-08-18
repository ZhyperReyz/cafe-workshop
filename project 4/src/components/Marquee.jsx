const WORDS = [
  'こんにちは',
  'ありがとう',
  'すごい',
  '美しい',
  '頑張って',
  '楽しい',
  '元気',
  '夢',
  '言葉',
  '文化',
]

/** Scrolling Japanese-word marquee (Text Animations), pure CSS animation. */
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((i) => (
          <div className="marquee__group" key={i}>
            {WORDS.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
