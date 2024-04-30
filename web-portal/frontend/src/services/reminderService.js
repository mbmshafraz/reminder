import axios from 'axios';

// Replace `APPOINTMENT_SERVICE_URL` with the actual URL of your appointments service
const REMINDER_SERVICE_URL = window.configs.apiUrl;

export const scheduleReminder = async (reminderDetails) => {
  try {
    const response = await fetch(`${REMINDER_SERVICE_URL}/create-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderDetails),
    });

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const getScheduledReminders = async (email) => {

  try {
    const response = await axios.get(`${REMINDER_SERVICE_URL}/update-reminder`, {
      params: {
        email: email,
        upcoming: 'true', // Assuming your backend supports this query parameter for filtering scheduled reminders
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled reminders:', error);
    throw error; // Rethrowing the error so it can be caught and handled in the component
  }
};

export const putReminder = async (reminderDetails) => {
  try {
    const response = await fetch(`${REMINDER_SERVICE_URL}/reminders`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderDetails),
    });

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};