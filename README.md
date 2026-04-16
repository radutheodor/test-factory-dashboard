# Test Factory — Product Test Maturity & Dashboard

## Quick Start

```bash
# 1. Extract and install
tar xzf test-factory-app.tar.gz
npm install

# 2. Configure qTest credentials — edit server/config.js:
#    qtest.baseUrl     → your qTest instance URL
#    qtest.bearerToken → your qTest API bearer token

# 3. Start
npm start

# 4. Open http://localhost:3000
```

That's it. The dashboard is served at `http://localhost:3000`.

## Architecture

```
Browser (http://localhost:3000)
  │
  ├── GET /                         → Express serves public/index.html (the dashboard)
  │
  └── GET /api/qtest/executions/101 → Express backend calls qTest API
                                       with bearer token (server-side only)
                                       → filters last 31 days
                                       → groups by release
                                       → returns JSON to browser
```

**Frontend**: `public/index.html` — a single-page HTML/JS app. No build step required.
Calls `/api/qtest/executions/:projectId` on the same server.

**Backend**: `server/server.js` — Express.js. Serves the frontend and proxies API calls
to qTest (and in future: ServiceNow, SonarQube, Azure DevOps). Credentials stay server-side.

## Configuration

Edit `server/config.js` or use environment variables:

```bash
# Option A: Environment variables
export QTEST_BASE_URL=https://your-instance.qtestnet.com
export QTEST_BEARER_TOKEN=your-token-here
npm start

# Option B: Edit server/config.js directly
```

| Config              | Env Variable         | Default                          |
|---------------------|----------------------|----------------------------------|
| `qtest.baseUrl`     | `QTEST_BASE_URL`     | `https://abc.qtestnet.com`       |
| `qtest.bearerToken` | `QTEST_BEARER_TOKEN` | `REPLACE_WITH_YOUR_BEARER_TOKEN` |
| `port`              | `PORT`               | `3000`                           |

When credentials are not configured, the widget shows a helpful message:
"qTest not configured — Set QTEST_BEARER_TOKEN environment variable or edit server/config.js"

## Project Structure

```
├── public/
│   └── index.html                  ← Dashboard app (served by Express at /)
├── server/
│   ├── config.js                   ← Credentials + URLs (edit this)
│   ├── qtest.service.js            ← qTest API: fetch → filter 31 days → group by release
│   └── server.js                   ← Express: serves frontend + API proxy routes
├── src/app/shared/                 ← Angular source files (for future Angular build)
│   ├── config/                     ← Maturity dimensions, teams, roadmap
│   ├── models/                     ← TypeScript interfaces
│   └── services/                   ← Angular services (call backend, not qTest)
├── package.json                    ← npm install / npm start
└── test-factory-webapp.html        ← Standalone copy of public/index.html
```

## qTest Integration Details

**API endpoint called by backend:**
```
GET {baseUrl}/api/v3/projects/{projectId}/test-runs?parentId=0&parentType=root&expand=descendants
```

**Processing:**
1. Filter items where `last_modified_date` is within last 31 days
2. For each test run, parse `properties[]` array:
   - Find `field_name === "Target Release/Build"` → `field_value_name` = release name
   - Find `field_name === "Status"` → `field_value_name` = Passed/Failed/Blocked/Incomplete/Unexecuted
3. Group by release name, tally statuses
4. Return to frontend as `{ portalUrl, releases: [...] }`

**Portal link:** `{baseUrl}/p/{projectId}/portal/project#tab=testexecution`

## Angular Source Files

The `src/app/shared/` directory contains TypeScript source files structured for Angular:

- `services/qtest.service.ts` — calls `GET {apiBaseUrl}/api/qtest/executions/{projectId}` (the backend, not qTest directly)
- `services/dashboard.service.ts` — aggregates data from all sources
- `models/qtest.model.ts` — `QTestReleaseExecution` interface + status colours
- `environments/environment.ts` — `apiBaseUrl: 'http://localhost:3000'`

To use with Angular: scaffold a workspace (`ng new test-factory`), copy `src/` into it, and the services will call the same Express backend.
