# Projectfolio

Projectfolio is a project-submission and review platform for students and mentors. Students can submit project details for review, while mentors can review submissions and update their status.

**Live application:** [ph-instructor-job-task-frontend.onrender.com](https://ph-instructor-job-task-frontend.onrender.com)

## Features

- Public landing page with product information and account access
- Email and password registration and login
- Role-based dashboards for students and mentors
- Student project list and project submission form
- Mentor project review with status filters, pagination, and approve or reject actions
- Dashboard profile lookup and role-aware navigation
- Server-side API requests, form validation, and toast notifications

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/register` | Public | Create an account |
| `/login` | Public | Sign in |
| `/student/dashboard` | Student | View and submit projects |
| `/mentor/dashboard` | Mentor | Review submitted projects |
| `/my-profile` | Authenticated | Profile page (currently a placeholder) |

After login, users are redirected to the dashboard associated with their role. The available roles are `STUDENT` and `MENTOR`; role assignment is handled by the backend.

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Base UI primitives and shadcn-style components
- Zod for input validation
- Lucide React icons and Sonner toast notifications

## Getting Started

### Requirements

- Node.js compatible with the installed Next.js version
- pnpm
- A running backend API supported by this frontend

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_URL=https://your-backend-api.example.com
JWT_ACCESS_SECRET=your_backend_jwt_signing_secret
```

`NEXT_PUBLIC_BASE_URL` is the backend API origin and must not end with a slash. `JWT_ACCESS_SECRET` must match the secret used by the backend to sign access tokens. Keep secrets out of source control and use the corresponding environment variable settings in your deployment environment.

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

## Backend API

The frontend expects a separately running backend API. It currently calls these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/users/register` | Register an account |
| `POST` | `/auth/login` | Authenticate and receive an access token |
| `GET` | `/users/profile` | Load the authenticated user's profile |
| `GET` | `/projects/mine` | List the current student's projects |
| `POST` | `/projects` | Submit a project |
| `GET` | `/projects` | List projects for mentor review |
| `GET` | `/projects/statistics` | Load project statistics |
| `PATCH` | `/projects/:id/status` | Approve or reject a project |

Protected requests use the access token stored in an HTTP-only cookie. API responses should follow the success/data response shape expected by the frontend.

## Project Structure

```text
src/
	app/          App Router pages and layouts
	components/   Layout, feature, and UI components
	config/       Runtime configuration
	lib/          Shared helpers and navigation configuration
	services/     Authentication and project API actions
	types/        Shared TypeScript types
	utils/        Authentication and route utilities
	zodSchema/    Form and request validation schemas
```
