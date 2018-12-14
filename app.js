const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose'),
      Home        = require('./models/home'),
      Comment     = require('./models/comment')
      seedDB      = require('./seeds')

mongoose.connect("mongodb://localhost:27017/homes", { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB()

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

app.get('/homes/:id/comments/new', (req, res) => {
  Home.findById(req.params.id, (err, foundHome) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', {home: foundHome});
    }
  })
});

app.post('/homes/:id/comments', (req, res) => {
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
