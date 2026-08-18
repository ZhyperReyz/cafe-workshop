import { gsap } from 'gsap'

/**
 * Grid-to-preview (Grid Animations/4) ported from product-grid.js +
 * product-preview.js. Renders two full-bleed preview panels that scale up
 * from a cross-shaped clip when a product is hovered, cycling through the
 * product's detail images.
 */

const debounce = (fn, wait = 150) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

class ProductPreview {
  constructor({ products, container }) {
    const allPreviewImages = container.querySelector(
      '.product-preview__images'
    ).children
    const previewImages = {}
    Array.from(allPreviewImages).forEach((img) => {
      const id = img.dataset.id
      if (!previewImages[id]) previewImages[id] = []
      previewImages[id].push(img)
    })

    this.ui = {
      products,
      container,
      clipped: container.querySelector('.masked-preview'),
      title: container.querySelector('.product-title'),
      price: container.querySelector('.product-price'),
      allPreviewImages,
      previewImagesPerID: previewImages,
    }

    this.scaleFactor = { x: 1, y: 1 }
    this.armWidth = { x: 10, y: 10 }
    this.galleryTimeline = null
    this.timeline = null

    this.onResize() // buildTimeline is called within onResize
  }

  setProduct(product) {
    if (this.galleryTimeline) this.galleryTimeline.kill()

    if (product) {
      this.ui.title.innerHTML = product.dataset.name
      this.ui.price.innerHTML = product.dataset.price

      gsap.set(this.ui.allPreviewImages, { opacity: 0 })
      gsap.set(this.ui.previewImagesPerID[product.dataset.index], { opacity: 1 })

      this.timeline.play().then(() => this.startPreviewGallery(product.dataset.index))
    } else {
      this.timeline.reverse()
      if (this.galleryTimeline) this.galleryTimeline.kill()
    }
  }

  buildTimeline() {
    const { x, y } = this.armWidth

    this.timeline = gsap
      .timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
      .addLabel('preview', 0)
      .addLabel('products', 0)
      .to(this.ui.container, { opacity: 1 }, 'preview')
      .to(
        this.ui.container,
        {
          scaleX: this.scaleFactor.x,
          scaleY: this.scaleFactor.y,
          transformOrigin: 'center center',
        },
        'preview'
      )
      .to(
        this.ui.products,
        {
          opacity: 0,
          x: (i) => (i % 2 === 0 ? '2.5vw' : '-2.5vw'),
          y: (i) => (i < 2 ? '2.5vw' : '-2.5vw'),
        },
        'products'
      )
      .fromTo(
        this.ui.clipped,
        {
          clipPath: `polygon(
        ${50 - x / 2}% 0%,
        ${50 + x / 2}% 0%,
        ${50 + x / 2}% ${50 - y / 2}%,
        100% ${50 - y / 2}%,
        100% ${50 + y / 2}%,
        ${50 + x / 2}% ${50 + y / 2}%,
        ${50 + x / 2}% 100%,
        ${50 - x / 2}% 100%,
        ${50 - x / 2}% ${50 + y / 2}%,
        0% ${50 + y / 2}%,
        0% ${50 - y / 2}%,
        ${50 - x / 2}% ${50 - y / 2}%
      )`,
        },
        {
          clipPath: `polygon(
        50% 0%,
        50% 0%,
        50% 50%,
        100% 50%,
        100% 50%,
        50% 50%,
        50% 100%,
        50% 100%,
        50% 50%,
        0% 50%,
        0% 50%,
        50% 50%
        )`,
        },
        'preview'
      )
  }

  startPreviewGallery(id) {
    const images = this.ui.previewImagesPerID[id]
    const timeline = gsap.timeline({ repeat: -1 })

    gsap.set([...images].slice(1), { opacity: 0 })
    images.forEach((image) => {
      timeline
        .set(images, { opacity: 0 })
        .set(image, { opacity: 1 })
        .to(image, { duration: 0, opacity: 1 }, '+=0.5')
    })

    this.galleryTimeline = timeline
  }

  onResize() {
    const { width, height } = this.ui.container.getBoundingClientRect()
    const vw = window.innerWidth / 100

    // 1. 'arms' width for the clip path (cross), in container %
    const armWidthVw = 5
    const armWidthPx = armWidthVw * vw
    this.armWidth = {
      x: width > 0 ? (armWidthPx / width) * 100 : 10,
      y: height > 0 ? (armWidthPx / height) * 100 : 10,
    }

    // 2. scale for the preview container (shrinks toward the center)
    const widthInVw = width / vw
    const heightInVw = height / vw
    const shrinkVw = 5
    this.scaleFactor = {
      x: (widthInVw - shrinkVw) / widthInVw,
      y: (heightInVw - shrinkVw) / heightInVw,
    }

    this.rebuildTimeline()
  }

  rebuildTimeline() {
    if (this.timeline) this.timeline.kill()
    this.buildTimeline()
  }

  destroy() {
    if (this.galleryTimeline) this.galleryTimeline.kill()
    if (this.timeline) this.timeline.kill()
  }
}

export default class GridPreview {
  constructor({ grid, panelLeft, panelRight }) {
    this.ui = {
      products: Array.from(grid.querySelectorAll('.product')),
      containerLeft: panelLeft,
      containerRight: panelRight,
    }

    this.previewLeft = null
    this.previewRight = null
    this.activeProduct = null
    this.hoverDelay = null

    this.init()
  }

  init() {
    this.previewLeft = new ProductPreview({
      container: this.ui.containerRight,
      products: this.ui.products.filter((_, i) => i % 4 === 2 || i % 4 === 3),
    })
    this.previewRight = new ProductPreview({
      container: this.ui.containerLeft,
      products: this.ui.products.filter((_, i) => i % 4 === 0 || i % 4 === 1),
    })

    this.onResize = debounce(() => {
      this.previewRight.onResize()
      this.previewLeft.onResize()
    })
    window.addEventListener('resize', this.onResize)

    this.ui.products.forEach((product) => {
      product.addEventListener('mouseenter', () =>
        this.productMouseEnter(product)
      )
      product.addEventListener('mouseleave', () => this.productMouseLeave())
    })
  }

  getProductSide(product) {
    const i = product.dataset.index
    const isLeft = i % 4 === 0 || i % 4 === 1
    return isLeft ? this.previewLeft : this.previewRight
  }

  productMouseEnter(product) {
    if (this.hoverDelay) {
      clearTimeout(this.hoverDelay)
      this.hoverDelay = null
    }
    this.hoverDelay = setTimeout(() => {
      this.activeProduct = product
      this.getProductSide(product).setProduct(product)
      this.hoverDelay = null
    }, 100)
  }

  productMouseLeave() {
    if (this.hoverDelay) {
      clearTimeout(this.hoverDelay)
      this.hoverDelay = null
    }
    if (this.activeProduct) {
      this.getProductSide(this.activeProduct).setProduct(null)
      this.activeProduct = null
    }
  }

  destroy() {
    clearTimeout(this.hoverDelay)
    if (this.previewLeft) this.previewLeft.destroy()
    if (this.previewRight) this.previewRight.destroy()
    window.removeEventListener('resize', this.onResize)
  }
}
