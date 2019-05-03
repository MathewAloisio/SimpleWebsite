// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /accounts/recover
    // GET - "/recover"
    pRouter.get("/recover", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID == undefined) {
			// User isn't logged in, send them the recover password page.
			pResponse.sendFile(path.resolve("views/recover.html"));
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
    });
    
    // POST - "/recover"
    pRouter.post("/recover", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
        if (pRequestBody.body.usernameEntry) {
        //TODO lookup username in database, send reset password email.
        }
    });
}