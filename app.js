const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      methodOverride = require('method-override'),
      flash         = require('connect-flash'),
      Home          = require('./models/home'),
      Comment       = require('./models/comment'),
      User          = require('./models/user')
      // seedDB        = require('./seeds')

const indexRoutes   = require('./routes/index'),
      homeRoutes    = require('./routes/home'),
      commentRoutes = require('./routes/comments')

mongoose.connect("mongodb://localhost:27017/homes", { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB()

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
});


app.use('/', indexRoutes);
app.use('/homes', homeRoutes);
app.use('/homes/:id/comments', commentRoutes);


app.listen('3000', () => {
  console.log('server starting...')
});
