# Test Factory — Product Test Maturity & Dashboard

## Architecture

```
┌─────────────────────────────┐     ┌──────────────────────────────┐
│   Angular Frontend (:4200)  │────▶│  Express Backend (:3000)     │
│                             │     │                              │
│  Dashboard Component        │     │  /api/qtest/executions/:id   │──▶ qTest API
│  Assessment Component       │     │  /api/servicenow/changes/:ci │──▶ ServiceNow API
│  History Component          │     │  /api/sonar/metrics/:key     │──▶ SonarQube API
│                             │     │  /api/ado/pipelines/:proj    │──▶ Azure DevOps API
└─────────────────────────────┘     └──────────────────────────────┘
```

**Frontend** (Angular): Responsible for rendering the UI — dashboard, maturity assessment, history.
Calls the backend for all external data. No API keys or tokens in the browser.

**Backend** (Express/Node.js): Proxies API calls to qTest, ServiceNow, SonarQube, Azure DevOps.
Holds credentials in server-side config (env vars or config.js). Handles data filtering and aggregation.

## Quick Start

### Backend

```bash
cd project-root
npm install
# Configure (option A: env vars)
export QTEST_BASE_URL=https://your-instance.qtestnet.com
export QTEST_BEARER_TOKEN=your-token-here
# Configure (option B: edit server/config.js directly)
npm start
# Server runs at http://localhost:3000
```

### Frontend (Angular)

```bash
cd project-root
ng serve
# App runs at http://localhost:4200, calls backend at http://localhost:3000
```

### Standalone HTML (no build required)

Open `test-factory-webapp.html` in a browser. Edit `QTEST_CONFIG` at the top of the file.
Note: The standalone HTML calls qTest directly from the browser (CORS must be allowed).

## Project Structure

```
├── server/                          ← Express.js backend
│   ├── config.js                    ← All credentials and URLs (env vars override)
│   ├── server.js                    ← Express app with route definitions
│   └── qtest.service.js             ← qTest API client: fetch, filter, group
│
├── src/app/                         ← Angular frontend
│   └── shared/
│       ├── config/
│       │   ├── maturity.config.ts    ← 9 dimensions, 22 questions, weights
│       │   ├── teams.config.ts       ← Product teams + mock data + qTestProjectId
│       │   └── roadmap.config.ts     ← Improvement actions per dimension
│       ├── models/
│       │   ├── dashboard.model.ts    ← Team, Sonar, CI, Delivery, Coverage interfaces
│       │   ├── maturity.model.ts     ← Assessment, Dimension, Level interfaces
│       │   ├── servicenow.model.ts   ← ServiceNow Change Request interface
│       │   └── qtest.model.ts        ← QTestReleaseExecution, status colours
│       └── services/
│           ├── dashboard.service.ts  ← Dashboard data + qTest integration
│           ├── maturity.service.ts   ← Scoring logic and in-memory storage
│           └── qtest.service.ts      ← Angular HTTP service → backend
│
├── src/environments/
│   ├── environment.ts               ← Dev: apiBaseUrl = http://localhost:3000
│   └── environment.prod.ts          ← Prod: apiBaseUrl = /api (same origin)
│
├── package.json                     ← Backend dependencies (express, cors)
├── test-factory-webapp.html         ← Standalone HTML version (no build needed)
└── README.md
```

## qTest Integration

### How It Works

1. Angular calls `GET http://localhost:3000/api/qtest/executions/{projectId}`
2. Backend calls qTest: `GET {baseUrl}/api/v3/projects/{projectId}/test-runs?parentId=0&parentType=root&expand=descendants`
3. Backend filters test runs to last 31 days via `last_modified_date`
4. Backend parses `properties[]` array on each test run:
   - Finds `field_name === "Target Release/Build"` → gets `field_value_name` (release name)
   - Finds `field_name === "Status"` → gets `field_value_name` (Passed/Failed/Blocked/Incomplete/Unexecuted)
5. Backend groups by release name, tallies statuses, returns aggregated JSON
6. Angular renders execution bars in the "Test Executions in the Last Month" widget

### Response Format

```json
{
  "portalUrl": "https://abc.qtestnet.com/p/101/portal/project#tab=testexecution",
  "releases": [
    {
      "releaseName": "Release 3.2",
      "passed": 198,
      "failed": 12,
      "blocked": 5,
      "incomplete": 3,
      "unexecuted": 30,
      "total": 248
    }
  ]
}
```

### Status Colours

| Status      | Colour       | Hex       |
|-------------|-------------|-----------|
| Passed      | Green       | `#10B981` |
| Failed      | Red         | `#EF4444` |
| Blocked     | Dark Orange | `#D4890B` |
| Incomplete  | Yellow      | `#F59E0B` |
| Unexecuted  | Silver      | `#D9D9D9` |

## Configuration Reference

All config lives in `server/config.js` and can be overridden with environment variables:

| Config Key          | Env Variable          | Default                          |
|---------------------|-----------------------|----------------------------------|
| `qtest.baseUrl`     | `QTEST_BASE_URL`      | `https://abc.qtestnet.com`       |
| `qtest.bearerToken` | `QTEST_BEARER_TOKEN`  | `REPLACE_WITH_YOUR_BEARER_TOKEN` |
| `port`              | `PORT`                | `3000`                           |
| `cors.origin`       | `CORS_ORIGIN`         | `http://localhost:4200`          |
