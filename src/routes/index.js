const AuthController = require("../controllers/AuthController");
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

module.exports = function route(app) {
  //   app.get("/home", passport.authenticate("jwt"), AuthController.home);
  app.post("/login", AuthController.login);
  app.get("/home", AuthController.home);
  app.post("/register", AuthController.register);
  app.post("/api/refreshToken", AuthController.refreshToken);
};
