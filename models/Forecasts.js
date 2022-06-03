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
    potentialOutcomes: {
        type: Array,
    },
    isClosed: {
        type: Boolean,
    },
    happened: {
        type: Boolean,
        default: false
    },
    singleCertainty: {
        type: Boolean
    },
    outcome: {
        type: String
    }
});

module.exports = mongoose.model("Forecasts", ForecastsSchema);