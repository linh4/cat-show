const Home = require('../models/home')
const Comment = require('../models/comment')

const middlewareObj = {}

middlewareObj.checkOwnerShip = (req, res, next) => {
  if (req.isAuthenticated()) {
    Home.findById(req.params.id, (err, foundHome) => {
      if (err) {
        req.flash("error", "Home not found")
        res.redirect('back');
      } else {
        // does user own Home?
        if (foundHome.author.id.equals(req.user._id)) {
          next()
        } else {
          req.flash("error", "You don't have permission to do that")
          res.redirect('back');
        }
      }
    })
  } else {
    req.flash("error", "Please login first")
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnerShip = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own Home?
        if (foundComment.author.id.equals(req.user._id)) {
          next()
        } else {
          req.flash("error", "You don't have permission to do that")
          res.redirect('back');
        }
      }
    })
  } else {
    req.flash("error", "Please login first")
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash("error", "Please login first")
  res.redirect('/login');
}

module.exports = middlewareObj;
