# Support Ticket Dashboard

A full-stack support queue built with React and Express. Create tickets, review status counts, filter the queue, and move tickets from open to in progress to resolved.

## What this demonstrates

- React components and hooks for forms, loading/error states, filters, and ticket updates.
- A layered Express API: controllers → services → repository, with Joi request validation.
- Rule-based priority suggestions from ticket text, shown while composing a ticket.
- OpenAPI documentation, backend unit/API tests, frontend component tests, and Docker packaging.

This is a portfolio/demo application. Storage is **in memory** and resets on backend restart. Priority suggestions use keyword matching, not a trained AI model. Authentication and user roles are not implemented.

## Run locally

Requires Node.js 24 and npm. From the repository root:

~~~sh
npm --prefix backend ci
npm --prefix frontend ci
~~~

Start the backend and frontend in separate terminals:

~~~sh
npm --prefix backend run dev
~~~

~~~sh
npm --prefix frontend run dev
~~~

Open http://localhost:3000. The Vite development server proxies /api to the backend on port 5000. Interactive API documentation is at http://localhost:5000/api-docs; health is at /health. No API keys or database setup are required.

## Run with Docker

~~~sh
docker compose up --build
~~~

Open http://localhost:3000. Nginx serves the frontend and proxies API requests. Published ports bind to localhost for local evaluation. Stop with docker compose down.

## API

- GET /api/tickets — returns tickets and global status counts; optional status=open, in-progress, or resolved.
- POST /api/tickets — create a ticket from title, description, and optional priority.
- PATCH /api/tickets/:id/status — update status with a JSON body such as {"status":"resolved"}.

~~~sh
curl -X POST http://localhost:5000/api/tickets -H 'Content-Type: application/json' -d '{"title":"Checkout error","description":"Payment failed during checkout"}'
~~~

Use Swagger UI for platform-independent request examples and validation schemas.

## Tests and build

~~~sh
npm test
npm --prefix frontend run build
~~~

The root test command runs both suites after their dependencies are installed. Tests use isolated application instances and mocked frontend API responses; they do not establish production reliability.

The frontend includes an .npmrc setting to keep optional peer resolution consistent with its lockfile; use npm ci from the frontend directory or npm --prefix frontend ci as above.

## Structure

- backend/src/domain — ticket entity and priority rules.
- backend/src/repositories — seeded in-memory storage.
- backend/src/services, controllers, validators — application behavior and HTTP boundary.
- backend/tests — unit and HTTP integration tests.
- frontend/src/components, hooks, services — UI, state, and API client.
- frontend/tests — component and hook tests.

## Design boundaries

List metadata is computed across all tickets so filtered views retain accurate overall counts. A repository boundary makes a future persistent database possible without putting storage logic in controllers. Before hosting for real users, add persistence, authentication, authorization, and abuse controls. The repository contains no customer tickets or credentials.

## Review results

See [publication validation](VALIDATION.md) for the checks performed, fixes, and unverified integrations.
