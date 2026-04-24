import { useReducedMotion } from 'framer-motion'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: reduceMotion() ? 0 : 0.6, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: reduceMotion() ? 0 : 0.1, delayChildren: 0 } }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: reduceMotion() ? 0 : 0.5 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion() ? 0 : 0.4 } }
}
