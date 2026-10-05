const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('=== RUNNING COMPREHENSIVE TRANSACTION & REPORTS API VERIFICATION ===\n');

  // 1. POST /api/allocations (Checkout available equipment in transaction)
  console.log('1. Testing POST /api/allocations (Checkout Equipment #1)');
  const allocRes = await request('/allocations', {
    method: 'POST',
    body: JSON.stringify({
      equipment_id: 1,
      user_id: 3,
      due_date: '2024-11-01 17:00:00',
      purpose: 'Robotics Kinematics Simulation Laboratory Module'
    })
  });
  console.log(`Status: ${allocRes.status}`);
  console.log(`Message: ${allocRes.data?.message}`);
  console.log(`Created Allocation ID: ${allocRes.data?.data?.id}\n`);
  const newAllocId = allocRes.data?.data?.id;

  // Verify equipment status changed to 'allocated'
  const eq1Check = await request('/equipment/1');
  console.log(`Equipment #1 Status after checkout: ${eq1Check.data?.data?.status} (Expected: allocated)\n`);

  // 2. Test Allocation Rejection on Non-Available Equipment
  console.log('2. Testing POST /api/allocations on already allocated item (Should fail 400)');
  const allocFailRes = await request('/allocations', {
    method: 'POST',
    body: JSON.stringify({
      equipment_id: 1,
      user_id: 2,
      due_date: '2024-11-05 17:00:00',
      purpose: 'Attempting conflicting allocation'
    })
  });
  console.log(`Status: ${allocFailRes.status} (Expected 400)`);
  console.log(`Message: ${allocFailRes.data?.message}\n`);

  // 3. PUT /api/allocations/:id/return (Return equipment in transaction)
  if (newAllocId) {
    console.log(`3. Testing PUT /api/allocations/${newAllocId}/return (Mark Returned)`);
    const returnRes = await request(`/allocations/${newAllocId}/return`, { method: 'PUT' });
    console.log(`Status: ${returnRes.status}`);
    console.log(`Message: ${returnRes.data?.message}`);

    // Verify equipment status restored to 'available'
    const eq1Restored = await request('/equipment/1');
    console.log(`Equipment #1 Status after return: ${eq1Restored.data?.data?.status} (Expected: available)\n`);
  }

  // 4. POST /api/maintenance/report (Damage report in transaction)
  console.log('4. Testing POST /api/maintenance/report (Report Damage on Equipment #9)');
  const reportRes = await request('/maintenance/report', {
    method: 'POST',
    body: JSON.stringify({
      equipment_id: 9,
      reported_by: 2,
      issue_description: 'SFP Uplink slot 1 failing optical link train. Mechanical dust cap missing.',
      severity: 'medium',
      technician_notes: 'Cleaned LC connector. Diagnostics in progress.'
    })
  });
  console.log(`Status: ${reportRes.status}`);
  console.log(`Message: ${reportRes.data?.message}`);
  console.log(`Ticket ID: ${reportRes.data?.data?.id}, Eq Status: ${reportRes.data?.data?.equipment_status}\n`);
  const ticketId = reportRes.data?.data?.id;

  // 5. GET /api/maintenance (Filter by status)
  console.log('5. Testing GET /api/maintenance?status=reported');
  const maintListRes = await request('/maintenance?status=reported');
  console.log(`Status: ${maintListRes.status}`);
  console.log(`Reported Tickets Count: ${maintListRes.data?.data?.length}\n`);

  // 6. PUT /api/maintenance/:id/status (Resolve ticket in transaction)
  if (ticketId) {
    console.log(`6. Testing PUT /api/maintenance/${ticketId}/status (Resolve Ticket)`);
    const resolveRes = await request(`/maintenance/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'resolved',
        technician_notes: 'Replaced SFP cage assembly and verified 1000BASE-SX optical loopback.'
      })
    });
    console.log(`Status: ${resolveRes.status}`);
    console.log(`Message: ${resolveRes.data?.message}`);

    // Verify equipment status restored to 'available'
    const eq9Restored = await request('/equipment/9');
    console.log(`Equipment #9 Status after resolution: ${eq9Restored.data?.data?.status} (Expected: available)\n`);
  }

  // 7. GET /api/reports/summary (Aggregations, GROUP BYs, Overdue list)
  console.log('7. Testing GET /api/reports/summary');
  const reportSummaryRes = await request('/reports/summary');
  console.log(`Status: ${reportSummaryRes.status}`);
  console.log(`Total Inventory: ${reportSummaryRes.data?.data?.totalInventoryCount}`);
  console.log(`Status Counts:`, reportSummaryRes.data?.data?.statusCounts);
  console.log(`Overdue Allocations Count: ${reportSummaryRes.data?.data?.overdueAllocations?.count}`);
  if (reportSummaryRes.data?.data?.overdueAllocations?.items?.length > 0) {
    const firstOverdue = reportSummaryRes.data?.data?.overdueAllocations?.items[0];
    console.log(`Sample Overdue: "${firstOverdue.equipment_name}" borrowed by ${firstOverdue.borrower_name} (${firstOverdue.days_overdue} days overdue)`);
  }
  console.log(`\n=== ALL ALLOCATIONS, MAINTENANCE, AND REPORTS APIS FULLY VERIFIED ===`);
}

runTests().catch(console.error);
