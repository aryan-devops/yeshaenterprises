'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const steps = [15, 35, 55, 72, 88, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i])
        i++
      } else {
        clearInterval(interval)
        // Small delay after 100% before hiding
        setTimeout(() => setVisible(false), 400)
      }
    }, 220)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
          style={{ backdropFilter: 'blur(0px)' }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
              }}
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Logo + text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center gap-5 mb-12"
          >
            {/* Brand */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, letterSpacing: '0.08em' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl font-bold text-white tracking-widest uppercase"
              >
                YESHA Connect
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="text-zinc-500 text-sm mt-1 tracking-wider"
              >
                Order Management Platform
              </motion.p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-3 w-56"
          >
            {/* Track */}
            <div className="w-full h-[2px] rounded-full bg-white/8 overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)',
                }}
              />
            </div>

            {/* Percentage */}
            <motion.span
              className="text-zinc-600 text-xs font-mono tabular-nums"
            >
              {progress}%
            </motion.span>
          </motion.div>

          {/* Floating dots */}
          <div className="absolute bottom-12 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: 'easeInOut',
                }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
