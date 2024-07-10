const fetch = require('node-fetch');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const chatGpt = async (message) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are a report writer.
                        Here is a sample report:
                        "Hi Team,
                        This week team logged a total of [XXX] hours. This is [higher/lower] than our weekly goal of 250 hours per week.
                        The person who logged the most hours was [Person Name] with [XHours] and the person who logged the least hours was [Person Name] with [YHours].
                        The average number of hours logged per person per day is [XXX] hours.
                        So far this month you have logged [XXX] hours, which puts you slightly behind your monthly goal of 1,000 hours.
                        You have completed [number of tasks] this week, with an average time per task of [minutes]. Your largest project was [ProjectName]". And you have to include anaylize part in your response. please don't write [Your Name] in last part`
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = { chatGpt };