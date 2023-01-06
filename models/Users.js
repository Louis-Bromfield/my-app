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
    pID: {
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
        default: ["Fantasy Forecast All-Time", "2022 Georgia Senate Runoff Election"]
    },
    onboarding: {
        type: Object,
        default: {
            visitProfilePage: false,
            // joinAMarket: false,
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
        default: "https://lh3.googleusercontent.com/a/AItbvmkRUSgd_Izrhz4X-ft3do7Li1X0OsBPAzgh9r4G=s96-c"
    },
    articleVisits: {
        type: Number,
        default: 0
    },
    authRT: {
        type: String
    },
    // pwdResetCode: {
    //     type: String
    // },
    email: {
        type: String
    },
    completedSurvey: {
        type: Boolean
    },
    notifications: {
        type: Array
    },
    trophies: {
        type: Array,
        default: [
            {
                trophyText: "Ready To Go",
                obtained: false,
                trophyModalText: "This trophy is earned by completing all of the tasks in the onboarding list, which can be found on the home page. By doing so, you'll be given access to the Stats section of your profile to help you view your own performance."
            },
            {
                trophyText: "Seer",
                obtained: false,
                trophyModalText: "This trophy is earned by reaching Level 15, or 1500 Fantasy Forecast Points. You will be given a Level-exclusive profile border (bronze) to let other forecasters know of your rank, and you'll be given the ability to use Forecast Chats (which can be found at the bottom of the My Forecasts page when you have selected a problem from the dropdown list)."
            },
            {
                trophyText: "Soothsayer",
                obtained: false,
                trophyModalText: "Reach Level 20 (2000 Fantasy Forecast Points). You'll receive a new Level-exclusive profile border (silver) to show off to other forecasters, and the ability to rate posts on your Feed as truthful and/or relevant."
            },
            {
                trophyText: "Oracle",
                obtained: false,
                trophyModalText: "Reach Level 25 (2500 Fantasy Forecast Points). You'll receive a new Level-exclusive profile border (gold) to show off."
            },
            {
                trophyText: "Diviner",
                obtained: false,
                trophyModalText: "Reach Level 50 (5000 Fantasy Forecast Points), you'll receive a new Level-exclusive profiler border (platinum) to display."
            },
            {
                trophyText: "First Time Around",
                obtained: false,
                trophyModalText: "Submit your first forecast."
            },
            {
                trophyText: "Gather Round!",
                obtained: false,
                trophyModalText: "Receive a positive truthful or relevant rating on one of your feed posts."
            },
            {
                trophyText: "Here, have a cookie.",
                obtained: false,
                trophyModalText: "Award another forecaster a positive truthful or relevant rating on one of their feed posts."
            },
            {
                trophyText: "The Gold Standard",
                obtained: false,
                trophyModalText: "Score 100 or more points on a forecast."
            },
            {
                trophyText: "The Triple Gold Standard",
                obtained: false,
                trophyModalText: "Score 100 or more points on three consecutive forecasts."
            },
            {
                trophyText: "Quick off the Mark",
                obtained: false,
                trophyModalText: "Submit a prediction within 24 hours of a forecast opening."
            },
            {
                trophyText: "Perfection",
                obtained: false,
                trophyModalText: "Score full marks on a quiz in the Learn section."
            }
        ]
    },
    ratings: {
        type: Number,
        default: 0
    },
    inTeam: {
        type: Boolean,
        default: false
    },
    teamName: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Users", UserSchema);