// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /verifyEmail
    // GET - "/verifyEmail"
    pRouter.get("/verifyEmail", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID == undefined) {
			// User isn't logged in, send them the recover password page.
			pResponse.sendFile(path.resolve("views/verifyEmail.html"));
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
    });
    
    // POST - "/verifyEmail"
    pRouter.post("/verifyEmail", (pRequest, pResponse) => {
        
    });
}