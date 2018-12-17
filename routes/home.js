const express = require('express');
const router = express.Router()
const Home = require('../models/home');
const middleware = require('../middleware')

router.get('/', (req, res) => {
  Home.find({}, (err, allHomes) => {
    if (err) {
      console.log(err)
    } else {
      res.render('homes/home', {homes: allHomes, page: 'homes'});
    }
  })
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  let name = req.body.name
  let price = req.body.price
  let image = req.body.image
  let description = req.body.description
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newHome = {name: name, price: price, image: image, description: description, author: author}
  Home.create(newHome, (err, newlyCreatedHome) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/homes');
    }
  })
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('homes/new');
});

router.get('/:id', (req, res) => {
  Home.findById(req.params.id).populate('comments').exec((err, foundHome) => {
    if (err || !foundHome) {
      req.flash("error", "Home not found")
      return res.redirect('/homes');
    } else {
      res.render('homes/show', {home: foundHome});
    }
  })
});


// edit home
router.get('/:id/edit', middleware.checkOwnerShip, (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
      res.render('homes/edit', {home: foundHome});
  })
})

router.put('/:id', middleware.checkOwnerShip,(req, res) => {
  Home.findByIdAndUpdate(req.params.id, req.body.home, (err, updatedHome) => {
    if (err) {
      console.log(err)
      res.redirect('/homes');
    } else {
      res.redirect('/homes/' + req.params.id);
    }
  })
})

router.delete('/:id', middleware.checkOwnerShip,(req, res) => {
  Home.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/homes');
    } else {
      res.redirect('/homes');
    }
  })
})


module.exports = router;
