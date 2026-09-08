# BKT Advisory — Project Estimator

Standalone quoting tool served at https://estimator.bktadvisory.com.
It was prototyped in Figma Make and lived in the separate
`jburkhardt4/BKT-ProjectEstimator` repo; this folder is now the source of
truth and deploys from the `Bktadvisory` repo (Vercel project
`bkt-estimator`, root directory `estimator/`).

## Run locally

```bash
cd estimator
npm ci
npm run dev   # http://localhost:5000
```

## Build and deploy

```bash
npm run build # outputs to build/
```

Vercel builds this directory on every push to `main` (see `vercel.json`).
Pushes that do not touch `estimator/` are skipped automatically.

## Backend

The estimator calls the `make-server-07a007e1` Supabase edge function on the
BKT project `hjrvtzkktodoxigezxqy` (source in `src/supabase/functions/server`).
Client configuration lives in `src/utils/supabase/info.tsx`.
