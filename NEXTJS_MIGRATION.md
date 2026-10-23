# Porting the Portfolio from Vite to Next.js

This guide rebuilds the existing **Vite + React** portfolio as a **Next.js (App Router, JavaScript)** app, so the
contact form's email backend runs as a native Next.js API route. It is self-contained: follow it top to
bottom inside a fresh Next.js project into which the old source files have been copied.

> **For an AI agent working in the new project:** apply every step in order. Files marked **copy as-is** need
> no edits. Files marked **replace** have their complete new content in this guide. Files marked **edit**
> list exact changes. Do not change anything else — the UI must look and behave exactly like the original.

---

## 1. What the site is

A single-page developer portfolio. Every section is driven by one data file, `src/data/portfolio.js`:

| Section    | Component         | Shown when                                              |
| ---------- | ----------------- | ------------------------------------------------------- |
| Hero       | `Hero.jsx`        | always                                                  |
| About      | `About.jsx`       | `about.paragraphs` not empty                            |
| Skills     | `Skills.jsx`      | `skills` not empty                                      |
| Services   | `Services.jsx`    | `NEXT_PUBLIC_SHOW_SERVICES=true` and `services` not empty |
| Experience | `Experience.jsx`  | `experience` or `education` not empty                   |
| Projects   | `Projects.jsx`    | `projects` not empty                                    |
| Links      | `Links.jsx`       | `NEXT_PUBLIC_SHOW_LINKS=true` and `links` not empty     |
| Contact    | `Contact.jsx`     | `contact.email` set                                     |

The nav order comes from `portfolio.nav`; hidden sections drop out of the nav automatically.

**Stack:** React 19, Tailwind CSS v4, framer-motion, react-icons, sweetalert2 (lazy-loaded popups),
nodemailer (server-side SMTP). Light/dark theme with a toggle saved in `localStorage` under `portfolio-theme`.

**Contact flow:** `Contact.jsx` validates the form and `POST`s JSON to `/api/contact`. The server validates
again, drops spam (hidden `website` honeypot field), emails the owner via SMTP, and optionally sends the
visitor an auto-reply. On failure the UI offers a pre-filled `mailto:` fallback.

---

## 2. Create the Next.js project

```bash
npx create-next-app@latest personal-portfolio-next
```

Answer the prompts:

| Prompt                     | Answer |
| -------------------------- | ------ |
| TypeScript                 | **No** |
| ESLint                     | **Yes** |
| Tailwind CSS               | **Yes** (sets up Tailwind v4 + `@tailwindcss/postcss` + `postcss.config.mjs`) |
| `src/` directory           | **Yes** |
| App Router                 | **Yes** |
| Turbopack                  | Yes (default) |
| Customize import alias     | No (keep `@/*` → `./src/*`) |

Install the runtime dependencies:

```bash
cd personal-portfolio-next
npm install framer-motion react-icons sweetalert2 nodemailer
```

> `react-toastify` from the old `package.json` is **not** needed — nothing imports it.
> Do not install `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite` or `eslint-plugin-react-refresh`.

