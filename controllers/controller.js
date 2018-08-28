/* Imports */ 
var axios = require('axios'); 
var cheerio = require('cheerio'); 
var mongoose = require('mongoose'); 
var db = require("../models"); 

/* Mongoose Configuration */ 
mongoose.Promise = Promise; 
mongoose.connect("https://sleepy-brushlands-46780.herokuapp.com/", { // Connect to the Mongo DB
});



var mongooseConnection = mongoose.connection;

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', function() {
  console.log(`Working with Mongo DB!!!!`); 
});

/* Exports */
module.exports = (app) => {

 /* Get Requests */ 

  // Default Route
  app.get("/", (req, res) => res.render("index"));

  // Scrape Articles Route
  app.get("/api/search", (req, res) => {

    axios.get("https://www.npr.org/sections/news/").then(response => {
      // console.log("Load Response");
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      var handlebarsObject = {
        data: []
      }; 

      $("article").each((i, element) => { 
        var lowResImageLink = $(element).children('.item-image').children('.imagewrap').children('a').children('img').attr('src');

        if (lowResImageLink) {

          var imageLength = lowResImageLink.length;
          var highResImage = lowResImageLink.substr(0, imageLength - 11) + "800-c100.jpg";

          handlebarsObject.data.push({ 
            headline: $(element).children('.item-info').children('.title').children('a').text(),
            summary: $(element).children('.item-info').children('.teaser').children('a').text(),
            url: $(element).children('.item-info').children('.title').children('a').attr('href'),
            imageURL: highResImage,
            slug: $(element).children('.item-info').children('.slug-wrap').children('.slug').children('a').text(),
            comments: null
          }); 
        } 
      }); 

      // Return Scrapped Data to Handlebars for Rendering
      res.render("index", handlebarsObject);
    });
  });

  // Saved Article Route
  app.get("/api/savedArticles", (req, res) => {
    db.Articles.find({}).
    then(function(dbArticle) {
      res.json(dbArticle);
    }).catch(function(err) {
      res.json(err);
    });
  });

 /* Post Requests */ 
  app.post("/api/add", (req, res) => { 

    var articleObject = req.body;

    db.Articles.
    findOne({url: articleObject.url}). 
    then(function(response) {

      if (response === null) { 
        db.Articles.create(articleObject).then((response) => console.log(" ")).catch(err => res.json(err));
      } 
      res.send("Article Saved");
    }).catch(function(err) {
      res.json(err);
    });

  }); 
  
  // End Post Route

  // Delete Article Route
  app.post("/api/deleteArticle", (req, res) => {
    sessionArticle = req.body;

    db.Articles.findByIdAndRemove(sessionArticle["_id"]). 
    then(response => {
      if (response) {
        res.send("Sucessfully Deleted");
      }
    });
  });

  app.post("/api/deleteComment", (req, res) => {
    var comment = req.body;
    db.Notes.findByIdAndRemove(comment["_id"]). 
    then(response => {
      if (response) {
        res.send("Sucessfully Deleted");
      }
    });
  }); 
  // End deleteArticle Route

  // Create Notes Route
  app.post("/api/createNotes", (req, res) => {

    sessionArticle = req.body;

    db.Notes.create(sessionArticle.body).then(function(dbNote) {
      return db.Articles.findOneAndUpdate({
        _id: sessionArticle.articleID.articleID
      }, {
        $push: {
          note: dbNote._id
        }
      });
    }).then(function(dbArticle) {
      res.json(dbArticle);
    }).catch(function(err) {
      res.json(err);
    });
  });
  app.post("/api/populateNote", function(req, res) {

    db.Articles.findOne({_id: req.body.articleID}).populate("Note").
    then((response) => {

      if (response.note.length == 1) {

        db.Notes.findOne({'_id': response.note}).then((comment) => {
          comment = [comment];
          console.log("Sending Back One Comment");
          res.json(comment); // Send Comment back to the Client
        });

      } else {

        console.log("2")
        db.Notes.find({
          '_id': {
            "$in": response.note
          }
        }).then((comments) => {
          res.json(comments);
        });
      }
    }).catch(function(err) {
      res.json(err);
    });
  }); // End of Post Populate Note

} // End of Module Export