# TravelGenie Payload backend

This is a separate Payload + SQLite backend for the Vite frontend in the repository root.

## Local setup

1. Copy `.env.example` to `.env` and replace `PAYLOAD_SECRET`.
2. Run `npm install` in this folder.
3. Run `npm run dev` to start the API at `http://localhost:3001`.
4. Visit `http://localhost:3001/api/health` to verify the server.

The first development start creates `data/travelgenie.db`. Payload's development schema push is enabled; use migrations before deploying production data.

The Vite frontend proxies `/api/*` to this service in development.
