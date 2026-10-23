# PH Instructor API

Backend API for the PH Instructor project submission and review platform. Students can submit and track projects, while mentors can review submissions and view project statistics.

## Live API

- **Production URL:** https://ph-instructor-job-task.onrender.com
- **Health check:** https://ph-instructor-job-task.onrender.com/
- **API base path:** `https://ph-instructor-job-task.onrender.com/api/v1`

The root health-check route returns a short message confirming that the API is running.

## Tech Stack

- Node.js and TypeScript
- Express 5
- Prisma ORM with PostgreSQL
- Zod request validation
- JWT authentication and bcrypt password hashing

## Features

- Student and mentor roles
- User registration and authenticated profile retrieval
- JWT login with an HTTP-only cookie; bearer tokens are also accepted
- Student project submission and personal project listing
- Mentor project listing, status review, and statistics
- Request validation and centralized error handling
- Duplicate repository URL protection and project submission rate limiting

## Requirements

- Node.js `^22.18.0`, `^24.11.0`, or `>=26.0.0`
- pnpm `11.28.5` (the version declared by the package)
- A PostgreSQL database compatible with the project's Prisma ORM configuration

## Getting Started

1. Install dependencies:

	 ```bash
	 pnpm install
	 ```

2. Create a `.env` file in the project root:

	 ```env
	 NODE_ENV=development
	 PORT=5000
	 DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
	 JWT_SECRET="replace-with-a-long-random-secret"
	 EXPIRES_IN="7d"
	 FRONTEND_URL="http://localhost:3000"
	 ```

	 Use the connection string and credentials for your own PostgreSQL database. `FRONTEND_URL` is the single allowed CORS origin, and credentialed requests are enabled.

3. Initialize or update the database using the Prisma workflow configured for your environment. The project includes Prisma Composer and database scripts; see the commands below.

4. Start the development server:

	 ```bash
	 pnpm dev
	 ```

The server connects to the database before listening on `PORT`.

## Available Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the API in watch mode with `tsx` |
| `pnpm start` | Run the TypeScript server with `tsx` |
| `pnpm build` | Build `src/server.ts` with `tsdown` into `dist/` |
| `pnpm start1` | Run the built `dist/server.mjs` entry point |
| `pnpm db:init` | Initialize Prisma database configuration |
| `pnpm db:update` | Update the database from the Prisma contract |
| `pnpm db:verify` | Verify the database state |
| `pnpm migrate` | Apply Prisma database migrations |
| `pnpm migration:status` | Show migration status |
| `pnpm composer:dev` | Build and start the Prisma Composer development workflow |
| `pnpm composer:deploy` | Deploy the Prisma Composer module |
| `pnpm deploy` | Build the API and deploy the Composer module |

## API Overview

All application routes are prefixed with `/api/v1`. Protected endpoints accept the `accessToken` cookie set at login or an `Authorization: Bearer <token>` header. Role restrictions are enforced for student and mentor routes.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/users/register` | Public | Register a student account |
| `GET` | `/users/profile` | Student or mentor | Get the authenticated user's profile |
| `POST` | `/auth/login` | Public | Log in and receive an access token |
| `POST` | `/auth/logout` | Public | Not implemented yet; currently returns `501` |
| `POST` | `/projects` | Student | Submit a project |
| `GET` | `/projects/mine` | Student | List the authenticated student's projects |
| `GET` | `/projects` | Mentor | List projects with pagination and optional status filtering |
| `GET` | `/projects/statistics` | Mentor | Get project counts by status |
| `PATCH` | `/projects/:id/status` | Mentor | Approve or reject a pending project |

New registrations are assigned the `STUDENT` role. Mentor access requires an account with the `MENTOR` role provisioned through your trusted database or administrative workflow.

### Example Requests

Register a student:

```http
POST /api/v1/users/register
Content-Type: application/json

{
	"name": "Alex Morgan",
	"email": "alex@example.com",
	"passwordHash": "your-plaintext-password"
}
```

Despite the field name, submit the plaintext password in `passwordHash`; the server hashes it with bcrypt before storing it. Never send a previously hashed database value.

Log in:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
	"email": "alex@example.com",
	"passwordHash": "your-plaintext-password"
}
```

On success, the API returns an access token and sets it in an HTTP-only, secure cookie. The token can also be sent in the `Authorization` header as a bearer token.

Submit a project as a student:

```http
POST /api/v1/projects
Content-Type: application/json
Authorization: Bearer <access-token>

{
	"name": "Portfolio Website",
	"repositoryUrl": "https://github.com/alex/portfolio",
	"liveUrl": "https://portfolio.example.com",
	"description": "A responsive portfolio website built to showcase my projects and experience."
}
```

Review a project as a mentor:

```http
PATCH /api/v1/projects/PROJECT_ID/status
Content-Type: application/json
Authorization: Bearer <access-token>

{
	"status": "APPROVED"
}
```

Supported review statuses are `APPROVED` and `REJECTED`. Only projects in `PENDING` status can be reviewed.

### Project Listing

Mentors can pass these optional query parameters to `GET /api/v1/projects`:

| Parameter | Values | Default |
| --- | --- | --- |
| `page` | Positive integer | `1` |
| `limit` | Positive integer, maximum `100` | `10` |
| `sortBy` | `name`, `createdAt`, `updatedAt`, `status` | `createdAt` |
| `sortOrder` | `asc`, `desc` | `desc` |
| `status` | `PENDING`, `APPROVED`, `REJECTED` | All statuses |

Example: `/api/v1/projects?page=1&limit=10&status=PENDING&sortBy=createdAt&sortOrder=desc`

## Data Model

- **User:** name, unique email, bcrypt password hash, role (`STUDENT` or `MENTOR`), and timestamps.
- **Project:** name, unique repository URL, optional live URL, description, status (`PENDING`, `APPROVED`, or `REJECTED`), student owner, and timestamps.
- Deleting a student cascades to their projects.

Project submissions are limited to five attempts per student per minute. Repository URLs must be unique.

## Error Responses

Successful API responses use a consistent JSON structure with `success`, `message`, and `data` fields. Paginated project results also include `meta`. Errors are passed through the global error handler; unknown routes return `404`.

## Deployment

The live service is hosted at [https://ph-instructor-job-task.onrender.com](https://ph-instructor-job-task.onrender.com). For a separate deployment, configure the environment variables above, provide a reachable PostgreSQL database, and use the repository's Render build script (`render-build.sh`) or the appropriate build and database commands for your host.
