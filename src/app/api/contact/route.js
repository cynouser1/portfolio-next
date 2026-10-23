// POST /api/contact — validates the contact form and emails it via SMTP.
// Credentials come from server-only env vars (see .env.example). Other methods get 405 from Next.js.
import nodemailer from 'nodemailer'
import { autoReplyEmail, ownerEmail } from '@/lib/server/emailTemplates'
import { validateContact } from '@/lib/server/validateContact'

// nodemailer needs Node.js APIs (not the Edge runtime), and this must never be cached
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const json = (status, body) => Response.json(body, { status })

// Public URL of the site, used for links inside the emails
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.URL) return process.env.URL // Netlify
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` // Vercel
  return ''
}

export async function POST(request) {
  let input
  try {
    input = await request.json()
  } catch {
    return json(400, { ok: false, error: 'Invalid request body.' })
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return json(400, { ok: false, error: 'Invalid request body.' })
  }

  // Honeypot: real users never fill the hidden "website" field
  if (input.website) return json(200, { ok: true })

  const { data, error } = validateContact(input)
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
  const site = siteUrl()
  const receivedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'

  try {
    const owner = ownerEmail({ ...data, receivedAt, siteUrl: site })
    await transporter.sendMail({
      from,
      to: CONTACT_TO_EMAIL,
      replyTo: { name: data.name, address: data.email },
      subject: `📬 New portfolio message — ${data.subject} — from ${data.name}`,
      html: owner.html,
      text: owner.text,
    })

    if (process.env.SEND_AUTO_REPLY === 'true') {
      const reply = autoReplyEmail({ ...data, ownerName: process.env.CONTACT_OWNER_NAME || from.name, siteUrl: site })
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
