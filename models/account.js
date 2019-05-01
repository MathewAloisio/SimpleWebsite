// Import required modules.
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const database = require("../core/modules/database");

// Register Account model with sequelize.
class Account extends Sequelize.Model {}
Account.init(
    {
        id: {
            type: Sequelize.INTEGER,
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
        date_registered: {
            type: Sequelize.DATE
        },
        date_lastlogin: {
            type: Sequelize.DATE
        }
    }, 
    { 
        sequelize: database.getSequelize(), 
        modelName: "accounts"
    }
);

// Export the module.
module.exports = Account;