# WeTrade Profit Simulator — Deployment Guide

A React-based "what if" simulator for the WeTrade 2026 Season 1 leaderboard.
Supports EN / ID / TH with URL-driven locale (`?lang=th`).

## What's in this folder

```
wetrade-simulator/
├── index.html                  ← HTML entry point
├── package.json                ← dependencies
├── vite.config.js              ← build config
├── tailwind.config.js          ← styling config
├── postcss.config.js           ← CSS pipeline
├── public/
│   ├── logo.png                ← brand logo (served at /logo.png)
│   └── favicon.png             ← browser tab icon
└── src/
    ├── main.jsx                ← React mount point
    ├── index.css               ← global styles
    └── ProfitSimulator.jsx     ← the simulator component
```

---

## Quick test before deploying (optional, but recommended)

If you have Node.js installed (`node --version` should show v18 or newer), run this
in the folder once to preview locally:

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). You'll see the simulator.
Press Ctrl+C in the terminal to stop.

If you don't have Node.js, skip this — the hosting platforms will install it for you.

---

## Deployment options, ranked by ease

### 🥇 Option 1 — Vercel (easiest, 5 minutes, free)

Vercel is the recommended path. It's free for this kind of site, integrates with
GitHub, and auto-deploys every time you push a change.

**Steps:**

1. Put this folder on GitHub:
   - Create a new repo at https://github.com/new (call it anything, e.g. `wetrade-simulator`)
   - Follow GitHub's instructions to upload — either drag the folder into the web UI,
     or use `git init && git add . && git commit -m "initial" && git push` from the terminal
2. Go to https://vercel.com and sign in with your GitHub account
3. Click **"Add New Project"** → pick your repo → click **"Deploy"**
4. Wait ~60 seconds. You'll get a live URL like `wetrade-simulator.vercel.app`

**To use a custom domain** (e.g. `simulator.wetrademarketing.com`):
Vercel dashboard → your project → Settings → Domains → add your domain → follow
the DNS instructions they show you.

---

### 🥈 Option 2 — Netlify (basically identical to Vercel)

Same workflow, different brand. Free tier is generous.

1. Put the folder on GitHub (same as above)
2. Go to https://app.netlify.com/start
3. Connect GitHub, pick the repo
4. Netlify auto-detects Vite — just click **Deploy**
5. You get a live `*.netlify.app` URL

---

### 🥉 Option 3 — DigitalOcean App Platform (if you prefer DO)

Costs ~$5/month for a static site (cheapest "Starter" tier).

1. Put the folder on GitHub (same as above)
2. In DigitalOcean console → **Apps** → **Create App**
3. Choose **GitHub** as the source → authorize → pick your repo
4. DO detects it as a Node.js app. Override these settings:
   - **Type**: change from "Web Service" to **"Static Site"**
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
5. Pick the **Starter** plan ($0 for static sites on some plans, or ~$3–5/mo)
6. Click **Create Resources**
7. Live URL appears in 2–3 minutes

Connect a custom domain: App → Settings → Domains → add domain → copy the CNAME
target into your DNS (Cloudflare, Namecheap, etc.).

---

### Option 4 — GitHub Pages (free, GitHub-only, slightly more fiddly)

Only recommended if you specifically want to stay inside GitHub.

1. Push the folder to GitHub
2. Create `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Add a `base` path to `vite.config.js` if your repo isn't named `username.github.io`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // ← add this line
});
```

4. Repo Settings → Pages → Source: **GitHub Actions**
5. Push to `main`. Live at `https://your-username.github.io/your-repo-name/` after
   the Actions workflow finishes (~2 minutes)

---

## Updating the site later

Once connected (Vercel/Netlify/DO), updates are automatic:

1. Edit a file (e.g. change the traders in `src/ProfitSimulator.jsx`)
2. Push to GitHub
3. New deployment runs automatically — live in 1–2 minutes

No manual uploads, no FTP, no servers to manage.

---

## Common edits you'll want to make

### Change trader data (top 3 leaderboard names)

Edit the `TRADERS` array in `src/ProfitSimulator.jsx` (near the top). Each object:

```js
{
  id: 'ycf888',              // internal ID
  handle: 'ycf888',           // display name
  acc: '7235598',             // account number
  platform: 'MT4',
  rank: 1,
  seasonProfit: 5634,         // shows as "+5,634%"
  seasonPrize: 250000,
  markets: 'Gold · Indices · FX',
  risk: 'high',               // 'high' | 'medium' | 'low'
  riskColor: '#EF4444',
  dailyReturns: [0.055, 0.042, -0.020, 0.068, 0.048, 0.078, 0.065],
  // ↑ 7 numbers = daily % return for each of 7 days. Negative = loss day.
}
```

### Change translated strings

Edit the `T` object in the same file. Three blocks: `T.en`, `T.id`, `T.th`.
Just update the string values — structure stays the same.

### Change CTA destination

Edit `CTA_URLS` in the same file:

```js
const CTA_URLS = {
  en: 'https://portal.wetrade.com/login?redirect=...',
  id: '...',
  th: '...',
};
```

### Replace the logo

Drop your new file into `public/logo.png` (same filename). Deploy. Done.

---

## Troubleshooting

**Build fails with "module not found"** — Run `npm install` in the folder. If still
failing, delete `node_modules` and `package-lock.json` then `npm install` again.

**Logo doesn't show up** — Confirm `public/logo.png` exists. In the browser, open
`your-site.com/logo.png` directly — if 404, the file isn't deploying. Check your
hosting provider's "publish directory" is set to `dist`.

**Thai/Indonesian text renders as boxes** — The Kanit font failed to load. Check the
browser console for font errors. Usually means Google Fonts is blocked by an ad blocker
or your network.

**`?lang=th` doesn't persist on page reload** — That's a hosting config issue with
SPA routing. On Vercel/Netlify this works out of the box. On DigitalOcean, set the
"Catchall Document" to `index.html` in the App settings.

---

## Quick reference: where things live

| You want to change...              | Edit this file                      |
|------------------------------------|-------------------------------------|
| Trader list / performance data     | `src/ProfitSimulator.jsx` → `TRADERS` |
| Translations (EN/ID/TH)            | `src/ProfitSimulator.jsx` → `T`     |
| CTA button URLs                    | `src/ProfitSimulator.jsx` → `CTA_URLS` |
| Brand colors                       | `src/ProfitSimulator.jsx` → `C`     |
| Logo image                         | `public/logo.png`                   |
| Favicon                            | `public/favicon.png`                |
| Page title / meta description      | `index.html`                        |
| Social preview image               | `index.html` (`og:image`)           |
