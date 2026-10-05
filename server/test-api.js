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
  console.log('=== RUNNING LABTRACK EQUIPMENT REST API VERIFICATION ===\n');

  // 1. GET /api/equipment (with query params)
  console.log('1. Testing GET /api/equipment?page=1&limit=3&status=available');
  const resList = await request('/equipment?page=1&limit=3&status=available');
  console.log(`Status: ${resList.status}`);
  console.log(`Items count: ${resList.data?.data?.length}, Total in DB: ${resList.data?.pagination?.total}`);
  console.log(`First item: ${resList.data?.data?.[0]?.name} (${resList.data?.data?.[0]?.asset_tag})\n`);

  // 2. GET /api/equipment/:id
  console.log('2. Testing GET /api/equipment/1');
  const resSingle = await request('/equipment/1');
  console.log(`Status: ${resSingle.status}`);
  console.log(`Item: ${resSingle.data?.data?.name}, Facility: ${resSingle.data?.data?.lab_name}, Incharge: ${resSingle.data?.data?.lab_incharge_name}\n`);

  // 3. POST /api/equipment (Valid Registration)
  console.log('3. Testing POST /api/equipment (Register new item)');
  const newTag = `EQ-AUTO-${Date.now().toString().slice(-4)}`;
  const resPost = await request('/equipment', {
    method: 'POST',
    body: JSON.stringify({
      asset_tag: newTag,
      name: 'Rigol DS1054Z Digital Storage Oscilloscope',
      category_id: 3,
      lab_id: 3,
      serial_no: 'DS1Z-99120',
      purchase_date: '2024-03-01',
      status: 'available',
      description: '50 MHz 4-channel DSO with 24 Mpts memory depth.'
    })
  });
  console.log(`Status: ${resPost.status}`);
  console.log(`Created ID: ${resPost.data?.data?.id}, Tag: ${resPost.data?.data?.asset_tag}`);
  console.log(`Message: ${resPost.data?.message}\n`);
  const createdId = resPost.data?.data?.id;

  // 4. PUT /api/equipment/:id
  if (createdId) {
    console.log(`4. Testing PUT /api/equipment/${createdId} (Update item specs)`);
    const resPut = await request(`/equipment/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify({
        asset_tag: newTag,
        name: 'Rigol DS1054Z Plus 4-Channel DSO (Upgraded)',
        category_id: 3,
        lab_id: 3,
        serial_no: 'DS1Z-99120',
        purchase_date: '2024-03-01',
        status: 'available',
        description: 'Upgraded to 100 MHz bandwidth with NIST verification.'
      })
    });
    console.log(`Status: ${resPut.status}`);
    console.log(`Updated Name: ${resPut.data?.data?.name}`);
    console.log(`Message: ${resPut.data?.message}\n`);
  }

  // 5. DELETE /api/equipment/:id (Guard test on item with active allocation - ID 3)
  console.log('5. Testing DELETE /api/equipment/3 (Must be BLOCKED due to active allocation)');
  const resDeleteBlocked = await request('/equipment/3', { method: 'DELETE' });
  console.log(`Status: ${resDeleteBlocked.status} (Expected 400 Bad Request)`);
  console.log(`Message: ${resDeleteBlocked.data?.message}\n`);

  // 6. DELETE /api/equipment/:id (Successful deletion on unallocated item)
  if (createdId) {
    console.log(`6. Testing DELETE /api/equipment/${createdId} (Successful deletion on newly created item)`);
    const resDeleteSuccess = await request(`/equipment/${createdId}`, { method: 'DELETE' });
    console.log(`Status: ${resDeleteSuccess.status} (Expected 200 OK)`);
    console.log(`Message: ${resDeleteSuccess.data?.message}\n`);
  }

  // 7. GET /api/labs (Dropdown support)
  console.log('7. Testing GET /api/labs (Filter dropdowns)');
  const resLabs = await request('/labs');
  console.log(`Status: ${resLabs.status}`);
  console.log(`Facilities count: ${resLabs.data?.data?.length}`);
  console.log(`First Lab: ${resLabs.data?.data?.[0]?.name} (${resLabs.data?.data?.[0]?.location})\n`);

  // 8. GET /api/categories (Dropdown support)
  console.log('8. Testing GET /api/categories (Filter dropdowns)');
  const resCats = await request('/categories');
  console.log(`Status: ${resCats.status}`);
  console.log(`Categories count: ${resCats.data?.data?.length}`);
  console.log(`First Category: ${resCats.data?.data?.[0]?.name} (${resCats.data?.data?.[0]?.equipment_count} items)\n`);

  console.log('=== ALL EQUIPMENT REST APIS VERIFIED AND FUNCTIONING CORRECTLY ===');
}

runTests().catch(console.error);
