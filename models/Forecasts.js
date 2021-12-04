const mongoose = require('mongoose');

// Just user submission, add the commented out one for when I add a new forecast to DB through an app
const ForecastsSchema = mongoose.Schema({
    problemName: {
        type: String,
    },
    startDate: {
        type: String,
    },
    closeDate: {
        type: String,
    },
    market: {
        type: String,
    },
    submittedForecasts: {
        type: Array,
    },
    forecasts: [{
        certainty: {
            type: Number,
            required: true
        },
        comments: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    }],
    isClosed: {
        type: Boolean,
    },
    happened: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Forecasts", ForecastsSchema);