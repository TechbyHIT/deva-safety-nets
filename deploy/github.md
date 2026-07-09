# Deploy via GitHub only (Hostinger VPS)

Push to GitHub → GitHub Actions builds the Docker image → Hostinger VPS pulls and runs it.

**No manual ZIP upload. No SSH deploy required** (SSH is optional for debugging).

---

## How it works

```
git push main
    ↓
GitHub Actions: build Next.js → push image to ghcr.io
    ↓
Hostinger API: pull image → docker compose up
    ↓
Site live at http://YOUR_VPS_IP:3000
```

The VPS **never builds** the app (avoids out-of-memory errors). All building happens on GitHub.

---

## Step 1 — Push project to GitHub

On your PC:

```powershell
cd "D:\Projects\deva safety nets"
git init
git add .
git commit -m "Initial commit — Deva Safety Nets"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Required files in the repo (already in project):

- `Dockerfile`
- `docker-compose.github.yml` ← used for Hostinger deploy
- `.github/workflows/deploy.yml` ← auto deploy on push

---

## Step 2 — Hostinger API key + VM ID

### 2.1 API key

1. [hpanel.hostinger.com](https://hpanel.hostinger.com) → **Profile** → **API**
2. Create / copy your **API key**

### 2.2 VM ID

1. hPanel → **VPS** → your server → **Overview**
2. VM ID is in the URL: `https://hpanel.hostinger.com/vps/123456/overview` → ID is **123456**
3. Or from hostname `srv123456.hstgr.cloud` → ID is **123456**

**Use only the number** — not the full URL. Wrong values cause:
`virtual-machines/https:/hpanel.hostinger.com/vps/.../docker could not be found`

---

## Step 3 — GitHub secrets & variables

Repo → **Settings** → **Secrets and variables** → **Actions**

### Secrets (encrypted)

| Name | Value |
|---|---|
| `HOSTINGER_API_KEY` | Your Hostinger API key |
| `REVALIDATE_SECRET` | Long random string (you make this up) |
| `HOSTINGER_VM_ID` | VM ID from step 2 — **can also go in Variables** | `123456` |

### Variables (plain text)

| Name | Value | Example |
|---|---|---|
| `HOSTINGER_VM_ID` | VM ID from step 2 — **or put in Secrets instead** | `123456` |
| `NEXT_PUBLIC_SITE_URL` | Your live domain | `https://devasafetynets.in` |
| `NEXT_PUBLIC_SITE_NAME` | Site name | `Deva Safety Nets` |
| `NEXT_PUBLIC_BRAND_PHONE` | Phone | `+917558844405` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number | `917558844405` |
| `NEXT_PUBLIC_EMAIL` | Email | `devasafetynetskochi@gmail.com` |
| `APP_PORT` | Host port | `3000` |

---

## Step 4 — Make GHCR package public (first deploy only)

After the first successful **Build** job:

1. GitHub repo → **Packages** (right sidebar) → click the container package
2. **Package settings** → **Change visibility** → **Public**

This lets Hostinger pull the image without login.  
(Private repos can keep the code private; only the **package** must be public for pull.)

### Private GitHub repo?

Add an SSH deploy key so Hostinger can clone your repo:

[Hostinger: deploy from private GitHub repo](https://www.hostinger.com/support/how-to-deploy-from-private-github-repository-on-hostinger-docker-manager/)

---

## Step 5 — Trigger deploy

Push to `main` (or run manually):

```powershell
git add .
git commit -m "Deploy to Hostinger"
git push
```

Or: GitHub → **Actions** → **Deploy to Hostinger** → **Run workflow**

### Watch progress

GitHub → **Actions** tab:

1. **Build Docker image** — ~5–10 min (first time)
2. **Deploy to Hostinger VPS** — ~1–2 min

### Verify on Hostinger

hPanel → **Docker Manager** → project **deva-safety-nets**:

- **1 container** — `deva-safety-nets` — status **Running**

Open: `http://YOUR_VPS_IP:3000`

---

## Step 6 — Domain (optional)

1. Point DNS A record → VPS IP
2. Install Nginx using `deploy/nginx.conf`
3. Cloudflare: SSL mode **Full (strict)**

---

## Troubleshooting failed Actions runs

Open the failed run → check **which job** is red:

| Failed job | Time | Fix |
|---|---|---|
| **Check Hostinger config** | < 30s | Add `HOSTINGER_API_KEY`, `REVALIDATE_SECRET` secrets and `HOSTINGER_VM_ID` variable |
| **Build Docker image** | ~5 min | Click job → read build log; usually Docker/npm build error |
| **Deploy to Hostinger VPS** | < 1 min | See below |

### Deploy job failures (most common after 5 min build)

| Error in log | Fix |
|---|---|
| `Invalid API key` / `401` | Regenerate API key in hPanel → Profile → API → update `HOSTINGER_API_KEY` secret |
| `Virtual machine not found` | Fix `HOSTINGER_VM_ID` (number from VPS URL, e.g. `123456`) |
| `pull access denied` / `unauthorized` | GitHub → **Packages** → container → **Package settings** → **Public** |
| `repository not found` / `could not read from remote` | **Private repo** — add Hostinger VPS SSH key to GitHub deploy keys ([guide](https://www.hostinger.com/support/how-to-deploy-from-private-github-repository-on-hostinger-docker-manager/)) |
| `0 containers` in hPanel | Deploy job failed — fix error above, re-run workflow |

### Old "Docker build & deploy" failures (18–21s)

Those used a removed workflow (`docker.yml`). Ignore them. Only **Deploy to Hostinger** matters now.

---

## Troubleshooting (general)

Actions → failed run → read **Build Docker image** logs.  
Usually a TypeScript or `npm run build` error — fix locally, push again.

### Deploy job fails

| Error | Fix |
|---|---|
| `Invalid API key` | Re-check `HOSTINGER_API_KEY` secret |
| `Virtual machine not found` | Re-check `HOSTINGER_VM_ID` variable |
| `pull access denied` | Make GHCR package **Public** (Step 4) |
| **0 containers** in hPanel | Deploy job failed — check Actions logs |

### SSH debug (optional)

```bash
ssh root@YOUR_VPS_IP
docker ps -a
docker logs deva-safety-nets --tail 80
curl http://127.0.0.1:3000/api/health
```

---

## Every future update

```powershell
git add .
git commit -m "Your change"
git push
```

GitHub Actions rebuilds and redeploys automatically.

---

## Checklist

- [ ] Code pushed to GitHub `main` branch
- [ ] `HOSTINGER_API_KEY` secret set
- [ ] `HOSTINGER_VM_ID` variable set
- [ ] `REVALIDATE_SECRET` secret set
- [ ] `NEXT_PUBLIC_SITE_URL` variable set
- [ ] First build succeeded in Actions
- [ ] GHCR package set to **Public**
- [ ] Deploy job succeeded
- [ ] hPanel shows **1 running container**
- [ ] `http://YOUR_VPS_IP:3000` loads the site
