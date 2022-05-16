const mongoose = require('mongoose');

const OnboardingSchema = mongoose.Schema({
    visitProfilePage: {
        type: Boolean,
        default: false
    },
    joinAMarket: {
        type: Boolean,
        default: false
    },
    submitAPost: {
        type: Boolean,
        default: false
    },
    submitAForecast: {
        type: Boolean,
        default: false
    },
    completeALearnQuiz: {
        type: Boolean,
        default: false
    },
});

const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    fantasyForecastPoints: {
        type: Number,
        default: 0
    },
    isGroup: {
        type: Boolean
    },
    markets: {
        type: Array,
        default: []
    },
    name: {
        type: String
    },
    onboarding: {
        type: OnboardingSchema,
    },
    brierScores: {
        type: Array,
        default: []
    },
    numberOfClosedForecasts: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: ""
    },
    articleVisits: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Users", UserSchema);