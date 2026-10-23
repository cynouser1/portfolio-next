// Netlify Function: POST /api/contact (see netlify.toml redirect)
// Validates the contact form and emails it via SMTP. Credentials come from env vars (see .env.example).
import nodemailer from 'nodemailer'
import { autoReplyEmail, ownerEmail } from '../lib/emailTemplates.js'

const LIMITS = { name: 100, email: 200, reason: 60, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

// Strip CR/LF from values used in mail headers to prevent header injection
const oneLine = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim()

export function validate(input) {
  const data = {
    name: oneLine(input.name),
    email: oneLine(input.email),
    reason: oneLine(input.reason),
    subject: oneLine(input.subject),
    message: String(input.message ?? '').trim(),
  }
  if (!data.name) return { error: 'Please enter your name.' }
  if (!EMAIL_RE.test(data.email)) return { error: 'Please enter a valid email address.' }
  if (!data.message || data.message.length < 10) return { error: 'Please write a message (at least 10 characters).' }
  for (const [key, max] of Object.entries(LIMITS)) {
    if (data[key].length > max) return { error: `${key[0].toUpperCase() + key.slice(1)} is too long (max ${max} characters).` }
  }
  if (!data.subject) data.subject = data.reason || 'New message'
  return { data }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })

  let input
  try {
    input = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { ok: false, error: 'Invalid request body.' })
  }

  // Honeypot: real users never fill the hidden "website" field
  if (input.website) return json(200, { ok: true })

  const { data, error } = validate(input)
  if (error) return json(400, { ok: false, error })

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM_NAME, CONTACT_TO_EMAIL } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error('Contact form: SMTP env vars are missing')
    return json(500, { ok: false, error: 'Email service is not configured.' })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: (SMTP_SECURE ?? 'true') === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const from = { name: MAIL_FROM_NAME || 'Portfolio Contact', address: SMTP_USER }
  const siteUrl = process.env.VITE_SITE_URL || process.env.URL || ''
  const receivedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'

  try {
    const owner = ownerEmail({ ...data, receivedAt, siteUrl })
    await transporter.sendMail({
      from,
      to: CONTACT_TO_EMAIL,
      replyTo: { name: data.name, address: data.email },
      subject: `📬 New portfolio message — ${data.subject} — from ${data.name}`,
      html: owner.html,
      text: owner.text,
    })

    if (process.env.SEND_AUTO_REPLY === 'true') {
      const reply = autoReplyEmail({ ...data, ownerName: process.env.CONTACT_OWNER_NAME || from.name, siteUrl })
      // A failed confirmation shouldn't fail the request — the owner already has the message
      await transporter
        .sendMail({
          from,
          to: data.email,
          replyTo: CONTACT_TO_EMAIL,
          subject: `Thanks for reaching out, ${data.name}!`,
          html: reply.html,
          text: reply.text,
        })
        .catch((err) => console.error('Contact form: auto-reply failed', err.message))
    }

    return json(200, { ok: true })
  } catch (err) {
    console.error('Contact form: send failed', err)
    return json(500, { ok: false, error: 'Could not send your message right now. Please try again or email me directly.' })
  }
}
