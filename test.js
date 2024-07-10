const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const BasicURL = `https://${siteName}.teamwork.com`;
const personLoggedTimeEndpoint = '/time_entries.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';
const pepleendpoint = '/people.json';

const main = async () => {
    var totalHours = 0;
    const people = await get_people();
    console.log(people);
    for (const person of people) {
        const data = await get_time_entries(person.id, '20240701', '20240708');
        console.log(data);
        console.log(data['totalhours']);
        totalHours += parseFloat(data['totalhours']);
    }
    console.log(`Total hours : ${totalHours}`);
}

const get_people = async () => {
    const parameters = {
        page: 1,
        pageSize: 50,
        companyId: 25052
    }
    try {
        const response = await axios.get(`${BasicURL}${pepleendpoint}`, {
            headers: {
                'Authorization': authHeader
            },
            params: parameters
        });
        const people = response.data.people;
        let i = 0;
        const idsAndNames = people.map(person => ({
            id: person.id,
            firstName: person['first-name'],
            lastName: person['last-name'],
            companyId: person['company-id'],
            i: i++
        }));
        console.log(idsAndNames);
        return idsAndNames;
    } catch (error) {
        console.error('Error making the request:', error);
        return []; // Return an empty array or handle the error as needed
    }
}

const get_time_entries = async (userId, fromdate, todate) => {
    const params = {
        page: 1,
        fromdate: fromdate, // Example start date
        fromtime: '00:00', // Example start time
        todate: todate, // Example end date
        totime: '00:00', // Example end time
        pageSize: 100,
        userId: userId,
    };
    let totalHours = 0;
    let data = {};

    try {
        const response = await axios.get(`${BasicURL}${personLoggedTimeEndpoint}`, {
            headers: {
                'Authorization': authHeader
            },
            params: params
        });
        const time_entries = response.data['time-entries'];
        time_entries.forEach(entry => {
            data['name'] = `${entry['person-first-name']} ${entry['person-last-name']}`;
            totalHours += parseFloat(entry['hoursDecimal']);
        });
        //console.log(`UserId : ${userId}, UserName : ${data['name']}, Total hours : ${totalHours}`);
        data['userId'] = userId;
        data['totalhours'] = totalHours;
        return data;
    } catch (error) {
        console.error('Error making the request:', error);
        return null; // Return null or handle the error as needed
    }
}

main().catch(error => console.error('Error in main function:', error));