# MongoScraper - The Verge edition

## Description
This app is an web scraper that scrapes [The Verge](https://www.theverge.com/) for new articles from their home page. The result of the scrape is displayed on this site in a concise, easy to read headline format. Each article can be saved for later so a new scrape will not delete the saved articles. Each saved article also has a comment section that the user can add custom comments to or delete the comments. Keep up with the latest tech news even when you have limited time - or save the articles you're interested in for later reading...
[Mongo Scrape - the Verge](https://protected-wildwood-32999.herokuapp.com/)

![screenshot](https://github.com/JHaarla/MongoScraper/blob/master/public/assets/img/scrnsht2.PNG "screenshot of app in action")

## Under the Hood
There are a few key npm packages at work behind the scenes in this full-stack app. The Node.js backend handles the routing and web server functions while Cheerio takes care of the actual scraping of the site. Once Cheerio receives the HTML data from the site to be scraped, we look for the elements that we want to display to the user. In this case, we're displaying the news article's title that has a link attached to it to get to the actual article from the Verge. We also append a button to each article title so it can be saved for later. 

We're using MongoDB for the database. Mongoose handles all the database reads & writes. Also, the comments are also stored in the MongoDB in a separate collection. Each comment gets tied to the parent article so all comments can be viewed for any particular article that has comments. The user also has the ability to delete comments individually. 

The user view is handled via Handlebars that renders a responsive Bootstrap layout. 

## Tech Used
* Node.js
* Express.js
* Cheerio
* Axios
* MongoDB / Mongoose
* Handlebars
* Bootstrap and custom CSS

Check out the live Heroku deployment:
[Mongo Scraper](https://protected-wildwood-32999.herokuapp.com/)

___
All code written by Jarkko Haarla 
