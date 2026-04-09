# Deploying paramai-blog to www.paramai.blog

End-to-end deploy guide: get the Astro blog live at `https://www.paramai.blog` using:

- **Domain**: already registered with Hostinger
- **Hosting**: Vercel Free (Hobby plan, ₹0/month)
- **SSL**: automatic via Let's Encrypt (issued by Vercel)

Total time: ~15 minutes of clicking + up to 1 hour for DNS propagation.

---

## Part 1 — Deploy the repo to Vercel (5 minutes)

### 1.1 Create a Vercel account

1. Go to <https://vercel.com/signup>.
2. Click **"Continue with GitHub"** and authorize Vercel to read your repos.
   - Use the GitHub account that owns `aditdhn/paramai-blog`.
3. When asked about a team, pick **"Personal / Hobby"** (free plan).

### 1.2 Import the repo

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**.
2. In the "Import Git Repository" list, find `aditdhn/paramai-blog`.
   - If it's not visible, click **"Adjust GitHub App Permissions"** and grant Vercel access to that repo, then refresh.
3. Click **"Import"** next to `aditdhn/paramai-blog`.

### 1.3 Configure the project

Vercel auto-detects Astro. The defaults should match `vercel.json`:

| Field | Value |
|---|---|
| Framework Preset | **Astro** (auto-detected) |
| Build Command | `npm run build` (auto) |
| Output Directory | `dist` (auto) |
| Install Command | `npm install` (auto) |
| Root Directory | `./` (leave empty) |
| Node.js Version | **20.x** |

**Environment Variables**: none needed — the scaffold has no secrets.

Click **"Deploy"**. Wait ~1 minute. Vercel gives you a temporary URL like `paramai-blog-xxxx.vercel.app`. Visit it — you should see the blog homepage with all 41 sector cards.

> If the build fails, check the "Build Logs" tab. The scaffold has been verified locally, so failures at this stage are almost always environment/permissions issues.

---

## Part 2 — Add your custom domain in Vercel (3 minutes)

### 2.1 Open the Domains panel

1. In the Vercel dashboard, click your `paramai-blog` project.
2. Click **"Settings"** in the top nav.
3. Click **"Domains"** in the left sidebar.

### 2.2 Add both apex and www

Add these **one at a time**:

1. Type `www.paramai.blog` in the input, click **"Add"**.
2. Type `paramai.blog` in the input, click **"Add"**.
3. When Vercel asks how to handle redirects, choose:
   - **Redirect `paramai.blog` → `www.paramai.blog`** (permanent 308)
   - This makes `www` the canonical version, which matches `vercel.json` and `astro.config.mjs`.

Vercel will now show both domains with a **"Invalid Configuration"** warning and a list of DNS records you need to add at your registrar. **Keep this tab open** — you'll copy values from it in Part 3.

The records will look like:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> Vercel occasionally shows a slightly different A-record IP. **Use whatever Vercel actually displays**, not the values above — they can rotate over time.

---

## Part 3 — Point Hostinger DNS at Vercel (5 minutes)

This is the only time you touch Hostinger. After this, you can forget they exist (until domain renewal).

### 3.1 Log into hPanel

1. Go to <https://hpanel.hostinger.com/>.
2. Log in with the credentials you used when buying the domain.

### 3.2 Open the DNS editor for paramai.blog

