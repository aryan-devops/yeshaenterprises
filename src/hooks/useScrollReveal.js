import { useEffect, useRef } from 'react'

export default function useScrollReveal(options = {}) {
  const elementsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          if (options.once !== false) {
            observer.unobserve(entry.target)
          }
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    })

    const currentElements = elementsRef.current
    currentElements.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => {
      currentElements.forEach((el) => {
        if (el) observer.unobserve(el)
      })
    }
  }, [options])

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el)
    }
  }

  return addToRefs
}
