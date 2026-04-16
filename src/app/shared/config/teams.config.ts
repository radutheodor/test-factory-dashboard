// ════════════════════════════════════════════════════════════════
// Product Teams Configuration
// ════════════════════════════════════════════════════════════════

export interface ProductTeam {
  id: string;
  name: string;
  desc: string;
  lead: string;
  sonarUrl: string;
  adoUrl: string;
  snowUrl: string;
  qTestProjectId: number;
}

export const PRODUCT_TEAMS: ProductTeam[] = [
  {
    id: 'order-mgmt',
    name: 'Order Management',
    desc: 'Core order processing & fulfilment',
    lead: 'Alice Chen',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:order-mgmt',
    adoUrl: 'https://dev.azure.com/company/OrderMgmt/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=order-mgmt',
    qTestProjectId: 101,
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    desc: 'Payment processing & fraud detection',
    lead: 'Bob Martinez',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:payment-gw',
    adoUrl: 'https://dev.azure.com/company/PaymentGW/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=payment-gw',
    qTestProjectId: 102,
  },
  {
    id: 'inventory-svc',
    name: 'Inventory Service',
    desc: 'Stock management & availability',
    lead: 'Carol Wu',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:inventory-svc',
    adoUrl: 'https://dev.azure.com/company/InventorySvc/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=inventory-svc',
    qTestProjectId: 103,
  },
  {
    id: 'customer-portal',
    name: 'Customer Portal',
    desc: 'Self-service customer account management',
    lead: 'David Kim',
    sonarUrl: 'https://sonar.company.com/dashboard?id=com.company:customer-portal',
    adoUrl: 'https://dev.azure.com/company/CustomerPortal/_build',
    snowUrl: 'https://company.service-now.com/nav_to.do?uri=change_request_list.do?sysparm_query=cmdb_ci=customer-portal',
    qTestProjectId: 104,
  },
];