1. In the top nav, click **"Domains"**.
2. Find `paramai.blog` in the list and click **"Manage"**.
3. In the left sidebar, click **"DNS / Nameservers"**.
4. Stay on the **"DNS Records"** tab (NOT "Nameservers" — leave those at Hostinger's defaults).

### 3.3 Delete the default records

Hostinger adds placeholder A / CNAME / MX records when a domain is registered. You need to clear the conflicting ones so Vercel's records take effect:

1. Find the existing **A record with Name `@`** (may point at a parking page IP). Click the **trash / delete icon**.
2. Find the existing **CNAME record with Name `www`** if one exists. Delete it.
3. **Leave alone**:
   - MX records (email routing — keep Hostinger's defaults unless you're using Google Workspace)
   - TXT records (SPF/DKIM if any)
   - NS records (nameservers)

### 3.4 Add the Vercel A record

Click **"Add record"** (or equivalent button at the top of the records list):

| Field | Value |
|---|---|
| Type | `A` |
| Name | `@` |
| Points to | `76.76.21.21` *(or whatever Vercel displayed in Part 2.2)* |
| TTL | `14400` (or leave default) |

Click **Save / Add**.

### 3.5 Add the Vercel CNAME record

Click **"Add record"** again:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `www` |
| Target | `cname.vercel-dns.com` *(do NOT add a trailing dot — Hostinger handles that)* |
| TTL | `14400` |

Click **Save / Add**.

### 3.6 Verify the records list

Your DNS records panel should now include:

```
A      @      76.76.21.21                14400
CNAME  www    cname.vercel-dns.com       14400
MX     @      mx1.hostinger.com    5     14400   (keep as-is)
...
```

---

## Part 4 — Wait for DNS + verify (5–60 minutes)

### 4.1 Check propagation

DNS changes propagate globally in 5 minutes to ~1 hour. You can watch it happen:

1. Go back to the Vercel **Domains** tab from Part 2.
2. Refresh the page every few minutes.
3. When Vercel finishes verifying, both domains flip from **"Invalid Configuration"** (red) to **"Valid Configuration"** (green) with a padlock icon.

You can also check from any terminal:

```bash
dig www.paramai.blog +short
# Should return a Vercel IP (starts with 76.76.* or similar)

dig paramai.blog +short
# Should return 76.76.21.21
```

Or use <https://dnschecker.org/#A/paramai.blog> to see propagation across global resolvers.

### 4.2 SSL certificate

As soon as DNS verifies, Vercel automatically requests a Let's Encrypt certificate for both `paramai.blog` and `www.paramai.blog`. This takes another 30–90 seconds. You'll see a **"Issuing certificate…"** state followed by a green padlock.

### 4.3 Smoke test

Open all four URLs. They should all land on the same page (the `www` version with a valid HTTPS padlock):

- <http://paramai.blog> → should redirect to `https://www.paramai.blog`
- <https://paramai.blog> → should redirect to `https://www.paramai.blog`
- <http://www.paramai.blog> → should redirect to `https://www.paramai.blog`
- <https://www.paramai.blog> → homepage with 41 sector cards

Also check:
- <https://www.paramai.blog/sitemap-index.xml> → XML sitemap
- <https://www.paramai.blog/rss.xml> → RSS feed
- <https://www.paramai.blog/robots.txt> → `Allow: /` + sitemap link
- <https://www.paramai.blog/sectors/ai-ml/> → a sector page

---

## Part 5 — Post-deploy hygiene (10 minutes)

### 5.1 Submit to Google Search Console

1. Go to <https://search.google.com/search-console>.
2. Click **"Add property"** → choose **"URL prefix"**.
3. Enter `https://www.paramai.blog` and click **Continue**.
4. Verify ownership — the easiest method is **"HTML tag"**:
   - Google gives you a `<meta name="google-site-verification" content="..." />` tag.
   - Add it once to `src/layouts/BaseLayout.astro` inside `<head>`, commit, push. Vercel auto-redeploys in ~1 minute, then click **"Verify"** in Search Console.
5. Once verified, go to **Sitemaps** → add `sitemap-index.xml` → Submit.

### 5.2 Submit to Bing Webmaster Tools

1. Go to <https://www.bing.com/webmasters>.
2. Click **"Import from Google Search Console"** — this is the fastest path; Bing imports your GSC property and sitemap in one click.

### 5.3 Add analytics (optional but recommended)

Pick one. Both are free for your scale:

**Option A — Plausible Analytics** (privacy-first, no cookie banner needed):
- Sign up at <https://plausible.io/>
- Add `paramai.blog` as a site
- Add one script tag to `BaseLayout.astro`:
  ```html
  <script defer data-domain="paramai.blog" src="https://plausible.io/js/script.js"></script>
  ```

**Option B — Google Analytics 4** (free, more powerful, requires cookie banner in EU):
- Create a GA4 property at <https://analytics.google.com/>
- Get the Measurement ID (`G-XXXXXXXXXX`)
- Add the gtag snippet to `BaseLayout.astro`

Either way, the UTM parameters already baked into `AssessmentCTA.astro` (`utm_source=blog&utm_medium=sector&utm_campaign=<slug>`) will surface as the top traffic source to `paramai.in`, so you can measure blog→assessment conversion.

### 5.4 Flip your first sector from draft to published

1. Open `src/content/sectors/ai-ml.mdx` (or your highest-priority sector).
2. Replace the `> **TODO:**` sections with real content (~800–1500 words).
3. Change frontmatter: `draft: true` → `draft: false`.
4. Commit + push. Vercel auto-deploys in ~1 minute. The post is live at `https://www.paramai.blog/sectors/ai-ml/` and appears on the homepage grid.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Invalid Configuration" stuck red in Vercel for >1 hour | DNS records not propagated or wrong values | Re-check Hostinger DNS panel values exactly match what Vercel's Domains tab shows |
| "This site can't provide a secure connection" | DNS propagated but SSL not issued yet | Wait 2 more minutes and refresh; Vercel retries automatically |
| Homepage shows a Vercel "Not Found" page | Custom domain attached to wrong project | In Vercel, check the project linked to the domain under Settings → Domains |
| `paramai.blog` works but `www.paramai.blog` doesn't | CNAME record missing or pointing wrong | Add/fix the `CNAME www → cname.vercel-dns.com` record in Hostinger |
| `www` works but apex doesn't redirect | A record missing on `@` | Add `A @ 76.76.21.21` in Hostinger |
| Build passes locally but fails on Vercel | Node version mismatch | In Vercel → Settings → General → Node.js Version, set to **20.x** |
| New commits don't deploy | Branch not connected | Vercel → Settings → Git → check "Production Branch" is `main` |

---

## Cost summary

| Item | Cost |
|---|---|
| Domain `paramai.blog` (annual renewal at Hostinger) | ~₹2,500–3,500/year |
| Vercel Hobby hosting | **₹0/month** |
| SSL certificate (Let's Encrypt via Vercel) | **₹0** |
| Bandwidth (100 GB/month on Hobby) | **₹0** at blog-scale traffic |
| Preview deploys per PR | **₹0** |
| **Total marginal cost to run the blog** | **₹0/month** |

The only ongoing cost is the domain renewal at Hostinger, which you're already paying.

---

## What you do NOT need to buy from Hostinger

- ❌ Shared hosting plan
- ❌ VPS
- ❌ Email hosting (use a forwarder or Google Workspace separately)
- ❌ SSL certificate (Vercel provides it free)
- ❌ Website builder
- ❌ Anything labeled "Website", "Hosting", or "Premium"

**You only need the domain. The rest is free through Vercel.**
