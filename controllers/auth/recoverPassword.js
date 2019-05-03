// Import required module(s).
const path = require('path');

const errorCodes = require(path.resolve("core/modules/errorCodes"));

module.exports = function(pRouter) {
    // Route: /auth/recoverPassword
    // GET - "/auth/recoverPassword"
    pRouter.get("/auth/recoverPassword", (pRequest, pResponse) => {
        if (!pRequest.signedCookies.accountID) {
			// User isn't logged in, send them the recover password page.
			pResponse.sendFile(path.resolve("views/auth/recoverPassword.html"));
        }
        else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
    });
    
    // POST - "/auth/recoverPassword"
	pRouter.post("/auth/recoverPassword", (pRequest, pResponse) => {
        if (pRequest.signedCookies.accountID != undefined) { pResponse.send(errorCodes.UNAUTHORIZED); return; } // Skip this post request if the user is logged in!
        if (pRequestBody.body.usernameEntry) {
            Account.findOne({ attributes: ["email"], where: { username: pRequest.body.usernameEntry } })
            .then((pUser) => {
                if (pUser) {
                    // User found, send password reset email.
                    //TODO

                    pResponse.send({ result: "sent" });
                }
                else { pResponse.send({ result: "nouser" }); }
            })
            .catch(() => { pResponse.send({ result: "dberror" }); });
        }
    });
}