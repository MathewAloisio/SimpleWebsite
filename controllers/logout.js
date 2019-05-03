module.exports = function(pRouter) {
    // Route: /logout
    // GET - "/logout"
    pRouter.get("/logout", (pRequest, pResponse) => {
        // Clear account ID cookie on logout, redirect user to login page.
        pResponse.clearCookie("viewingAccountID");
        pResponse.clearCookie("accountID");
        pResponse.redirect("/login");
    });
}