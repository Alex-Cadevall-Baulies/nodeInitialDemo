const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username: String,
    nickname: String,
    password: String,
});

module.exports = mongoose.model("User", user)