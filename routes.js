// Our middleware routing module to help organize things in a RESTful api fashion.
// Import required modules.
const express = require("express");

// Get express router.
const router = express.Router();

//-----ROUTES-----//
// Route: /index
require("./controllers/index")(router);

// Route: /accounts
require("./controllers/accounts")(router);

// Sub-route: auth (authentication)
// Route: /auth/login
require("./controllers/auth/login")(router);

// Route: /auth/logout
require("./controllers/auth/logout")(router);

// Route: /auth/register
require("./controllers/auth/register")(router);

// Route: /auth/verifyEmail
require("./controllers/auth/verifyEmail")(router);

// Route: /auth/recoverPassword
require("./controllers/auth/recoverPassword")(router);
//--END OF ROUTES--//

// Export the module.
module.exports = router;