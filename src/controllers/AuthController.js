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
      let refreshToken = "";
      const payload = { username: username, userId: user.id };
      const dataRefreshToken = await RefreshToken.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!dataRefreshToken) {
        refreshToken = await generateToken(
          payload,
          REFRESH_TOKEN_SECRET,
          REFRESH_TOKEN_LIFE
        );
        await RefreshToken.create({
          userId: user.dataValues.id,
          refreshToken: refreshToken,
        });
      } else {
        refreshToken = dataRefreshToken.dataValues.refreshToken;
      }
      console.log(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 60 * 60 * 1000,
        secure: false,
      });
      res.json({ success: true, uid: user.id });
    } catch (err) {
      res.status(400).json({ success: false, message: "ERROR" });
      console.log(err);
      return;
    }
  }

  async home(req, res) {
    const a = 10;
    res.cookie("a123", a);
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
      console.log("refresh endpoint");
      // console.log("cookies: ", req.cookies);
      const REFRESH_TOKEN = req.cookies.refreshToken;
      console.log(REFRESH_TOKEN);
      const decoded = await jwt.verify(
        REFRESH_TOKEN || "",
        REFRESH_TOKEN_SECRET
      );
      if (!decoded) {
        res.status(400).json({ success: false, message: "Invalid token" });
        return;
      }
      const payload = { username: decoded.username, userId: decoded.userId };
      const newAccessToken = await generateToken(
        payload,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );
      await AccessToken.destroy({
        where: {
          userId: decoded.userId,
        },
      });
      await AccessToken.create({ accessToken: newAccessToken });
      res.json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: "Invalid Token" });
      return;
    }
  }
}

module.exports = new auth();
