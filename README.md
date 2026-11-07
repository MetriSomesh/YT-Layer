# YT-Layer

A Next.js app that connects YouTubers with video editors: sign up, connect a
YouTube channel, upload videos, and manage editor invitations.

## Tech stack

- Next.js 14 (App Router)
- Prisma + PostgreSQL (Neon)
- NextAuth (credentials) + Google OAuth (YouTube)
- Recoil, Tailwind CSS, shadcn/ui, Framer Motion
- Cloudinary (video/image uploads), imgbb (profile pictures)

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a database

Create a free Postgres project at [console.neon.tech](https://console.neon.tech),
then copy the **pooled** connection string from **Dashboard → Connect**
(host contains `-pooler`).

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon pooled Postgres connection string |
| `NEXTAUTH_URL` | Public origin, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` / `JWT_SECRET` | Random secrets — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `GOOGLE_REDIRECT_URI`, `GOOGLE_UPLOAD_REDIRECT_URI` | `<origin>/api/google/callback`, `<origin>/api/upload/callback` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET` | Cloudinary credentials |
| `API_KEY` | imgbb API key (profile pictures) |

Add both redirect URIs to the OAuth client in Google Cloud Console.

`.env` is git-ignored. Never commit real credentials.

### 4. Set up the schema

For a brand-new database, apply the migration history:

```bash
npm run db:deploy
```

Or, during early development, push the schema directly:

```bash
npx prisma db push
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (free tier)

The app is ready to deploy on **Azure App Service F1 (free)** or an
**AWS EC2 free-tier instance** with the included `Dockerfile`. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full walkthrough, environment
variables, migrations, and a GitHub Actions workflow.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run start:migrate` | Apply migrations, then start the production server |
| `npm run db:deploy` | Apply pending Prisma migrations |
| `npm run lint` | Run ESLint |

## Health check

`GET /api/health` returns `{ "status": "ok" }` without touching the database.
Add `?db=1` to include a database connectivity check.
