var mongoose = require("mongoose");
var bcrypt = require("bcrypt")

var UserSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: -1
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        default: "null---"
    },
    usernameRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('UserSession', UserSessionSchema)