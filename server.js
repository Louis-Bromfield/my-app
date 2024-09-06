require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 8000;
const path = require("path");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
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
        default: ["Fantasy Forecast All-Time", "UK Local Elections 2023"]
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
        default: ""
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
        type: String,
        default: "NO EMAIL ADDRESS"
    },
    completedSurvey: {
        type: Boolean,
        default: false
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
                trophyModalText: "This trophy is earned by reaching Level 15, or 1500 Fantasy Forecast Points. You will be given a Level-exclusive profile border (bronze) to let other forecasters know of your rank, and you'll be given the ability to use Forecast Chats (which can be found at the bottom of the Forecasts page when you have selected a problem from the dropdown list.)."
            },
            {
                trophyText: "Soothsayer",
                obtained: false,
                trophyModalText: "Reach Level 20 (2000 Fantasy Forecast Points). You'll receive a new Level-exclusive profile border (silver) to show off to other forecasters, and the ability to rate posts on your Feed as truthful and/or relevant."
            },
            {
                trophyText: "Oracle",
                obtained: false,
                trophyModalText: "Reach Level 25 (2500 Fantasy Forecast Points). You'll receive a new Level-exclusive profile border (gold) to show off. "
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
    },
    isTeam: {
        type: Boolean,
        default: false
    },
    members: {
        type: Array,
        default: []
    },
    numberOfAttemptedForecasts: {
        type: Number,
        default: 0
    }
});

const User = new mongoose.model("User", UserSchema);

// Routes
const homePageNewsFeedRoutes = require('./routes/homePageNewsFeedPosts');
app.use('/homePageNewsFeedPosts', homePageNewsFeedRoutes);

const helperRoutes = require('./routes/helpers');
app.use('/helpers', helperRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const googleNewsRoute = require('./routes/googleNewsScraper');
app.use('/googleNewsScraper', googleNewsRoute);

const learnRoutes = require('./routes/learnQuizzes');
app.use('/learnQuizzes', learnRoutes);

const leaderboardRoutes = require('./routes/leaderboards');
app.use('/leaderboards', leaderboardRoutes);

const forecastsRoutes = require('./routes/forecasts');
app.use('/forecasts', forecastsRoutes);

// const submitFeedbackRoutes = require("./routes/helpers");
const Users = require('./models/Users');
const req = require('express/lib/request');
// app.use("/submitFeedback", submitFeedbackRoutes);

app.use(express.static(path.join(__dirname, "client", "build")))

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Database connectivity
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://fantasyForecastAdmin:7yZsA4MfWK9ulpYP@fantasyforecastcluster1.pzp29.mongodb.net/", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://fantasyForecastAdmin:7yZsA4MfWK9ulpYP@fantasyforecastcluster1.pzp29.mongodb.net/Fantasy_Forecast?authSource=admin&replicaSet=atlas-sudpl6-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Successfully connected to the Database"));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Get one user for logging in
app.get("/:username/:passwordOrResetCode/:isPassword", cors(), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            res.json({ loginSuccess: false, message: "This user does not exist in the database"});
        };
        if (user.isTeam === true) {
            res.json({ loginSuccess: false, message: "This is a team account. Please login to your individual account."});
        }
        let match;
        if (req.params.isPassword === "true") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.password);
        } else if (req.params.isPassword === "false") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.pwdResetCode);
        }
        if (match) {
            res.json(user);
        } else {
            res.json({ loginSuccess: false, message: "Password/reset code does not match that stored in the database"});
        };
    } catch (error) {
        console.error("Error in router.get/username/password in server.js");
        console.error(error);
    };
});

app.get("/logout", function(req, res) {
    res.redirect("https://fantasy-forecast-politics.herokuapp.com");
});

app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

// Port listening
app.listen(port, () => console.log(`listening on port ${port}`));