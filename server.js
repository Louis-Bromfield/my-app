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
let mDBObjectID = "_TEMP_MDB_ID";

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
    },
    justSignedInWithOAuth: {
        type: Boolean,
        default: true
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
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    req.session.prolificID = prolificIDFromClient;
    User.findOrCreate({ 
        prolificID: prolificIDFromClient,
        googleID: profile.id,
        username: usernameFromClient, 
        profilePicture: profile.photos[0].value || ""
        // Need to add user to the Fantasy Forecast All-Time leaderboard document
        // and to create a document for them in the learnQuizzes collection
    }, function (err, user) {
        // if this calls the next callback, can we pass in prolificID here?
        console.log("user");
        console.log(user);
        prolificIDFromClient = user.prolificID;
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

const loggingMiddleWare = (username, prolificID, next) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(username);
    console.log(prolificID);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    usernameFromClient = username;
    prolificIDFromClient = prolificID
    next();
};

// app.get("/auth/google/not_callback/:username/:prolificID", 
//     (req, res, next) => loggingMiddleWare(req.params.username, req.params.prolificID, next), 
//     passport.authenticate("google", {
//         // scope: ["profile"] 
//         scope: [
//             'https://www.googleapis.com/auth/userinfo.profile',
//             'https://www.googleapis.com/auth/userinfo.email'
//         ]
//     }
// ));

// app.get("/auth/google/callback/", passport.authenticate("google", { 
//     // Maybe change failureRedirect to a page that just says login failed, and a button to go back to the login page
//     failureRedirect: "https://fantasy-forecast-politics.herokuapp.com",
//     successRedirect: "https://fantasy-forecast-politics.herokuapp.com",
//     // successRedirect: `https://fantasy-forecast-politics.herokuapp.com/loginSuccess/userGID=${res.req.user.googleID}`
// // }), function(req, res) { 
// //         console.log("==============================================");
// //         console.log("=================REQ=================");
// //         console.log(req);
// //         console.log("=================RES=================");
// //         console.log(res);
// //         console.log("=================END OF RES=================");
// //         res.redirect("https://fantasy-forecast-politics.herokuapp.com/home")
// //     }
// }));


// HERE 
app.get("/auth/google/not_callback/:username/:prolificID", function(req, res, next) {
    usernameFromClient = req.params.username;
    prolificIDFromClient = req.params.prolificID;
    req.session.prolificID = req.params.prolificID;
    console.log("req.params.prolificID = " + req.params.prolificID)
    console.log("req.session.prolificID = " + req.session.prolificID)
    req.prolificID = req.params.prolificID;
    next();
}, passport.authenticate("google", {
        // scope: ["profile"] 
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        state: req.prolificID
        // state: prolificIDFromClient
    },
    console.log("______________________________"),
    console.log("req.prolificID = " + req.prolificID),
    console.log("req.session.prolificID = " + req.session.prolificID)
));

app.get("/auth/google/callback", 
    passport.authenticate("google", { 
        failureRedirect: "https://fantasy-forecast-politics.herokuapp.com"
    }), 
    function(req, res) {
        console.log("+++++++++++++WE NEED TO GET THEM HERE:+++++++++++++++");
        console.log("req.query.state = ");
        console.log(req.query.state);
        console.log("req.prolificID = ");
        console.log(req.prolificID);
        console.log("req.session.prolificID = ");
        console.log(req.session.prolificID);
        let id = req.query.state;
        console.log("id = " + id);
        if (id) {
            res.redirect('https://fantasy-forecast-politics.herokuapp.com/loginSuccess/pAID=' + id)
        } else {
            res.redirect('https://fantasy-forecast-politics.herokuapp.com')
        }
    }
);
// TO HERE

// app.get("/auth/google/callback", passport.authenticate("google", { 
//     // Maybe change failureRedirect to a page that just says login failed, and a button to go back to the login page
//     failureRedirect: "https://fantasy-forecast-politics.herokuapp.com",
//     // JOB ONE:
//     // look at RES or REQ objects and traverse them to find the user object and it's googleID
//     // successRedirect: `https://fantasy-forecast-politics.herokuapp.com/loginSuccess/userGID=108614670038566185853`
//     successRedirect: `https://fantasy-forecast-politics.herokuapp.com/loginSuccess/pAID=OMEGALUL`
// // }), function(req, res) { 
// //         console.log("==============================================");
// //         console.log("=================REQ=================");
// //         console.log(req);
// //         console.log("=================RES=================");
// //         console.log(res);
// //         console.log("=================END OF RES=================");
// //         res.redirect("https://fantasy-forecast-politics.herokuapp.com/home")
// //     }
// }));

// app.get("/auth/google/callback/", passport.authenticate("google", { 
//     // Maybe change failureRedirect to a page that just says login failed, and a button to go back to the login page
//     failureRedirect: "https://fantasy-forecast-politics.herokuapp.com",
//     // failureRedirect: "https://fantasy-forecast-politics.herokuapp.com",
//     // JOB ONE:
//     // look at RES or REQ objects and traverse them to find the user object and it's googleID
//     successRedirect: `https://fantasy-forecast-politics.herokuapp.com/loginSuccess/userGID=108614670038566185853`
//     // successRedirect: `https://fantasy-forecast-politics.herokuapp.com/loginSuccess/userGID=${res.locals.googleID}`
// // }), function(req, res) { 
// //         console.log("==============================================");
// //         console.log("=================REQ=================");
// //         console.log(req);
// //         console.log("=================RES=================");
// //         console.log(res);
// //         console.log("=================END OF RES=================");
// //         res.redirect("https://fantasy-forecast-politics.herokuapp.com/home")
// //     }
// }));

app.get("/logout", function(req, res) {
    res.redirect("https://fantasy-forecast-politics.herokuapp.com");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Port listening
app.listen(port, () => console.log(`listening on port ${port}`));