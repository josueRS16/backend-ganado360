const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3010,
  path: '/api/historial?page=1&limit=10',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('body:', data);
    process.exit(0);
  });
});

req.on('error', error => {
  console.error('request error:', error);
  process.exit(1);
});

req.end();
