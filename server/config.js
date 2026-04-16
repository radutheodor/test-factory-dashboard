// ════════════════════════════════════════════════════════════════
// Server Configuration
// ════════════════════════════════════════════════════════════════
// All sensitive values (tokens, URLs) are configured here.
// In production, use environment variables instead.
// ════════════════════════════════════════════════════════════════

module.exports = {
  // Express server
  port: process.env.PORT || 3000,

  // qTest API
  qtest: {
    baseUrl: process.env.QTEST_BASE_URL || 'https://abc.qtestnet.com',
    bearerToken: process.env.QTEST_BEARER_TOKEN || 'REPLACE_WITH_YOUR_BEARER_TOKEN',
  },

  // ServiceNow API (future)
  serviceNow: {
    baseUrl: process.env.SNOW_BASE_URL || 'https://company.service-now.com',
    username: process.env.SNOW_USERNAME || '',
    password: process.env.SNOW_PASSWORD || '',
  },

  // SonarQube API (future)
  sonar: {
    baseUrl: process.env.SONAR_BASE_URL || 'https://sonar.company.com',
    token: process.env.SONAR_TOKEN || '',
  },

  // Azure DevOps API (future)
  azureDevOps: {
    orgUrl: process.env.ADO_ORG_URL || 'https://dev.azure.com/company',
    pat: process.env.ADO_PAT || '',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  },
};
