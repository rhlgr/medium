const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
const userModel = new mongoose.Schema({
    avatar: {
        type: String,
        default: "dummy.png"
    },
    name: String,
    username: String,
    email: String,
    about: String,
    password: String,

    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
    resetPasswordToken:0,
})

userModel.plugin(plm, { usernameField: "email" });

const User = mongoose.model("user", userModel);
module.exports = User;