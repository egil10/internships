# Internship Tracker

A static Next.js dashboard for 274 internship applications across six years and
eighteen countries — made for my younger brothers, as a reminder that "no" is
mostly the answer until one day it isn't.

## What's inside

- **`excel-data/`** — the raw Excel tracker (gitignored, never published)
- **`scripts/parse.py`** — extracts the Overview sheet, normalizes the messy
  categorical fields, derives countries / years / funnel stages, and writes
  `data/internships.json` + `data/stats.json`
- **`data/positions.json`** — hand-curated list of positions actually held
- **`data/education.json`** — hand-curated schools attended
- **`app/`** + **`components/`** — Next.js 15 app router, Tailwind, Recharts,
  Lucide icons, `next-themes` for light / dark / system

## Run locally

```bash
# parse the spreadsheet once after editing it
python scripts/parse.py

# dev server
npm install
npm run dev   # http://localhost:3000

# production build
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel — it autodetects Next.js
3. No environment variables needed; the data is committed JSON

The Excel file is gitignored — when you update it, re-run the parser locally
and commit the regenerated JSON.
