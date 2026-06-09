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
  ├── GET /                                    → public/index.html
  ├── GET /api/teams                           → Product teams config (numeric IDs)
  ├── GET /api/maturity-config                 → Dimensions, levels, questions
  ├── GET /api/roadmap-config                  → Improvement actions per dimension
  │
  ├── GET  /api/assessments                    → List all stored assessments
  ├── GET  /api/assessments/:id                → Single assessment
  ├── GET  /api/assessments/latest/:teamId     → Latest for a team (used for retake pre-fill)
  ├── POST /api/assessments                    → Save a new assessment
  │
  ├── GET /api/qtest/executions/:projectId     → Paginated test runs, grouped by release
  └── GET /api/qtest/requirements-coverage/:id → Traceability Matrix coverage
                                                       │
                                                       └─→ qTest API (token server-side)
```

## Project Structure

```
├── public/
│   ├── index.html                ← Dashboard markup + JS (no inline config)
│   └── css/styles.css            ← Extracted CSS (no framework, just CSS variables)
├── server/
│   ├── config.js                 ← Backend credentials (env vars override)
│   ├── config/
│   │   ├── teams.config.js       ← Product teams (numeric IDs: 1, 2, 3, 4)
│   │   ├── maturity.config.js    ← Dimensions, maturity levels, questions
│   │   └── roadmap.config.js     ← Improvement actions per dimension
│   ├── data/
│   │   └── assessments.db        ← SQLite database (auto-created on first run)
│   ├── server.js                 ← Express: serves frontend + API routes
│   ├── qtest.service.js          ← qTest API: axios + parallel pagination
│   └── assessments.service.js    ← SQLite-backed assessment storage
└── package.json
```

## Assessment Storage: SQLite

Why SQLite (`better-sqlite3`):

- **Persistence**: Data survives server restarts (previously in-memory only).
- **Concurrent-safe**: Multiple users completing assessments at the same time work correctly.
- **Synchronous + fast**: Microsecond queries, no async callbacks.
- **Queryable**: SQL for "latest per team", "by date range", indexed lookups.
- **Zero ops**: One file (`server/data/assessments.db`). Backup = copy the file.
- **Schema-flexible**: Result stored as JSON in `result_json` column; indexed columns
  for `team_id`, `assessed_at`, `level` allow fast filtering without rigid schema.

Schema:
```sql
CREATE TABLE assessments (
  id          TEXT PRIMARY KEY,
  team_id     INTEGER NOT NULL,
  team_name   TEXT NOT NULL,
  assessed_by TEXT NOT NULL,
  assessed_at TEXT NOT NULL,
  overall     REAL NOT NULL,
  level       TEXT NOT NULL,
  result_json TEXT NOT NULL
);
```

## Retake Assessment

When "Retake Assessment" is clicked, the wizard calls
`GET /api/assessments/latest/:teamId` and pre-fills the `answers` object.
Each question's radio button reads `answers[q.id]` to determine if it's checked,
so previously selected options appear pre-selected.

## Configuration Reference

| Config              | Env Variable         | Default                          |
|---------------------|----------------------|----------------------------------|
| `qtest.baseUrl`     | `QTEST_BASE_URL`     | `https://abc.qtestnet.com`       |
| `qtest.bearerToken` | `QTEST_BEARER_TOKEN` | `REPLACE_WITH_YOUR_BEARER_TOKEN` |
| `port`              | `PORT`               | `3000`                           |
| `cors.origin`       | `CORS_ORIGIN`        | `http://localhost:4200`          |
