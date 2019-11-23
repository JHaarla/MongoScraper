const mongoose = require("mongoose");
const logger = require("morgan");
const exphbs = require("express-handlebars");
//express server setup/init
const express = require("express");
const app = express();
const PORT = 5000;

//set public folder as public root
app.use(express.static("public"));

//scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// require all models
const db = require("./models");

// use morgan logger for logging requests
app.use(logger("dev"));

// connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoScraper", { useNewUrlParser: true });

//handlebars setup
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//ROUTES
//===============
app.get("/", function (err, result) {
    db.Article.find({})
    .then(function (DBArticle) {
        result.render("index", { articles: DBArticle});
    }).catch(function (err) {
        result.json(err);
    });
});

// GET route to scrape the site and write to the database
app.get("/scrape", function (req, res) {
    //grabs the HTML from the specified site


    axios.get("https://www.theverge.com/").then(function (siteHTML) {
        // load the siteHTML into cheerio, set $ as shorthand for ease of use    
        const $ = cheerio.load(siteHTML.data);

        $(".c-entry-box--compact__title").each(function (i, element) {
            const article = {};

            article.title = $(this)
                .children("a")
                // .children("span.balancedHeadline")
                .text();
            article.link = $(this)
                .children("a")
                .attr("href");
            // article.summary = $(this)
            // .children("p").text();

            //create new article from scraped data with the article object
            // db.Article.remove({})
            db.Article.create(article)
            .then(function (DBArticle) {
                console.log(DBArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.redirect("/");
    })







    // axios.get("https://www.nytimes.com/").then(function (siteHTML) {
    //     // load the siteHTML into cheerio, set $ as shorthand for ease of use    
    //     const $ = cheerio.load(siteHTML.data);

    //     $("article a").each(function (i, element) {
    //         const article = {};

    //         article.title = $(this)
    //             .children("div").children("h2")
    //             // .children("span.balancedHeadline")
    //             .text();
    //         article.link = "https://www.nytimes.com" + $(this)
    //             // .children("a")
    //             .attr("href");
    //         article.summary = $(this)
    //         .children("p").text();

    //         //create new article from scraped data with the article object
    //         db.Article.remove({})
    //         db.Article.create(article)
    //         .then(function (DBArticle) {
    //             console.log(DBArticle);
    //         }).catch(function (err) {
    //             console.log(err);
    //         });
    //     });
    //     res.redirect("/");
    // })
})

// GET route to retrieve articles from the database 
app.get("/articles", function (req, res) {

    db.Article.find({})
    .then(function(DBArticles) {
        res.json(DBArticles);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// catch-all route for anything not defined above
// app.get("*", function (req, res) {
//     res.render("404");
// });

app.get("/clear-all", function (req, res) {
    db.Article.remove({}, function(err, doc){
        if (err) {
            console.log(err);
        } else {
            console.log("removed all articles");
        }
    });
    res.redirect("/");
});








//start express server
app.listen(PORT, function () {
    console.log("Listening on: http://localhost:" + PORT)
})
