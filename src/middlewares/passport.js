const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET || "123",
    },
    (payload, done) => {
      try {
        console.log("payload", payload);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
