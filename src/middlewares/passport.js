const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/User");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET || "123",
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({
          where: {
            id: payload.userId,
          },
        });
        console.log("payload", payload);
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
