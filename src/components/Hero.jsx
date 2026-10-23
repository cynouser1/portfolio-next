'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from './ui/Icon'
import Avatar from './Avatar'

function useTyped(words, { type = 70, erase = 35, hold = 1600 } = {}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return
    const word = words[index % words.length]
    let delay = deleting ? erase : type
    if (!deleting && text === word) delay = hold

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => i + 1)
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, type, erase, hold])

  return text
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ meta, socials, hasProjects, hasContact }) {
  const typed = useTyped(meta.typedRoles ?? [meta.role])
  const [spot, setSpot] = useState({ x: 50, y: 40 })

  return (
    <section
      id="top"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
      }}
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-blob rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-[28rem] w-[28rem] animate-blob rounded-full bg-accent-2/20 blur-3xl [animation-delay:-6s]" />
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-300"
        style={{ background: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, var(--c-glow), transparent 60%)` }}
      />

      <div
        className={`relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-28 pb-20 sm:px-6 ${
          meta.avatar ? 'lg:grid-cols-[1.3fr_1fr] lg:gap-16' : ''
        }`}
      >
        {meta.avatar && (
          <div className="lg:order-last">
            <Avatar avatar={meta.avatar} />
          </div>
        )}
        <div className="text-center lg:text-left">
          {meta.availableForWork && (
            <motion.div {...fade(0)} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              {meta.availabilityText}
            </motion.div>
          )}

          <motion.p {...fade(0.1)} className="mb-4 font-mono text-accent">
            Hi there, I&apos;m
          </motion.p>

          <motion.h1
            {...fade(0.2)}
            className={`font-display leading-[0.95] font-bold tracking-tight ${
              meta.avatar ? 'text-5xl sm:text-7xl xl:text-8xl' : 'text-5xl sm:text-8xl lg:text-9xl'
            }`}
          >
            <span className="text-gradient animate-gradient">{meta.name}</span>
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.h2 {...fade(0.3)} className="mt-5 h-8 font-display text-xl font-semibold text-fg/90 sm:h-10 sm:text-3xl xl:text-4xl">
            {typed}
            <span className="ml-1 inline-block w-[3px] animate-blink bg-accent align-middle">&nbsp;</span>
          </motion.h2>

          <motion.p {...fade(0.4)} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
            {meta.tagline}
          </motion.p>

          <motion.div {...fade(0.5)} className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            {hasProjects && (
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 font-medium text-white shadow-lg shadow-accent/25 transition hover:shadow-xl hover:shadow-accent/40"
              >
                View my work
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            )}
            <a
              href={meta.resume}
              download
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium transition hover:border-accent/60 hover:text-accent"
            >
              <Icon name="download" className="h-4 w-4" />
              Download CV
            </a>
            {hasContact && (
              <a href="#contact" className="px-2 py-3.5 font-medium text-muted underline-offset-4 transition hover:text-fg hover:underline">
                Get in touch
              </a>
            )}
          </motion.div>

          <motion.div {...fade(0.6)} className="mt-10 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Icon name="pin" className="h-4 w-4" /> {meta.location}
            </span>
            <span className="h-px w-10 bg-line" />
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-muted transition hover:-translate-y-1 hover:text-accent"
              >
                <Icon name={s.icon} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted md:flex"
      >
        <span className="font-mono">scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-line pt-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1 rounded-full bg-accent"
          />
        </span>
      </a>
    </section>
  )
}
