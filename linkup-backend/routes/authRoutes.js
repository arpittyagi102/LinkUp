const express = require("express");
const router = express.Router();

module.exports = (authController) => {
  router.post("/signup", authController.signup);
  router.post("/googleLogin", authController.googleLogin);
  router.post("/login", authController.login);
  router.post("/forgotPassword", authController.forgotPassword);
  router.put("/resetPassword", authController.resetPassword);

  return router;
};
