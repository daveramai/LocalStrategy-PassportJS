function protectedRoute(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

//used to set the nav-header isLoggedIn ejs variable
function GlobalResAuthenticateChecker(req, res, next) {
  res.locals.authenticated = req.isAuthenticated();
  next();
}

module.exports = {
  protectedRoute,
  GlobalResAuthenticateChecker,
};
