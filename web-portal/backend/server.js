require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const authenticate = require('./src/authenticate');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

async function getAccessToken() {
    const tokenUrl = process.env.REMINDERS_OAUTH_TOKEN_URL;
    const clientId = process.env.REMINDERS_OAUTH_CLIENT_ID;
    const clientSecret = process.env.REMINDERS_OAUTH_CLIENT_SECRET;

    try {
        const accessToken = await authenticate(tokenUrl, clientId, clientSecret);
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; // Rethrow the error to handle it in the calling context
    }
}

// Endpoint to get reminders, filtering by email
app.get('/reminders', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).send('Email query parameter is required');
        }

        const accessToken = await getAccessToken(); // Use the new function

        const reminderServiceUrl = process.env.REMINDER_SERVICE_URL;
        const response = await axios.get(`${reminderServiceUrl}/reminders?email=${email}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.post('/create-reminder', async (req, res) => {
    try {
        // Retrieve authentication details from environment variables
        const accessToken = await getAccessToken(); // Use the new function here too

        const reminderServiceUrl = process.env.REMINDER_SERVICE_URL;
        if (!reminderServiceUrl) {
            throw new Error('Reminder service URL is not defined in the environment variables');
        }

        const response = await axios.post(`${reminderServiceUrl}/reminders`, req.body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.send("No exception");
        // Respond to the client with the Reminder service's response
        // res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error forwarding reminder creation request:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
