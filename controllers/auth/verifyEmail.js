// Import required module(s).
const path = require('path');

const errorCodes = require(path.resolve("core/modules/errorCodes"));
const Account = require(path.resolve("models/account"));
const EmailVerification = require(path.resolve("models/emailVerification"));

module.exports = function(pRouter) {
    // Route: /auth/verifyEmail
    // GET - "/auth/verifyEmail"
    pRouter.get("/auth/verifyEmail", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID) {
            if (pRequest.query.resend) {
                // Use requested the email be re-sent.
                // Update the requested email if need-be.
                let accountID = parseInt(pRequest.signedCookies.accountID, 10);
                Account.update({ email: pRequest.query.resend, email_confirmed: false }, { where: { id: accountID } });

                // Update email cookies.
                pResponse.cookie("email", pRequest.query.resend, { signed: true });
                pResponse.cookie("emailConfirmed", false, { signed: true });

                //TODO Re-send user email.
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