import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import Nav from './components/Nav'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import TeachersPage from './pages/TeachersPage'
import SchedulePage from './pages/SchedulePage'
import Gallery from './pages/Gallery'
import ContactPage from './pages/ContactPage'
import './App.css'

const ROUTES = {
  '/': Home,
  '/curriculum': Curriculum,
  '/teachers': TeachersPage,
  '/schedule': SchedulePage,
  '/gallery': Gallery,
  '/contact': ContactPage,
}

const ROUTE_NAMES = {
  '/': 'Home ホーム',
  '/curriculum': 'Curriculum カリキュラム',
  '/teachers': 'Teachers 先生',
  '/schedule': 'Schedule 時間割',
  '/gallery': 'Gallery 文化',
  '/contact': 'Contact 連絡先',
}

/** Read the current route from the location hash ('#/curriculum' → '/curriculum'). */
function getRoute() {
  const hash = window.location.hash
  if (!hash.startsWith('#/')) return '/'
  const path = hash.slice(1).split('?')[0]
  return path in ROUTES ? path : '/'
}

/**
 * Nihongo Class — Japanese language school site. Multi-page hash router:
 * each menu entry navigates to its own page behind a fullscreen curtain
 * transition (Page Transitions), with a first-load preloader.
 */
export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [loading, setLoading] = useState(true)
  const routeRef = useRef(route)
  const curtainRef = useRef(null)
  const curtainLabelRef = useRef(null)
  const transitioningRef = useRef(false)

  routeRef.current = route

  const performTransition = useCallback((nextRoute) => {
    if (transitioningRef.current || nextRoute === routeRef.current) return
    transitioningRef.current = true

    const overlay = curtainRef.current
    if (!overlay) {
      setRoute(nextRoute)
      return
    }
    if (curtainLabelRef.current) {
      curtainLabelRef.current.textContent = ROUTE_NAMES[nextRoute] || ''
    }

    const tl = gsap.timeline()
    tl.set(overlay, { display: 'flex', yPercent: 100 })
      .to(overlay, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' })
      .add(() => {
        setRoute(nextRoute)
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo(0, 0)
        }
      })
      .to(overlay, { yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.2 })
      .set(overlay, { display: 'none' })
      .add(() => {
        // Re-measure the freshly mounted page's ScrollTriggers (hero pin, …).
        requestAnimationFrame(() => ScrollTrigger.refresh())
        transitioningRef.current = false
      })
  }, [])

  useEffect(() => {
    const onHashChange = () => performTransition(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [performTransition])

  const Page = ROUTES[route]

  return (
    <>
      <Nav />
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <div ref={curtainRef} className="page-transition" aria-hidden="true">
        <span ref={curtainLabelRef} className="page-transition__label" />
      </div>
      <main key={route} id="top">
        <Page />
      </main>
      <Footer />
    </>
  )
}
