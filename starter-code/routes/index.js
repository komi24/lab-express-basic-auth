const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET signup page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* POST signup page */
router.post('/signup', (req, res, next) => {
  const salt  = bcrypt.genSaltSync(saltRounds);
  const hash1 = bcrypt.hashSync(req.body.password, salt);
  let user = new User({
    username: req.body.username, 
    password: hash1
  })
  // let {username, password} = req.body
  // let username = req.body.username
  // let password = req.body.password
  user.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err=>{
    next(err);
  })
});

/* POST login page */
router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});


module.exports = router;
