/* Imports */ 
var mongoose = require('mongoose');

/* Initialize */ 
var Schema = mongoose.Schema; // Save a Reference to the Schema Constructor

/* Model*/ 

var ArticleSchema = new Schema({ 

  headline: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  imageURL: {
    type: String,
    required: true
  },

  slug: {
    type: String
  },


  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

}); // End of New Schema

/* Export */ 


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article; 
