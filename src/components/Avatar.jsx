'use client'

import { motion } from 'framer-motion'

export default function Avatar({ avatar }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-44 sm:w-56 lg:w-full lg:max-w-sm"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative aspect-square"
      >
        {/* glow */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-accent/40 to-accent-2/40 blur-3xl" />
        {/* rotating gradient ring */}
        <div className="absolute -inset-1.5 overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%]">
          <div className="absolute inset-[-50%] animate-spin-slow bg-[conic-gradient(from_0deg,var(--c-accent),var(--c-accent-2),transparent_40%,var(--c-accent))]" />
        </div>
        {/* photo */}
        <picture>
          <source srcSet={avatar.src} type="image/webp" />
          <img
            src={avatar.fallback ?? avatar.src}
            alt={avatar.alt}
            width="640"
            height="640"
            loading="eager"
            fetchPriority="high"
            className="relative h-full w-full rounded-[42%_58%_55%_45%/48%_42%_58%_52%] border-4 border-bg object-cover object-top"
          />
        </picture>

        {avatar.badges?.map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.15 }}
            className={`absolute hidden items-center gap-2 rounded-full border border-line bg-surface-solid px-4 py-2 font-mono text-xs font-medium whitespace-nowrap shadow-xl sm:inline-flex ${
              i % 2 ? 'right-[-8%] bottom-[12%]' : 'top-[10%] left-[-12%]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${i % 2 ? 'bg-accent-2' : 'bg-accent'}`} />
            {b}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}
