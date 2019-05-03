// Our middleware routing module to help organize things in a RESTful api fashion.
// Import required modules.
const express = require("express");

// Get express router.
const router = express.Router();

//-----ROUTES-----//
// Route: /index
require("./controllers/index")(router);

// Route: /login
require("./controllers/login")(router);

// Route: /logout
require("./controllers/logout")(router);

// Route: /register
require("./controllers/register")(router);

// Route: /accounts
require("./controllers/accounts")(router);

// Route: /verifyEmail
require("./controllers/verifyEmail")(router);

// Route: /recoverPassword
require("./controllers/recoverPassword")(router);
//--END OF ROUTES--//

// Export the module.
module.exports = router;