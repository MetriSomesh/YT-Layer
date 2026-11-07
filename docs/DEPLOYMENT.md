# Deploying YT-Layer for free

This app is a standard Next.js 14 server (SSR + API routes + Prisma), so it
needs a host that can run Node, not a static-only host.

## Which free option to pick

| Platform | Free offer | Fits this app? | Catch |
| --- | --- | --- | --- |
| **Azure App Service (Linux, F1)** | Free indefinitely: 1 GB RAM, 60 CPU-min/day | **Yes — recommended** | Sleeps when idle, 60 min/day CPU, no custom-domain TLS on F1 |
| AWS EC2 `t3.micro` / `t2.micro` | 750 h/month free for 12 months on eligible accounts (new accounts are credit-based) | Yes, via Docker | You administer the server; not free forever |
| AWS Amplify Hosting | Free tier for 12 months | Yes | Build minutes/data caps; not free forever |
| AWS App Runner / ECS Fargate / ALB | — | Yes | **Paid**, not free tier |
| Vercel Hobby | Free | Yes | Not AWS/Azure |

The rest of this guide uses **Azure App Service F1** as the primary target and
includes an **AWS EC2** path at the end. The same code works on both.

---

## 1. Prerequisites

- The repo pushed to GitHub.
- A Neon Postgres project (free tier): https://console.neon.tech
  - Copy the **pooled** connection string (host contains `-pooler`).
  - Append `pgbouncer=true&connect_timeout=15` if they are not already there:
    ```
    postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/DB?sslmode=require&pgbouncer=true&connect_timeout=15
    ```
- Google OAuth client (for YouTube connect) and Cloudinary/imgbb keys.

## 2. Create the Azure Web App

Using the Azure CLI (replace names/region):

```bash
az login
az group create --name yt-layer-rg --location centralindia

# F1 = free tier. Linux is required for the Node runtime.
az appservice plan create \
  --name yt-layer-plan \
  --resource-group yt-layer-rg \
  --sku F1 \
  --is-linux

az webapp create \
  --name <globally-unique-name> \
  --resource-group yt-layer-rg \
  --plan yt-layer-plan \
  --runtime "NODE:20-lts"
```

Or in the portal: **Create → Web App → Code → Linux → Node 20 LTS → Pricing
plan F1 (Free)**.

## 3. Configure application settings

In **App Service → Configuration → Application settings**, add:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `NEXTAUTH_URL` | `https://<app-name>.azurewebsites.net` |
| `NEXTAUTH_SECRET` | random 32-byte hex |
| `JWT_SECRET` | random 32-byte string (base64url is ideal) |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `https://<app-name>.azurewebsites.net/api/google/callback` |
| `GOOGLE_UPLOAD_REDIRECT_URI` | `https://<app-name>.azurewebsites.net/api/upload/callback` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary preset |
| `API_KEY` | imgbb API key |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `WEBSITES_PORT` | `3000` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` (we deploy a prebuilt artifact) |

`PORT` and `WEBSITES_PORT` must agree: the first tells `next start` where to
listen, the second tells App Service which port to probe. If your region's
platform overrides `PORT`, set both to the same value.

Generate secrets locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Also set the startup command (Configuration → General settings → Startup
Command):

```text
npm start
```

If you would rather let the app apply migrations at boot, use
`npm run start:migrate` instead. The GitHub Actions workflow below already
runs migrations, so `npm start` is enough.

Finally, enable the health check at **Monitoring → Health check → Path**:
`/api/health`.

## 4. Deploy

### Option A — GitHub Actions (recommended)

1. Download the publish profile: **App Service → Overview → Download publish
   profile**.
2. In GitHub repo settings → **Secrets and variables → Actions**, add:

   | Secret | Value |
   | --- | --- |
   | `AZURE_WEBAPP_NAME` | your App Service name |
   | `AZURE_WEBAPP_PUBLISH_PROFILE` | contents of the downloaded profile |
   | `DATABASE_URL` | Neon connection string |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |

3. Push to `main` (or run the workflow manually). It:
   - installs deps
   - builds on Ubuntu (so the Prisma engine matches Azure Linux)
   - runs `prisma migrate deploy`
   - prunes dev dependencies
   - deploys the artifact

The workflow lives at `.github/workflows/deploy-azure.yml`.

### Option B — Azure Deployment Center

Deployment Center → GitHub → pick repo/branch → **Node.js** stack. Azure builds
on Linux, runs `npm install` (which triggers `prisma generate`), then
`npm run build`, and starts with `npm start`.

## 5. Point Google and Cloudinary at the new domain

In Google Cloud Console → **APIs & Services → Credentials → OAuth client**:

- Add `https://<app-name>.azurewebsites.net/api/google/callback`
  to **Authorized redirect URIs**.
