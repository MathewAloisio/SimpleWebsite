// Import required module(s).
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const murmurHash = require('murmurhash-native').murmurHash

const randomString = require(path.resolve("core/modules/random")).randomString;
const errorCodes = require(path.resolve("core/modules/errorCodes"));
const Account = require(path.resolve("models/account"));
const EmailVerification = require(path.resolve("models/emailVerification"));

// Load account configuration file.
let accountConfiguration = undefined;
fs.readFile("configuration/accountConfiguration.json", (pError, pData) => {
   if (!pError) {
      accountConfiguration = JSON.parse(pData);
   }
   else { console.log("WARNING : Failed to load account configuration file \"configuration/accountConfiguration.json\"."); }
});

module.exports = function(pRouter) {
   // Route: /auth/register
   // GET - "/auth/register"
   pRouter.get("/auth/register", (pRequest, pResponse) => {
      if (!pRequest.signedCookies.accountID) {
         // User isn't logged in, send them the register page.
         pResponse.sendFile(path.resolve("views/auth/register.html"));
      }
      else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
   });

   // POST - "/auth/register"
   pRouter.post("/auth/register", (pRequest, pResponse) => {
      if (pRequest.signedCookies.accountID != undefined) { pResponse.send(errorCodes.UNAUTHORIZED); return; } // Skip this post request if the user is logged in!
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
                        date_registered: new Date()
                     })
                     .then((pUser) => {
                        // Generate verification entry.
                        EmailVerification.create({
                           accountID: pUser.id,
                           hash: murmurHash(randomString(12)),
                           date_expires: new Date(new Date().setDate(new Date().getDate() + (accountConfiguration ? parseInt(accountConfiguration.Email.VerificationTimeoutDays, 10) : 30)))
                        })
                        .then(() => {
                           // Send verification email.
                           //TODO
                        });

                        // Registration succeded.
                        pResponse.send({ result: "success" });
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