const mongoose = require("../../db/connection");
const Schema = mongoose.Schema;

const User = new Schema({
    insta_user_id: Number,
    user_name: String,
    account_type: String,
    short_token: String,
    long_token: String,
    long_type: String,
    long_expires_in: Number
});



module.exports = mongoose.model("UserModel", User);
