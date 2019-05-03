module.exports = function(pRouter) {
    // Route: /auth/logout
    // GET - "/auth/logout"
    pRouter.get("/auth/logout", (pRequest, pResponse) => {
        // Clear account ID cookie on logout, redirect user to login page.
        pResponse.clearCookie("viewingAccountID");
        pResponse.clearCookie("accountID");
        pResponse.redirect("/auth/login");
    });
}