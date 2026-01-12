const http = require('http');

const postData = JSON.stringify({
    name: "Crash Tester",
    email: "ganduu@gmail.com", // Using the email from screenshot that caused 500
    password: "password123",
    role: "guest"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('BODY: ' + data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
