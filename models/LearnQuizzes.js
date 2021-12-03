const mongoose = require('mongoose');

const LearnQuizzesSchema = mongoose.Schema({
    username: {
        type: String
    },
    brierComplete: {
        type: Boolean,
        default: false
    },
    gjpComplete: {
        type: Boolean,
        default: false
    },
    superforecastersComplete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("LearnQuizzes", LearnQuizzesSchema);