// A module for logging.
// Import required modules.
const fs = require("fs");

// Export the Logger class as the module.
module.exports = class Logger {
    constructor(pLogName) {
        this.m_LogName = pLogName;
        this.m_FilePath = "logs/" + pLogName + ".log";
    }

    /**
     * log
     * @description Writes a string to the given logfile for a Logger instance and also to the console.
     * @param {*} pLog - The string to write to the log file.
     */
    log(pLog) {
        this.logNoConsole(pLog);

        // Write log to console.
        console.log('[' + this.m_LogName + "] " + pLog);
    }

    /**
     * logNoConsole
     * @description Writes a string to the given logfile for a Logger instance.
     * @param {*} pLog - The string to write to the log file.
     */
    logNoConsole(pLog) {
        // Write log to logfile.
        fs.appendFile(this.m_FilePath, pLog + '\n', (pError) => {
            console.log("Logger failed to write to file: \"" + this.m_FilePath + "\".\n" + pError);
        });
    }
}