const mongoose = require('mongoose');

// const OnboardingSchema = mongoose.Schema({
//     visitProfilePage: {
//         type: Boolean,
//         default: false
//     },
//     joinAMarket: {
//         type: Boolean,
//         default: false
//     },
//     submitAPost: {
//         type: Boolean,
//         default: false
//     },
//     submitAForecast: {
//         type: Boolean,
//         default: false
//     },
//     completeALearnQuiz: {
//         type: Boolean,
//         default: false
//     },
// });

// Non-OAuth Schema
// const UserSchema = mongoose.Schema({
//     username: {
//         type: String
//     },
//     password: {
//         type: String
//     },
//     email: {
//         type: String
//     },
//     fantasyForecastPoints: {
//         type: Number,
//         default: 0
//     },
//     isGroup: {
//         type: Boolean
//     },
//     markets: {
//         type: Array,
//         default: []
//     },
//     name: {
//         type: String
//     },
//     onboarding: {
//         type: OnboardingSchema,
//     },
//     brierScores: {
//         type: Array,
//         default: []
//     },
//     numberOfClosedForecasts: {
//         type: Number,
//         default: 0
//     },
//     profilePicture: {
//         type: String,
//         default: ""
//     },
//     articleVisits: {
//         type: Number,
//         default: 0
//     }
// });

// OAuth Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
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
        default: ["Fantasy Forecast All-Time", "UK Politics Practice Tournament", "UK Politics Forecasting Tournament"]
    },
    onboarding: {
        type: Object,
        default: {
            visitProfilePage: false,
            joinAMarket: false,
            submitAPost: false,
            submitAForecast: false,
            completeALearnQuiz: false
        }
    },
    learnQuizzes: {
        type: Object,
        default: {
            brierComplete: false,
            gjpComplete: false,
            superforecastersComplete: false
        }
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
    },
    authRT: {
        type: String
    },
    pwdResetCode: {
        type: String
    },
    email: {
        type: String
    },
    completedSurvey: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Users", UserSchema);