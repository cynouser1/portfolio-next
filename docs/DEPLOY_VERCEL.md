# Deploy to Vercel

Vercel builds Next.js with no configuration. The page is served from the CDN, and `/api/contact` becomes a
serverless function automatically.

## Before you start

- The project is pushed to a GitHub (or GitLab/Bitbucket) repository.
- `npm run build` passes locally.
- You have a Gmail App Password (or other SMTP credentials). See [ENVIRONMENT.md](ENVIRONMENT.md#gmail-app-password).

## 1. Push the code

```bash
git add .
git commit -m "Next.js portfolio"
git push origin main
```

Check that `.env` / `.env.local` are **not** committed (they're git-ignored).

## 2. Import the project

1. Sign in at <https://vercel.com> with GitHub.
2. Click **Add New → Project** and **Import** your repository.
3. **Framework Preset** is detected as **Next.js**. Keep the defaults:
   - Build Command: `npm run build`
   - Output Directory: (default)
   - Install Command: `npm install`
4. Don't click Deploy yet. Open **Environment Variables** first (step 3).

## 3. Add environment variables

The quickest way is to paste the contents of your local `.env.local` into the first **Key** field. Vercel splits it into
separate variables. Otherwise add each key from [`.env.example`](../.env.example) one by one.

- Mark **`SMTP_PASS`** as **Sensitive**.
- Set **`NEXT_PUBLIC_SITE_URL`** to your final URL, e.g. `https://dhananjay.vercel.app`. If you don't know it yet,
  deploy once, copy the URL, set the variable, then redeploy.
- Apply the variables to **Production**. Add **Preview** too if you want the form to work on preview deployments.

See [ENVIRONMENT.md](ENVIRONMENT.md) for what each variable does.

## 4. Deploy

Click **Deploy**. The first build takes about a minute. When it finishes, open the URL Vercel gives you.

Every later `git push` to `main` deploys automatically. Pushes to other branches get preview URLs.

## 5. Check it works

```bash
SITE=https://your-site.vercel.app

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

1. Project → **Settings → Domains → Add**, enter your domain.
2. Add the DNS records Vercel shows at your registrar. HTTPS is issued automatically.
3. Update `NEXT_PUBLIC_SITE_URL` to the new domain and **redeploy**.

## Updating the site

| Change | What to do |
| ------ | ---------- |
| Content (`src/data/portfolio.js`), components, CV, images | Commit and push. Vercel redeploys |
| A `NEXT_PUBLIC_*` variable | Edit it in **Settings → Environment Variables**, then **Deployments → ⋯ → Redeploy** |
| An `SMTP_*` / server variable | Edit it, then redeploy |

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Form says *"Email service is not configured."* | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` or `CONTACT_TO_EMAIL` is missing for this environment (Production vs Preview). Add it and redeploy |
| Form says *"Could not send your message right now."* | Open **Logs** and filter by `/api/contact`. A `535` / `Invalid login` error means a wrong App Password, or 2-Step Verification is off |
| Old email/links still showing after changing an env var | `NEXT_PUBLIC_*` values are inlined at build time, so redeploy |
| Build fails | Run `npm run build` locally, fix the error and push again. Check that the Node.js version (Settings → General) is 20 or newer |
