// Import required modules.
const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Load ssl configuration file.
const sslConfiguration = fs.existsSync("configuration/sslConfiguration.json") ? JSON.parse(fs.readFileSync("configuration/sslConfiguration.json")) : undefined;
const USE_SSL = sslConfiguration && sslConfiguration.Key && sslConfiguration.Certificate && fs.existsSync(sslConfiguration.Key) && fs.existsSync(sslConfiguration.Certificate);

// Load server configuration file.
fs.readFile("core/cfg/configuration.json", (pError, pData) => {
   if (!pError) {
      let configuration = JSON.parse(pData);

      // Import custom modules.
      const database = require("./core/modules/database");
      const errorCodes = require(path.resolve("core/modules/errorCodes"));

      // Create the express app.
      var app = express();

      // Connect to the MySQL database and sync all models.
      database.connect();
      database.getSequelize().sync()
      .then(() => { console.log("MySQL: Models synced wih database!"); })
      .catch(() => { console.log("MySQL: Failed to sync models with MySQL database!"); });

      // Tell the app to always redirect to https when using SSL.
      if (USE_SSL && sslConfiguration.ForceHTTPS && parseInt(sslConfiguration.ForceHTTPS, 10) != 0) {
         app.use((pRequest, pResponse, pNext) => {
            if (!pRequest.secure && pRequest.get("x-forwarded-proto") !== "https") {
               return pResponse.redirect("https://" + pRequest.get("host") + pRequest.url);
            }

            pNext();
         });
         console.log("\nNOTICE: Force-https is enabled.\n");
      }

      // Tell the app which directories to treat as static asset directories.
      app.use(express.static("public"));

      // Tell the app to use body parser.
      app.use(bodyParser.urlencoded({ extended: true }));

      // Tell the app to use cookie parser.
      app.use(cookieParser(configuration.Cookies.Secret));

      // Tell the app to use the router.
      app.use(require("./routes"));

      //-----ERROR ROUTING------//
      // WARNING: This MUST remain at the bottom of this file. (At the bottom of the expressJS middleware stack.)
      app.use((pError, pRequest, pResponse, pNext) => {
         let statusCode = pError.statusCode;
         if (!statusCode) statusCode = errorCodes.UNKNOWN;
         let filePath = path.resolve("views/error/error_" + statusCode + ".html");
         fs.access(filePath, fs.F_OK, (pError) => {
            if (!pError) {
               // Error page found.
               pResponse.sendFile(filePath);
            }
            else { 
               // Error page not found.
               console.log("WARNING : No error page for error code: " + statusCode + ".");
               pResponse.send("Error code " + statusCode);
            }
         });
      });
      //--END OF ERROR ROUTING--//

      // Load SSL options.
      var server = undefined;
      if (USE_SSL) {
         // Create https server.
         server = https.createServer(
            {
               key:  fs.readFileSync(path.resolve(sslConfiguration.Key)),
               cert: fs.readFileSync(path.resolve(sslConfiguration.Certificate)),
               passphrase: sslConfiguration.Passphrase ? sslConfiguration.Passphrase : undefined
            }, 
            app
         ).listen(parseInt(configuration.Port, 10), () => {
            console.log("Listening @ http://%s:%s...\n", server.address().address, server.address().port);
         });
      }
      else { 
         // Create http server.
         server = app.listen(parseInt(configuration.Port, 10), function() {
            console.log("Listening @ http://%s:%s...\n", server.address().address, server.address().port);
         });
         console.log("WARNING : Server running without valid SSL cerificate. No SSL cerificate was loaded\n"); 
      }
   }
   else { console.log("FATAL ERROR : Failed to load server configuration file \"core/cfg/configuration.json\"."); }
});
