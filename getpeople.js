const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const BasicURL = `https://${siteName}.teamwork.com`;
const endpoint = '/people.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

const get_people = async () => {
    const parameters = {
        page: 1,
        pageSize: 50,
        companyId: 25052
    }
    try {
        const response = await axios.get(`${BasicURL}${endpoint}`, {
            headers: {
                'Authorization': authHeader
            },
            params: parameters
        });
        const people = response.data.people;
        var i=0;
        const idsAndNames = people.map(person => ({
            id: person.id,
            firstName: person['first-name'],
            lastName: person['last-name'],
            //permission: person.permissions,
            companyId: person['company-id'],
            i: i++          
            
        }));i++
        console.log(idsAndNames);
        return idsAndNames;
    } catch (error) {
        console.error('Error making the request:', error);
        return []; // Return an empty array or handle the error as needed
    }
}

//get_people();
module.exports = { get_people };