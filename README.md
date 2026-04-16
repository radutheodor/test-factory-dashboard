# Test Factory — Product Test Maturity & Dashboard

## Overview

A web application for assessing product team test maturity and providing a unified quality dashboard
with real-time qTest integration.

### Features

1. **Maturity Assessment Wizard** — 9 dimensions, 22 questions, weighted scoring
2. **Product Dashboard** — SonarQube, CI/CD/CT Pipelines, ServiceNow, qTest, Requirement Coverage
3. **qTest Integration** — Live test execution data from Tricentis qTest API
4. **Assessment History** — Maturity spectrum, clickable detail views, improvement roadmaps

## qTest Integration

The dashboard fetches test execution data directly from the qTest API:

### Configuration

Edit `QTEST_CONFIG` in the HTML file (or `src/app/shared/config/qtest.config.ts` for Angular):

```javascript
const QTEST_CONFIG = {
  baseUrl: 'https://your-instance.qtestnet.com',
  bearerToken: 'YOUR_BEARER_TOKEN_HERE',
};
```

### How It Works

1. Each product team has a `qTestProjectId` in `teams.config.ts`
2. On dashboard load, calls: `GET {baseUrl}/api/v3/projects/{projectId}/test-runs?parentId=0&parentType=root&expand=descendants`
3. Filters test runs to last 31 days via `last_modified_date`
4. Groups by "Target Release/Build" property (`items.properties.field_name`)
5. Counts statuses (Passed, Failed, Blocked, Incomplete, Unexecuted) from "Status" property
6. Renders execution bars per release in the "Test Executions in the Last Month" widget

### qTest API Reference

- **Endpoint**: `/api/v3/projects/{projectId}/test-runs`
- **Auth**: Bearer token in Authorization header
- **Key fields**: `last_modified_date`, `properties[].field_name`, `properties[].field_value_name`
- **Portal link**: `{baseUrl}/p/{projectId}/portal/project#tab=testexecution`

## Project Structure

```
src/app/shared/
├── config/
│   ├── maturity.config.ts    ← Dimensions, weights, questions
│   ├── teams.config.ts       ← Teams with qTestProjectId
│   ├── qtest.config.ts       ← qTest base URL + bearer token
│   └── roadmap.config.ts     ← Improvement actions per dimension
├── models/
│   ├── maturity.model.ts     ← Assessment interfaces
│   ├── dashboard.model.ts    ← Dashboard data interfaces
│   └── servicenow.model.ts   ← ServiceNow CR model
└── services/
    ├── maturity.service.ts   ← Scoring logic
    ├── dashboard.service.ts  ← Dashboard data aggregation
    └── qtest.service.ts      ← qTest API integration
```

## Quick Start

Open `test-factory-webapp.html` in any browser — fully functional standalone.
Replace `QTEST_CONFIG.baseUrl` and `QTEST_CONFIG.bearerToken` with your real values.
