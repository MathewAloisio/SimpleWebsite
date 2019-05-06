// A module that allows emails to be sent by the server using nodemailer.
// Import required modules.
const fs = require("fs");
const path = require("path");
const nodeMailer = require("nodemailer");

// Load configuration file.
const configuration = JSON.parse(fs.readFileSync(path.resolve("core/cfg/configuration.json")));

const transporter = nodeMailer.createTransport({
    host: configuration.Mail.Host,
    port: configuration.Mail.Port,
    secure: parseInt(configuration.Mail.Secure, 10) != 0,
    auth: {
        user: configuration.Mail.Username,
        pass: configuration.Mail.Password
    }
});

// Export the module.
module.exports = {
    sendTo: (pFrom, pTo, pSubject, pTextBody, pHTMLBody) => {
        return transporter.sendMail({
            from: pFrom,
            to: pTo,
            subject: pSubject,
            text: pTextBody,
            html: pHTMLBody
        });
    }
}