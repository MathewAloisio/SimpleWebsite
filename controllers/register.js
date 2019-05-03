// Import required module(s).
const path = require("path");
const bcrypt = require("bcrypt");

const database = require(path.resolve("core/modules/database"));
const Account = require(path.resolve("models/account"));

module.exports = function(pRouter) {
   // Route: /register
   // GET - "/register"
   pRouter.get("/register", (pRequest, pResponse) => {
      if (pRequest.signedCookies.accountID == undefined) {
         // User isn't logged in, send them the register page.
         pResponse.sendFile(path.resolve("views/register.html"));
      }
      else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
   });

   // POST - "/register"
   pRouter.post("/register", (pRequest, pResponse) => {
      if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
      if (pRequest.body.usernameEntry && pRequest.body.passwordEntry && pRequest.body.emailEntry) {
         // Check if the username is in use.
         Account.findOne({ where: { username: pRequest.body.usernameEntry } })
         .then((pUser) => {
            if (!pUser) {
               // Username NOT in use.
               // Generate a salt and password hash.
               bcrypt.hash(pRequest.body.passwordEntry, 12, (pError, pHash) => {
                  if (!pError) {
                     // Create the user's data model.
                     Account.create({
                        username: pRequest.body.usernameEntry,
                        password: pHash,
                        email: pRequest.body.emailEntry,
                        date_registered: new Date(),
                        date_lastlogin: null
                     })
                     .then(() => {
                        // Registration succeded.
                        pResponse.send({ result: "success" });
                     })
                     .catch(() => { 
                        // Registration failed.
                        pResponse.send({ result: "failed" });
                     })
                  }
                  else { logger.log("Failed to create account! Password hash failed."); }
               });
            }
            else { pResponse.send({ result: "nameinuse" }); } // Username already in use.
         });
      }
   });
}