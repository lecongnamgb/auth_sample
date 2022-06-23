const { hash, compare } = require("../common/hash");
const { generateToken } = require("../common/jwtHelper");
const User = require("../models/User");
const { AccessToken } = require("../models/accessToken");
const { RefreshToken } = require("../models/refreshToken");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "abcjwt";
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "900s";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshjwt11";
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || "30d";

class auth {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        where: { username: username },
      });
      if (!user) {
        res.json({ success: false });
        return;
      }
      const resultPw = await compare(password, user.dataValues.password);
      if (!resultPw) {
        res.json({ success: false });
        return;
      }
      await AccessToken.destroy({
        where: {
          userId: user.id,
        },
      });
      const payload = { username: username };
      const accessToken = await generateToken(
        payload,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );

      await AccessToken.create({
        userId: user.dataValues.id,
        accessToken: accessToken,
      });

      let refreshToken = await RefreshToken.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!refreshToken) {
        refreshToken = await generateToken(
          payload,
          REFRESH_TOKEN_SECRET,
          REFRESH_TOKEN_LIFE
        );
        await RefreshToken.create({
          userId: user.dataValues.id,
          refreshToken: refreshToken,
        });
      }
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.json({ success: true, accessToken: accessToken });
    } catch (err) {
      res.status(400).json({ success: false, message: "ERROR" });
      console.log(err);
      return;
    }
  }

  async home(req, res) {
    const a = 10;
    res.cookie("a", a);
    res.cookie("abc", "123", { httpOnly: true });
    res.json("home");
  }

  async register(req, res) {
    const { username, password } = req.body;
    const hashpw = await hash(password);
    const user = await User.create({ username: username, password: hashpw });

    res.json("Create user successfully");
  }

  async refreshToken(req, res) {
    try {
      console.log("cookies: ");
      console.log(req.cookies);
      const authorHeader = req.headers?.authorization;
      if (!authorHeader) {
        res.json({ success: false, message: "missing access token in header" });
        return;
      }
      const accessToken = authorHeader.split(" ")?.[1];
      if (!accessToken) {
        res.json({ success: false, message: "missing access token in header" });
        return;
      }
      const decoded = await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        {
          ignoreExpiration: true,
        }
      );
      if (!decoded) {
        res.json({ success: false, message: "Invalid token" });
      }
      await AccessToken.destroy({
        where: {
          accessToken: accessToken,
        },
      });
      const payload = { username: decoded.username };
      const newAccessToken = await generateToken(
        payload,
        accessToken,
        process.env.ACCESS_TOKEN_LIFE
      );
      res.json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      res.status(400).json({ success: false, message: "Invalid Token" });
      return;
    }
  }
}

module.exports = new auth();
