const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const projectId = '418999'; // Replace with your actual project ID
const BasicURL = `https://${siteName}.teamwork.com`;
const endpoint = '/time_entries.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

const get_time_entries = async (fromdate, todate) => {

const params = {
    page: 1,
    fromdate: fromdate, // Example start date
    fromtime: '00:00', // Example start time
    todate: todate, // Example end date
    totime: '00:00', // Example end time
    page: 1,
    pageSize: 100,

    // showDeleted: 'false',
    // tagIds: '23,445,454',
    // updatedAfterDate: '20230101000000', // Example updated after date
    // pageSize: 100,
    // taskTagIds: '12,34,56'
};
var totalours = 0;
var data = [];
const hours =0;
axios.get(`${BasicURL}${endpoint}`, {
    headers: {
        'Authorization': authHeader
    },
    params: params
})
.then(response => {
    //console.log(response.data['time-entries']);
   console.log(response);
})
.catch(error => {
    console.error('Error making the request:', error);
});
    
}


    get_time_entries('20240601', '20240630');
