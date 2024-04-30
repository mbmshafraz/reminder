require('dotenv').config();

const { Sequelize } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const Reminder = require('./reminderModel'); // Import the model

const app = express();
const port = 8090; // You can choose any port that is free

app.use(bodyParser.json());

// Sync Sequelize models
Reminder.sequelize.sync().then(() => {
    console.log(`Database & tables created!`);
});


app.get('/reminders', async (req, res) => {
    try {
        const { upcoming, email } = req.query;
        let whereCondition = {};

        if (upcoming === 'true') {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            whereCondition.reminderDate = {
                [Sequelize.Op.gte]: now,
                [Sequelize.Op.lt]: tomorrow,
            };
        }

        // Filter by email address if provided
        if (email) {
            whereCondition.email = email; 
        }

        const reminders = await Reminder.findAll({
            where: whereCondition,
            order: [['reminderDate', 'ASC']], // Optionally, order by date
        });

        res.status(200).send(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).send(error);
    }
});

app.get('/reminders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const reminder = await Reminder.findOne({ where: { id } });

        if (!reminder) {
            return res.status(404).send({ message: 'Reminder not found'});
        }

        res.status(200).send(reminder);
    } catch (error) {
        console.error('Error fetching reminder:', error);
        res.status(500).send(error);
    }
});

// Adding endpoint
app.post('/reminders', async (req, res) => {
    try {
        const { name, description, phoneNumber, email, reminderDate } = req.body;
        const newReminder = await Reminder.create({ name, description, phoneNumber, email, reminderDate });
        res.status(201).send(newReminder);
    } catch (error) {
        console.error('Error adding reminder:', error);
        res.status(500).send(error);
    }
});

app.put('/reminders/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, phoneNumber, email, reminderDate } = req.body;

    try {
        const reminder = await Reminder.findOne({ where: { id } });

        if (!reminder) {
            return res.status(404).send({ message: 'Reminder not found'});
        }

        reminder.name = name;
        reminder.description = description;
        reminder.phoneNumber = phoneNumber;
        reminder.email = email;
        reminder.reminderDate = reminderDate;

        await reminder.save();
        res.status(200).send(reminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).send(error);
    }
});

app.delete('/reminders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Reminder.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).send({ message: 'Reminder not found'});
        }

        res.status(200).send({ message: 'Reminder deleted successfully'});
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
