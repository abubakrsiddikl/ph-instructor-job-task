# PH Instructor

PH Instructor is a project submission and review platform connecting students with mentors. Students can submit projects and track their review status; mentors can browse submissions, view project statistics, and approve or reject pending work.

## Live Application

- **Frontend:** [ph-instructor-job-task-frontend.onrender.com](https://ph-instructor-job-task-frontend.onrender.com)
- **Backend API:** [ph-instructor-job-task.onrender.com](https://ph-instructor-job-task.onrender.com)
- **API health check:** [ph-instructor-job-task.onrender.com/](https://ph-instructor-job-task.onrender.com/)
- **API base path:** `https://ph-instructor-job-task.onrender.com/api/v1`

## Features

- Student and mentor accounts with role-based dashboards
- Student project submission and personal submission list
- Mentor project review with status filters, pagination, and statistics
- Approve or reject pending submissions
- Validated API requests and centralized error handling
- JWT authentication using an HTTP-only cookie or bearer token

## Technology

| Application | Stack |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zod |
| Backend | Node.js, TypeScript, Express 5, Prisma ORM, PostgreSQL, Zod |
| Authentication | JWT and bcrypt |

## Repository Structure

```text
backend/    Express API, authentication, project workflows, and database integration
frontend/   Next.js web application and role-based user interfaces
Readme.md   Project overview and local setup
```

The frontend and backend are separate applications with independent dependencies and deployment configuration. Install and run each from its own directory.

## Requirements

- Node.js `^22.18.0`, `^24.11.0`, or `>=26.0.0` for the backend
- pnpm `11.28.5` for the backend
- A PostgreSQL database for the backend
- A Node.js version supported by the installed Next.js version for the frontend

## Local Development

### 1. Configure and start the backend

```bash
cd backend
pnpm install
```

Create `backend/.env` and provide the backend configuration:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

Initialize or update the database using the Prisma workflow for your environment. The backend provides commands including `pnpm db:init`, `pnpm db:update`, `pnpm db:verify`, and `pnpm migrate`; see [backend/README.md](backend/README.md) for details.

Start the API:

```bash
pnpm dev
```

By default, the API is available at `http://localhost:5000/api/v1`.

### 2. Configure and start the frontend

In a second terminal:

```bash
cd frontend
pnpm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
JWT_ACCESS_SECRET=your_backend_jwt_signing_secret
```

`NEXT_PUBLIC_BASE_URL` is the backend origin and should not end with a slash. `JWT_ACCESS_SECRET` must match the backend's `JWT_SECRET`. Keep secrets out of source control.

Start the web application:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page |
| `/register` | Public | Create a student account |
| `/login` | Public | Sign in |
| `/student/dashboard` | Student | View and submit projects |
| `/mentor/dashboard` | Mentor | Review project submissions |
| `/my-profile` | Authenticated | Profile page |

New registrations receive the `STUDENT` role. Mentor accounts must be provisioned with the `MENTOR` role through a trusted administrative or database workflow.

## Useful Commands

Run these commands from the relevant application directory.

| Directory | Command | Description |
| --- | --- | --- |
| `backend/` | `pnpm dev` | Run the API in watch mode |
| `backend/` | `pnpm build` | Build the API |
| `backend/` | `pnpm start` | Run the API with `tsx` |
| `frontend/` | `pnpm dev` | Start the Next.js development server |
| `frontend/` | `pnpm build` | Create a production build |
| `frontend/` | `pnpm start` | Start the production server |
| `frontend/` | `pnpm lint` | Run ESLint |

## API Overview

All application endpoints use the `/api/v1` prefix. Protected requests accept the HTTP-only `accessToken` cookie or an `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/users/register` | Public | Register a student |
| `GET` | `/users/profile` | Authenticated | Get the current user's profile |
| `POST` | `/auth/login` | Public | Sign in |
| `POST` | `/projects` | Student | Submit a project |
| `GET` | `/projects/mine` | Student | List the student's projects |
| `GET` | `/projects` | Mentor | List and filter submissions |
| `GET` | `/projects/statistics` | Mentor | Get project counts by status |
| `PATCH` | `/projects/:id/status` | Mentor | Approve or reject a pending project |

Project statuses are `PENDING`, `APPROVED`, and `REJECTED`. Repository URLs must be unique, and project submissions are rate-limited. For request examples, pagination options, database details, and deployment instructions, see [backend/README.md](backend/README.md). Frontend-specific details are in [frontend/README.md](frontend/README.md).
