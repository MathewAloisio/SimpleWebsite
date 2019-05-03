// Import required modules.
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const database = require("./core/modules/database");

// Load configuration file.
const configuration = JSON.parse(fs.readFileSync("core/cfg/configuration.json"));

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

// Create the server listener.
var server = app.listen(parseInt(configuration.Port, 10), function() {
   console.log("Listening @ http://%s:%s...", server.address().address, server.address().port);
});
