export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  fadeInUpDelay: (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
  }),
  hoverScale: {
    whileHover: { scale: 1.01, y: -3 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tapScale: {
    whileTap: { scale: 0.98 }
  },
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'spring', damping: 25, stiffness: 220 }
  },
  modalFade: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.25, ease: 'easeOut' }
  }
};
