const express = require('express');
const router = express.Router()
const Home = require('../models/home');

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

router.get('/', (req, res) => {
  Home.find({}, (err, allHomes) => {
    if (err) {
      console.log(err)
    } else {
      res.render('homes/home', {homes: allHomes});
    }
  })
});

router.post('/', isLoggedIn, (req, res) => {
  let name = req.body.name
  let image = req.body.image
  let description = req.body.description
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newHome = {name: name, image: image, description: description, author: author}
  Home.create(newHome, (err, newlyCreatedHome) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/homes');
    }
  })
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('homes/new');
});

router.get('/:id', (req, res) => {
  Home.findById(req.params.id).populate('comments').exec((err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      console.log(foundHome)
      res.render('homes/show', {home: foundHome});
    }
  })
});

module.exports = router;
