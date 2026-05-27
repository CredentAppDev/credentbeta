const http = require('http');

function req(opts, body) {
  return new Promise((resolve, reject) => {
    const r = http.request(opts, (res) => {
      let chunks = '';
      res.on('data', d => chunks += d);
      res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  // Login as teacher
  const loginBody = JSON.stringify({ passkey: 'TEST1234' });
  const login = await req({
    hostname: 'localhost', port: 5000,
    path: '/api/auth/desktop/initiate', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);
  console.log('Login status:', login.status);
  const lj = JSON.parse(login.body);
  const token = lj.token || lj.accessToken || lj.access_token;
  if (!token) { console.log('Login body:', login.body); return; }

  // Hit roadmap
  const rm = await req({
    hostname: 'localhost', port: 5000,
    path: '/api/ai/roadmap?project_id=7', method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Roadmap status:', rm.status);
  const rj = JSON.parse(rm.body);
  console.log('Keys in response:', Object.keys(rj));
  console.log('requires_teacher_readiness:', rj.requires_teacher_readiness);
  console.log('message:', rj.message);
  console.log('roadmap is array:', Array.isArray(rj.roadmap));
  console.log('roadmap length:', Array.isArray(rj.roadmap) ? rj.roadmap.length : 'N/A');
  if (Array.isArray(rj.roadmap)) console.log('first:', JSON.stringify(rj.roadmap[0]));
})();
