const {verifySignUp} = require('../middlewares/index');
const authController = require('../controllers/auth.controller');

module.exports = app => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  let router = require('express').Router();
  router.post('/signup', 
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    authController.signup
  );
  router.post('/signin', authController.signin);

  app.use('/api/auth', router);
};