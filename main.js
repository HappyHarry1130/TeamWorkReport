const axios = require('axios');

const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';
const { getPreviousWeekRange } = require('./week');
const {chatGpt} = require('./chatgpt');
const {getTaskInfo} = require('./task');
const {sendEmail} = require('./sendgrid');

const siteName = 'toneagency'; 
const BasicURL = `https://${siteName}.teamwork.com`;

//endPoints
const personLoggedTimeEndpoint = '/time_entries.json';
const pepleendpoint = '/people.json';
const endpoint = '/projects.json';


//Get PreviousWeekDate
const { fromdate, todate } = getPreviousWeekRange();
console.log(`From Date: ${fromdate}, To Date: ${todate}`);

//Get Logedtime via Projects
const getProjectsTime = async () => {
    try {
        const response = await axios.get(`${BasicURL}${endpoint}`, {
            headers: {
                'Authorization': authHeader
            }
        });
        const projects = response.data.projects;
        let i = 0;
        let maxTotalHours = 0;
        let maxProject = null;
        let hours = 0;
        const returndata = [];
        const projectPromises = projects.map(async (project) => {
            const projectData = await get_on_a_projects(project.id);
            returndata.push(projectData[0]);
            projectData.forEach(proj => {
                const totalHours = parseFloat(proj['time-totals']['total-hours-sum']);
                hours += totalHours;
                if (totalHours > maxTotalHours) {
                    maxTotalHours = totalHours;
                    maxProject = proj;
                }
            });
            i++;
        });

        await Promise.all(projectPromises);
        
        if (maxProject) {
            console.log(`Project with max total hours: ${maxProject.name} (ID: ${maxProject.id}) with ${maxTotalHours} hours`);
        } else {
            console.log('No projects found.');
        }
        return {maxProject,returndata};
    } catch (error) {
        console.error('Error making the request:', error);
    }
};

const get_on_a_projects = (projectId,) => {
    const endpoint_getonaproject = `/projects/${projectId}/time/total.json`;
    const params = {
        fromDate: fromdate,          
        toDate: todate,
        companyId: '25052',        
        projectType: 'active',
        page: 1,              
        pageSize: 10          
    };
    return axios.get(`${BasicURL}${endpoint_getonaproject}`, {
        headers: {
            'Authorization': authHeader
        },
        params: params
    })
    .then(response => {
        return response.data.projects;
    })
    .catch(error => {
        console.error('Error making the request:', error);
        return [];
    });
}

//Get Loged Time via people
const getlogedtimeviapeople = async () => {
    var totalHours = 0;
    var monthTotalHours = 0;
    var returndata =[];
    const people = await get_people();
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    console.log(firstDay, lastDay);
    for (const person of people) {
        const data = await get_time_entries(person.id, fromdate, todate);
        const monthdata = await get_time_entries(person.id, firstDay, lastDay);
        totalHours += parseFloat(data['totalhours']);
        monthTotalHours += parseFloat(monthdata['totalhours']);
        returndata.push(data);        
    }
    return {totalHours,returndata, monthTotalHours};
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
 
        return idsAndNames;
    } catch (error) {
        console.error('Error making the request:', error);
        return []; // Return an empty array or handle the error as needed
    }
}

const get_time_entries = async (userId, fromdate, todate) => {
    const params = {
        page: 1,
        fromdate: fromdate,
        fromtime: '00:00', 
        todate: todate, 
        totime: '00:00', 
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
        data['userId'] = userId;
        data['totalhours'] = totalHours;
        return data;
    } catch (error) {
        console.error('Error making the request:', error);
        return null; 
    }
}

const getFirstAndLastDayOfMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        firstDay: firstDay.toISOString().split('T')[0].replace(/-/g, ''),
        lastDay: lastDay.toISOString().split('T')[0].replace(/-/g, '')
    };
};


async function main(){
    var projectData = [];
    var projectno = 0;
    const { maxProject, returndata } = await getProjectsTime();
    returndata.forEach(project => {
        projectData[projectno] = {}; // Initialize the object
        projectData[projectno]['name'] = project['name'];
        projectData[projectno]['totalhours'] = project['time-totals']['total-hours-sum'];
        projectno++;
    });
    const { returndata: personData, totalHours, monthTotalHours } = await getlogedtimeviapeople();
    if (personData.length === 0) {
        console.log('No person data found.');
        return;
    }

    let maxPerson = personData[0];
    let minPerson = personData[0];
    const activepersonData = personData.filter(person => person.totalhours > 0);
    activepersonData.forEach(async person => {
        if (person.totalhours > maxPerson.totalhours) {
            maxPerson = person;
        }
        if (person.totalhours < minPerson.totalhours&&person.totalhours>0) {
            minPerson = person;
        }        
    });
    const tasks = await getTaskInfo(fromdate, todate);

    const message = `the total hours is ${totalHours}. ${maxPerson.name} and ${minPerson.name} are the person with max and min total hours respectively. Here is some information about your users:
        ${activepersonData.map(person => `${person.name} : ${person.totalhours}`).join('\n')}
        Here is some information about your projects:
        ${projectData.map(project => `${project.name} : ${project.totalhours}`).join('\n')}
        Here is some information about your tasks:
        completed task is ${tasks.length} AvgTimePerTask = ${totalHours/tasks.length}
        Monthly hours is ${monthTotalHours}
        `; 
    const response = await chatGpt(message);
    console.log(response);
    await sendEmail(response);


    console.log(`TotalHours : ${totalHours}`);
    console.log(`Person with max total hours: UserId : ${maxPerson.userId}, UserName : ${maxPerson.name}, Total hours : ${maxPerson.totalhours}`);
    console.log(`Person with min total hours: UserId : ${minPerson.userId}, UserName : ${minPerson.name}, Total hours : ${minPerson.totalhours}`);
}
main();