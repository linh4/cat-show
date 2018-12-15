const express = require('express');
const router = express.Router({mergeParams: true})
const Home = require('../models/home');
const Comment = require('../models/comment');

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

// COMMENTS ROUTES

router.get('/new', isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {home: foundHome});
    }
  })
});

router.post('/', isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, home) => {
    if (err) {
      console.log(err)
      res.redirect('/homes');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          home.comments.push(comment)
          home.save()
          res.redirect('/homes/' + home._id);
        }
      })
    }
  })
})

module.exports = router;
