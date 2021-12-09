const mongoose = require('mongoose');

const OnboardingSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        default: false
    },
    visitProfilePage: {
        type: Boolean,
        required: true,
        default: false
    },
    joinAMarket: {
        type: Boolean,
        required: true,
        default: false
    },
    submitAPost: {
        type: Boolean,
        required: true,
        default: false
    },
    submitAForecast: {
        type: Boolean,
        required: true,
        default: false
    },
    completeALearnQuiz: {
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = mongoose.model("Onboarding", OnboardingSchema);