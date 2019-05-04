// Import required modules.
const path = require("path");
const Sequelize = require("sequelize");

const database = require(path.resolve("core/modules/database"));

// Register Account model with sequelize.
/**
 * Account- A model that represents a personal account, passwords are hashed with bcrypt.
 * @author Mathew Aloisio
 */
class Account extends Sequelize.Model {}
Account.init({
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING(60),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email_confirmed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        date_registered: {
            type: Sequelize.DATE,
            allowNull: false
        },
        date_lastlogin: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    }, 
    { sequelize: database.getSequelize() }
);

// Export the module.
module.exports = Account;