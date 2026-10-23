'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './ui/Icon'
import useActiveSection from '../hooks/useActiveSection'

export default function Navbar({ meta, nav, theme, onToggleTheme }) {
  const active = useActiveSection(nav.map((n) => n.id))
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-x-0 border-t-0 py-3' : 'py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-mono text-lg font-semibold whitespace-nowrap">
          <span className="text-accent">&lt;</span>
          {meta.name}
          <span className="text-accent"> /&gt;</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active === item.id ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="glass grid h-10 w-10 place-items-center rounded-full transition hover:scale-105 hover:text-accent"
          >
            {theme && <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />}
          </button>
          <a
            href={meta.resume}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-accent/50 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white sm:inline-block"
          >
            Resume
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-[18px] w-[18px]" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-4 mt-3 flex max-h-[calc(100svh-6rem)] flex-col overflow-y-auto rounded-2xl bg-surface-solid/95 p-2 lg:hidden"
          >
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 ${
                    active === item.id ? 'bg-accent/15 text-fg' : 'text-muted'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={meta.resume} target="_blank" rel="noreferrer" className="block rounded-xl px-4 py-3 text-accent">
                Resume ↗
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
