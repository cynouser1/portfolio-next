import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { formatDuration, isCurrent, jobDuration, totalMonths } from '../utils/duration'

// Badge colour per employment type
const typeStyles = {
  'full-time': 'border-accent/30 bg-accent/10 text-accent',
  internship: 'border-accent-2/30 bg-accent-2/10 text-accent-2',
  freelance: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  contract: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
  'part-time': 'border-sky-500/30 bg-sky-500/10 text-sky-500',
}

function TypeBadge({ type }) {
  if (!type) return null
  const style = typeStyles[type.toLowerCase()] ?? typeStyles['full-time']
  return (
    <span className={`shrink-0 self-start rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase ${style}`}>
      {type}
    </span>
  )
}

function JobCard({ job }) {
  return (
    <div className="glass rounded-3xl p-5 transition hover:border-accent/40 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="font-display text-lg font-semibold sm:text-xl">{job.role}</h3>
        <TypeBadge type={job.type} />
      </div>
      <p className="mt-1 font-medium text-accent-2">
        {job.company}
        {job.note && <span className="text-muted"> · {job.note}</span>}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Icon name="calendar" className="h-4 w-4" />
          {job.start} — {job.end}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-fg/5 px-2.5 py-0.5 font-mono text-xs text-fg">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {jobDuration(job)}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1.5">
            <Icon name="pin" className="h-4 w-4" />
            {job.location}
          </span>
        )}
      </div>
      <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-muted">
        {job.points.map((p, j) => (
          <li key={j} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {job.tech?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <span key={t} className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CareerTimeline({ experience }) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Icon name="briefcase" className="h-5 w-5 text-accent" />
          Career timeline
        </h3>
        <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent">
          {formatDuration(totalMonths(experience))}
        </span>
      </div>
      <ol>
        {experience.map((job, i) => {
          const current = isCurrent(job.end)
          return (
            <li
              key={`${job.company}-${job.start}`}
              className={`relative pl-6 ${i < experience.length - 1 ? 'border-l border-accent/25 pb-5' : ''}`}
            >
              <span className="absolute top-1 -left-1.5 flex h-3 w-3">
                {current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />}
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent ring-4 ring-surface-solid" />
              </span>
              <p className="-mt-0.5 font-semibold leading-snug">{job.company}</p>
              <p className="mt-0.5 text-sm text-muted">{job.role}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted">
                <span>
                  {job.start} — {job.end}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-accent-2">{jobDuration(job)}</span>
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function AtAGlance({ experience, meta }) {
  const companies = new Set(experience.map((j) => j.company)).size
  const types = Object.entries(
    experience.reduce((acc, j) => {
      if (j.type) acc[j.type] = (acc[j.type] ?? 0) + 1
      return acc
    }, {}),
  )
  const current = experience.find((j) => isCurrent(j.end))

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <p className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">At a glance</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-fg/5 p-4">
          <div className="text-gradient font-display text-3xl font-bold">{companies}</div>
          <div className="mt-1 text-xs text-muted">{companies === 1 ? 'Company' : 'Companies'}</div>
        </div>
        <div className="rounded-2xl bg-fg/5 p-4">
          <div className="text-gradient font-display text-3xl font-bold">{experience.length}</div>
          <div className="mt-1 text-xs text-muted">{experience.length === 1 ? 'Role' : 'Roles'}</div>
        </div>
      </div>
      {types.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map(([type, n]) => (
            <span key={type} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted">
              {n} × {type}
            </span>
          ))}
        </div>
      )}
      {current && (
        <p className="mt-4 text-sm text-muted">
          Currently <span className="font-medium text-fg">{current.role}</span> at{' '}
          <span className="font-medium text-accent-2">{current.company}</span>
        </p>
      )}
      {meta?.resume && (
        <a
          href={meta.resume}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <Icon name="download" className="h-4 w-4" />
          Download résumé
        </a>
      )}
    </div>
  )
}

function EducationCard({ education }) {
  const latest = education[0]
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
        <Icon name="cap" className="h-5 w-5 text-accent-2" />
        Education
      </h3>
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">{latest.short ?? latest.degree}</span>
        <span className="rounded-full bg-accent-2/10 px-2.5 py-1 font-mono text-xs font-medium text-accent-2">
          {education[education.length - 1].start} — {latest.end}
        </span>
      </div>
      <ol>
        {education.map((e, i) => (
          <li key={e.degree} className={`relative pl-6 ${i < education.length - 1 ? 'border-l border-accent-2/25 pb-5' : ''}`}>
            <span className="absolute top-1 -left-1.5 h-3 w-3 rounded-full bg-accent-2 ring-4 ring-surface-solid" />
            <p className="-mt-0.5 font-semibold leading-snug">{e.degree}</p>
            <p className="mt-0.5 text-sm text-muted">
              {e.school}
              {e.location && ` · ${e.location}`}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              {e.start} — {e.end}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Experience({ index, experience, education = [], meta }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  return (
    <Section id="experience" index={index} label="experience" title="Where I've worked">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
        <div ref={ref} className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-line" />
          <motion.div
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-4 w-px origin-top bg-gradient-to-b from-accent to-accent-2"
          />

          <div className="space-y-10">
            {experience.map((job, i) => (
              <div key={`${job.company}-${job.start}`} className="relative pl-12">
                <span className="absolute top-6 left-4 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-accent/50 bg-surface-solid text-accent shadow-lg shadow-accent/20">
                  <Icon name="briefcase" className="h-4 w-4" />
                </span>
                <Reveal delay={i * 0.05}>
                  <JobCard job={job} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          {experience.length > 0 && (
            <Reveal>
              <CareerTimeline experience={experience} />
            </Reveal>
          )}
          {education.length > 0 && (
            <Reveal delay={0.1}>
              <EducationCard education={education} />
            </Reveal>
          )}
          {experience.length > 0 && (
            <Reveal delay={0.2}>
              <AtAGlance experience={experience} meta={meta} />
            </Reveal>
          )}
        </aside>
      </div>
    </Section>
  )
}
