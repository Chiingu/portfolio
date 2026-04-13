# Mourtada Portfolio

Immersive portfolio website built with React, Tailwind v4, motion animations, and an Express endpoint for terminal-style contact messages.

## Stack

- Frontend: React 19 + Vite + Tailwind CSS v4 + motion
- Backend: Express + Nodemailer (optional SMTP)
- Language: TypeScript

## Development

1. Install dependencies:

```bash
npm install
```

2. Create an environment file from [.env.example](.env.example) and configure SMTP values if you want real email delivery.

3. Start the app (frontend + API via Express/Vite middleware):

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Type Check

```bash
npm run lint
```

## Email API

The terminal contact modal posts to `/api/send-email`.

- If `SMTP_USER` and `SMTP_PASS` are configured, emails are sent via Nodemailer.
- If SMTP credentials are missing, the API simulates success for local development.

Recommended environment variables:

- `PORT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (optional sender override)
