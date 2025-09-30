"use client"

import { motion, Variants, Transition } from "framer-motion"
import { ReactNode } from "react"

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  type?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "rotate"
  trigger?: "onLoad" | "inView"
  staggerChildren?: number
  staggerDirection?: number
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
  },
}

export function MotionWrapper({
  children,
  className,
  delay = 0,
  duration = 0.6,
  type = "fadeIn",
  trigger = "onLoad",
  staggerChildren,
  staggerDirection = 1,
}: MotionWrapperProps) {
  const variants = animationVariants[type]

  const transition: Transition = {
    duration,
    delay,
    ease: "easeOut", // Using built-in easing
  }

  if (staggerChildren) {
    return (
      <motion.div
        className={className}
        variants={{
          animate: {
            transition: {
              staggerChildren,
              staggerDirection,
            },
          },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    )
  }

  if (trigger === "inView") {
    return (
      <motion.div
        className={className}
        initial={variants.initial as any}
        whileInView={variants.animate as any}
        viewport={{ once: true, margin: "-50px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={variants.initial as any}
      animate={variants.animate as any}
      exit={variants.exit as any}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

// Individual motion item for staggered animations
interface MotionItemProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  type?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "rotate"
}

export function MotionItem({
  children,
  className,
  delay = 0,
  duration = 0.6,
  type = "fadeIn",
}: MotionItemProps) {
  const variants = animationVariants[type]

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// Hook for intersection observer animations
export function useInViewAnimation() {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  }
}