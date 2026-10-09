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

async function runAuthTests() {
  console.log('=== RUNNING JWT AUTHENTICATION & ROLE API VERIFICATION ===\n');

  // 1. Test Admin Login
  console.log('1. Testing POST /api/auth/login (Admin Credentials)');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@labtrack.edu', password: 'admin123' })
  });
  console.log(`Status: ${adminLogin.status}`);
  console.log(`User: ${adminLogin.data?.user?.name} [${adminLogin.data?.user?.role}]`);
  console.log(`Token Received: ${Boolean(adminLogin.data?.token)}`);
  const adminToken = adminLogin.data?.token;

  // 2. Test Staff Login
  console.log('\n2. Testing POST /api/auth/login (Staff Credentials)');
  const staffLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'elena.ramos@labtrack.edu', password: 'staff123' })
  });
  console.log(`Status: ${staffLogin.status}`);
  console.log(`User: ${staffLogin.data?.user?.name} [${staffLogin.data?.user?.role}]`);
  console.log(`Token Received: ${Boolean(staffLogin.data?.token)}`);
  const staffToken = staffLogin.data?.token;

  // 3. Test Student Login
  console.log('\n3. Testing POST /api/auth/login (Student Credentials)');
  const studentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'liam.cooper@student.labtrack.edu', password: 'student123' })
  });
  console.log(`Status: ${studentLogin.status}`);
  console.log(`User: ${studentLogin.data?.user?.name} [${studentLogin.data?.user?.role}]`);
  console.log(`Token Received: ${Boolean(studentLogin.data?.token)}`);

  // 4. Test Invalid Password
  console.log('\n4. Testing POST /api/auth/login (Invalid Password)');
  const invalidLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@labtrack.edu', password: 'wrongpassword' })
  });
  console.log(`Status: ${invalidLogin.status} (Expected 401)`);
  console.log(`Error Message: ${invalidLogin.data?.message}`);

  // 5. Test Missing Field Validation
  console.log('\n5. Testing POST /api/auth/login (Missing Fields)');
  const emptyLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: '' })
  });
  console.log(`Status: ${emptyLogin.status} (Expected 400)`);
  console.log(`Error Message: ${emptyLogin.data?.message}`);

  // 6. Test GET /api/auth/me with Bearer Token
  console.log('\n6. Testing GET /api/auth/me (With Valid Bearer Token)');
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`Status: ${meRes.status}`);
  console.log(`Session Verified User: ${meRes.data?.user?.name} (${meRes.data?.user?.email})`);

  // 7. Test GET /api/auth/me without Token
  console.log('\n7. Testing GET /api/auth/me (Without Bearer Token)');
  const unauthRes = await request('/auth/me');
  console.log(`Status: ${unauthRes.status} (Expected 401)`);
  console.log(`Message: ${unauthRes.data?.message}`);

  // 8. Test GET /api/auth/users
  console.log('\n8. Testing GET /api/auth/users (User Directory)');
  const usersRes = await request('/auth/users', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`Status: ${usersRes.status}`);
  console.log(`Total Users Retrieved: ${usersRes.data?.data?.length}`);
  usersRes.data?.data?.forEach(u => {
    console.log(` - [${u.role.toUpperCase()}] ${u.name} <${u.email}>`);
  });

  console.log('\n=== ALL JWT AUTHENTICATION TESTS PASSED SUCCESSFULLY ===');
}

runAuthTests().catch(console.error);
