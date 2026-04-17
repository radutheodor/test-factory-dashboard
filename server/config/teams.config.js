// ════════════════════════════════════════════════════════════════
// Product Teams Configuration
// ════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH for all product team metadata.
// - The backend reads this via require()
// - The frontend fetches this via GET /api/teams
//
// To add/remove/edit teams, change only this file.
// Do NOT duplicate team data in the frontend.
// ════════════════════════════════════════════════════════════════

const PRODUCT_TEAMS = [
  {
    id: 'order-mgmt',
    name: 'Order Management',
    description: 'Core order processing & fulfilment',
    techLead: 'Alice Chen',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:order-mgmt',
    adoUrl: 'https://dev.azure.com/company/OrderMgmt/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=order-mgmt',
    qTestProjectId: 101,
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Payment processing & fraud detection',
    techLead: 'Bob Martinez',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:payment-gw',
    adoUrl: 'https://dev.azure.com/company/PaymentGW/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=payment-gw',
    qTestProjectId: 102,
  },
  {
    id: 'inventory-svc',
    name: 'Inventory Service',
    description: 'Stock management & availability',
    techLead: 'Carol Wu',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:inventory-svc',
    adoUrl: 'https://dev.azure.com/company/InventorySvc/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=inventory-svc',
    qTestProjectId: 103,
  },
  {
    id: 'customer-portal',
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
