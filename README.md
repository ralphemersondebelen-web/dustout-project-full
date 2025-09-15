# DustOut Project (Vite React frontend + Express backend)

## What is included
- `frontend/` - Vite + React + Tailwind frontend (landing page, booking form)
- `server/` - Express backend with `/api/book` endpoint (Google Calendar + Nodemailer scaffold)
- `docker-compose.yml` - run both services with Docker
- `.env.example` - example env vars for the backend

## Quick local setup (without Docker)
1. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   - Vite dev server will run on http://localhost:5173

2. Backend:
   ```
   cd server
   npm install
   cp .env.example .env
   # fill .env with credentials
   npm start
   ```
   - Express server will run on http://localhost:5000

## With Docker
- Ensure Docker is installed.
- From project root:
  ```
  docker compose up --build
  ```

## Google & Email setup
See .env.example and the inline comments in server/index.js.
You will need OAuth2 credentials (client id/secret) and a refresh token to allow the server to create calendar events and send emails.

## Notes
- This package is configurable; replace the .env values with your credentials.
- The server will attempt to contact Google APIs; if you don't provide credentials the /api/book endpoint will error (this is expected).
