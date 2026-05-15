const axios = require('axios');

async function test() {
  try {
    // First login to get a token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    
    // Then submit
    const submitRes = await axios.post('http://localhost:5000/api/submissions', {
      task_id: 1, // Assumes task 1 exists
      answer: "My test answer"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(submitRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Error data:', err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  }
}
test();
