// Import required modules.
const fs = require("fs");
const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const database = require("./core/modules/database");
const Account = require("./models/account");
const Logger = require("./core/modules/logger");

// Load configuration file.
const configuration = JSON.parse(fs.readFileSync("core/cfg/configuration.json"));

// Create the servers logger.
const logger = new Logger("server");

// Create the express app.
var app = express();
database.connect();

// Tell the app which directories to treat as static asset directories.
app.use(express.static("public"));

// Tell the app to use cookie parser.
app.use(cookieParser(configuration.Cookies.Secret));

// Setup body-parser.
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

// Define the express application behaviour.
// GET - "/"
app.get("/", (pRequest, pResponse) => {
   // Go to the login page if the user isn't logged in, otherwise their user page.
   if (pRequest.signedCookies.accountID == undefined) {
      pResponse.redirect("/login");
   }
   else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
});

// GET - "/login"
app.get("/login", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID == undefined) {
      // User isn't logged in, send them the login page.
      pResponse.sendFile("views/login.html", { root: __dirname });
   }
   else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
});

// POST - "/login"
app.post("/login", bodyParserURLEncoded, function(pRequest, pResponse) {
   if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
   // Lookup user by username.
   if (pRequest.body.usernameEntry && pRequest.body.passwordEntry) {
      Account.findOne({
         where: {
            username: pRequest.body.usernameEntry
         }
      })
      .then((pUser) => {
         if (pUser) {
            bcrypt.compare(pRequest.body.passwordEntry, pUser.password, (pError, pMatch) => {
               if (!pError && pMatch) {
                  // Login successful! 
                  // Set the account's lastlogin date to now.
                  pUser.update({ date_lastlogin: new Date() });

                  // Set the user's accountID cookie to the corresponding account ID and send a successful login response.
                  pResponse.cookie("accountID", pUser.id, { signed: true });
                  pResponse.send({ success: true });
               }
               else { pResponse.send({ success: false });  }
            });
         }
         else { pResponse.send({ success: false }); }
      })
      .catch(() => { pResponse.send({ success: false }); });
   }
});

// GET - "/register"
app.get("/register", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID == undefined) {
      // User isn't logged in, send them the register page.
      pResponse.sendFile("views/register.html", { root: __dirname });
   }
   else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
});

// POST - "/register"
app.post("/register", bodyParserURLEncoded, (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
   if (pRequest.body.usernameEntry && pRequest.body.passwordEntry && pRequest.body.emailEntry) {
      // Check if the username is in use.
      Account.findOne({
         where: {
            username: pRequest.body.usernameEntry
         }
      })
      .then((pUser) => {
         if (!pUser) {
            // Username NOT in use.
            // Generate a salt and password hash.
            bcrypt.hash(pRequest.body.passwordEntry, 12, (pError, pHash) => {
               if (!pError) {
                  // Create the user's data model.
                  database.getSequelize().sync()
                  .then(() => {
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
                  })
                  .catch(() => { 
                     // Registration failed.
                     pResponse.send({ result: "syncfail" });
                  })
               }
               else { logger.log("Failed to create account! Password hash failed."); }
            });
         }
         else { pResponse.send({ result: "nameinuse" }); } // Username already in use.
      });
   }
});

// GET - "/recover"
app.get("/recover", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID == undefined) {
      // User isn't logged in, send them the recover password page.
      pResponse.sendFile("views/recover.html", { root: __dirname });
   }
   else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
});

// POST - "/recover"
app.post("/recover", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID != undefined) return; // Skip this post request if the user is logged in!
   if (pRequestBody.body.usernameEntry) {
      //TODO lookup username in database, send reset password email.
   }
});

// GET - "/logout"
app.get("/logout", (pRequest, pResponse) => {
   // Clear account ID cookie on logout, redirect user to login page.
   pResponse.clearCookie("viewingAccountID");
   pResponse.clearCookie("accountID");
   pResponse.redirect("/login");
});

// ExpressJS routing documentation - https://expressjs.com/en/guide/routing.html
// GET - /accounts/:accountID
app.get("/accounts/:accountID", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID != undefined) {
      // Update viewingAccountID cookie before sending the HTML.
      pResponse.cookie("viewingAccountID", pRequest.param.accountID, { signed: true });
      pResponse.sendFile("views/accountOverview.html", { root: __dirname });
   }
   else { pResponse.redirect("/login"); } // Redirect users to the login page if they aren't signed in as signed-out users may not view accounts.
});

// POST - /accounts/:accountID
app.post("/accounts/:accountID", (pRequest, pResponse) => {
   if (pRequest.signedCookies.accountID == undefined || pRequest.signedCookies.viewingAccountID == undefined) return; // Skip this post request if the user is not logged in, or not viewing an account page.
   //TODO: 
});


// Create the server listener.
var server = app.listen(parseInt(configuration.Port, 10), function() {
   console.log("Listening @ http://%s:%s...", server.address().address, server.address().port);
});