Delete the starter files you will replace: `src/app/page.module.css` (if present) and the default SVGs in
`public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).

---

## 3. File mapping

Copy files from the old project into the new one using this table.

| Old project                         | New project                              | Action |
| ----------------------------------- | ---------------------------------------- | ------ |
| `public/Resume.pdf`                 | `public/Resume.pdf`                      | copy as-is |
| `public/profile.webp`               | `public/profile.webp`                    | copy as-is |
| `public/Profile-img.png`            | `public/Profile-img.png`                 | copy as-is |
| `public/favicon.svg`                | `public/favicon.svg`                     | copy as-is |
| `src/components/ui/Icon.jsx`        | `src/components/ui/Icon.jsx`             | copy as-is |
| `src/components/ui/TechIcon.jsx`    | `src/components/ui/TechIcon.jsx`         | copy as-is |
| `src/components/ui/Section.jsx`     | `src/components/ui/Section.jsx`          | copy as-is |
| `src/components/ui/Reveal.jsx`      | `src/components/ui/Reveal.jsx`           | edit (§4.2) |
| `src/components/About.jsx`          | `src/components/About.jsx`               | edit (§4.2) |
| `src/components/Avatar.jsx`         | `src/components/Avatar.jsx`              | edit (§4.2) |
| `src/components/Contact.jsx`        | `src/components/Contact.jsx`             | edit (§4.2) |
| `src/components/Experience.jsx`     | `src/components/Experience.jsx`          | edit (§4.2) |
| `src/components/Footer.jsx`         | `src/components/Footer.jsx`              | copy as-is |
| `src/components/Hero.jsx`           | `src/components/Hero.jsx`                | edit (§4.2) |
| `src/components/Links.jsx`          | `src/components/Links.jsx`               | edit (§4.2) |
| `src/components/Navbar.jsx`         | `src/components/Navbar.jsx`              | edit (§4.2, §4.4) |
| `src/components/Projects.jsx`       | `src/components/Projects.jsx`            | edit (§4.2) |
| `src/components/Services.jsx`       | `src/components/Services.jsx`            | copy as-is |
| `src/components/Skills.jsx`         | `src/components/Skills.jsx`              | edit (§4.2) |
| `src/hooks/useActiveSection.js`     | `src/hooks/useActiveSection.js`          | copy as-is |
| `src/hooks/useTheme.js`             | `src/hooks/useTheme.js`                  | **replace** (§4.4) |
| `src/utils/duration.js`             | `src/utils/duration.js`                  | copy as-is |
| `src/lib/alert.js`                  | `src/lib/alert.js`                       | copy as-is |
| `src/data/portfolio.js`             | `src/data/portfolio.js`                  | edit (§4.1) |
| `src/App.jsx`                       | `src/components/Portfolio.jsx`           | **replace** (§4.3) |
| `src/main.jsx` + `index.html`       | `src/app/layout.js`                      | **replace** (§4.5) |
| —                                   | `src/app/page.js`                        | **replace** (§4.6) |
| `src/index.css`                     | `src/app/globals.css`                    | edit (§4.7) |
| `netlify/lib/emailTemplates.js`     | `src/lib/server/emailTemplates.js`       | copy as-is |
| `netlify/functions/contact.js`      | `src/lib/server/validateContact.js` + `src/app/api/contact/route.js` | **replace** (§4.8) |
| `.env.example`                      | `.env.example`                           | **replace** (§5) |
| `netlify.toml`                      | `netlify.toml` (Netlify only)            | **replace** (§8) — never copy the old one |
| `vite.config.js`, `eslint.config.js`, `docs/NETLIFY_SETUP.md`, `README.md` | — | do not copy |

---

## 4. Required code changes

### 4.1 `src/data/portfolio.js` — environment variables

Vite exposes env vars as `import.meta.env.VITE_*`. Next.js uses `process.env.NEXT_PUBLIC_*`, and it **only
inlines literal references** like `process.env.NEXT_PUBLIC_CONTACT_EMAIL` into browser code. A dynamic
lookup such as `process.env[key]` is `undefined` in the browser. So the old `env(key, fallback)` helper must
change to take the *value*, not the key.

**Replace** these lines at the top of the file:

```js
// Read a public VITE_* env var, falling back to the default when unset/blank
const env = (key, fallback) => import.meta.env[key] || fallback

const email = env('VITE_CONTACT_EMAIL', 'dhananjaydhiman809@gmail.com')
```

with:

```js
// Use a public NEXT_PUBLIC_* env value, falling back to the default when unset/blank.
// Next.js only inlines literal `process.env.NEXT_PUBLIC_X` references, so pass the value, not the key.
const env = (value, fallback) => value || fallback

