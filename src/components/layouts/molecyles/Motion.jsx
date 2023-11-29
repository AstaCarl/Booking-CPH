import React from 'react'
import { motion } from "framer-motion";

export default function Motion() {
  return (
    <motion.div
    whileHover={{
      scale: 1.02,
      opacity: 2,
    }} // Define the hover animation
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
  </motion.div>
  )
}
