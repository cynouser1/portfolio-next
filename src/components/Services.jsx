import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'

// The CTA card fills the empty cells of the last grid row (static class names so Tailwind picks them up)
const smSpan = { 0: 'sm:col-span-2', 1: 'sm:col-span-1' }
const lgSpan = { 0: 'lg:col-span-3', 1: 'lg:col-span-2', 2: 'lg:col-span-1' }

function CtaCard({ meta }) {
  return (
    <div className="glass relative flex h-full flex-col justify-center gap-5 overflow-hidden rounded-3xl border-accent/30 p-6 sm:p-7">
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">
        <h3 className="font-display text-xl font-bold sm:text-2xl">Have a project in mind?</h3>
        <p className="mt-2 text-muted">Tell me what you need — I&apos;ll reply with ideas, a plan and a timeline.</p>
      </div>
      <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-wrap">
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 font-medium whitespace-nowrap text-white shadow-lg shadow-accent/25 transition hover:scale-105"
        >
          Let&apos;s talk <Icon name="arrow" className="h-4 w-4" />
        </a>
        {meta?.resume && (
          <a
            href={meta.resume}
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium whitespace-nowrap transition hover:border-accent/50"
          >
            <Icon name="download" className="h-4 w-4" /> Résumé
          </a>
        )}
      </div>
    </div>
  )
}

export default function Services({ index, services, meta }) {
  const span = `${smSpan[services.length % 2]} ${lgSpan[services.length % 3]}`

  return (
    <Section id="services" index={index} label="services" title="What I can do for you">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <article className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:border-accent/40 sm:p-7">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/25 transition group-hover:scale-110">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold transition-colors group-hover:text-accent">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.description}</p>
              {s.features?.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
        <Reveal className={span}>
          <CtaCard meta={meta} />
        </Reveal>
      </div>
    </Section>
  )
}
