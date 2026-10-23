'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import TechIcon from './ui/TechIcon'

export default function Skills({ index, skills }) {
  const categories = ['All', ...skills.map((s) => s.category)]
  const [active, setActive] = useState('All')
  const all = skills.flatMap((s) => s.items.map((item) => ({ ...item, category: s.category })))
  const shown = active === 'All' ? all : all.filter((s) => s.category === active)

  return (
    <Section id="skills" index={index} label="skills" title="My tech toolbox">
      <Reveal className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active === c ? 'text-white' : 'glass text-muted hover:text-fg'
            }`}
          >
            {active === c && (
              <motion.span
                layoutId="skill-tab"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-accent to-accent-2"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {c}
          </button>
        ))}
      </Reveal>

      <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((s, i) => (
            <motion.div
              layout
              key={`${s.category}-${s.name}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.025 } }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="glass group rounded-2xl p-4 transition-colors hover:border-accent/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3">
                  {s.icon && (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-fg/5 text-muted">
                      <TechIcon name={s.icon} className="h-[18px] w-[18px]" />
                    </span>
                  )}
                  <span className="truncate font-medium">{s.name}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-muted">{s.category}</span>
              </div>
              {s.level != null && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite marquee of every skill */}
      <div className="relative mt-16 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="glass group inline-flex items-center gap-2 rounded-full px-5 py-2 font-mono text-sm whitespace-nowrap text-muted">
              {s.icon && <TechIcon name={s.icon} className="h-4 w-4" />}
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}
