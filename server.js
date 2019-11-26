const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const logger = require("morgan");
const exphbs = require("express-handlebars");
//express server setup/init
const express = require("express");
const app = express();
const PORT = 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
mongoose.connect("mongodb://localhost/MongoScraper", { useNewUrlParser: true, useUnifiedTopology: true });

//handlebars setup
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//ROUTES
//===============
app.get("/", function (err, result) {

    db.Article.find({"saved": false})
        .then(function (DBArticle) {
            console.log(DBArticle.length);
            // console.log(DBArticle);
            if (DBArticle.length !== 0) {
                result.render("index", { articles: DBArticle });
            } else {
                result.render("noarticles");
            }
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

        // $(".c-entry-box--compact__title").each(function (i, element) {
        //     const article = {};

        //     article.title = $(this)
        //         .children("a")
        //         .text();
        //     article.link = $(this)
        //         .children("a")
        //         .attr("href");


        $(".c-compact-river__entry").each(function (i, element) {
            const article = {};

            article.title = $(this)
                .children("div.c-entry-box--compact")
                .children("div.c-entry-box--compact__body")
                .children("h2.c-entry-box--compact__title")
                .children("a")
                .text();
            article.link = $(this)
                .children("div.c-entry-box--compact")
                .children("a")
                .attr("href");
            // article.image = $(this)
            //     .children("div.c-entry-box--compact")
            //     .children("a")
            //     .children("div.c-entry-box--compact__image")
            //     .children("img")
            //     .attr("src");
            //     console.log("article image",article.image);


            //create new article from scraped data with the article object
            db.Article.create(article)
                .then(function (DBArticle) {
                    // console.log(DBArticle);
                }).catch(function (err) {
                    console.log(err);
                });
        });
        res.redirect("/");
    })
})

// GET route to retrieve articles from the database 
app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (DBArticles) {
            res.json(DBArticles);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// catch-all route for anything not defined above
// app.get("*", function (req, res) {
//     res.render("404");
// });

app.get("/clear-everything", function (req, res) {
    db.Article.remove({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed all articles");
        }
    });
    db.Comment.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all comments");
        }
    })
    res.redirect("/");
});

app.get("/clear-all", function (req, res) {
    db.Article.deleteMany({"saved": false}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed all except for saved articles");
        }
    });
    res.redirect("/");
})

app.post("/saved/:id", function (req, res) {
    db.Article.updateOne( { _id: req.params.id }, { saved: true })
    .then(function(DBArticle) {
        console.log(DBArticle);
        // res.json(DBArticle);
    });
})

app.get("/saved", function (req, res){
    db.Article.find({"saved": true})
    .then(function(DBArt){
        if (DBArt.length !== 0) {
            res.render("saved", { articles: DBArt});
        } else {
            res.render("nosavedarts");
        }
    }).catch(function(err) {
        res.json(err);
    })
})


app.post("/deleteone/:id", function (req, res) {
    db.Article.deleteOne( { _id: req.params.id }, function (err, doc) {
        if (err) {
            console.log(err);
        } else{
            console.log("Deleted saved article");
        }
    });
    // location.reload();
    });

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (DBArt) {
        res.json(DBArt);
        // console.log( "wha: " + DBArt);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/arts/:id", function (req, res) {
    const comment = req.body;

    console.log("Comment: " + JSON.stringify(comment));
    // console.log("test: " + req);
    db.Comment.create(comment)
    .then(function (DBCom) {
        console.log(DBCom);
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: DBCom._id } }, { new: true });
        // return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: DBCom._id }, { new: true });
    })
    .then(function (dbArticle) {
        console.log(dbArticle);
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
});

//comments route here
app.get("/comments/:id", function (req, res) {
    db.Comment.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//delete comment route
app.post("/delete-comment/:id", function (req, res) {
    console.log(req.params.id);
    db.Comment.deleteOne({_id: req.params.id})
    .then(function (dbArts) {
        res.render("saved",{
            articles: dbArts
        })
    });
})

//start express server
app.listen(PORT, function () {
    console.log("Listening on: http://localhost:" + PORT)
})
