const mongoose    = require('mongoose');

let homeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
})

module.exports = mongoose.model('Home', homeSchema);
