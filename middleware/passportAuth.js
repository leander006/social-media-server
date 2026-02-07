const JWT = require("passport-jwt");
const User = require("../model/User");
const { ACCESS_TOKEN_SECRET } = require("../config/serverConfig");

const JwtStrategy = JWT.Strategy;

/**
 * Custom extractor to read JWT from cookies
 */
const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.access_token;
  }

  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: ACCESS_TOKEN_SECRET,
};

const passportAuth = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).select("-password");

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

module.exports = { passportAuth };
