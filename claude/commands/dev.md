Start the Boon Toem Upgrade Manager development environment (backend + frontend).

## Steps

1. Check if backend dependencies are installed by looking for `backend/node_modules`. If missing, run `npm install` inside `backend/`.

2. Check if frontend dependencies are installed by looking for `frontend/node_modules`. If missing, run `npm install` inside `frontend/`.

3. Start the backend server in the background:
   - Working directory: `backend/`
   - Command: `npm run dev`
   - Runs on port 3001

4. Wait 2 seconds, then verify backend is up by calling `GET http://localhost:3001/api/health`. If it fails, report the error.

5. Start the frontend dev server in the background:
   - Working directory: `frontend/`
   - Command: `npm run dev`
   - Runs on port 5173

6. Report back with:
   - Backend URL: http://localhost:3001
   - Frontend URL: http://localhost:5173
   - Any errors encountered

Do NOT open a browser automatically. Just report the URLs.
