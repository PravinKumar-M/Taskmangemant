const https = require('https');

const data = JSON.stringify({
  compiler: 'python-3.10.6',
  code: 'print("Hello from Wandbox!")',
  save: false
});

const options = {
  hostname: 'wandbox.org',
  port: 443,
  path: '/api/compile.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => {
    body += d;
  });
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
