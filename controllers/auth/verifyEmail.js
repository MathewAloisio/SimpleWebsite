// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /auth/verifyEmail
    // GET - "/auth/verifyEmail"
    pRouter.get("/auth/verifyEmail", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID == undefined) {
			// User isn't logged in, send them the recover password page.
			pResponse.sendFile(path.resolve("views/auth/verifyEmail.html"));
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
    });
    
    // POST - "/auth/verifyEmail"
    pRouter.post("/auth/verifyEmail", (pRequest, pResponse) => {
        
    });
}