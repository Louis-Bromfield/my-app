const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
    reportType: {
        type: String
    },
    reportComments: {
        type: String
    },
    reportDate: {
        type: String
    },
    reportComments: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);