import { ListItemText, Avatar, ListItemAvatar, Box } from '@mui/material';
const TaskView = ({ task }) => {
    return (
        <div className="task">
            `{task.description}`
        </div>
    );
    // return (
    // <ListItemAvatar>
    //     <Avatar>
    //                             <CalendarTodayIcon />
    //                         </Avatar>
    //                     </ListItemAvatar>
    //                     <ListItemText
    //                         primary={todo.description}
    //                         secondary={`On ${format(new Date(todo.reminderDate), 'MMMM d, yyyy, h:mm a')} for ${todo.name}`}/>);
};

export default TaskView;