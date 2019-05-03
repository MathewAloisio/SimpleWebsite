// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /accounts/
    // GET - /accounts/:accountID
    pRouter.get("/accounts/:accountID", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID != undefined) {
        // Update viewingAccountID cookie before sending the HTML.
        pResponse.cookie("viewingAccountID", pRequest.param.accountID, { signed: true });
        pResponse.sendFile(path.resolve("views/accountOverview.html"));
        }
        else { pResponse.redirect("/auth/login"); } // Redirect users to the login page if they aren't signed in as signed-out users may not view accounts.
    });
    
    // POST - /accounts/:accountID
    pRouter.post("/accounts/:accountID", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID == undefined || pRequest.signedCookies.viewingAccountID == undefined) return; // Skip this post request if the user is not logged in, or not viewing an account page.
        //TODO: 
    });
}