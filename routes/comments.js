const express = require('express');
const router = express.Router({mergeParams: true})
const Home = require('../models/home');
const Comment = require('../models/comment');
const middleware = require('../middleware')

// COMMENTS ROUTES

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {home: foundHome});
    }
  })
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, home) => {
    if (err) {
      res.redirect('/homes');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong")
        } else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          home.comments.push(comment)
          home.save()
          req.flash("success", "Added comment successfully")
          res.redirect('/homes/' + home._id);
        }
      })
    }
  })
})

// comment edit
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
    if (err || !foundHome) {
      req.flash("error", "Home not found")
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {home_id: req.params.id, comment: comment});
      }
    })
  })
});

router.put('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/homes/' + req.params.id);
    }
  })
})

// comment DELETE
router.delete('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash("success", "Comment deleted")
      res.redirect('/homes/' + req.params.id);
    }
  })
})

module.exports = router;
