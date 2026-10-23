# Environment variables & email setup

Both deployment guides ([Vercel](DEPLOY_VERCEL.md), [Netlify](DEPLOY_NETLIFY.md)) use the variables below.
The full template is [`.env.example`](../.env.example).

## Local setup

```bash
cp .env.example .env.local   # .env* files are git-ignored (except .env.example)
npm run dev                  # http://localhost:3000 — the contact form API works here too
```

Next.js loads `.env.local` and `.env` automatically. Values in `.env.local` take priority.

## Reference

### Server-only (never sent to the browser)

Used by [`src/app/api/contact/route.js`](../src/app/api/contact/route.js).

| Variable             | Required | Example                        | Purpose |
| -------------------- | -------- | ------------------------------ | ------- |
| `SMTP_HOST`          | yes      | `smtp.gmail.com`               | SMTP server |
| `SMTP_PORT`          | no       | `465`                          | Defaults to `465` |
| `SMTP_SECURE`        | no       | `true`                         | `true` for port 465, `false` for 587 |
| `SMTP_USER`          | yes      | `you@gmail.com`                | SMTP login, also the "From" address |
| `SMTP_PASS`          | yes      | 16-char App Password           | **Secret.** Mark it sensitive on the host |
| `CONTACT_TO_EMAIL`   | yes      | `you@gmail.com`                | Where form messages are delivered |
| `MAIL_FROM_NAME`     | no       | `Portfolio Contact`            | Display name in the "From" header |
| `CONTACT_OWNER_NAME` | no       | `Dhananjay Dhiman`             | Signature on the auto-reply |
| `SEND_AUTO_REPLY`    | no       | `true`                         | Send the visitor a confirmation email |

If any required value is missing, the form returns *"Email service is not configured."*

### Public (`NEXT_PUBLIC_*`, bundled into the site)

Read in [`src/data/portfolio.js`](../src/data/portfolio.js). Leave a value blank to use the default in that file.

| Variable                         | Purpose |
| -------------------------------- | ------- |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | Email shown on the site |
| `NEXT_PUBLIC_CONTACT_PHONE`      | Phone shown on the site |
| `NEXT_PUBLIC_GITHUB_URL`         | GitHub profile link |
| `NEXT_PUBLIC_LINKEDIN_URL`       | LinkedIn profile link |
| `NEXT_PUBLIC_RESUME_URL`         | CV link (default `/Resume.pdf`) |
| `NEXT_PUBLIC_SITE_URL`           | Your live URL, used for SEO/Open Graph tags and links in emails |
| `NEXT_PUBLIC_AVAILABLE_FOR_WORK` | `true` / `false`, shows the availability badge |
| `NEXT_PUBLIC_AVAILABILITY_TEXT`  | Badge text |
| `NEXT_PUBLIC_SHOW_SERVICES`      | `true` / `false`, shows the Services section |
| `NEXT_PUBLIC_SHOW_LINKS`         | `true` / `false`, shows the Links section |

> **Important:**
> - `NEXT_PUBLIC_*` values are baked in at **build time**. After changing one, restart `npm run dev` locally, or
>   redeploy on Vercel/Netlify.
> - Never put a secret in a `NEXT_PUBLIC_*` variable, because it ends up in the public JavaScript.

## Gmail App Password

Gmail rejects your normal password over SMTP. Create an App Password instead:

1. Google Account → **Security** → turn on **2-Step Verification**.
2. Open <https://myaccount.google.com/apppasswords>, create one named "Portfolio", and copy the 16 characters
   (remove the spaces).
3. Set the SMTP variables:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_SECURE=true`
   - `SMTP_USER=<your gmail>`
   - `SMTP_PASS=<app password>`

Other providers (Zoho, Brevo, Outlook, a custom domain) work too. Use the provider's host and port. For port `587`, set
`SMTP_SECURE=false`.

## Why `cacheComponents` is off

`next.config.mjs` deliberately leaves out `cacheComponents` and `partialPrefetching`:

- **It wouldn't speed anything up.** The portfolio is one fully static page that is prerendered at build time and
  rebuilt daily (`revalidate` in `src/app/page.js`), then served from the CDN. Cache Components only helps when a
  server-rendered page mixes cached data with per-request data, and this site has none.
- **It would break things.** With it on:
  - the `revalidate` export is rejected;
  - every `new Date()` in a Client Component fails the build (footer year, years of experience, job durations).
- **Partial prefetching doesn't apply.** It only affects `<Link>` navigation between routes, and there is a single route.

Turn it back on only if you add server-side data later (a blog, a CMS, a database), and then migrate following
`node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.
