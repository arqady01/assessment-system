import { motion } from 'framer-motion'
import { forwardRef } from 'react'

// Type-safe wrapper for motion components to handle className and other HTML props
export const MotionDiv = forwardRef<HTMLDivElement, any>((props, ref) => {
  return <motion.div ref={ref} {...props} />
})

export const MotionButton = forwardRef<HTMLButtonElement, any>((props, ref) => {
  return <motion.button ref={ref} {...props} />
})

export const MotionH2 = forwardRef<HTMLHeadingElement, any>((props, ref) => {
  return <motion.h2 ref={ref} {...props} />
})

export const MotionP = forwardRef<HTMLParagraphElement, any>((props, ref) => {
  return <motion.p ref={ref} {...props} />
})

MotionDiv.displayName = 'MotionDiv'
MotionButton.displayName = 'MotionButton'
MotionH2.displayName = 'MotionH2'
MotionP.displayName = 'MotionP'
