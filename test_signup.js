const axios = require('axios');

const fs = require('fs');

const testSignup = async () => {
    const testUser = {
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
    };

    try {
        console.log('Attempting signup with:', testUser);
        const res = await axios.post('http://127.0.0.1:5000/api/auth/signup', testUser);
        fs.writeFileSync('signup_result.log', JSON.stringify(res.data, null, 2));
        console.log('Signup Result saved to signup_result.log');
    } catch (err) {
        let errorInfo = {
            message: err.message,
            code: err.code,
            status: err.response?.status,
            data: err.response?.data
        };
        fs.writeFileSync('signup_result.log', JSON.stringify(errorInfo, null, 2));
        console.error('Signup Error:', errorInfo);
    }
};

testSignup();
