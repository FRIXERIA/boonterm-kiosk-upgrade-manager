Run the backend test suite for the Boon Toem Upgrade Manager and report results.

## Steps

1. Run the backend tests:
   - Working directory: `backend/`
   - Command: `npm test`

2. Parse the output and summarize clearly:
   - Total tests: passed / failed / total
   - List every FAILING test with: test name, expected value, received value
   - List test suites that failed
   - If all pass: confirm "✅ All X tests passing"

3. If there are failures, suggest the likely cause based on the test name and error message.

4. Do NOT attempt to fix any failures automatically unless the user explicitly asks.

## Report format

```
Test Results — backend/tests/tasks.test.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Passed : X
❌ Failed : X
Total     : X

[If failures exist]
FAILING TESTS:
• <test name> — expected <X> received <Y>
  └ Likely cause: ...
```
