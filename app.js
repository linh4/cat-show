const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      Home          = require('./models/home'),
      Comment       = require('./models/comment'),
      User          = require('./models/user')
      seedDB        = require('./seeds')

mongoose.connect("mongodb://localhost:27017/homes", { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB()

// Passport configuration
app.use(require('express-session')({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// AUTH ROUTES
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/homes');
    })
  })
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/homes',
  failureRedirect: '/login'
}), (req, res) => {
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/homes');
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/homes', (req, res) => {
  Home.find({}, (err, allHomes) => {
    if (err) {
      console.log(err)
    } else {
      res.render('homes/home', {homes: allHomes});
    }
  })
});

app.post('/homes', (req, res) => {
  let name = req.body.name
  let image = req.body.image
  let description = req.body.description
  let newHome = {name: name, image: image, description: description}
  Home.create(newHome, (err, newlyCreatedHome) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/homes');
    }
  })
});

app.get('/homes/new', (req, res) => {
  res.render('homes/new');
});

app.get('/homes/:id', (req, res) => {
  Home.findById(req.params.id).populate('comments').exec((err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      console.log(foundHome)
      res.render('homes/show', {home: foundHome});
    }
  })
});

// COMMENTS ROUTES

app.get('/homes/:id/comments/new', isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {home: foundHome});
    }
  })
});

app.post('/homes/:id/comments', isLoggedIn, (req, res) => {
  Home.findById(req.params.id, (err, home) => {
    if (err) {
      console.log(err)
      res.redirect('/homes');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          home.comments.push(comment)
          home.save()
          res.redirect('/homes/' + home._id);
        }
      })
    }
  })
})

app.listen('3000', () => {
  console.log('server starting...')
});
