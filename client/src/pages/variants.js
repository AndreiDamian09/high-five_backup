export const animations = {
  // 1. APARIȚIE ȘI LISTE
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  containerStagger: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  },

  // 2. ELEMENTE DE INTERFAȚĂ (MODALE / POP-UPS)
  modalZoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },

  // 3. FEEDBACK VIZUAL (BUTOANE ȘI CARDURI)
  buttonHover: {
    whileHover: { scale: 1.03, filter: "brightness(1.1)" },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },

  // 4. LOADING STATES (SKELETONS)
  skeletonGlow: {
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  },

  // 5. NOTIFICĂRI SAU ERORI (SHAKE EFECT)
  shakeError: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  // 6. TRANZIȚII DE PAGINĂ (FADE)
  pageTransition: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { duration: 0.3 }
  },

  // 7. EXPANDARE (Pentru secțiuni de "Vezi Detalii" / Accordion)
  expand: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};