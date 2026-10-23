'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { showError, showSuccess } from '../lib/alert'

const MAX_MESSAGE = 5000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const empty = { name: '', email: '', reason: '', subject: '', message: '', website: '' }

const inputClass =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg placeholder:text-muted/70 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20'

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email.'
  if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

// mailto: link pre-filled with what the visitor typed, so nothing is lost if sending fails
function mailtoFor(email, form) {
  const subject = form.subject || form.reason || 'Hello from your portfolio'
  const body = `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Field({ label, error, className = 'block', children }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

function ContactForm({ contact, ownerName }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [serverError, setServerError] = useState('')
  const cardRef = useRef(null)
  const submitRef = useRef(null)
  const anotherRef = useRef(null)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    if (status === 'error') setStatus('idle')
  }

  // Bring the form back into view and focus `el` once a popup closes
  const refocus = (el) => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    el?.focus({ preventScroll: true })
  }

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    setStatus('sending')
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('success')
      setForm(empty)
      await showSuccess({ name: form.name, ownerName })
      refocus(anotherRef.current)
    } catch (err) {
      // fetch() itself failing (offline, blocked) gives a cryptic message — replace it
      const message = err instanceof TypeError ? 'Network error — please check your connection and try again.' : err.message
      setServerError(message)
      setStatus('error')
      const choice = await showError({ message, email: contact.email })
      if (choice === 'email') window.location.href = mailtoFor(contact.email, form)
      else refocus(submitRef.current)
    }
  }

  return (
    <div ref={cardRef} className="glass relative flex h-full flex-col rounded-3xl p-5 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-104 flex-col items-center justify-center text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h4 className="mt-5 font-display text-2xl font-bold">Message sent!</h4>
            <p className="mt-2 max-w-sm text-muted">Thanks for reaching out — I&apos;ll get back to you soon. A confirmation is on its way to your inbox.</p>
            <button ref={anotherRef} onClick={() => setStatus('idle')} className="mt-6 text-sm font-medium text-accent hover:underline">
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} noValidate className="flex flex-1 flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input type="text" autoComplete="name" maxLength={100} value={form.name} onChange={set('name')} placeholder="Your name" className={inputClass} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" autoComplete="email" maxLength={200} value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Reason">
                <select value={form.reason} onChange={set('reason')} className={`${inputClass} appearance-none [&>option]:bg-surface-solid ${form.reason ? '' : 'text-muted/70'}`}>
                  <option value="">Select a reason</option>
                  {(contact.reasons ?? []).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <input type="text" maxLength={150} value={form.subject} onChange={set('subject')} placeholder="What's it about?" className={inputClass} />
              </Field>
            </div>

            <Field label="Message" error={errors.message} className="flex flex-1 flex-col">
              <textarea
                rows={6}
                maxLength={MAX_MESSAGE}
                value={form.message}
                onChange={set('message')}
                placeholder="Tell me about your project, role or idea…"
                className={`${inputClass} flex-1 resize-y`}
              />
              <span className="mt-1 block text-right font-mono text-xs text-muted">
                {form.message.length}/{MAX_MESSAGE}
              </span>
            </Field>

            {/* Honeypot: hidden from people, bots fill it in */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

            {status === 'error' && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {serverError}{' '}
                <a href={mailtoFor(contact.email, form)} className="font-medium underline">
                  Email me directly
                </a>
              </p>
            )}

            <button
              ref={submitRef}
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 font-medium text-white shadow-lg shadow-accent/25 transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
            >
              {status === 'sending' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending…
                </>
              ) : (
                <>
                  <Icon name="send" className="h-4 w-4" /> Send message
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact({ index, contact, socials, meta }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <Section id="contact" index={index} label="contact" title="Get in touch">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        <Reveal>
          <div className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              {meta?.availableForWork && (
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {meta.availabilityText}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold sm:text-4xl">
                <span className="text-gradient animate-gradient">{contact.heading}</span>
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{contact.message}</p>

              <ul className="mt-8 space-y-3">
                <li>
                  <button
                    onClick={copy}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-line p-3 text-left transition hover:border-accent/50"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                      <Icon name="mail" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-muted">Email</span>
                      <span className="block truncate font-medium">{contact.email}</span>
                    </span>
                    <Icon name={copied ? 'check' : 'copy'} className={`h-4 w-4 shrink-0 ${copied ? 'text-emerald-500' : 'text-muted group-hover:text-accent'}`} />
                  </button>
                </li>
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 rounded-2xl border border-line p-3 transition hover:border-accent/50">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-2/15 text-accent-2">
                        <Icon name="phone" className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-muted">Phone</span>
                        <span className="block font-medium">{contact.phone}</span>
                      </span>
                    </a>
                  </li>
                )}
                {meta?.location && (
                  <li className="flex items-center gap-4 rounded-2xl border border-line p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                      <Icon name="pin" className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-muted">Location</span>
                      <span className="block font-medium">{meta.location}</span>
                    </span>
                  </li>
                )}
              </ul>

              {contact.responseTime && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
                  <Icon name="clock" className="h-4 w-4" /> {contact.responseTime}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {socials
                  .filter((s) => s.icon !== 'mail')
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:border-accent/50 hover:text-accent"
                    >
                      <Icon name={s.icon} className="h-4 w-4" /> {s.label}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <ContactForm contact={contact} ownerName={meta?.name} />
        </Reveal>
      </div>
    </Section>
  )
}
