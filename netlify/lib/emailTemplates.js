// Email-client-safe HTML templates (tables + inline styles, 600px wide).
// All user-provided values must be passed through `escapeHtml` before reaching these.

export const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Escaped text with line breaks preserved
const multiline = (str) => escapeHtml(str).replace(/\r?\n/g, '<br>')

const ACCENT = '#7c3aed'
const ACCENT_2 = '#0891b2'
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function layout({ preheader, title, subtitle, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f0f7;font-family:${FONT};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f0f7;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
        <tr>
          <td style="background:${ACCENT};background-image:linear-gradient(135deg,${ACCENT},${ACCENT_2});padding:32px 36px;">
            <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.8);">// portfolio</p>
            <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;">${title}</h1>
            ${subtitle ? `<p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.9);">${subtitle}</p>` : ''}
          </td>
        </tr>
        <tr><td style="padding:32px 36px;color:#0f172a;font-size:15px;line-height:1.6;">${body}</td></tr>
        <tr>
          <td style="padding:20px 36px;background:#f8f7fc;border-top:1px solid #ece9f5;color:#6b7280;font-size:12px;line-height:1.6;">${footer}</td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function row(label, value) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f0eef6;width:130px;vertical-align:top;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #f0eef6;vertical-align:top;color:#0f172a;font-weight:600;">${value}</td>
  </tr>`
}

const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:${ACCENT};background-image:linear-gradient(90deg,${ACCENT},${ACCENT_2});color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:999px;">${label}</a>`

// Notification sent to the site owner
export function ownerEmail({ name, email, reason, subject, message, receivedAt, siteUrl }) {
  const n = escapeHtml(name)
  const e = escapeHtml(email)
  const s = escapeHtml(subject)
  const r = escapeHtml(reason)
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`

  const html = layout({
    preheader: `${n}: ${escapeHtml(message.slice(0, 90))}`,
    title: 'New message from your portfolio',
    subtitle: `${n} just reached out through the contact form.`,
    body: `
      ${r ? `<p style="margin:0 0 18px;"><span style="display:inline-block;background:#f3effe;color:${ACCENT};border:1px solid #e4dafc;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">${r}</span></p>` : ''}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('Name', n)}
        ${row('Email', `<a href="mailto:${e}" style="color:${ACCENT_2};text-decoration:none;">${e}</a>`)}
        ${row('Subject', s)}
        ${row('Received', escapeHtml(receivedAt))}
      </table>
      <p style="margin:26px 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <div style="background:#f8f7fc;border-left:4px solid ${ACCENT};border-radius:10px;padding:18px 20px;color:#1f2937;white-space:normal;">${multiline(message)}</div>
      <p style="margin:28px 0 0;text-align:center;">${button(replyHref, `Reply to ${n}`)}</p>`,
    footer: `Sent from the contact form on ${siteUrl ? `<a href="${escapeHtml(siteUrl)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(siteUrl)}</a>` : 'your portfolio'}. Hit “Reply” to answer ${n} directly.`,
  })

  const text = [
    'New message from your portfolio',
    '',
    `Name:     ${name}`,
    `Email:    ${email}`,
    reason ? `Reason:   ${reason}` : null,
    `Subject:  ${subject}`,
    `Received: ${receivedAt}`,
    '',
    message,
  ]
    .filter((l) => l !== null)
    .join('\n')

  return { html, text }
}

// Confirmation sent back to the visitor
export function autoReplyEmail({ name, subject, message, ownerName, siteUrl }) {
  const n = escapeHtml(name)
  const o = escapeHtml(ownerName)

  const html = layout({
    preheader: `Thanks ${n} — I've received your message.`,
    title: `Thanks for reaching out, ${n}!`,
    subtitle: 'Your message landed safely in my inbox.',
    body: `
      <p style="margin:0 0 16px;">Hi ${n},</p>
      <p style="margin:0 0 16px;">Thanks for getting in touch. I've received your message and will get back to you as soon as I can — usually within 24 hours.</p>
      <p style="margin:24px 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Your message · ${escapeHtml(subject)}</p>
      <div style="background:#f8f7fc;border-left:4px solid ${ACCENT_2};border-radius:10px;padding:18px 20px;color:#374151;">${multiline(message)}</div>
      <p style="margin:24px 0 0;">Best regards,<br><strong>${o}</strong></p>
      ${siteUrl ? `<p style="margin:24px 0 0;text-align:center;">${button(escapeHtml(siteUrl), 'Visit my portfolio')}</p>` : ''}`,
    footer: "This is an automatic confirmation — no need to reply to it. If you didn't send this message, you can safely ignore this email.",
  })

  const text = `Hi ${name},\n\nThanks for getting in touch. I've received your message and will get back to you as soon as I can.\n\n--- Your message (${subject}) ---\n${message}\n\nBest regards,\n${ownerName}${siteUrl ? `\n${siteUrl}` : ''}`

  return { html, text }
}
