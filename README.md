# ScrapingBy

Scraping By is mada as aapplication that will allow users to rettrive articles from NPR.com. The users then can view and/or leave comments on the articles they chose to save. 

Technologies
Nodejs
CSS 
Express
Javascript 
MongoDB 
Materialize	Cheerio 
Handlebars 

Usage
Click on the "Scrape" Add Icon at the Upper Right Hand Corner to Scrape News Articles from NPR News.

Click on Add Symbol on the Individual Articles to Store the Article in MongoDB.

Click on "Saved Articles" to bring up a List of Saved Articles.

Click on the Article to Bring Up a Pop up Modal for Viewing and Submitting Comments Pertaining to the Article.

Click on the "Trash" Icon / Delete to Delete the Article / Comment.

Requirements
Web Browser
Nodejs
Mongo DB
Installation



To be able to run Scraping by locally, make sure that MongoDB is Running.

Proceed to controller/controller.js and Update the Following Code
mongoose.connect("Your DB Connection Goes Here", { // Connect to the Mongo DB
  useMongoClient: true
});
