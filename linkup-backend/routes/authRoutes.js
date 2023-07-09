const express = require("express");
const router = express.Router();

module.exports = (authController) => {
  router.post('/signup', authController.signup);
  router.post('/googleLogin', authController.googleLogin);
  router.post('/login', authController.login);
  router.post('/forget', authController.forget)
  router.post('/change_password/:id', authController.change_password)



  return router;
};
 