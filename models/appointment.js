// Import required modules.
const path = require("path");
const Sequelize = require("sequelize");

const database = require(path.resolve("core/modules/database"));

// Register Appointment model with sequelize.
class Appointment extends Sequelize.Model {}
Appointment.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        clientID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        confirmedByID: {
            type: Sequelize.INTEGER,
            defaultValue: false
        },
        date_booked: {
            type: Sequelize.DATE
        },
        date_appointment: {
            type: Sequelize.DATE
        },
        date_completed: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    }, 
    { sequelize: database.getSequelize() }
);

// Export the module.
module.exports = Appointment;