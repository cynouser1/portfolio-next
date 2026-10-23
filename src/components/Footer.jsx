import Icon from './ui/Icon'

export default function Footer({ meta, socials, footer, nav = [], contact }) {
  const name = meta.fullName ?? meta.name

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-accent-2 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <a href="#top" className="text-gradient inline-block font-display text-2xl font-bold">
              {name}
            </a>
            {footer?.blurb && <p className="leading-relaxed text-muted">{footer.blurb}</p>}
            {meta.availableForWork && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {meta.availabilityText}
              </span>
            )}
          </div>

          {nav.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-display font-semibold">Quick links</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {nav.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className="text-muted transition-colors hover:text-accent">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-display font-semibold">Get in touch</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              {contact?.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 break-all transition-colors hover:text-accent">
                    <Icon name="mail" className="h-4 w-4 shrink-0" />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 transition-colors hover:text-accent">
                    <Icon name="phone" className="h-4 w-4 shrink-0" />
                    {contact.phone}
                  </a>
                </li>
              )}
              {meta.location && (
                <li className="inline-flex items-center gap-2">
                  <Icon name="pin" className="h-4 w-4 shrink-0" />
                  {meta.location}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {name} {footer?.text }
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="hover:text-accent">
                <Icon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
            <a
              href="#top"
              className="glass group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-fg transition hover:border-accent/40"
            >
              <Icon name="arrowUp" className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
