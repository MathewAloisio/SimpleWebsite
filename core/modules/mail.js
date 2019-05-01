// A module that allows emails to be sent by the server using nodemailer.
// Import required modules.
const fs = require("fs");
const nodeMailer = require("nodemailer");

const Logger = require("./logger");

// Load configuration file.
const configuration = JSON.parse(fs.readFileSync("core/cfg/configuration.json"));

// Create the logger for this module.
const logger = new Logger("core.modules.mail");

// Define Mailer class.
class Mailer {
    sendTo(pFrom, pTo, pSubject, pTextBody, pHTMLBody) {
        Mailer.TRANSPORTER.sendMail(
            {   // Mail options.
                from: pFrom,
                to: pTo,
                subject: pSubject,
                text: pTextBody,
                html: pHTMLBody
            },
            (pError, pInfo) => { if (pError) return logger.log(pError); }
        )
    }
};

// Static class definition(s).
Mailer.TRANSPORTER = nodeMailer.createTransport({
    host: configuration.Mail.Host,
    port: configuration.Mail.Port,
    secure: parseInt(configuration.Mail.Secure, 10) != 0,
    auth: {
        user: configuration.Mail.Username,
        pass: configuration.Mail.Password
    }
});

// Export the module.
module.exports = Mailer;