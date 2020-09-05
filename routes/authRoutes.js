const router = require("express").Router();
const passport = require("passport");
const User = require("../model/user");
const pwdhelper = require("../config/password-helper");
const authHelper = require("../config/auth-helper");
/**
 * -------------- ROUTES ----------------
 */

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("./auth/show-login.ejs");
  }
});

// Since we are using the passport.authenticate() method, we should be redirected no matter what
const redirection = {
  failureRedirect: "login",
  successRedirect: "/",
  failureFlash: true,
};
router.post(
  "/login",
  passport.authenticate("local", redirection),
  (err, req, res, next) => {
    if (err) next(err);
  }
);

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("./auth/show-register.ejs", {
      message: "",
      user: new User(),
    });
  }
});

router.post("/register", async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    const saltHash = pwdhelper.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      hash: hash,
      salt: salt,
    });
    try {
      const newUser = await user.save();
      res.status(201).render("index", {
        message: "User registration successful",
      });
    } catch (err) {
      console.log(err);
      if (err.name === "MongoError" && err.code === 11000) {
        // Duplicate username
        return res.status(422).render("./auth/show-register.ejs", {
          success: false,
          message: "Username already exist!",
          user: user,
        });
      }
      res.status(422).redirect("register");
    }
  }
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.redirect("/");
});

module.exports = router;
