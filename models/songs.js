var mongoose = require("mongoose");

var Songs = new mongoose.Schema({
    songId: {
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
    songJSONString: {
        type: String,
        default: ""
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Songs', Songs)