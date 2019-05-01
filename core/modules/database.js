// A MySQL connection module that allows queries to be ran using connections via a pool.
// Import required modules.
const fs = require("fs");
const Sequelize = require("sequelize");

const Logger = require("./logger");

// Load configuration file.
const configuration = JSON.parse(fs.readFileSync("core/cfg/configuration.json"));

// Create the logger for this module.
const logger = new Logger("core.modules.database");

// Create a sequelize object.
const sequelize = new Sequelize(
    configuration.MySQL.Database, configuration.MySQL.Username, configuration.MySQL.Password,
    {
        host: configuration.MySQL.Host,
        dialect: "mysql",
        pool: {
            max: parseInt(configuration.MySQL.Pool.ConnectionLimit, 10),
            min: 0,
            idle: parseInt(configuration.MySQL.Pool.MaxIdleTime, 10),
            acquire: parseInt(configuration.MySQL.Pool.MaxAcquireTime, 10),
            evict: parseInt(configuration.MySQL.Pool.EvictTime, 10)
        }
    }
);

module.exports = {
    /**
     * connect
     * @description Attempts to connect to the MySQL server using the information provided in the core configuration file.
     * @returns true on successful connection, otherwise false.
     */
    connect() {
        sequelize.authenticate()
        .catch((pError) => {
            logger.log("Failed to connect to MySQL server! (" + pError + ")");
        })
    },
    /**
     * disconnect
     * @description Disconnects from the MySQL database.
     */
    disconnect() {
        sequelize.close();
    },
    /**
     * getSequelize
     * @returns the Sequelize object associated with this database.
     */
    getSequelize() {
        return sequelize;
    }
}