const email = env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'dhananjaydhiman809@gmail.com')
```

Then replace each remaining `env('VITE_…', …)` call:

| Old                                                                   | New |
| --------------------------------------------------------------------- | --- |
| `env('VITE_SHOW_SERVICES', 'true')`                                   | `env(process.env.NEXT_PUBLIC_SHOW_SERVICES, 'true')` |
| `env('VITE_SHOW_LINKS', 'true')`                                      | `env(process.env.NEXT_PUBLIC_SHOW_LINKS, 'true')` |
| `env('VITE_AVAILABLE_FOR_WORK', 'true')`                              | `env(process.env.NEXT_PUBLIC_AVAILABLE_FOR_WORK, 'true')` |
| `env('VITE_AVAILABILITY_TEXT', 'Open to new opportunities')`          | `env(process.env.NEXT_PUBLIC_AVAILABILITY_TEXT, 'Open to new opportunities')` |
| `env('VITE_RESUME_URL', '/Resume.pdf')`                               | `env(process.env.NEXT_PUBLIC_RESUME_URL, '/Resume.pdf')` |
| `env('VITE_SITE_URL', '')`                                            | `env(process.env.NEXT_PUBLIC_SITE_URL, '')` |
| `env('VITE_CONTACT_PHONE', '+91 7055044168')`                         | `env(process.env.NEXT_PUBLIC_CONTACT_PHONE, '+91 7055044168')` |
| `env('VITE_GITHUB_URL', 'https://github.com/Dhananjaydhiman')`        | `env(process.env.NEXT_PUBLIC_GITHUB_URL, 'https://github.com/Dhananjaydhiman')` |
| `env('VITE_LINKEDIN_URL', 'https://linkedin.com/in/dhananjaydhiman')` | `env(process.env.NEXT_PUBLIC_LINKEDIN_URL, 'https://linkedin.com/in/dhananjaydhiman')` |

Also update the comments in the file header that mention `VITE_SHOW_SERVICES` / `VITE_SHOW_LINKS` / `.env`
to the `NEXT_PUBLIC_*` names. Afterwards, `grep -n "VITE_\|import.meta" src` must return nothing.

Leave everything else in the file (content, `nav`, `footer`, etc.) unchanged. This file has no
`'use client'` directive; it is plain data and is imported by both the server layout (for metadata) and
client components.

### 4.2 `'use client'` directives

In the App Router every component is a Server Component unless marked otherwise. Anything using React
hooks, browser APIs, event handlers or framer-motion must be a Client Component.

`src/components/Portfolio.jsx` (§4.3) starts with `'use client'`, which makes everything it imports a client
component as well. That alone is enough to make the site work. Also add `'use client'` as the **very first
line** of these files, so each one stays safe if it is ever imported from a server component:

- `src/components/ui/Reveal.jsx`
- `src/components/About.jsx`
- `src/components/Avatar.jsx`
- `src/components/Contact.jsx`
- `src/components/Experience.jsx`
- `src/components/Hero.jsx`
- `src/components/Links.jsx`
- `src/components/Navbar.jsx`
- `src/components/Projects.jsx`
- `src/components/Skills.jsx`

`Footer.jsx`, `Services.jsx`, `Section.jsx`, `Icon.jsx` and `TechIcon.jsx` have no hooks and need no directive.

`Avatar.jsx`, `Links.jsx` and `Projects.jsx` use plain `<img>` tags. Next's lint rule `@next/next/no-img-element`
only **warns** about these, and the build still passes. To silence it, add this comment on the line directly above each
`<img` (the `<picture>`/WebP setup in `Avatar.jsx` is intentional and already optimised):

```jsx
{/* eslint-disable-next-line @next/next/no-img-element */}
```

### 4.3 `src/components/Portfolio.jsx` — replaces `src/App.jsx`

Same as `App.jsx` except: `'use client'` at the top, relative import paths adjusted for its new location,
and the `document.title` / meta-description effect removed (Next's `metadata` export in the layout handles
that on the server, so it is in the HTML for SEO and link previews).

```jsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import data from '../data/portfolio'
import useTheme from '../hooks/useTheme'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Services from './Services'
import Experience from './Experience'
import Projects from './Projects'
import Links from './Links'
import Contact from './Contact'
import Footer from './Footer'
import Icon from './ui/Icon'

// Each section: whether it has content, and how to render it.
const sections = {
  about: { has: (d) => d.about?.paragraphs?.length, render: (d, i) => <About index={i} about={d.about} meta={d.meta} /> },
  skills: { has: (d) => d.skills?.length, render: (d, i) => <Skills index={i} skills={d.skills} /> },
  experience: {
    has: (d) => d.experience?.length || d.education?.length,
    render: (d, i) => <Experience index={i} experience={d.experience ?? []} education={d.education ?? []} meta={d.meta} />,
  },
  projects: { has: (d) => d.projects?.length, render: (d, i) => <Projects index={i} projects={d.projects} /> },
  services: {
    has: (d) => d.features?.services && d.services?.length,
    render: (d, i) => <Services index={i} services={d.services} meta={d.meta} />,
  },
  links: { has: (d) => d.features?.links && d.links?.length, render: (d, i) => <Links index={i} links={d.links} /> },
  contact: { has: (d) => d.contact?.email, render: (d, i) => <Contact index={i} contact={d.contact} socials={d.socials ?? []} meta={d.meta} /> },
}

