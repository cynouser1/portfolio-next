// Server-side validation for the contact form (mirrors the client checks in src/components/Contact.jsx)

const LIMITS = { name: 100, email: 200, reason: 60, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Strip CR/LF from values used in mail headers to prevent header injection
const oneLine = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim()

export function validateContact(input) {
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
