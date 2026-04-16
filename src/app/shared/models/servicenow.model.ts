// ════════════════════════════════════════════════════════════════
// ServiceNow Change Request Model
// ════════════════════════════════════════════════════════════════
// Fields commonly available from the ServiceNow Table API
// (GET /api/now/table/change_request)
// ════════════════════════════════════════════════════════════════

export interface ServiceNowChangeRequest {
  number: string;                    // CHG0041523
  type: 'Normal' | 'Standard' | 'Emergency';
  state: string;                     // New, Assess, Authorize, Scheduled, Implement, Review, Closed
  priority: string;                  // 1 - Critical, 2 - High, 3 - Moderate, 4 - Low
  assignedTo: string;
  shortDescription: string;
  category: string;                  // Software, Hardware, Network, etc.
  riskLevel: 'High' | 'Moderate' | 'Low';
  plannedStartDate: string;          // ISO 8601
  plannedEndDate: string;
  approvalStatus: string;            // Approved, Requested, Rejected, Pre-Approved
  cabDate: string;                   // Change Advisory Board date
  closedAt?: string;
  closeNotes?: string;
}

// ServiceNow Table API reference:
// GET /api/now/table/change_request?sysparm_query=cmdb_ci={ci_name}
//
// Common fields returned:
//   number, type, state, priority, assigned_to, short_description,
//   category, risk, planned_start_date, planned_end_date,
//   approval, cab_date, closed_at, close_notes,
//   sys_created_on, sys_updated_on, sys_id
//
// Filters commonly used:
//   state!=7 (exclude cancelled)
//   type=normal^ORtype=emergency
//   planned_start_date>=javascript:gs.beginningOfLast30Days()
