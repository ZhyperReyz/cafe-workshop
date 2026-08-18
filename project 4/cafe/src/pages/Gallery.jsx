import { useEffect, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import GridPreview from '../lib/gridPreview'
import '../Gallery.css'

const PRODUCTS = [
  { index: 0, name: 'Candle holder · ろうそく立', price: '2,500', src: '/gallery/products/product-1.webp' },
  { index: 1, name: 'Cow vase · うし', price: '4,000', src: '/gallery/products/product-2.webp' },
  { index: 2, name: 'Bookshelf · 本棚', price: '20,000', src: '/gallery/products/product-3.webp' },
  { index: 3, name: 'Side table · テーブル', price: '12,000', src: '/gallery/products/product-4.webp' },
  { index: 4, name: 'Armchair · イス', price: '22,000', src: '/gallery/products/product-5.webp' },
  { index: 5, name: 'Cabinet · タンス', price: '18,000', src: '/gallery/products/product-6.webp' },
  { index: 6, name: 'Clock · とけい', price: '3,000', src: '/gallery/products/product-7.webp' },
  { index: 7, name: 'Chair · チェア', price: '5,000', src: '/gallery/products/product-8.webp' },
]

// Preview panels: left panel shows products 2, 3, 6, 7; right shows 0, 1, 4, 5.
const LEFT_IDS = [2, 3, 6, 7]
const RIGHT_IDS = [0, 1, 4, 5]

const detailSrc = (id, detail) =>
  `/gallery/products/product-${id}${detail === 0 ? '' : `-detail-${detail}`}.webp`

function PreviewImages({ ids }) {
  return (
    <>
      <div className="product-preview__images">
        {ids.flatMap((id) =>
          [0, 1, 2].map((d) => (
            <img key={`${id}-${d}`} data-id={id} src={detailSrc(id, d)} alt="" />
          ))
        )}
      </div>
      <div className="product-preview__details">
        <p className="product-title">product title</p>
        <p>
          ¥ <span className="product-price">0</span>
        </p>
      </div>
      <div className="product-preview__inside masked-preview" />
    </>
  )
}

/** Gallery — grid-to-preview (Grid Animations/4): hover a tile and the
 *  matching full-bleed preview scales up from a cross-shaped clip. */
export default function Gallery() {
  const gridRef = useRef(null)
  const panelLeftRef = useRef(null)
  const panelRightRef = useRef(null)

  useEffect(() => {
    if (!gridRef.current || !panelLeftRef.current || !panelRightRef.current) return
    const preview = new GridPreview({
      grid: gridRef.current,
      panelLeft: panelLeftRef.current,
      panelRight: panelRightRef.current,
    })
    return () => preview.destroy()
  }, [])

  return (
    <div className="gallery">
      <PageHeader
        index="04"
        label="Gallery"
        title="Gallery 文化"
        lede="Objects from the classroom and the culture around it — hover to preview, and let the pieces tell their story."
      />
      <div className="products" ref={gridRef}>
        <ul className="products__grid">
          {PRODUCTS.map((product) => (
            <li
              key={product.index}
              className="product"
              data-name={product.name}
              data-price={product.price}
              data-index={product.index}
            >
              <div className="product__cta">
                <p>View 見る</p>
              </div>
              <img src={product.src} alt={product.name} />
            </li>
          ))}
        </ul>
        <div className="products__preview">
          <div ref={panelLeftRef} className="product-preview --left">
            <PreviewImages ids={LEFT_IDS} />
          </div>
          <div ref={panelRightRef} className="product-preview --right">
            <PreviewImages ids={RIGHT_IDS} />
          </div>
        </div>
      </div>
    </div>
  )
}
