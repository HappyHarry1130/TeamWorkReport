const torighttype = (billableEntries) => {
    billableEntries.forEach(entry => {
        const date = new Date(parseInt(entry[0])); // Convert epoch time to Date object
        const hoursLogged = entry[1]; // Hours logged
        const projectId = entry[2]; // Project ID
        console.log(`Date: ${date}, Hours Logged: ${hoursLogged}, Project ID: ${projectId}`);
    });
}

module.exports = torighttype;