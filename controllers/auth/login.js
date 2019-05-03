// Import required module(s).
const path = require("path");
const bcrypt = require("bcrypt");

const errorCodes = require(path.resolve("core/modules/errorCodes"));
const Account = require(path.resolve("models/account"));

module.exports = function(pRouter) {
   // Route: /auth/login
   // GET - "/auth/login"
   pRouter.get("/auth/login", (pRequest, pResponse) => {
      if (pRequest.signedCookies.accountID == undefined) {
         // User isn't logged in, send them the login page.
         pResponse.sendFile(path.resolve("views/auth/login.html"));
      }
      else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
   });
   
   // POST - "/auth/login"
   pRouter.post("/auth/login", function(pRequest, pResponse) {
      if (pRequest.signedCookies.accountID != undefined) { pResponse.send(errorCodes.UNAUTHORIZED); return; } // Skip this post request if the user is logged in!
      // Lookup user by username.
      if (pRequest.body.usernameEntry && pRequest.body.passwordEntry) {
         Account.findOne({ attributes: ["id", "password"], where: { username: pRequest.body.usernameEntry } })
         .then((pUser) => {
            if (pUser) {
               bcrypt.compare(pRequest.body.passwordEntry, pUser.password)
               .then((pMatch) => {
                  if (pMatch) {
                     // Login successful! 
                     // Set the account's lastlogin date to now.
                     pUser.update({ date_lastlogin: new Date() });
   
                     // Set the user's accountID cookie to the corresponding account ID and send a successful login response.
                     pResponse.cookie("accountID", pUser.id, { signed: true });
                     pResponse.send({ success: true });
                  }
                  else { pResponse.send({ success: false });  }
               })
               .catch(() => { pResponse.send({ success: false }); })
            }
            else { pResponse.send({ success: false }); }
         })
         .catch(() => { pResponse.send({ success: false }); });
      }
   });
}
