// Import required module(s).
const path = require("path");
const bcrypt = require("bcrypt");

const errorCodes = require(path.resolve("core/modules/errorCodes"));
const Account = require(path.resolve("models/account"));

module.exports = function(pRouter) {
   // Route: /auth/login
   // GET - "/auth/login"
   pRouter.get("/auth/login", (pRequest, pResponse) => {
      if (!pRequest.signedCookies.accountID) {
         // User isn't logged in, send them the login page.
         pResponse.sendFile(path.resolve("views/auth/login.html"));
      }
      else {
         // User is logged in, check if they need to be sent to their account page or the verifyEmail page.
         if (pRequest.signedCookies.emailConfirmed != "true") {
            pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID);
         }
         else { pResponse.redirect("/auth/verifyEmail"); }// The user hasn't verified their email, send them to the email verification page.
      }
   });
   
   // POST - "/auth/login"
   pRouter.post("/auth/login", function(pRequest, pResponse) {
      if (pRequest.signedCookies.accountID) { pResponse.sendStatus(errorCodes.UNAUTHORIZED); return; } // Skip this post request if the user is logged in!
      // Lookup user by username.
      if (pRequest.body.usernameEntry && pRequest.body.passwordEntry) {
         Account.findOne({ attributes: ["id", "password", "email", "email_confirmed"], where: { username: pRequest.body.usernameEntry } })
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
                     pResponse.cookie("email", pUser.email, { signed: true });
                     pResponse.cookie("emailConfirmed", pUser.email_confirmed, { signed: true });
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
