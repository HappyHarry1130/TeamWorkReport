const axios = require('axios');

const siteName = 'toneagency'; // Replace with your actual site name
const BasicURL = `https://${siteName}.teamwork.com`;
const endpoint = '/projects.json';
const authHeader = 'Basic dHdwXzBEcDJPUFAyUUtsRmRJampXOVU4bEpvdTlweHE6';

axios.get(`${BasicURL}${endpoint}`, {
    headers: {
        'Authorization': authHeader
    }
})
.then(async response => {
    const projects = response.data.projects;
    let i = 0;
    let maxTotalHours = 0;
    let maxProject = null;
    let minProject = null;

    const projectPromises = projects.map(async (project) => {
        const projectData = await get_on_a_projects(project.id);
        projectData.forEach(proj => {
            const totalHours = parseFloat(proj['time-totals']['total-hours-sum']);
            console.log(` ${i} - ${project.id} - ${project.name} - ${totalHours}`);
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
})
.catch(error => {
    console.error('Error making the request:', error);
});

//functions
const get_on_a_projects = (projectId) => {
    const endpoint_getonaproject = `/projects/${projectId}/time/total.json`;
    const params = {
        fromDate: '20240701', 
        fromTime: '09:00',   
        toDate: '20240708',  
        toTime: '17:00',      
        //userId: 12345,       
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