const axios = require('axios');

const run = async () => {
    const url = 'http://localhost:5000/api/v1/auth/register';
    const user = {
        name: 'Gandu Test',
        email: 'gandu@gmail.com',
        password: 'password123',
        role: 'guest'
    };

    try {
        console.log('Sending register request...');
        await axios.post(url, user);
        console.log('Registration SUCCESS (Unexpected if trying to trigger error)');
    } catch (e) {
        if (e.response) {
            console.log('Registration Failed with Status:', e.response.status);
            console.log('Response Body:', JSON.stringify(e.response.data, null, 2));
        } else {
            console.log('Error:', e.message);
        }
    }
};

run();
