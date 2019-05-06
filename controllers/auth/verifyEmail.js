// Import required module(s).
const fs = require("fs");
const path = require('path');

const mailer = require(path.resolve("core/modules/mailer"));
const errorCodes = require(path.resolve("core/modules/errorCodes"));

const Account = require(path.resolve("models/account"));
const EmailVerification = require(path.resolve("models/emailVerification"));

// Load configuration file.
const accountConfiguration = JSON.parse(fs.readFileSync(path.resolve("configuration/accountConfiguration.json")));

async function sendVerificationEmail(pSendTo, pHash, pHost) {
    mailer.sendTo(
        accountConfiguration.Email.VerificationEmail.Sender,  // From
        pSendTo,                                              // To
        accountConfiguration.Email.VerificationEmail.Subject, // Subject
        "Activation code: " + pHash + "\nClick the following link to verify your account:\nhttps://" + pHost + "/auth/verifyEmail?hash=" + pHash + "\n Alternatively, you may login to your account and enter the activation code to verify your email address.",               // Text
        "<h2>Activation code: " + pHash + "</h2><br><a href=\"https://" + pHost + "/auth/verifyEmail?hash=" + pHash + "\">Click this link to verify your account.\n Alternatively, you may login to your account and enter the activation code to verify your email address."   // HTML
    )
    .catch((pError) => { console.log("ERROR : Failed to send verification email. (Error: \"" + pError + "\""); });
}

module.exports = {
    sendVerificationEmail: sendVerificationEmail,
    initialize: (pRouter) => {
        // Route: /auth/verifyEmail
        // GET - "/auth/verifyEmail"
        pRouter.get("/auth/verifyEmail", (pRequest, pResponse) => {
            if (pRequest.signedCookies.accountID) {
                if (pRequest.query.resend) {
                    EmailVerification.findOne({ attributes: ["accountID", "hash"], where: { accountID: pRequest.signedCookies.accountID } })
                    .then((pEmailVerification) => {
                        if (pEmailVerification) {
                            // Use requested the email be re-sent.
                            // Update the requested email if need-be.
                            let accountID = parseInt(pRequest.signedCookies.accountID, 10);
                            if (pRequest.signedCookies.email != pRequest.query.resend) {
                                Account.update({ email: pRequest.query.resend, email_confirmed: false }, { where: { id: accountID } });

                                // Update email cookies.
                                pResponse.cookie("email", pRequest.query.resend, { signed: true });
                                pResponse.cookie("emailConfirmed", false, { signed: true });
                            }

                            // Re-send user activation email.
                            sendVerificationEmail(pRequest.query.resend, pEmailVerification.hash, pRequest.get("host"));

                            // Redirect the user to the verification page.
                            pResponse.redirect("/auth/verifyEmail");
                        }
                        else { console.log("ERROR : Attempting to resend verification email to user #" + pRequest.signedCookies.accountID + " but no emailverification object was found!"); }
                    });
                }
                else if (pRequest.query.hash) {
                    // User is attempting to verify.
                    EmailVerification.findOne({ attributes: ["accountID"], where: { hash: pRequest.query.hash } })
                    .then((pEmailVerification) => {
                        if (pEmailVerification) {
                            // Update user email_confirmed field, if valid user.
                            Account.findOne({ attributes: ["id"], where: { id: pEmailVerification.accountID } })
                            .then((pUser) => {
                                if (pUser) {
                                    pUser.update({ emailed_confirmed: true });
                                    pResponse.sendFile(path.resolve("views/auth/emailVerified.html"));
                                }
                                else { pUser.sendStatus(errorCodes.NOT_FOUND); }

                                // Remove EmailVerification from database.
                                pEmailVerification.destroy();
                            });
                        }
                        else if (pRequest.signedCookies.accountID && pRequest.signedCookies.emailConfirmed != "true") {
                            pResponse.redirect("/auth/verifyEmail");
                        }
                        else { pResponse.sendStatus(errorCodes.NOT_FOUND); }
                    });
                }
                else {
                    // Send user the email verification page.
                    if (pRequest.signedCookies.emailConfirmed != "true") {
                        // Send user to the verify email page.
                        pResponse.sendFile(path.resolve("views/auth/verifyEmail.html"));
                    }
                    else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // Users email is already confirmed, take them to their account page.
                }
            }
            else { pResponse.sendStatus(errorCodes.UNAUTHORIZED); }
        });
    
        // POST - "/auth/verifyEmail"
        pRouter.post("/auth/verifyEmail", (pRequest, pResponse) => {
            //TODO Re-send verification email button.
        });
    }
}