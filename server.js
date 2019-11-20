const mongoose = require("mongoose");
const logger = require("morgan");
//express server setup/init
const express = require("express");
const app = express();
const PORT = 5000;

//scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// require all models
const db = require("./models");

// use morgan logger for logging requests
app.use(logger("dev"));

// connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoScraper", { useNewUrlParser: true });

//ROUTES
//===============
// GET route to scrape the site
app.get("/scrape", function (req, res) {
    //grabs the HTML from the specified site
    axios.get("https://www.nytimes.com/").then(function (siteHTML) {
        // load the siteHTML into cheerio, set $ as shorthand for ease of use    
        const $ = cheerio.load(siteHTML.data);

        $("article a").each(function (i, element) {
            const article = {};

            article.title = $(this)
                .children("div").children("h2")
                // .children("span.balancedHeadline")
                .text();
            article.link = $(this)
                // .children("a")
                .attr("href");

            //create new article from scraped data with the article object
            db.Article.create(article)
            .then(function (DBArticle) {
                console.log(DBArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.send("scrape completed successfully") //will send a different view via handlebars for succesful scrape
    })
})












//start express server
app.listen(PORT, function () {
    console.log("Listening on: http://localhost:" + PORT)
})
