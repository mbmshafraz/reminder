// components/SchedulingForm.js

import React, { useState, useEffect } from 'react';
// import { services } from '../serviceData';
import { TextField, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { add, startOfDay } from 'date-fns';
import { scheduleReminder } from '../services/reminderService';

const SchedulingForm = ({ userDetails, handleOpenSnackbar, onSchedulingSuccess }) => {
    const defaultReminderDate = add(startOfDay(new Date()), { days: 1, hours: 10 });

    const [name, setName] = useState(userDetails.name || userDetails.username);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [description, setDescription] = useState('');
    const [reminderDate, setReminderDate] = useState(defaultReminderDate);
    const [errors, setErrors] = useState({
        name: '',
        phoneNumber: '',
        description: '',
        reminderDate: '',
    });
    const [isSchedulingReminder, setIsSchedulingReminder] = useState(false);

    // Effect to update state when userDetails changes
    useEffect(() => {
        setName(userDetails.name || userDetails.username);
    }, [userDetails]);

    const validateForm = () => {
        let tempErrors = { name: '', description: '', reminderDate: '', phoneNumber: '' };
        let isValid = true;

        if (!name) {
            tempErrors.name = 'Name is required.';
            isValid = false;
        }

        if (!description) {
            tempErrors.description = 'Description is required.';
            isValid = false;
        }

        if (!reminderDate || new Date(reminderDate) < new Date()) {
            tempErrors.reminderDate = 'Please select a future date and time.';
            isValid = false;
        }

        // Basic validation for phone number
        const phoneRegex = /^[0-9]{10}$/; // Adjust the regex according to your needs
        if (!phoneNumber) {
            tempErrors.phoneNumber = 'Phone number is required.';
            isValid = false;
        } else if (!phoneRegex.test(phoneNumber)) {
            tempErrors.phoneNumber = 'Phone number is 10 digits.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSchedulingReminder(true); // Start loading

        const reminderDetails = {
            name,
            phoneNumber,
            description,
            reminderDate,
            email: userDetails.email, // Include the email in your remnder details
        };

        try {
            await scheduleReminder(reminderDetails);
            handleOpenSnackbar('Added reminder successfully!');

            onSchedulingSuccess(); // Add this line. You need to pass this prop from App.js

            // Reset form fields
            setDescription('');
            setReminderDate(defaultReminderDate);
            setPhoneNumber('');
        } catch (error) {
            console.error('Adding reminder failed:', error);
            setDescription(error.message); // Remove Later
            handleOpenSnackbar('Failed to add the reminder. Please try again.');
        } finally {
            setIsSchedulingReminder(false); // Stop loading regardless of the outcome
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
                margin="normal"
                variant="outlined"
                type="tel" // Suggests to browsers that this input should be treated as a telephone number
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
                margin="normal"
                variant="outlined"
            />   
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Reminder Date"
                    value={reminderDate}
                    onChange={(newValue) => setReminderDate(newValue)}
                    slotProps={{
                        textField: {
                            variant: 'outlined',
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.reminderDate,
                            helperText: errors.reminderDate,
                        }
                    }}
                />
            </LocalizationProvider>
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20, position: 'relative' }} disabled={isSchedulingReminder}>
                Add Reminder
                {isSchedulingReminder && (
                    <CircularProgress
                        size={24}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -12,
                            marginLeft: -12,
                        }}
                    />
                )}
            </Button>
        </form>
    );
};

export default SchedulingForm;
