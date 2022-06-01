// Imports
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require("path");

// OAuth
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

let usernameFromClient = "_TEMP_USERNAME";
let prolificIDFromClient = "_TEMP_PROLIFIC_ID_UNIMPORTED";

// Middleware
app.use(express.json());
app.use(cors());

// OAuth
app.use(session({
    secret: "Our little secrety.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
    prolificID: {
        type: String
    },
    googleID: {
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

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = new mongoose.model("User", UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// Access our variables from .env file and create a new user
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://fantasy-forecast-politics.herokuapp.com/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ 
        // when we implement, we want them to input their prolificID first, and save that as state
        // then we pass it into this mongoose command (findOrCreate), as the success/failure of 
        // the OAuth login is when the redirect occurs, so the prolificID must be obtained prior
        prolificID: prolificIDFromClient,
        googleID: profile.id,
        // We don't want to use their name (displayName) as their username, we want them to create their own username (don't want to store their personal info!) 
        username: usernameFromClient, 
        profilePicture: profile.photos[0].value || ""
    }, function (err, user) {
        return cb(err, user);
    });
  }
));

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

const imageUploadRoutes = require("./routes/uploadImageRoute");
app.use("/api", imageUploadRoutes);

const submitFeedbackRoutes = require("./routes/helpers");
app.use("/submitFeedback", submitFeedbackRoutes);

app.use(express.static(path.join(__dirname, "client", "build")))

// Database connectivity
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Successfully connected to the Database"));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

const loggingMiddleWare = (username, prolificID, next) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(username);
    console.log(prolificID);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    usernameFromClient = username;
    prolificIDFromClient = prolificID
    next();
};

// app.get("/auth/google", (req, res) => loggingMiddleWare(req, res), passport.authenticate("google", {
//     // scope: ["profile"] 
//     scope: [
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email'
//     ]
// }));

app.get("/auth/google/not_callback/:username/:prolificID", 
    (req, res, next) => loggingMiddleWare(req.params.username, req.params.prolificID, next), 
    passport.authenticate("google", {
        // scope: ["profile"] 
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }
));


app.get("/auth/google/callback", passport.authenticate("google", { 
    failureRedirect: "https://fantasy-forecast-politics.herokuapp.com" }), function(req, res) { 
        // updateUserDocToShowSignIn()
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log(res.client.user);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log("==============================================");
        console.log("=================REQ=================");
        console.log(req);
        console.log("=================RES=================");
        console.log(res);
        console.log("=================END OF RES=================");
        res.redirect("https://fantasy-forecast-politics.herokuapp.com/home")
    }
);

app.get("/logout", function(req, res) {
    res.redirect("https://fantasy-forecast-politics.herokuapp.com");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Port listening
app.listen(port, () => console.log(`listening on port ${port}`));