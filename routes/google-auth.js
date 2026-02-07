const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const express = require("express");
const crypto = require("crypto");
const googleAuth = require("../controllers/google-authController");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  CLIENT_URL,
  BASE_URL,
} = require("../config/serverConfig");
const { generateAccessToken, generateRefreshToken } = require("../config/authToken");

let userProfile;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

// request at /auth/google, when user click sign-up with google button transferring
// the request to google server, to show emails screen
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// URL Must be same as 'Authorized redirect URIs' field of OAuth client, i.e: /auth/google/callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/error",
    session: false,
  }),
  (req, res) => {
    res.redirect("/api/auth/google/success"); // Successful authentication, redirect success.
  }
);
router.get("/success", asyncHandler(async (req, res) => {
  const user = await googleAuth.registerWithGoogle(userProfile);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
    domain: ".vercel.app", // remove if not using subdomain
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    //domain: ".vercel.app",
  });

  // CSRF token (readable by frontend)
  res.cookie("csrf_token", crypto.randomUUID(), {
    secure: true,
    sameSite: "None",
    domain: ".vercel.app",
  });

  res.redirect(CLIENT_URL);
}));

router.get("/error", (req, res) => res.send("Error logging in via Google.."));

router.get("/logout", async (req, res) => {
  // req.logout();
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.clearCookie("csrf_token");
  res.redirect(BASE_URL);
});

module.exports = router;
