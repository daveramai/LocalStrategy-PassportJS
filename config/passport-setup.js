const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user");
const pwdHelper = require("./password-helper");

passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false, { message: "No user with that username" });
        }

        // Function defined at bottom of app.js
        const isValid = pwdHelper.validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false, { message: "Password is incorrect" });
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

//saved user.id to the session document on mongodb
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

//fetch the user object from the mongodb using the user.id stored in the session (during serializeUser)
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user); //user object attaches to the request as req.user
  });
});
