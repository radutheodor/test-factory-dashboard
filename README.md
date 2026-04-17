# Test Factory — Product Test Maturity & Dashboard

## Quick Start

```bash
tar xzf test-factory-app.tar.gz
npm install
# Edit server/config.js — set qtest.baseUrl and qtest.bearerToken
npm start
# Open http://localhost:3000
```

## Architecture

```
Browser (http://localhost:3000)
   │
   ├── GET /                                    → Express serves public/index.html
   ├── GET /api/teams                           → Product teams from server/config/teams.config.js
   ├── GET /api/qtest/executions/:projectId     → Paginated test runs, grouped by release
   └── GET /api/qtest/requirements-coverage/:id → Traceability Matrix coverage stats
                                                       │
                                                       └─→ qTest API (bearer token server-side)
```

**Frontend** (`public/index.html`) is a pure rendering layer. It holds no configuration.
On load it fetches teams from `/api/teams`; on team selection it fetches qTest data.

**Backend** (`server/`) holds all configuration and credentials, proxies API calls to qTest.

## Project Structure

```
├── public/
│   └── index.html                    ← Dashboard (served by Express at /)
├── server/
│   ├── config.js                     ← Backend credentials (env vars override)
│   ├── config/
│   │   └── teams.config.js           ← SINGLE SOURCE OF TRUTH for product teams
│   ├── qtest.service.js              ← qTest API: pagination, trace matrix parser
│   └── server.js                     ← Express: serves frontend + API proxy routes
├── package.json                      ← npm install / npm start
├── README.md
└── test-factory-webapp.html          ← Standalone copy of public/index.html
```

## Teams Configuration

All product team metadata lives in **`server/config/teams.config.js`** — the single source of
truth. The frontend fetches it via `GET /api/teams` on startup. To add/remove/edit a team,
edit only this file.

```javascript
const PRODUCT_TEAMS = [
  {
    id: 'order-mgmt',
    name: 'Order Management',
    description: 'Core order processing & fulfilment',
    techLead: 'Alice Chen',
    sonarUrl: '...',
    adoUrl: '...',
    snowUrl: '...',
    qTestProjectId: 101,
  },
  // ...
];
```

Going forward, any new fields (SLOs, on-call rotation, Confluence space, etc.) are added only here.

## qTest Integration

### Test Executions Widget

**Endpoint**: `GET /api/qtest/executions/:projectId`

**What it does**:
1. Calls qTest's `test-runs` endpoint with pagination (`page=N&pageSize=999`), looping until a page returns fewer than 999 items (generic pagination — doesn't rely on `total` field)
2. Filters test runs to the last 31 days via `last_modified_date`
3. For each run, parses the `properties[]` array to find `field_name === "Target Release/Build"` (release name) and `field_name === "Status"` (Passed/Failed/Blocked/Incomplete/Unexecuted)
4. Groups by release name and tallies statuses

**Response**:
```json
{
  "portalUrl": "https://your.qtestnet.com/p/101/portal/project#tab=testexecution",
  "releases": [
    { "releaseName": "Release 3.2", "passed": 198, "failed": 12,
      "blocked": 5, "incomplete": 3, "unexecuted": 30, "total": 248 }
  ]
}
```

### Requirements Coverage Widget

**Endpoint**: `GET /api/qtest/requirements-coverage/:projectId`

**What it does**:
1. Calls qTest's `requirements/trace-matrix-report` endpoint with pagination (`page=N&size=999`)
2. At the root level, finds the entry whose `name` contains **"Traceability Matrix"**
3. If no such entry exists → returns `{ found: false }` (frontend shows "Found no Traceability Matrix Folder at the root of Requirements")
4. Recursively walks `requirements[]` and `children[]` — each requirement with `linked-testcases > 0` counts as covered, otherwise uncovered
5. Sums totals and computes coverage percentage

**Response**:
```json
{
  "found": true,
  "totalRequirements": 62,
  "coveredRequirements": 48,
  "uncoveredRequirements": 14,
  "totalTestsCovering": 312,
  "coveragePercentage": 77.4
}
```

### Generic Pagination Helper

The `fetchAllPages()` helper in `server/qtest.service.js` is endpoint-agnostic:
it loops calling pages until one returns fewer items than `pageSize`, then stops.
This works for any paginated qTest endpoint regardless of whether the response
includes a `total` field. Reuse this helper for future endpoints.

## Configuration Reference

Edit `server/config.js` or use environment variables:

| Config              | Env Variable         | Default                          |
|---------------------|----------------------|----------------------------------|
| `qtest.baseUrl`     | `QTEST_BASE_URL`     | `https://abc.qtestnet.com`       |
| `qtest.bearerToken` | `QTEST_BEARER_TOKEN` | `REPLACE_WITH_YOUR_BEARER_TOKEN` |
| `port`              | `PORT`               | `3000`                           |
| `cors.origin`       | `CORS_ORIGIN`        | `http://localhost:4200`          |

## Status Colours

| Status      | Colour      | Hex       |
|-------------|-------------|-----------|
| Passed      | Green       | `#10B981` |
| Failed      | Red         | `#EF4444` |
| Blocked     | Dark Orange | `#D4890B` |
| Incomplete  | Yellow      | `#F59E0B` |
| Unexecuted  | Silver      | `#D9D9D9` |
