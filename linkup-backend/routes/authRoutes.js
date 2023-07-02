const express = require("express");
const router = express.Router();

module.exports = (authController) => {
  router.post('/signup', authController.signup);
  router.post('/googleLogin', authController.googleLogin);
  router.post('/login', authController.login);

  return router;
};
