/**
 * -------------- Required modules ----------------
 */
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const MongoStore = require("connect-mongo")(session);
const authRoutes = require("./routes/authRoutes");
const authHelper = require("./config/auth-helper");
const expressLayouts = require("express-ejs-layouts");
const flash = require("express-flash");
require("dotenv").config();

/**
 * -------------- Create Express Application ----------------
 */

const app = express();

/**
 * -------------- DATABASE CONNECT----------------
 */

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

/**
 * -------------- Setup EJS Views and layout ----------------
 */

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(flash());
/**
 * -------------- SESSION SETUP ----------------
 */
/**
 * The MongoStore is used to store session data.
 *
 * Note that the `db` connection used for the MongoStore is the same connection above
 */
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: "sessions",
});

/**
 * -------------- BODY PARSE & JSON MIDDLEWARE----------------
 */

// Middleware that allows Express to parse through both JSON and x-www-form-urlencoded request bodies (same as body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION MIDDLEWARE ----------------
 */

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- Custom middleware ----------------
 */

app.use(authHelper.GlobalResAuthenticateChecker);

/**
 * -------------- ROUTES ----------------
 */

app.use(authRoutes);

app.get("/", (req, res, next) => {
  res.render("index", { message: "" });
});

app.get("/secret", authHelper.protectedRoute, (req, res, next) => {
  res.render("secret");
});

/**
 * -------------- Server Listening on Port ----------------
 */

app.listen(3000);

/**
 * -------------- END ----------------
 */
