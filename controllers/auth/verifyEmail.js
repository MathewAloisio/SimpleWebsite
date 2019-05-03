// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /auth/verifyEmail
    // GET - "/auth/verifyEmail"
    pRouter.get("/auth/verifyEmail", (pRequest, pResponse) => {
        if (pRequest.signedCookies.emailConfirmed) {
            if (pRequest.signedCookies.accountID != undefined) {
                // User is logged in, send them the verify email page.
                pResponse.sendFile(path.resolve("views/auth/verifyEmail.html"));
            }
            else { pResponse.redirect("/auth/login"); } // User isn't logged in, go to the log-in page.
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // Users email is already confirmed, take them to their account page.
    });
    
    // POST - "/auth/verifyEmail"
    pRouter.post("/auth/verifyEmail", (pRequest, pResponse) => {
        //TODO Re-send verification email button.
    });
}