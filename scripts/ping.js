import http from 'http';

const url = process.argv[2] || 'http://127.0.0.1:3001/health';

http.get(url, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', body);
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Request error:', err.message);
  process.exit(1);
});
