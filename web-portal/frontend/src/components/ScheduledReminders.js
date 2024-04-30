import React, { useEffect, useState } from 'react';
import { getScheduledReminders } from '../services/reminderService';
// import { services } from '../serviceData';
import { List, ListItem, ListItemText, Typography, Paper, Avatar, ListItemAvatar, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';

// Convert service values to labels for display
// const getServiceLabel = (serviceValue) => {
//     const service = services.find(s => s.value === serviceValue);
//     return service ? service.label : serviceValue; // Fallback to the value if not found
// };

const ScheduledReminders = ({ email, triggerRefresh }) => {
    return (
            <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' }}>
                `Email: ${email}`
            </Typography>
        );

    // const [reminders, setReminders] = useState([]);

    // const fetchReminders = async () => {
    //     if (!email) return;

    //     try {
    //         const sheduledReminders = await getScheduledReminders(email);
    //         setReminders(sheduledReminders);
    //     } catch (error) {
    //         console.error('Failed to fetch reminders:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchReminders();
    // }, [email, triggerRefresh]);

    // if (reminders.length === 0) {
    //     return (
    //         <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' }}>
    //             No sheduled reminders. Take a moment to add one!
    //         </Typography>
    //     );
    // }

    // return (
    //     <Paper elevation={3} style={{ marginTop: 20, padding: '20px' }}>
    //         <Typography variant="h6" style={{ marginBottom: 10 }}>
    //             Scheduled Reminders
    //         </Typography>
    //         <List>
    //             {reminders.map((reminder, index) => (
    //                 <ListItem key={index}>
    //                     <ListItemAvatar>
    //                         <Avatar>
    //                             <CalendarTodayIcon />
    //                         </Avatar>
    //                     </ListItemAvatar>
    //                     <ListItemText
    //                         primary={reminder.description}
    //                         secondary={`On ${format(new Date(reminder.reminderDate), 'MMMM d, yyyy, h:mm a')} for ${reminder.name}`}
    //                     />
    //                 </ListItem>
    //             ))}
    //         </List>
    //     </Paper>
    // );
};

export default ScheduledReminders;
