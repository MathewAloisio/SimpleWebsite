module.exports = function(pRouter) {
   // Route: /index
   // GET - "/"
   pRouter.get("/", (pRequest, pResponse) => {
      // Go to the login page if the user isn't logged in, otherwise their user page.
      if (pRequest.signedCookies.accountID == undefined) {
         pResponse.redirect("/login");
      }
      else { pResponse.redirect("/accounts/" + pRequest.signedCookies.accountID); } // User is logged in, go to logged-in account page.
   });
}