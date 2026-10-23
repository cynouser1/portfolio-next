import Reveal from './Reveal'

export default function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="mb-14">
        <p className="mb-3 font-mono text-sm text-accent">
          <span className="text-muted">{String(index).padStart(2, '0')}.</span> // {label}
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  )
}
