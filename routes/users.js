const express = require('express');
const passport = require('passport');

const bodyParser = require('body-parser');
const User = require('../models/users');
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
    .then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.json({ 
                    "message": "Fetched all the users successfully!",
                    "users": users
                });
    }, (err) =>  next(err))
    .catch((err) => next(err));
});

// ======================={Sign Up}============================================

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, message: 'User has been registered successfully!'});
        });
      });
    }
  });
});

// ======================={Sign In}============================================

router.post('/signin', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, message: 'You are successfully logged in!'});
});


// ======================={Logout}============================================

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
