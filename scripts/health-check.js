import http from 'http';
import app from '../src/app.js';

const server = app.listen(0, () => {
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/health`;

  http.get(url, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      console.log('BODY:', body);
      server.close(() => process.exit(0));
    });
  }).on('error', (err) => {
    console.error('Request error:', err.message);
    server.close(() => process.exit(1));
  });
});
