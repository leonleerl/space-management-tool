# Introduction

This project is a space management tool designed for the Business School to consolidate accommodation/office spreadsheets and contact lists. The system aims to significantly reduce administration time and minimize errors from manual data entry by providing an intuitive web-based interface for managing staff and student information, room assignments, and generating comprehensive accommodation reports.

# Tech Stack

Frontend & Backend: Next.js (React framework)

Database: Prisma ORM

Table Management: Handsontable (Interactive spreadsheet component)

Authentication: NextAuth.js

Deployment: Vercel

# Environment Variables

Before running the app, ensure the following environment variables are set in a `.env` file at the project root:

```
NEXTAUTH_SECRET=your-strong-random-secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

- `NEXTAUTH_SECRET`: Used to sign and verify authentication tokens. Generate a strong secret, for example:
  - macOS/Linux: `openssl rand -base64 32`
  - Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `NEXTAUTH_URL`: The base URL of your app.
  - Local development: `http://localhost:3000`
  - Production: Set this to your deployed URL (e.g., `https://your-domain.com`).
- `DATABASE_URL`: Connection string for Prisma (PostgreSQL). Example:
  - Local: `postgresql://postgres:postgres@localhost:5432/space_management?schema=public`
  - Cloud (render.com, supabase, neon, etc.): use the URL provided by your provider.

# Quickstart

After cloning the git repository, remember to use the command to install the dependencies:

```
npm install
```

Run the project:

```
npm run dev
```

If you don't have `npm` environment on your PC, Please check https://nodejs.org/en/download

Next.js learning: https://nextjs.org/docs

