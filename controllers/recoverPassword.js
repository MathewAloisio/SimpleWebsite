// Import required module(s).
const path = require('path');

module.exports = function(pRouter) {
    // Route: /recoverPassword
    // GET - "/recoverPassword"
    pRouter.get("/recoverPassword", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID == undefined) {
			// User isn't logged in, send them the recover password page.
			pResponse.sendFile(path.resolve("views/recoverPassword.html"));
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
    });
    
    // POST - "/recoverPassword"
    pRouter.post("/recoverPassword", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
        if (pRequestBody.body.usernameEntry) {
            Account.findOne({ attributes: ["email"], where: { username: pRequest.body.usernameEntry } })
            .then((pUser) => {
                if (pUser) {
                    // User found, send password reset email.
                    //TODO

                    pResponse.send({ success: true });
                }
                else { pResponse.send({ success: false }); }
            })
            .catch(() => { pResponse.send({ success: false }); });
        }
    });
}