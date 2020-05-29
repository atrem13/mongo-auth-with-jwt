const config = require('../config/auth.config');
const db = require('../models/index');
const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save(user).then((data) => {
    if(data){
      let roles = req.body.roles;
      if(roles){
        Role.find(
          {
            name: {$in: roles}
          }
        ).then((data2) => {
          data.roles = data2.map(role => role._id);
          data.save().then((data3) => {
            return res.json({
              status: 'ok',
              message: 'register success',
              data: data3
            });
          }).catch((err) => {
            return res.status(500).json({
              status: 'error',
              message: err.message || 'register failed',
            });
          });
        }).catch((err) => {
          return res.status(500).json({
            status: 'error',
            message: err.message || 'register failed',
          });
        })
      }else{
        Role.findOne(
          {
            name: 'user'
          }
        ).then((data2) => {
          data.roles = [data2._id];
          data.save().then((data3) => {
            return res.json({
              status: 'ok',
              message: 'register success',
              data: data3
            });
          }).catch((err) => {
              return res.status(500).json({
                status: 'error',
                message: err.message || 'register failed',
              });
          });
        }).catch((err) => {
            return res.status(500).json({
              status: 'error',
              message: err.message || 'register failed',
            });
        });
      }
    }else{
      return res.status(500).json({
        status: 'error',
        message: err.message || 'register failed',
      });
    }
  }).catch((err) => {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'register failed',
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  }).populate("roles", "-__v").then((data) => {
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      data.password
    );

    if(!passwordIsValid){
      return res.status(401).json({
        message: 'invalid password'
      });
    }
    let token = jwt.sign({id: data._id}, config.secret, {
      expiresIn: 86400
    });

    let authorities = [];
    for(let i = 0; i < data.roles.length; i++){
      console.log(data);
      authorities.push('ROLE_' + data.roles[i].name.toUpperCase());
    }
    return res.json({
      id: data._id,
      username: data.username,
      email: data.email,
      roles: authorities,
      accessToken: token 
    });
  }).catch((err) => {
    return res.status(500).json({
      message: err.message || 'login failed'
    });
  });
};