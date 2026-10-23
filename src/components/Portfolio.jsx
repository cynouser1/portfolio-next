'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import data from '../data/portfolio'
import useTheme from '../hooks/useTheme'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Services from './Services'
import Experience from './Experience'
import Projects from './Projects'
import Links from './Links'
import Contact from './Contact'
import Footer from './Footer'
import Icon from './ui/Icon'

// Each section: whether it has content, and how to render it.
const sections = {
  about: { has: (d) => d.about?.paragraphs?.length, render: (d, i) => <About index={i} about={d.about} meta={d.meta} /> },
  skills: { has: (d) => d.skills?.length, render: (d, i) => <Skills index={i} skills={d.skills} /> },
  experience: {
    has: (d) => d.experience?.length || d.education?.length,
    render: (d, i) => <Experience index={i} experience={d.experience ?? []} education={d.education ?? []} meta={d.meta} />,
  },
  projects: { has: (d) => d.projects?.length, render: (d, i) => <Projects index={i} projects={d.projects} /> },
  services: {
    has: (d) => d.features?.services && d.services?.length,
    render: (d, i) => <Services index={i} services={d.services} meta={d.meta} />,
  },
  links: { has: (d) => d.features?.links && d.links?.length, render: (d, i) => <Links index={i} links={d.links} /> },
  contact: { has: (d) => d.contact?.email, render: (d, i) => <Contact index={i} contact={d.contact} socials={d.socials ?? []} meta={d.meta} /> },
}

export default function Portfolio() {
  const { theme, toggle } = useTheme()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 })
  const [showTop, setShowTop] = useState(false)

  const nav = data.nav.filter((n) => sections[n.id]?.has(data))
  const socials = data.socials ?? []

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-accent-2"
      />
      <Navbar meta={data.meta} nav={nav} theme={theme} onToggleTheme={toggle} />

      <main className="overflow-x-clip">
        <Hero
          meta={data.meta}
          socials={socials}
          hasProjects={nav.some((n) => n.id === 'projects')}
          hasContact={nav.some((n) => n.id === 'contact')}
        />
        {nav.map((n, i) => (
          <div key={n.id}>{sections[n.id].render(data, i + 1)}</div>
        ))}
      </main>

      <Footer meta={data.meta} socials={socials} footer={data.footer} nav={nav} contact={data.contact} />

      <a
        href="#top"
        aria-label="Back to top"
        className={`glass fixed right-5 bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full text-accent shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          showTop ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <Icon name="arrowUp" />
      </a>
    </>
  )
}
