const mongoose = require('mongoose');

// OAuth Schema
const SessionSchema = mongoose.Schema({
    sessionID: {
        type: String
    },
    expiration: {
        type: String
    },
    username: {
        type: String
    }
});

module.exports = mongoose.model("Sessions", SessionSchema);