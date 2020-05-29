const db = require('../models/index');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    username: req.body.username
  }).then((data) => {
    if(data){
      return res.status(400).json({
        status: 'error',
        message: 'username already use by someone'
      });
    }else{
      User.findOne({
        email: req.body.email
      }).then((data) => {
        if(data){
          return res.status(400).json({
            message: 'email already use by someone'
          });
        }else{
          next()
        }
      }).catch((err) => {
        return res.status(500).json({
          message: err.message
        });
      });
    }
  }).catch((err) => {
    return res.status(500).json({
      message: err.message
    });
  });
};

checkRolesExisted = (req, res, next) => {
  let user_roles = req.body.roles;
  if(user_roles){
    for(let i = 0; i < user_roles.length; i++){
      if(!ROLES.includes(user_roles[i])){
        return res.status(400).json({
          message: `failed! roles ${user_roles[i]} doesnt exist`
        });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;