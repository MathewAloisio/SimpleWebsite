// Import required modules.
const path = require("path");
const Sequelize = require("sequelize");

const database = require(path.resolve("core/modules/database"));

// Register EmailVerification model with sequelize.
/**
 * EmailVerification - A model that stores an account ID, an email, and a hash to allow users to verify their emails via URLs emailed to them.
 * @author Mathew Aloisio
 */
class EmailVerification extends Sequelize.Model {}
EmailVerification.init({
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        accountID: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        hash: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        date_expires: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, 
    { sequelize: database.getSequelize() }
);

EmailVerification.addHook("afterCreate", "deleteOldEntries", (pEmailVerification, pOptions) => {
    // DELETE FROM emailverifications WHERE (TIMESTAMPDIFF(MINUTE, date_expires, CURRENT_TIMESTAMP()) > 0 AND id > 0);
    const sequelize = database.getSequelize();
    EmailVerification.destroy({ 
        where: sequelize.where(sequelize.fn("timestampdiff", sequelize.literal("minute"), sequelize.col("date_expires"), sequelize.fn("current_timestamp")), ">", 0) 
    });
});

// Export the module.
module.exports = EmailVerification;