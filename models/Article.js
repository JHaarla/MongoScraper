const mongoose = require("mongoose");

// schema constructor - mongoose thing
const Schema = mongoose.Schema;

// create new object via the above Schema constructor
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false,
        required: true
    },
    // image: {
    //     type: String,
    //     required: false
    // },
    // `comment` is an object that stores a Comment id
    // The ref property links the ObjectId to the Comment model
    // This allows us to populate the Article with an associated Comment
    comment: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
    ]
});

// Creates the Article model from the above schema using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

//Export the Article model to be used
module.exports = Article;