const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models/index');
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if(!token) {
    return res.status(403).json({
      message: 'no token provided'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if(err){
      return res.status(401).json({
        message: 'unauthorized'
      });
    }
    req.userId = decoded.id;
    next();
  });
  
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).then((data) => {
    if(data){
      Role.find(
        {
          _id: {$in: data.roles}
        }
      ).then((data2) => {
        for(let i = 0; i < data2.length; i++){
          if(data2[i].name === 'admin'){
            next();
            return;
          }
        }
        return res.status(403).json({
          message: 'only for admin'
        });
      }).catch((err) => {
        return res.status(500).json({
          status: 'error',
          message: err.message
        });
      });
    }
  }).catch((err) => {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).then((data) => {
    if(data){
      Role.find(
        {
          _id: {$in: data.roles}
        }
      ).then((data2) => {
        for(let i = 0; i < data2.length; i++){
          if(data2[i].name === 'moderator'){
            next();
            return;
          }
        }
        return res.status(403).json({
          message: 'only for moderator'
        });
      }).catch((err) => {
        return res.status(500).json({
          status: 'error',
          message: err.message
        });
      });
    }
  }).catch((err) => {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

module.exports = authJwt;

