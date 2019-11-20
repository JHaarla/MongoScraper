const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("morgan");
//express server setup/init
const express = require("express");
const app = express();
const PORT = 5000;







//start express server
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT)
})
