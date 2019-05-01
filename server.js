// Import required modules.
const fs = require("fs");
const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");

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

// Setup body-parser.
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

// Define the express application behaviour.
// GET - "/"
app.get("/", (pRequest, pResponse) => {
   pResponse.redirect("/login");
});

// GET - "/login"
app.get("/login", (pRequest, pResponse) => {
   pResponse.sendFile("views/login.html", { root: __dirname });
});

// POST - "/login"
app.post("/login", bodyParserURLEncoded, function(pRequest, pResponse) {
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
               if (pError || !pMatch) {
                  pResponse.send({ success: false });
               }
               else { pResponse.send({ success: true }); }
            });
         }
         else { pResponse.send({ success: false }); }
      })
      .catch(() => { pResponse.send({ success: false }); });
   }
});

// GET - "/register"
app.get("/register", (pRequest, pResponse) => {
   pResponse.sendFile("views/register.html", { root: __dirname });
});

// POST - "/register"
app.post("/register", bodyParserURLEncoded, (pRequest, pResponse) => {
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
   pResponse.sendFile("views/recover.html", { root: __dirname });
});

// POST - "/recover"
app.post("/recover", (pRequest, pResponse) => {
   if (pRequestBody.body.usernameEntry) {
      //TODO lookup username in database, send reset password email.
   }
});

// Create the server listener.
var server = app.listen(parseInt(configuration.Port, 10), function() {
   console.log("Listening @ http://%s:%s...", server.address().address, server.address().port);
});
