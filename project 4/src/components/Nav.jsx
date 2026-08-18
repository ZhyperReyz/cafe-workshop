import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, SplitText)

const MENU_LINKS_LEFT = [
  { label: 'Home', dataText: 'Home', href: '#/' },
  { label: 'Curriculum', dataText: 'Curriculum', href: '#/curriculum' },
  { label: 'Teachers', dataText: 'Teachers', href: '#/teachers' },
]

const MENU_LINKS_RIGHT = [
  { label: 'Schedule', dataText: 'Schedule', href: '#/schedule' },
  { label: 'Gallery', dataText: 'Gallery', href: '#/gallery' },
  { label: 'Contact', dataText: 'Contact', href: '#/contact' },
]

/**
 * Nav + fullscreen menu (Navigation Menus/1). Two-sided "unrolling"
 * background reveal + staggered line-by-line text via SplitText, driven by a
 * paused GSAP timeline. Menu links navigate between pages via hash routes.
 * Hover slides the line up while a red duplicate rises from below.
 */
export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const menuTlRef = useRef(null)

  useEffect(() => {
    CustomEase.create('jump', '0.85, 0, 0.15, 1')

    const ctx = gsap.context(() => {
      SplitText.create('.menu a', {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      })

      const menuTl = gsap.timeline({ paused: true })
      menuTl
        .to(
          '.menu__bg-box--left, .menu__bg-box--right',
          { rotate: 0, duration: 1, ease: 'jump' },
          0
        )
        .to(
          '.menu__column .line',
          { y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
          0.6
        )
      menuTlRef.current = menuTl
    }, menuRef)

    return () => ctx.revert()
  }, [])

  const openMenu = () => {
    menuTlRef.current?.play()
    window.lenis?.stop()
    setIsOpen(true)
  }

  const closeMenu = () => {
    menuTlRef.current?.reverse()
    window.lenis?.start()
    setIsOpen(false)
  }

  const handleToggle = () => (isOpen ? closeMenu() : openMenu())

  // Menu links are page routes — close the menu and let the hash change; the
  // router in App runs the curtain transition on hashchange.
  const handleLinkClick = (e, href) => {
    closeMenu()
    if (window.location.hash === href) {
      e.preventDefault()
    }
  }

  const handleHoverEnter = (e) => {
    gsap.to(e.currentTarget.querySelectorAll('.line'), {
      y: '-110%',
      duration: 0.5,
      ease: 'power3.inOut',
    })
  }

  const handleHoverLeave = (e) => {
    gsap.to(e.currentTarget.querySelectorAll('.line'), {
      y: '0%',
      duration: 0.5,
      ease: 'power3.inOut',
    })
  }

  const renderColumn = (links) => (
    <div className="menu__column">
      {links.map(({ label, href }) => (
        <a
          key={href}
          href={href}
          className="menu__link"
          data-text={label}
          onClick={(e) => handleLinkClick(e, href)}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          {label}
        </a>
      ))}
    </div>
  )

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__logo">
            <a href="#/" className="nav__logo-link">
              日本語
            </a>
          </div>
          <div
            className="nav__btn-toggle"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggle()
              }
            }}
          >
            <span>{isOpen ? 'CLOSE' : 'MENU'}</span>
          </div>
        </div>
      </nav>

      <div ref={menuRef} className={`menu${isOpen ? ' active' : ''}`}>
        <div className="menu__bg">
          <div className="menu__bg-side menu__bg-side--left">
            <div className="menu__bg-box menu__bg-box--left" />
          </div>
          <div className="menu__bg-side menu__bg-side--right">
            <div className="menu__bg-box menu__bg-box--right" />
          </div>
        </div>
        <div className="menu__content">
          {renderColumn(MENU_LINKS_LEFT)}
          {renderColumn(MENU_LINKS_RIGHT)}
        </div>
      </div>
    </>
  )
}
