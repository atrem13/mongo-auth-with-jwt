const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to mongodb
const db = require('./models/index');
const dbConfig = require('./config/db.config');
const Role = db.role;

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{
      useNewUrlParser: true,
      useUnifiedTopology: true
  }).then(() => {
    console.log('connected to mongodb');
    initial();
  }).catch((err) => {
    console.error('connect error', err);
    process.exit();
  });

function initial(){
  Role.estimatedDocumentCount((err, count) => {
    if(!err && count === 0){
      new Role({
        name: 'user'
      }).save((err) => {
        if(err){
          console.log('error ', err);
        }else{
          console.log('added user to roles collection');
        }
      });

      new Role({
        name: 'moderator'
      }).save((err) => {
        if(err){
          console.log('error ', err);
        }else{
          console.log('added moderator to roles collection');
        }
      });

      new Role({
        name: 'admin'
      }).save((err) => {
        if(err){
          console.log('error ', err);
        }else{
          console.log('added admin to roles collection');
        }
      });

    }

  });
}

// import routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

module.exports = app;
