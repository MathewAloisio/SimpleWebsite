// Import required modules.
const path = require("path");
const Sequelize = require("sequelize");

const database = require(path.resolve("core/modules/database"));

// Register Appointment model with sequelize.
/**
 * Appointment - A model that stores all information neccesary for an appointment.
 * @author Mathew Aloisio
 */
class Appointment extends Sequelize.Model {}
Appointment.init({
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        bookedByID: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        confirmedByID: {
            type: Sequelize.INTEGER.UNSIGNED,
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