- Add `https://<app-name>.azurewebsites.net/api/upload/callback` too.
- Add `https://<app-name>.azurewebsites.net` to **Authorized JavaScript origins**.

Cloudinary does not need per-domain configuration, but make sure the upload
preset is unsigned only if you use unsigned uploads.

## 6. Verify

- `https://<app-name>.azurewebsites.net/api/health` → `{"status":"ok",...}`
- `https://<app-name>.azurewebsites.net/api/health?db=1` → checks Neon too.
- Open `/signup`, create an account, sign in, then connect a channel.

If the first request is slow, that is Neon waking from scale-to-zero.

## 7. Free-tier limits to know

- **60 CPU minutes/day** on F1; the app also idles/sleeps after inactivity, so
  the first request after a break is slow.
- **No custom domain with TLS** on F1; use the `*.azurewebsites.net` hostname.
- **1 GB RAM / 1 vCPU** shared: video transcoding is done by Cloudinary, but
  large base64 uploads still pass through the app. Keep test videos small.
- Azure F1 apps can be **stopped by the platform** when the daily quota is
  exhausted. The app resumes the next day.

---

## AWS (EC2 free tier) with Docker

Use this only while the account still has free-tier EC2 hours. After 12 months
(or if the account is credit-based) EC2 is billed.

1. Launch an **Amazon Linux 2023** `t3.micro` (or `t2.micro`) instance.
2. Security group inbound: `22` from your IP, `80` and `443` from anywhere.
3. SSH in and install Docker:

   ```bash
   sudo dnf install -y docker git
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user && newgrp docker
   ```

4. Clone and configure:

   ```bash
   git clone https://github.com/<you>/YT-Layer.git
   cd YT-Layer
   cp .env.example .env
   nano .env   # DATABASE_URL, NEXTAUTH_URL=http://<ec2-public-ip>, secrets, keys
   ```

5. Build, migrate, run:

   ```bash
   docker build -t yt-layer .
   docker run --rm --env-file .env yt-layer npx prisma migrate deploy
   docker run -d --name yt-layer --restart unless-stopped \
     --env-file .env -p 80:3000 yt-layer
   ```

6. For HTTPS without paying for a load balancer, put **Caddy** in front of the
   container (it issues free Let's Encrypt certificates). That needs a domain
   you control; otherwise use `http://<ec2-public-ip>` for the demo.

The `Dockerfile` in the repo root builds a production image and runs
`npm run start` on port 3000.

---

## Migrations and the database

- `npm run db:deploy` = `prisma migrate deploy` (apply migrations, safe in CI).
- `npm run start:migrate` = apply migrations then start the server.
- Never run `prisma migrate dev` or `prisma db push` against production unless
  you intend to change the schema.
- Use the Neon **pooled** connection string for the running app; Prisma will
  reuse a singleton client (see `app/lib/prisma.ts`).

## Secrets

`.env` is git-ignored and no secrets (database password, Google client secret)
are committed anymore. `credentials.json` has been removed; Google OAuth is
configured through `GOOGLE_*` env vars. If this repo was ever public, rotate the
old Neon password and Google client secret — both were previously committed.
