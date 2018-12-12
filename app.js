const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose');

mongoose.connect("mongodb://localhost:27017/cats", { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

let catSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})

let Cat = mongoose.model("Cat", catSchema)

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/cats', (req, res) => {
  Cat.find({}, (err, allCats) => {
    if (err) {
      console.log(err)
    } else {
      res.render('cats', {cats: allCats});
    }
  })
});

app.post('/cats', (req, res) => {
  let name = req.body.name
  let image = req.body.image
  let description = req.body.description
  let newCat = {name: name, image: image, description: description}
  Cat.create(newCat, (err, newlyCreatedCat) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/cats');
    }
  })
});

app.get('/cats/new', (req, res) => {
  res.render('new');
});

app.get('/cats/:id', (req, res) => {
  Cat.findById(req.params.id, (err, foundCat) => {
    if (err) {
      console.log(err)
    } else {
      res.render('show', {cat: foundCat});
    }
  })
});

app.listen('3000', () => {
  console.log('server starting...')
});
