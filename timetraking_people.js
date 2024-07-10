const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const BasicURL = `https://${siteName}.teamwork.com`;
const endpoint = '/people.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

const time_tracking_people = (month) => {
    
axios.get(`${BasicURL}${endpoint}`, {
    headers: {
        'Authorization': authHeader
    }
})
.then(response => {
    const people = response.data.people;
    const idsAndNames = people.map(person => ({
        id: person.id,
        firstName: person['first-name'],
        lastName: person['last-name']
    }));
    while(idsAndNames.length > 0){
        const userId = idsAndNames.shift().id;
        const params = {
            m: month,         
            y: '2024',       
            page: 1,         
            pageSize: 10    
        };
        const endpointpersontime = `/people/${userId}/loggedtime.json`;
        axios.get(`${BasicURL}${endpointpersontime}`, {
            headers: {
                'Authorization': authHeader
            },
            params: params
        })
        .then(response => {
            torighttype(response.data.user);
        })
        .catch(error => {
            console.error('Error making the request:', error);
        });
        console.log(userId);
    }
})
.catch(error => {
    console.error('Error making the request:', error);
});
}

const torighttype = (user) => {
    const id = user.id;
    const name = user['firstname'] + ' ' + user['lastname'];
    let totalHoursLogged = 0;
    user.billable.forEach(entry => {
        const date = new Date(parseInt(entry[0])); // Convert epoch time to Date object
        const hoursLogged = parseFloat(entry[1]); // Hours logged
        const projectId = entry[2]; // Project ID
        totalHoursLogged += hoursLogged;
        console.log(`ID: ${id}, Name: ${name}, Date: ${date}, Hours Logged: ${hoursLogged}, Project ID: ${projectId}`);
    });
    if(totalHoursLogged!=0){
        console.log(`Total Hours Logged for ${name} (ID: ${id}): ${totalHoursLogged}`);
    }
}

function getPreviousWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const previousWeekDays = [];

    for (let i = 1; i <= 7; i++) {
        const previousDay = new Date(today);
        previousDay.setDate(today.getDate() - dayOfWeek - i);
        previousWeekDays.push(previousDay);
    }

    return previousWeekDays;
}

function getUniqueMonthsFromPreviousWeek() {
    const previousWeek = getPreviousWeekDays();
    const monthsSet = new Set();

    previousWeek.forEach(date => {
        const month = date.getMonth() + 1; // Months are 0-based, so add 1
        monthsSet.add(month);
    });

    const uniqueMonths = Array.from(monthsSet).sort((a, b) => a - b);
    return uniqueMonths;
}

// Example usage:
const uniqueMonths = getUniqueMonthsFromPreviousWeek();
// uniqueMonths.forEach(month => {
//     time_tracking_people(month);
// });
const main = async () => {
    await time_tracking_people(7);
};

// Call the main function
main().catch(error => console.error('Error in main function:', error));