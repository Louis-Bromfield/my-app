require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require("path");
const bcrypt = require("bcryptjs");

// OAuth
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

let usernameFromClient = "_TEMP_USERNAME";
let passwordFromClient = "_TEMP_PASSWORD";
// let isSignedUpForSurveyFromClient = "SIGNUPFORSURVEY_VALUE_UNCHANGED";
// let prolificIDFromClient = "_TEMP_PROLIFIC_ID_UNIMPORTED";

// Middleware
app.use(express.json());
app.use(cors());

// OAuth
app.use(session({
    secret: "fgkebgrbwksjebsk84373rbsbewqeIUIUKEWdkfdhU2383782!shjdfgvh237248582354",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    pWD: {
        type: String,
        default: "NO_PASSWORD"
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
        default: ["Fantasy Forecast All-Time"]
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
    callbackURL: `https://fantasy-forecast-politics.herokuapp.com/auth/google/callback`,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    passReqToCallback: true,
    // scope: [
    //     'https://www.googleapis.com/auth/userinfo.profile',
    //     'https://www.googleapis.com/auth/userinfo.email'
    // ],
    store: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    console.log("117 " + passwordFromClient);
    console.log("118 " + typeof passwordFromClient);
    profile._json.passwordFromClient = passwordFromClient;
    console.log("121 = " + profile._json.passwordFromClient);
    console.log(profile);
    // const newUserInfo = {
    //     username: usernameFromClient, 
    //     profilePicture: profile.photos[0].value || "",
    //     pWD: profile.passwordFromClient
    // }
    // console.log(newUserInfo);
    User.findOrCreate({ 
        username: usernameFromClient, 
        profilePicture: profile.photos[0].value || "",
        pWD: typeof profile._json.passwordFromClient === String ? profile._json.passwordFromClient : typeof profile._json.passwordFromClient
        // isSignedUpForSurvey: isSignedUpForSurveyFromClient
    }, function (err, user) {
        console.log("user");
        console.log(user);
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
const Users = require('./models/Users');
const req = require('express/lib/request');
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

// Prev
// const loggingMiddleWare = (username, prolificID, next) => {
//     console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
//     console.log(username);
//     console.log(prolificID);
//     console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
//     usernameFromClient = username;
//     prolificIDFromClient = prolificID
//     req.piDFC = prolificID;
//     next();
// };

// New
const loggingMiddleWare = async (params, next) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(params.username);
    console.log(params.password);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    usernameFromClient = params.username;
    // isSignedUpForSurveyFromClient = params.isSignedUpForSurvey;

    // Hash password here:
    await hashPassword(params.password);
    // const saltRounds = 10;
    // console.log(params.password);
    // bcrypt.genSalt(saltRounds, (err, salt) => {
    //     console.log(params.password);
    //     bcrypt.hash(params.password, salt, (err, hash) => {
    //         passwordFromClient = hash;
    //         console.log(passwordFromClient);
    //         console.log("hash = " + hash);
    //     });
    // });
    next();
};

const hashPassword = async (pw) => {
    console.log("211 ******************************");
    try {
        const saltRounds = 10;
        console.log("214 " + pw);
        bcrypt.genSalt(saltRounds, (err, salt) => {
            console.log("216 " + pw);
            bcrypt.hash(pw, salt, (err, hash) => {
                passwordFromClient = hash;
                console.log("219 " + passwordFromClient);
                console.log("220 hash = " + hash);
            });
        });
    console.log("223 ******************************");
    } catch (error) {
        console.error("error in hashPassword");
        console.error(error);
    };
};


app.get("/auth/google/not_callback/:username/:password", (req, res, next) => loggingMiddleWare(req.params, next), passport.authenticate("google", {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    // THIS vvvvvv WORKS BUT IT RETURNS "_TEMP_PROLIFIC_ID_UNIMPORTED", NOT WHAT LOGGINGMIDDLEWARE UPDATES IT TO
    // state: { prolificID: prolificIDFromClient }
    }
));

app.get("/auth/google/callback", 
    passport.authenticate("google", { 
        failureRedirect: "https://fantasy-forecast-politics.herokuapp.com",
        successRedirect: "https://fantasy-forecast-politics.herokuapp.com/loginSuccess"
    })
);

app.get("/logout", function(req, res) {
    res.redirect("https://fantasy-forecast-politics.herokuapp.com");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Port listening
app.listen(port, () => console.log(`listening on port ${port}`));