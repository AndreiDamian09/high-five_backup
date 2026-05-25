export const animations = {
  // Fade + slide up — general purpose entrance
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Stagger parent — pairs with staggerItem on children
  containerStagger: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  },

  // Stagger child — used inside containerStagger parents
  staggerItem: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
  },

  // Scale up from slightly small
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", damping: 22, stiffness: 260 }
  },

  // Slide from the left
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.55, ease: "easeOut" }
  },

  // Slide from the right
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.55, ease: "easeOut" }
  },

  // Continuous vertical float
  floatY: {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
    }
  },

  // Modal / card zoom entrance
  modalZoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },

  // Button press feedback
  buttonHover: {
    whileHover: { scale: 1.03, filter: "brightness(1.1)" },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },

  // Skeleton loading pulse
  skeletonGlow: {
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  },

  // Error shake
  shakeError: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  // Page-level fade + slide (used with AnimatePresence)
  pageTransition: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { duration: 0.3 }
  },

  // Accordion / detail expand
  expand: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};
