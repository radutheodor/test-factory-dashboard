// ════════════════════════════════════════════════════════════════
// Product Teams Configuration
// ════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH for all product team metadata.
// - Backend reads this via require()
// - Frontend fetches via GET /api/teams
// ════════════════════════════════════════════════════════════════

const PRODUCT_TEAMS = [
  {
    id: 1,
    name: 'Order Management',
    description: 'Core order processing & fulfilment',
    techLead: 'Alice Chen',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:order-mgmt',
    adoUrl: 'https://dev.azure.com/company/OrderMgmt/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=order-mgmt',
    qTestProjectId: 101,
  },
  {
    id: 2,
    name: 'Payment Gateway',
    description: 'Payment processing & fraud detection',
    techLead: 'Bob Martinez',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:payment-gw',
    adoUrl: 'https://dev.azure.com/company/PaymentGW/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=payment-gw',
    qTestProjectId: 102,
  },
  {
    id: 3,
    name: 'Inventory Service',
    description: 'Stock management & availability',
    techLead: 'Carol Wu',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:inventory-svc',
    adoUrl: 'https://dev.azure.com/company/InventorySvc/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=inventory-svc',
    qTestProjectId: 103,
  },
  {
    id: 4,
    name: 'Customer Portal',
    description: 'Self-service customer account management',
    techLead: 'David Kim',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:customer-portal',
    adoUrl: 'https://dev.azure.com/company/CustomerPortal/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=customer-portal',
    qTestProjectId: 104,
  },
];

module.exports = { PRODUCT_TEAMS };
