const axios = require('axios');






const siteName = 'toneagency';  // Replace with your actual site name
const userId = '258615'; // Replace with the actual user ID
const BasicURL = `https://${siteName}.teamwork.com`;

const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

// Define the query parameters
const persontime = (userId, month, year) =>{
var endpoint = `/people/${userId}/loggedtime.json`;
const params = {
    m: month,         // Month (e.g., '07' for July)
    y: year,       // Year (e.g., '2024')
    page: 10,         // Page number (e.g., '1')
    pageSize: 20     // Number of entries per page (e.g., '10')
};

axios.get(`${BasicURL}${endpoint}`, {
    headers: {
        'Authorization': authHeader
    },
    params: params
})
.then(response => {
    console.log(response.data.user.billable);
    return response.data.user.billable;
})
.catch(error => {
    console.error('Error making the request:', error);
});
}

module.exports = { persontime };