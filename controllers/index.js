module.exports = function(pRouter) {
   // Route: /index
   // GET - "/"
   pRouter.get("/", (pRequest, pResponse) => {
      // Go to the login page.
      pResponse.redirect("/auth/login");
   });
}