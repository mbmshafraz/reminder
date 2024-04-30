import { DataTypes } from 'sequelize';
import { define } from './database';

const Reminder = define('Reminder', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  // Other model options go here
});

export default Reminder;
