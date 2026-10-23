'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function Favicon({ url }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <Icon name="globe" className="h-5 w-5 text-accent" />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostOf(url)}&sz=64`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-6 w-6 rounded"
    />
  )
}

export default function Links({ index, links }) {
  const [active, setActive] = useState('All')
  const categories = [...new Set(links.map((l) => l.category).filter(Boolean))]
  const tabs = [
    { label: 'All', count: links.length },
    ...categories.map((c) => ({ label: c, count: links.filter((l) => l.category === c).length })),
  ]
  const visible = active === 'All' ? links : links.filter((l) => l.category === active)

  return (
    <Section id="links" index={index} label="links" title="Around the web">
      {categories.length > 1 && (
        <Reveal className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="glass inline-flex gap-1 rounded-full p-1" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={active === t.label}
                onClick={() => setActive(t.label)}
                className={`relative rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  active === t.label ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {active === t.label && (
                  <motion.span
                    layoutId="links-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-accent/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {t.label}
                <span className="ml-1.5 font-mono text-xs text-muted">{t.count}</span>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((l) => (
            <motion.a
              key={l.url + l.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="glass group flex h-full flex-col rounded-3xl p-5 transition-colors hover:border-accent/40 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-surface-solid">
                  <Favicon url={l.url} />
                </span>
                <Icon name="external" className="h-4 w-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">{l.title}</h3>
              </div>
              {l.category && (
                <span className="mt-2 self-start rounded-full bg-accent-2/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent-2">
                  {l.category}
                </span>
              )}
              {l.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{l.description}</p>}
              <p className="mt-auto truncate pt-4 font-mono text-xs text-muted/80">{hostOf(l.url)}</p>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
