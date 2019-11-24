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
    // image: {
    //     type: String,
    //     required: false
    // },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Creates the Article model from the above schema using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

//Export the Article model to be used
module.exports = Article;