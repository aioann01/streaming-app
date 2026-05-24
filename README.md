[Swagger Docs]: https://streaming-app-production-7730.up.railway.app/docs#/
# Streaming Platform API

## Overview

A backend system for managing streaming content built with **NestJS, PostgreSQL, TypeORM, JWT authentication, and Jest**.

The system provides secure CRUD operations, authentication, validation, testing, and CI/CD deployment.

---

# Features

- JWT Authentication with role-based access (ADMIN / AGENT)
- Protected streaming routes
- CRUD operations for streaming content
- Pagination, filtering, and sorting support
- DTO validation (class-validator)
- Swagger / OpenAPI documentation
- Unit & integration tests
- CI pipeline using GitHub Actions
- Railway deployment (auto-deploy on `main`)

---

# Tech Stack

- NestJS
- PostgreSQL
- TypeORM
- JWT
- bcrypt
- class-validator
- Swagger
- Jest
- Railway

---

# Local Setup Instructions

## Prerequisites

- Node.js (>= 18)
- npm
- PostgreSQL

---

## 1. Clone repository

```bash
git clone <repo-url>
cd <project>
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Environment variables

Create a `.env` file in the root of your project and configure the following variables:

```
JWT_SECRET=your_secure_random_string
API_URL=http://localhost:<port>
SYNCHRONIZE_DB=true|false
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>
```

### Description

- **JWT_SECRET**  
  Secret key used to sign and verify JWT authentication tokens. Keep it long, random, and private.

- **API_URL**  
  Base URL where your backend API is running. Used by swagger, frontend or external services to connect to the server.

- **SYNCHRONIZE_DB**  
  Enables or disables automatic database schema synchronization.  
  Recommended `true` for development only, `false` for production.

- **DATABASE_URL**  
  Connection string for your PostgreSQL database, including credentials and database location.

---

## 4. Run application

```bash
npm run start:dev
```

Server runs by default at:

http://localhost:3000

Swagger Docs:

http://localhost:3000/docs

---


# Prod Deployment

## 1. Install dependencies

```bash
npm ci
```

## 2. Build application

```bash
npm run build
```

## 3. Setup environment variables

see [Local Setup Instructions](#local-setup-instructions) Environment Variables section

## 4. Run Application

```bash
npm run start:prod
```

# Database Schema

The base entity of the Streaming application is the **Streaming Entity**.

| Field         | Type   |
|---------------|--------|
| id            | number |
| title         | string |
| description   | string |
| genre         | string |
| thumbnail_url | string |
| video_url     | string |
| created_at    | Date   |
| updated_at    | Date   |

---

You can find more details about schema in [Swagger Docs]


---

# Swagger Docs

Swagger UI is available at:

[Swagger Docs]

It provides detailed information about:
- Authentication (JWT)
- API endpoints
- Request / response schemas
- Validation rules
- Interactive API testing (you can execute requests directly)


You can register a new user and then log in using the APIs in the **Auth** section.

After logging in, use the **Authorize** button and provide the generated `jwt_token` from the login API. This is required to successfully access the APIs in the **Streaming** section.

See [Authentication Flow](#authentication-flow) for more details on how login works.

---

# Authentication Flow

All streaming endpoints require a valid JWT token.

## Register User

POST /auth/register

Supports roles:
- ADMIN ( Can `Create`, `Update`, `Delete` and `View` streaming)
- AGENT ( Can only `View` streaming)

---

## Login

POST /auth/login

Response:

```
{
  "access_token": "jwt_token"
}
```

---

## Using JWT

`Authorization header`:
Bearer <jwt_token>

Some endpoints require ADMIN role (see [Swagger Docs]).

---

More details in [Swagger Docs]

---

# Streaming API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/streaming | List content |
| GET | /api/streaming/:id | Get detail |
| POST | /api/streaming | Create |
| PUT | /api/streaming/:id | Update |
| DELETE | /api/streaming | Delete |


For more details on each Api you can refer to [Swagger Docs]

---

# Validation & Error Handling

Uses:
- class-validator
- ValidationPipe
- NestJS exception handling

Common responses:

- 400 → Invalid input
- 401 → Unauthorized
- 403 → Forbidden (role-based access)
- 404 → Not found

---

# Testing

Unit tests:
```bash
npm run test
```

Integration tests (local):
```bash
npm test:it:local
```

Integration tests (prod):
For diferent live URL you can set {APIDomainName} ENV variable in test/integration/StreamingApp_PROD_postman_environment.json .Then run:
```bash
npm run test:it
```

---

# CI/CD

- GitHub Actions runs tests on every push/PR
- Railway auto-deploys on merge to main

---


# Deployment

Live API:
[Swagger Docs]

---

# Summary

Backend system demonstrating:
- secure authentication
- scalable architecture
- production-ready CI/CD
- performance optimizations


# AuthGuard Fixes

# Bug Fixes

Bug 1: Potential crash on missing Authorization header → fixed by adding a safe header check.

Bug 2: Hardcoded JWT secret → critical security vulnerability. Storing secrets and credentials in code or in the repository is unsafe. Moved to environment variables (even better approach: using a secret manager).

Bug 3: Silent authentication failures when the token was not successfully verified → previously only logged and allowed the user to proceed. Now it correctly throws an `UnauthorizedException`.

---

# Performance Fix

## Problem

The application was performing in-memory filtering after fetching all records from the database.

This is inefficient for two main reasons:

1. Fetching all records is expensive, especially with large datasets. It increases memory usage, adds latency, and can negatively impact other requests.
2. Filtering should be done at the database level, where it can leverage indexes and optimized query execution plans, making it significantly faster and more scalable.

---

## Fix

- Moved filtering logic to the database query layer (TypeORM)
- Added an index on the `genre` field to improve query performance

---

## Result

- Improved performance
- Reduced memory usage
- More scalable queries

---

# Key Decisions & Tradeoffs

1. DB-level filtering and sorting → better performance, more correct approach.

2. Projection → Ideally, listing Streaming items should exclude fields at the dto/entity level. This adds a bit more complexity, but requires fewer changes compared to maintaining a list of fields to retrieve and extend later.

3. Security → This is a simple app. Storing credentials in config files is not the best solution. Also, with this design, anyone could potentially create a superuser (without proper authorization) and call the APIs.

   In practice, each database/application should have only one superuser created at initialization. This user should only be able to create new users.

   On top of that, authorization should be based on scope/permission level rather than only roles (this adds more complexity but allows a finer-grained solution).

4. DAO → I considered skipping the DAO interface, which would make the application slightly simpler and less over-engineered. However, I chose to keep it because it feels like a cleaner and more scalable approach for the future.

   If a new database type is introduced (which is rare, but I have experienced it once), the switch can be done by implementing the interface instead of redesigning and changing service logic.

   The service layer should contain only business logic.
---