# Dhananjay — Developer Portfolio

React 19 + Vite + Tailwind CSS v4 + Framer Motion.

## Updating content

**All content lives in [`src/data/portfolio.js`](src/data/portfolio.js).** Edit that file only — every section reads from it.

- Add a project / job / skill → add an entry to the relevant array.
- Hide a section → empty its array (e.g. `projects: []`) or remove it from `nav`.
- Education is shown in the Experience section's side column (with the career timeline). Add `short: 'MCA'` for the snapshot chip.
- Job type badge (Full-time, Part-time, Internship, Freelance, Contract) → `type` on each experience entry. Durations are calculated from `start` / `end`.
- Featured vs other projects → `featured: true/false`; add `image: '/file.webp'` for a screenshot on featured cards.
- **Services** section → edit the `services` array (title, icon, description, features). Show/hide it with `VITE_SHOW_SERVICES=true|false` in `.env`.
- **Links** section ("Around the web": websites you built, demos, company pages, articles) → edit the `links` array (`title`, `url`, `category`, `description`). Filter tabs are created from the categories you use. Show/hide with `VITE_SHOW_LINKS=true|false`.
- Change the hero's typing words → `meta.typedRoles`.
- Replace your CV → overwrite `public/Resume.pdf` (path set by `meta.resume`).
- Change your photo → replace `public/Profile-img.png`, then regenerate the optimized copy:
  `python3 -c "from PIL import Image; Image.open('public/Profile-img.png').convert('RGB').resize((640,640)).save('public/profile.webp', quality=82)"`
  (or point `meta.avatar.src` straight at the PNG). Delete `meta.avatar` to hide the photo.
- Skill logos → set `icon` on a skill to a key listed in `src/components/ui/TechIcon.jsx` (uses `react-icons`).
- Add live/GitHub links to a project → `links: { live: 'https://…', github: 'https://…' }`.

## Commands

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build
npx netlify-cli dev  # site + contact-form function, with .env loaded
```

## Contact form & environment variables

The contact form posts to `/api/contact`, a Netlify Function (`netlify/functions/contact.js`) that emails
the message over SMTP to `CONTACT_TO_EMAIL` — with an HTML email and an optional auto-reply to the visitor.
The visitor sees a themed SweetAlert2 popup on success or failure (`src/lib/alert.js`, styles in `src/index.css`).

```bash
cp .env.example .env   # then fill in your values (.env is git-ignored)
```

- **`SMTP_*`, `CONTACT_TO_EMAIL`, `MAIL_FROM_NAME`, `CONTACT_OWNER_NAME`, `SEND_AUTO_REPLY`** — server-only, used by the function. Never exposed to the browser.
- **`VITE_*`** — public site info (contact email/phone, GitHub/LinkedIn, résumé URL, site URL, availability) and section toggles (`VITE_SHOW_SERVICES`, `VITE_SHOW_LINKS`). Leave blank to use the defaults in `src/data/portfolio.js`. Restart the dev server after changing them.

`npm run dev` runs only the frontend. To test the form locally run `npx netlify-cli dev` (serves the site + function and loads `.env`).

Email templates live in `netlify/lib/emailTemplates.js`.

## Deploy (Netlify)

Build settings and the `/api` redirect are in `netlify.toml`. You only need to import the repo and add the
environment variables — **see [docs/NETLIFY_SETUP.md](docs/NETLIFY_SETUP.md)** for the step-by-step guide
(Gmail App Password, env vars, redeploy, testing and troubleshooting).
