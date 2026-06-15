Show a full health status of the Boon Toem Upgrade Manager project.

## Steps

Run ALL of the following checks in parallel, then present a unified report.

### 1. Backend server health
Call GET http://localhost:3001/api/health
- If 200: backend is UP
- If connection refused: backend is DOWN (not running)

### 2. Task count
If backend is UP, call GET http://localhost:3001/api/tasks
Count tasks grouped by status (pending, in_progress, completed, cancelled) and by kioskType (BT7, BT10, เต่าบิน).

### 3. Test suite
Run `npm test` in the `backend/` directory.
Report: passed / failed / total.

### 4. File check
Check that these key files exist (use Read or Glob):
- backend/app.js
- backend/validators/taskValidator.js
- backend/tests/tasks.test.js
- frontend/src/App.jsx
- frontend/src/pages/CalendarPage.jsx
- frontend/src/pages/TasksPage.jsx
- frontend/src/pages/FileSummaryPage.jsx

### 5. Dependencies
Check backend/package.json and frontend/package.json exist and have the expected keys.

## Report format

```
╔══════════════════════════════════════════╗
║   Boon Toem Upgrade Manager — Status    ║
╚══════════════════════════════════════════╝

🖥  Backend      : ✅ UP  (http://localhost:3001)
                   — or —
                 : ❌ DOWN (run /dev to start)

🌐  Frontend     : [not checked — browser only]

🧪  Tests        : ✅ 23/23 passing
                   — or —
                 : ❌ X/23 failing

📋  Tasks in DB  : X total
   • pending     : X
   • in_progress : X
   • completed   : X
   • cancelled   : X

   By kiosk type:
   • BT7         : X
   • BT10        : X
   • เต่าบิน      : X

📁  Key files    : ✅ All present
                   — or list missing files —
```

Keep the report concise. Do not print raw JSON.
