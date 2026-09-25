# Login Ready Backend

Backend for the Login Ready student project.

## Technologies

- Node.js
- Express.js
- MySQL
- mysql2
- cors
- dotenv

## Installation

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` and configure the MySQL connection and frontend origin. Run `schema.sql` in MySQL Workbench or with the MySQL command line to create the database tables.

## Run

```bash
npm start
```

For development, the existing command is:

```bash
npm run dev
```

The API listens on port `5000` by default. Set `CORS_ORIGIN` to the origin serving the frontend. When the frontend runs on a separate origin, configure its API URL or a development proxy to point to this backend.

## API

Project endpoints require a valid-looking email in the `X-Student-Email` request header. The email is used to group project records; it is not an authentication check.

- `POST /api/projects` — create a project and its modules
- `GET /api/projects` — list projects for the email in the header
- `GET /api/projects/:id` — get one project
- `PUT /api/projects/:id` — update a project and its modules
- `DELETE /api/projects/:id` — delete a project and its modules

Login is intentionally demo-only in the frontend: any valid-looking email and non-empty password is accepted. This backend has no account registration, login, or password verification endpoints.

## Frontend

The frontend is maintained separately at [login-ready-project](https://github.com/thiruvishal2006/login-ready-project.git).
