// Import required modules.
const fs = require("fs");
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

let configuration = undefined;
// Load server configuration file.
fs.readFile("core/cfg/configuration.json", (pError, pData) => {
   if (!pError) {
      configuration = JSON.parse(pData);

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

      // Create the server listener.
      var server = app.listen(parseInt(configuration.Port, 10), function() {
         console.log("Listening @ http://%s:%s...", server.address().address, server.address().port);
      });
   }
   else { console.log("FATAL ERROR : Failed to load server configuration file \"core/cfg/configuration.json\"."); }
});
