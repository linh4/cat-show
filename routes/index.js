const express = require('express');
const router = express.Router()
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('homepage');
});

// AUTH ROUTES

router.get('/register', (req, res) => {
  res.render('register', {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/homes");
        });
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/homes',
  failureRedirect: '/login'
}), (req, res) => {
});

router.get('/login', (req, res) => {
  res.render('login', {message: req.flash("error"), page: 'login'});
});

router.get('/logout', (req, res) => {
  req.logout()
  req.flash("success", "LOGGED YOU OUT!")
  res.redirect('/homes');
});


module.exports = router;
