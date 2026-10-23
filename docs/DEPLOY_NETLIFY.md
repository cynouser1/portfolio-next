# Deploy to Netlify

Netlify detects Next.js and runs it through its built-in Next.js runtime. That covers the static page, the daily
revalidation and the `/api/contact` route handler (deployed as a Netlify Function). No plugin or adapter needs to be installed.

## Before you start

- The project is pushed to a GitHub (or GitLab/Bitbucket) repository.
- `npm run build` passes locally.
- You have a Gmail App Password (or other SMTP credentials). See [ENVIRONMENT.md](ENVIRONMENT.md#gmail-app-password).

> **Don't reuse the old Vite `netlify.toml`.** Its `/* → /index.html` SPA fallback and its
> `/api/* → /.netlify/functions/:splat` redirect break Next.js routing and the contact API. This project needs
> no `netlify.toml` at all.

## 1. Push the code

```bash
git add .
git commit -m "Next.js portfolio"
git push origin main
```

Check that `.env` / `.env.local` are **not** committed (they're git-ignored).

## 2. Import the project

1. Sign in at <https://app.netlify.com>.
2. **Add new site → Import an existing project**, choose your Git provider and the repository.
3. Netlify shows **Next.js** as the detected framework. Keep the defaults:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Before deploying, add the environment variables (step 3). On the import screen use **Add environment variables**, or
   deploy once and add them afterwards.

## 3. Add environment variables

**Site configuration → Environment variables → Add a variable**. The **Import from a .env file** option lets you paste your
local `.env.local` in one go. Otherwise add each key from [`.env.example`](../.env.example).

- Mark **`SMTP_PASS`** as **Contains secret values**.
- Set **`NEXT_PUBLIC_SITE_URL`** to your final URL, e.g. `https://dhananjay.netlify.app`. Netlify sets its own `URL`
  variable, but the site's metadata reads `NEXT_PUBLIC_SITE_URL`.
- The scopes must include **Builds** (for `NEXT_PUBLIC_*`) and **Functions** (for `SMTP_*`). The default "All scopes" covers both.

See [ENVIRONMENT.md](ENVIRONMENT.md) for what each variable does.

## 4. Deploy

Click **Deploy site** (or **Deploys → Trigger deploy → Deploy site** if you added the variables after the first deploy).
When it finishes, open the `*.netlify.app` URL.

Every later `git push` to `main` deploys automatically. Pull requests get Deploy Previews.

## 5. Check it works

```bash
SITE=https://your-site.netlify.app

# Validation → 400 {"ok":false,"error":"Please enter a valid email address."}
curl -i -X POST $SITE/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"nope","message":"Long enough message"}'

# Wrong method → 405
curl -i $SITE/api/contact
```

Then in the browser:

- Submit the contact form. The email should arrive at `CONTACT_TO_EMAIL`, and the auto-reply should reach the sender.
- View the page source and confirm the `<title>`, the meta description and the `og:*` tags.
- Toggle the theme and reload. The choice should stick without a flash.

## 6. Custom domain (optional)

1. **Domain management → Add a domain** and follow the DNS steps. HTTPS (Let's Encrypt) is issued automatically.
2. Update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy (step 4).

## Optional `netlify.toml`

The defaults are enough. If you want the settings in the repo, or to pin the Node.js version, create this file at
the project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
```

Don't add redirects for `/api` or `/*`.

## Updating the site

| Change | What to do |
| ------ | ---------- |
| Content (`src/data/portfolio.js`), components, CV, images | Commit and push. Netlify redeploys |
| A `NEXT_PUBLIC_*` variable | Edit it, then **Deploys → Trigger deploy → Clear cache and deploy site** |
| An `SMTP_*` / server variable | Edit it, then **Trigger deploy → Deploy site** |

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Form says *"Email service is not configured."* | An `SMTP_*` or `CONTACT_TO_EMAIL` variable is missing, or its scope excludes Functions. Fix it and redeploy |
| Form says *"Could not send your message right now."* | Open **Logs → Functions** and look for the Next.js server function. A `535` / `Invalid login` error means a wrong App Password, or 2-Step Verification is off |
| `/api/contact` returns 404, or every page shows the home page | An old `netlify.toml` or `_redirects` file with SPA or `/.netlify/functions` redirects is present. Delete it |
| Old email/links still showing after changing an env var | Use **Clear cache and deploy site**. `NEXT_PUBLIC_*` values are inlined at build time |
| Build fails | Run `npm run build` locally first. Make sure Node.js is 20 or newer (set `NODE_VERSION`) |
