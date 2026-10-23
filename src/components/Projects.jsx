'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'

// Mouse-follow tilt + glow shared by featured and regular cards
function useTilt(max = 6) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(x, (v) => `${v * 100}%`)
  const glowY = useTransform(y, (v) => `${v * 100}%`)
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(400px circle at ${gx} ${gy}, var(--c-glow), transparent 60%)`,
  )

  return {
    style: { rotateX, rotateY, transformPerspective: 1000 },
    glow,
    handlers: {
      onMouseMove: (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width)
        y.set((e.clientY - r.top) / r.height)
      },
      onMouseLeave: () => {
        x.set(0.5)
        y.set(0.5)
      },
    },
  }
}

function ProjectLinks({ project }) {
  const { live, github } = project.links ?? {}
  return (
    <>
      {github && (
        <a href={github} target="_blank" rel="noreferrer" aria-label="Source code" className="hover:text-accent">
          <Icon name="github" />
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noreferrer" aria-label="Live site" className="hover:text-accent">
          <Icon name="external" />
        </a>
      )}
    </>
  )
}

function FeaturedCard({ project, i }) {
  const { style, glow, handlers } = useTilt(3)
  const flip = i % 2 === 1

  return (
    <Reveal delay={0.05}>
      <motion.article
        style={style}
        {...handlers}
        className="glass group relative grid grid-cols-1 overflow-hidden rounded-3xl transition-colors hover:border-accent/40 md:grid-cols-2"
      >
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: glow }} />

        {/* Visual side: screenshot if provided, otherwise a decorative stack panel */}
        <div className={`relative min-h-56 overflow-hidden ${flip ? 'md:order-2' : ''}`}>
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-accent-2/10 to-transparent">
              <div className="bg-grid absolute inset-0 opacity-60" />
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/30">
                  <Icon name="folder" className="h-6 w-6" />
                </span>
                <div>
                  {project.org && <p className="mb-3 font-mono text-xs tracking-widest text-accent uppercase">{project.org}</p>}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-lg border border-line bg-surface-solid/70 px-2.5 py-1 font-mono text-xs backdrop-blur">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative p-5 sm:p-8">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">Featured project</p>
            <div className="flex items-center gap-3 text-muted">
              <ProjectLinks project={project} />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-accent sm:text-3xl">{project.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>

          {project.points?.length > 0 && (
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted">
              {project.points.map((p, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-1 text-accent">▹</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full bg-fg/5 px-3 py-1 font-mono text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

function ProjectCard({ project, i }) {
  const [open, setOpen] = useState(false)
  const { style, glow, handlers } = useTilt()

  return (
    <Reveal delay={i * 0.1}>
      <motion.article
        style={style}
        {...handlers}
        className="glass group relative h-full overflow-hidden rounded-3xl p-5 transition-colors hover:border-accent/40 sm:p-7"
      >
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: glow }} />

        <div className="relative">
          <div className="mb-5 flex items-start justify-between gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <Icon name="folder" />
            </span>
            <div className="flex items-center gap-3 text-muted">
              <ProjectLinks project={project} />
              {project.org && <span className="rounded-full border border-line px-3 py-1 font-mono text-xs">{project.org}</span>}
            </div>
          </div>

          <h3 className="font-display text-xl font-bold transition-colors group-hover:text-accent">{project.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{project.summary}</p>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ul className="space-y-2 pt-4 text-[15px] leading-relaxed text-muted">
                  {project.points.map((p, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-1 text-accent">▹</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {project.points?.length > 0 && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              {open ? 'Show less' : 'Key highlights'}
              <Icon name="chevron" className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full bg-fg/5 px-3 py-1 font-mono text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

export default function Projects({ index, projects }) {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <Section id="projects" index={index} label="projects" title="Things I've built">
      {featured.length > 0 && (
        <div className="space-y-8">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} project={p} i={i} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className={featured.length > 0 ? 'mt-20' : ''}>
          {featured.length > 0 && (
            <Reveal className="mb-8 text-center">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Other projects</h3>
              <p className="mt-2 text-muted">More work across different stacks and problem spaces.</p>
            </Reveal>
          )}
          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${others.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {others.map((p, i) => (
              <ProjectCard key={p.title} project={p} i={i} />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
