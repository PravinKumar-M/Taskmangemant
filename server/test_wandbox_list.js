const https = require('https');

const req = https.request({
  hostname: 'wandbox.org',
  port: 443,
  path: '/api/list.json',
  method: 'GET'
}, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    const list = JSON.parse(body);
    const python = list.filter(c => c.language === 'Python');
    console.log('ALL Python:', python.map(c => c.name));
  });
});
req.end();
