import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import Section from './ui/Section'
import Reveal from './ui/Reveal'

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

export default function About({ index, about, meta }) {
  const stats = about.stats.map((s) => ({
    ...s,
    value: s.since ? new Date().getFullYear() - s.since : s.value,
  }))

  return (
    <Section id="about" index={index} label="about me" title="Who I am">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-3">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p>{p}</p>
            </Reveal>
          ))}
          {about.highlights?.length > 0 && (
            <Reveal delay={0.3} className="flex flex-wrap gap-2 pt-2">
              {about.highlights.map((h) => (
                <span key={h} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-sm text-accent">
                  {h}
                </span>
              ))}
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-2">
          <Reveal className="glass relative overflow-hidden rounded-3xl p-6 font-mono text-sm">
            <div className="mb-4 flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <pre className="overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <span className="text-accent">const</span> <span className="text-accent-2">developer</span> = {'{\n'}
              {'  '}name: <span className="text-emerald-500">&apos;{meta.fullName ?? meta.name}&apos;</span>,{'\n'}
              {'  '}role: <span className="text-emerald-500">&apos;{meta.role}&apos;</span>,{'\n'}
              {'  '}location: <span className="text-emerald-500">&apos;{meta.location}&apos;</span>,{'\n'}
              {'  '}openToWork: <span className="text-accent">{String(!!meta.availableForWork)}</span>,{'\n'}
              {'}'}
            </pre>
          </Reveal>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="glass rounded-2xl p-4 transition hover:-translate-y-1 sm:p-5 hover:border-accent/40">
                <div className="text-gradient font-display text-3xl font-bold sm:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
