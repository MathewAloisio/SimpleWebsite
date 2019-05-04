module.exports = function(pRouter) {
    // Route: /auth/logout
    // GET - "/auth/logout"
    pRouter.get("/auth/logout", (pRequest, pResponse) => {
        // Clear account ID cookie on logout, redirect user to login page.
        pResponse.clearCookie("viewingAccountID", { signed: true });
        pResponse.clearCookie("accountID", { signed: true });
        pResponse.clearCookie("email", { signed: true });
        pResponse.clearCookie("emailConfirmed", { signed: true });
        pResponse.redirect("/auth/login");
    });
}