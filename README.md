# OmniRev

A [Next.js](https://nextjs.org) application with internationalization, authentication (NextAuth + Azure AD B2C), dashboard, and API proxy.

## Getting Started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/) (package manager)

### Install & Run

```bash
# Install dependencies
pnpm install

# Run development server (http://127.0.0.1:3000)
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

### Environment

Copy or create a `.env` file with the required variables. See [src/docs/env.md](src/docs/env.md) for the full list (Auth, API, and app URL settings).

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `pnpm dev`       | Start dev server (127.0.0.1)   |
| `pnpm build`     | Production build               |
| `pnpm start`     | Start production server        |
| `pnpm lint`      | Run ESLint                     |
| `pnpm format`    | Format with Prettier           |
| `pnpm format:check` | Check formatting            |
| `pnpm test`      | Run Vitest (watch)             |
| `pnpm test:run`  | Run Vitest once                |

## Project Structure

- **`src/app/`** – Next.js App Router: `[locale]` (auth, dashboard), `api/proxy`
- **`src/Components/`** – Shared UI: Entity (pagination, table, search, theme, locale), Layout, Shadcn, Error
- **`src/Main/`** – Feature modules: Auth (Login, SignUp), Dashboard (Contacts, Home)
- **`src/lib/`** – API client, auth, config, hooks, query, routes
- **`src/docs/`** – Docs and guidelines (env, i18n, testing, etc.)

## Tech Stack

- **Framework:** Next.js 16, React 19
- **Auth:** NextAuth, Azure AD B2C
- **Data:** TanStack Query (React Query)
- **UI:** Radix UI, Tailwind CSS, Shadcn-style components, Recharts, Sonner
- **State:** Zustand
- **Testing:** Vitest

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