export default function Portfolio() {
  const { theme, toggle } = useTheme()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 })
  const [showTop, setShowTop] = useState(false)

  const nav = data.nav.filter((n) => sections[n.id]?.has(data))
  const socials = data.socials ?? []

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-accent-2"
      />
      <Navbar meta={data.meta} nav={nav} theme={theme} onToggleTheme={toggle} />

      <main className="overflow-x-clip">
        <Hero
          meta={data.meta}
          socials={socials}
          hasProjects={nav.some((n) => n.id === 'projects')}
          hasContact={nav.some((n) => n.id === 'contact')}
        />
        {nav.map((n, i) => (
          <div key={n.id}>{sections[n.id].render(data, i + 1)}</div>
        ))}
      </main>

      <Footer meta={data.meta} socials={socials} footer={data.footer} nav={nav} contact={data.contact} />

      <a
        href="#top"
        aria-label="Back to top"
        className={`glass fixed right-5 bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full text-accent shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          showTop ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <Icon name="arrowUp" />
      </a>
    </>
  )
}
```

### 4.4 Theme — fix the server-render crash and the flash of the wrong theme

**Problem:** the old `useTheme` reads `localStorage` and `window.matchMedia` inside `useState(getInitialTheme)`.
Next.js renders components on the server first, where `window` doesn't exist, so the build or the page crashes.
Even when guarded, the server can't know the visitor's theme, so the page would flash dark → light.

**Fix (two parts):**

1. A tiny inline script in `<head>` (in `layout.js`, §4.5) sets the `dark` class on `<html>` **before the
   first paint**, using the saved choice or the OS preference.
2. `useTheme` no longer owns the theme. It reads the class on `<html>` through `useSyncExternalStore`
   (returning `null` during server render and hydration), and `toggle` flips the class and saves it.

**Replace** `src/hooks/useTheme.js` entirely with:

```js
import { useSyncExternalStore } from 'react'

// Must match the key used by the inline script in src/app/layout.js
export const THEME_KEY = 'portfolio-theme'

// The <html> class is the source of truth: the inline script in layout.js sets it before first paint.
function subscribe(callback) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

// Unknown on the server — consumers render theme-dependent bits only once this is non-null
const getServerSnapshot = () => null

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    const next = getSnapshot() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // storage unavailable — the choice just won't persist
    }
  }

  return { theme, toggle }
}
```

**Edit** `src/components/Navbar.jsx`: the toggle icon depends on the theme, which is `null` until hydration
finishes. Render the icon only once it's known (the button keeps its size, so nothing shifts). Change:

```jsx
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />
```

to:

```jsx
            {theme && <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />}
```

### 4.5 `src/app/layout.js` — replaces `index.html` + `src/main.jsx`

This handles: the `<html lang="en" class="dark">` default, fonts (via `next/font` instead of the Google
Fonts `<link>`, so they're self-hosted and don't block rendering), the favicon, title/description/Open Graph
tags (built from `portfolio.meta`), preloading the hero photo, and the no-flash theme script.

**Replace** the generated `src/app/layout.js` with:

```jsx
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { preload } from 'react-dom'
import portfolio from '@/data/portfolio'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-space-grotesk', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono', display: 'swap' })

const { meta } = portfolio

function siteUrl() {
  try {
    return new URL(meta.siteUrl || 'http://localhost:3000')
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const metadata = {
  metadataBase: siteUrl(),
  title: meta.title,
  description: meta.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'website',
    images: meta.avatar ? [meta.avatar.src] : [],
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
}

// Runs before first paint: apply the saved theme (or the OS preference) so there's no flash.
// Keep the key in sync with THEME_KEY in src/hooks/useTheme.js.
const themeScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`

export default function RootLayout({ children }) {
  if (meta.avatar) preload(meta.avatar.src, { as: 'image', type: 'image/webp', fetchPriority: 'high' })

  return (
    // suppressHydrationWarning: the theme script changes the class before React hydrates
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

> If the build complains that a font weight isn't available, drop the `weight` option for that font
> (Inter and JetBrains Mono are variable fonts and work without it).

### 4.6 `src/app/page.js`

**Replace** the generated page with:

```jsx
import Portfolio from '@/components/Portfolio'

// The page is pre-rendered at build time. Rebuild it daily so date-based text stays current:
// the footer year, the "years of experience" stat and "Present" job durations.
export const revalidate = 86400

export default function Page() {
  return <Portfolio />
}
```

### 4.7 `src/app/globals.css` — replaces `src/index.css`

Copy the **entire** contents of the old `src/index.css` over the generated `src/app/globals.css` (delete the
generated content first). It already starts with `@import 'tailwindcss';` and `@custom-variant dark …`, which
work unchanged with Next's Tailwind v4 PostCSS setup. The SweetAlert2 popup styles at the bottom stay as they are.

Then make one edit inside the `@theme { … }` block, pointing the fonts at the `next/font` CSS variables
from `layout.js`. Replace:

```css
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Space Grotesk', 'Inter', ui-sans-serif, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

with:

```css
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-space-grotesk), var(--font-inter), ui-sans-serif, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
```

(These resolve because the font variable classes sit on `<html>`, the same element as `:root`.)

### 4.8 Contact API — replaces the Netlify Function

The client in `Contact.jsx` already calls `fetch('/api/contact', { method: 'POST', … })`. In Next.js the
file `src/app/api/contact/route.js` serves exactly that URL on every host, so **no client change and no
redirect is needed**.

The old function also exported a `validate` helper. Route files may only export HTTP-method handlers and
route config (`runtime`, `dynamic`, …), so validation moves to its own module.

**Create** `src/lib/server/validateContact.js`:

```js
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
```

**Create** `src/app/api/contact/route.js`:

```js
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
```

`src/lib/server/emailTemplates.js` is copied as-is from `netlify/lib/emailTemplates.js`. It escapes all
user input and has no Netlify-specific code.

The API response contract is unchanged, and `Contact.jsx` already handles it:

| Case                          | Status | Body |
| ----------------------------- | ------ | ---- |
| Sent (or honeypot filled)     | 200    | `{ "ok": true }` |
| Bad JSON / validation failure | 400    | `{ "ok": false, "error": "<message shown to user>" }` |
| SMTP env vars missing         | 500    | `{ "ok": false, "error": "Email service is not configured." }` |
| SMTP send failed              | 500    | `{ "ok": false, "error": "Could not send your message right now. …" }` |
| GET/PUT/etc.                  | 405    | (Next.js default) |

### 4.9 Things that need no change (checked)

- `src/lib/alert.js` dynamically imports `sweetalert2` on click, which works the same in Next. SweetAlert2
  injects its own base CSS; the theme overrides live in `globals.css`.
- `useActiveSection`, the `Navbar` and `Portfolio` scroll listeners, `navigator.clipboard`, and `window.location`
  all run inside `useEffect` or event handlers, never during render, so they're safe on the server.
- `new Date()` in `Footer.jsx`, `About.jsx` and `utils/duration.js` gives the same result on server and client
  except right at a month or year boundary. The daily `revalidate` in `page.js` keeps the pre-rendered HTML current.
- Asset paths (`/Resume.pdf`, `/profile.webp`, `/Profile-img.png`, `/favicon.svg`) are served from `public/` exactly as before.

---

## 5. Environment variables

**Replace** `.env.example` with the content below. For local development copy it to `.env.local`
(create-next-app's `.gitignore` already ignores `.env*`; make sure `!.env.example` is added so the example
is still committed).

```bash
# ============================================================================
#  Copy this file to `.env.local` and fill in your values:  cp .env.example .env.local
#  Never commit real credentials. On Vercel/Netlify add the same keys in the dashboard.
# ============================================================================

# ---------------------------------------------------------------------------
#  SMTP (server-only — used by src/app/api/contact/route.js, never sent to the browser)
#  Gmail: use an App Password (Google Account → Security → 2-Step Verification → App passwords)
# ---------------------------------------------------------------------------
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password

# Display name used in the "From" header
MAIL_FROM_NAME=Portfolio Contact
# Your name, used to sign the auto-reply email
CONTACT_OWNER_NAME=Dhananjay Dhiman
# Where contact-form messages are delivered
CONTACT_TO_EMAIL=dhananjaydhiman809@gmail.com
# Send a "thanks, I got your message" email back to the visitor (true/false)
SEND_AUTO_REPLY=true

# ---------------------------------------------------------------------------
#  Public site info (NEXT_PUBLIC_* values are bundled into the site — don't put secrets here)
#  Leave any blank to use the default from src/data/portfolio.js.
#  These are baked in at BUILD time: restart `npm run dev` / redeploy after changing them.
# ---------------------------------------------------------------------------
NEXT_PUBLIC_CONTACT_EMAIL=dhananjaydhiman809@gmail.com
NEXT_PUBLIC_CONTACT_PHONE=+91 7055044168
NEXT_PUBLIC_GITHUB_URL=https://github.com/Dhananjaydhiman
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/dhananjaydhiman
NEXT_PUBLIC_RESUME_URL=/Resume.pdf
NEXT_PUBLIC_SITE_URL=https://your-site.example.com
NEXT_PUBLIC_AVAILABLE_FOR_WORK=true
NEXT_PUBLIC_AVAILABILITY_TEXT=Open to new opportunities

# ---------------------------------------------------------------------------
#  Optional sections (true/false) — content lives in src/data/portfolio.js
# ---------------------------------------------------------------------------
NEXT_PUBLIC_SHOW_SERVICES=true
NEXT_PUBLIC_SHOW_LINKS=true
```

| Old name (Vite)            | New name (Next.js)               | Where it's used |
| -------------------------- | -------------------------------- | --------------- |
| `SMTP_*`, `MAIL_FROM_NAME`, `CONTACT_OWNER_NAME`, `CONTACT_TO_EMAIL`, `SEND_AUTO_REPLY` | unchanged | server only (`route.js`) |
| `VITE_CONTACT_EMAIL`       | `NEXT_PUBLIC_CONTACT_EMAIL`      | `portfolio.js` |
| `VITE_CONTACT_PHONE`       | `NEXT_PUBLIC_CONTACT_PHONE`      | `portfolio.js` |
| `VITE_GITHUB_URL`          | `NEXT_PUBLIC_GITHUB_URL`         | `portfolio.js` |
| `VITE_LINKEDIN_URL`        | `NEXT_PUBLIC_LINKEDIN_URL`       | `portfolio.js` |
| `VITE_RESUME_URL`          | `NEXT_PUBLIC_RESUME_URL`         | `portfolio.js` |
| `VITE_SITE_URL`            | `NEXT_PUBLIC_SITE_URL`           | `portfolio.js`, `layout.js` (metadataBase), `route.js` (email links) |
| `VITE_AVAILABLE_FOR_WORK`  | `NEXT_PUBLIC_AVAILABLE_FOR_WORK` | `portfolio.js` |
| `VITE_AVAILABILITY_TEXT`   | `NEXT_PUBLIC_AVAILABILITY_TEXT`  | `portfolio.js` |
| `VITE_SHOW_SERVICES`       | `NEXT_PUBLIC_SHOW_SERVICES`      | `portfolio.js` |
| `VITE_SHOW_LINKS`          | `NEXT_PUBLIC_SHOW_LINKS`         | `portfolio.js` |

**Never** prefix the SMTP values with `NEXT_PUBLIC_`, because that would publish your password in the JavaScript bundle.

### Gmail App Password (for SMTP)

Gmail rejects your normal password over SMTP. Create an App Password:

1. Google Account → **Security** → turn on **2-Step Verification**.
2. Open <https://myaccount.google.com/apppasswords>, create one named "Portfolio", and copy the 16 characters.
3. Use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=<your gmail>`, `SMTP_PASS=<app password>`.

Another provider (Zoho, Brevo, Outlook, a custom domain)? Use its host and port. For port `587`, set `SMTP_SECURE=false`.

---

## 6. Run locally

```bash
cp .env.example .env.local   # then fill in real SMTP values
npm run dev                  # http://localhost:3000
```

Test the API directly:

```bash
# Should return {"ok":true} and deliver an email (plus the auto-reply)
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"you@example.com","reason":"Just saying hi","subject":"Hello","message":"Testing the Next.js contact route."}'

# Should return 400 {"ok":false,"error":"Please enter a valid email address."}
curl -i -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"nope","message":"Long enough message"}'

# Should return 405
curl -i http://localhost:3000/api/contact
```

Then do a production build, which catches server-render problems that `dev` can hide:

```bash
npm run build && npm run start
npm run lint
```

---

## 7. Deploy to Vercel

1. Push the new project to GitHub.
2. In Vercel: **Add New → Project**, import the repo. The framework is auto-detected as Next.js; keep the defaults.
3. **Settings → Environment Variables:** add every key from `.env.example` (or paste your `.env.local`
   into the import box). Mark `SMTP_PASS` as **Sensitive**. Apply to Production (and Preview if you want
   the form working on preview URLs).
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://dhananjay.vercel.app`).
5. Deploy. After changing any `NEXT_PUBLIC_*` value, **redeploy**, because those values are baked in at build time.

`/api/contact` becomes a Vercel serverless function automatically. Outbound SMTP on ports 465 and 587 works on Vercel.

---

## 8. Deploy to Netlify

Netlify runs Next.js through its built-in Next.js runtime, which handles API routes, ISR and images automatically.

**Do not reuse the old `netlify.toml`.** Its `/* → /index.html` SPA fallback and its `/api/* → /.netlify/functions/:splat`
redirect would break Next.js routing and the API route. Create this minimal one instead (or omit the file entirely
and let Netlify auto-detect):

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
```

1. Push to GitHub, then in Netlify: **Add new site → Import an existing project** and pick the repo.
2. **Site configuration → Environment variables:** add every key from `.env.example` and mark `SMTP_PASS` as secret.
   Netlify sets `URL` itself; still set `NEXT_PUBLIC_SITE_URL` so the metadata and email links use your real domain.
3. Deploy. After changing any `NEXT_PUBLIC_*` value, trigger **Deploys → Trigger deploy → Clear cache and deploy site**.

---

## 9. Verification checklist

- [ ] `npm run build` succeeds; `npm run lint` shows no errors.
- [ ] `grep -rn "VITE_\|import.meta" src` returns nothing.
- [ ] All sections render in the same order and style as the old site (compare side by side).
- [ ] Browser console shows **no hydration warnings** on load.
- [ ] Theme: the toggle switches light/dark; a reload keeps the choice with **no flash**; with `localStorage`
      cleared, the page follows the OS theme.
- [ ] Nav: the active pill follows scroll; the mobile menu opens and closes; the scroll progress bar and back-to-top button work.
- [ ] Hero typing animation runs; the avatar loads (WebP); **Download CV** downloads `/Resume.pdf`.
- [ ] View source shows the correct `<title>`, meta description and `og:*` tags in the server HTML.
- [ ] Contact form: empty submit shows inline errors; a valid submit shows the spinner, then the success popup,
      then the "Message sent!" card. The email arrives at `CONTACT_TO_EMAIL`, and the auto-reply reaches the sender.
- [ ] With a wrong `SMTP_PASS`: the error popup appears, **Email instead** opens a pre-filled `mailto:`, and the
      form keeps its values.
- [ ] Setting `NEXT_PUBLIC_SHOW_SERVICES=false` (and rebuilding) hides the Services section and its nav link.
- [ ] The same checks pass on the deployed Vercel/Netlify URL.

---

## 10. Final project structure

```
personal-portfolio-next/
├── public/
│   ├── Resume.pdf
│   ├── profile.webp
│   ├── Profile-img.png
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.js          # POST /api/contact (nodemailer)
│   │   ├── globals.css               # old src/index.css + next/font variables
│   │   ├── layout.js                 # <html>, fonts, metadata, theme script
│   │   └── page.js                   # renders <Portfolio />, revalidate daily
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Icon.jsx
│   │   │   ├── Reveal.jsx
│   │   │   ├── Section.jsx
│   │   │   └── TechIcon.jsx
│   │   ├── About.jsx
│   │   ├── Avatar.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Links.jsx
│   │   ├── Navbar.jsx
│   │   ├── Portfolio.jsx             # old src/App.jsx ('use client')
│   │   ├── Projects.jsx
│   │   ├── Services.jsx
│   │   └── Skills.jsx
│   ├── data/
│   │   └── portfolio.js              # all site content (NEXT_PUBLIC_* env)
│   ├── hooks/
│   │   ├── useActiveSection.js
│   │   └── useTheme.js               # SSR-safe rewrite
│   ├── lib/
│   │   ├── alert.js                  # SweetAlert2 popups (client)
│   │   └── server/
│   │       ├── emailTemplates.js     # HTML/text email templates
│   │       └── validateContact.js    # server-side form validation
│   └── utils/
│       └── duration.js
├── .env.example
├── .env.local                        # git-ignored, real secrets
├── eslint.config.mjs                 # generated by create-next-app
├── jsconfig.json                     # generated (@/* alias)
├── netlify.toml                      # only if deploying to Netlify (§8)
├── next.config.mjs                   # generated, no changes needed
├── package.json
└── postcss.config.mjs                # generated (@tailwindcss/postcss)
```
