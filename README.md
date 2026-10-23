# Dhananjay — Developer Portfolio

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion. The contact form sends email through a Next.js
API route with Nodemailer.

## Commands

```bash
npm install
cp .env.example .env.local   # then fill in your values (see docs/ENVIRONMENT.md)
npm run dev      # http://localhost:3000, with hot reload (contact form API included)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Updating content

**All content lives in [`src/data/portfolio.js`](src/data/portfolio.js).** Edit only that file, because every section reads from it.

- Add a project / job / skill → add an entry to the relevant array.
- Hide a section → empty its array (e.g. `projects: []`) or remove it from `nav`.
- Education is shown in the Experience section's side column (with the career timeline). Add `short: 'MCA'` for the snapshot chip.
- Job type badge (Full-time, Part-time, Internship, Freelance, Contract) → `type` on each experience entry. Durations are calculated from `start` / `end`.
- Featured vs other projects → `featured: true/false`. Add `image: '/file.webp'` for a screenshot on featured cards.
- **Services** section → edit the `services` array (title, icon, description, features). Show or hide it with `NEXT_PUBLIC_SHOW_SERVICES=true|false`.
- **Links** section ("Around the web": websites you built, demos, company pages, articles) → edit the `links` array (`title`, `url`, `category`, `description`). Filter tabs are created from the categories you use. Show or hide it with `NEXT_PUBLIC_SHOW_LINKS=true|false`.
- Change the hero's typing words → `meta.typedRoles`.
- Replace your CV → overwrite `public/Resume.pdf` (the path is set by `meta.resume`).
- Change your photo → replace `public/Profile-img.png`, then regenerate the optimized copy:
  `python3 -c "from PIL import Image; Image.open('public/Profile-img.png').convert('RGB').resize((640,640)).save('public/profile.webp', quality=82)"`
  (or point `meta.avatar.src` straight at the PNG). Delete `meta.avatar` to hide the photo.
- Skill logos → set `icon` on a skill to a key listed in `src/components/ui/TechIcon.jsx` (uses `react-icons`).
- Add live/GitHub links to a project → `links: { live: 'https://…', github: 'https://…' }`.

After changing any `NEXT_PUBLIC_*` value, restart `npm run dev` or redeploy, because these values are baked in at build time.

## Contact form

The form ([`src/components/Contact.jsx`](src/components/Contact.jsx)) posts JSON to `/api/contact`, which is
[`src/app/api/contact/route.js`](src/app/api/contact/route.js). The route:

1. Validates the input ([`src/lib/server/validateContact.js`](src/lib/server/validateContact.js)) and drops spam (hidden `website` honeypot field).
2. Emails the message over SMTP to `CONTACT_TO_EMAIL` (templates in [`src/lib/server/emailTemplates.js`](src/lib/server/emailTemplates.js)).
3. Optionally sends the visitor an auto-reply (`SEND_AUTO_REPLY=true`).

The visitor sees a themed SweetAlert2 popup on success or failure ([`src/lib/alert.js`](src/lib/alert.js), styles in
`src/app/globals.css`). On failure the popup offers a pre-filled `mailto:` link instead.

SMTP credentials are server-only. See **[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)** for every variable and the Gmail App Password steps.

## Project structure

```
src/
├── app/
│   ├── api/contact/route.js   # POST /api/contact (Nodemailer)
│   ├── globals.css            # Tailwind v4, theme tokens, SweetAlert2 styles
│   ├── layout.js              # <html>, fonts, SEO metadata, no-flash theme script
│   └── page.js                # renders <Portfolio />, rebuilt daily
├── components/                # Portfolio.jsx (page shell) + one component per section, ui/ helpers
├── data/portfolio.js          # all site content
├── hooks/                     # useTheme, useActiveSection
├── lib/
│   ├── alert.js               # SweetAlert2 popups (client)
│   └── server/                # email templates + validation (server only)
└── utils/duration.js
public/                        # Resume.pdf, profile.webp, Profile-img.png, favicon.svg
docs/                          # deployment and environment guides
```

Tailwind runs through the `@tailwindcss/turbopack` loader configured in `next.config.mjs` (no PostCSS config needed).
`cacheComponents` is intentionally off. See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md#why-cachecomponents-is-off) for why.

## Deploy

- **Vercel**: [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md)
- **Netlify**: [docs/DEPLOY_NETLIFY.md](docs/DEPLOY_NETLIFY.md)

On both, you import the repo, add the environment variables from `.env.example`, and deploy. No extra config files are needed.
