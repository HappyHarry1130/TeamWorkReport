const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const BasicURL = `https://${siteName}.teamwork.com`;
const endpoint = '/completedtasks.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

const getTaskInfo = async (fromDate, toDate) => {
    const params = {
        page: 1,
        pageSize: 250,
        startdate: fromDate,
        enddate: toDate,
        includeArchivedProjects: true
    };

    try {
        const response = await axios.get(`${BasicURL}${endpoint}`, {
            headers: {
                'Authorization': authHeader
            },
            params: params
        });
        return response.data.tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

module.exports = { getTaskInfo };