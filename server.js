require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sessions = require('./models/Sessions');
const cookieParser = require("cookie-parser");

// OAuth
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

let usernameFromClient = "_TEMP_USERNAME";
let passwordFromClient = "_TEMP_PASSWORD";
let passwordResetCodeFromClient = "_TEMP_PASSWORD_RESET_CODE";
// let accessTokenToReturnToClient = "_TEMP_TOKEN";
// let isSignedUpForSurveyFromClient = "SIGNUPFORSURVEY_VALUE_UNCHANGED";
// let prolificIDFromClient = "_TEMP_PROLIFIC_ID_UNIMPORTED";

app.use(cookieParser());

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
    password: {
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
    console.log(profile);
    // console.log("113 " + passwordFromClient);
    // console.log("114 " + typeof passwordFromClient);
    const passwordCheck = passwordFromClient;
    // console.log("116 " + passwordCheck);
    
    // if not do this:
    // const newUsername = usernameFromClient;
    // usernameFromClient = passwordFromClient;
    // password: usernameFromClient
    // ---------------------------------------------------------------------------------------
    // profile._json.passwordFromClient = passwordFromClient.toString();
    // console.log("127 THIS ONEEEEEEEEEEEEEEEEEE = " + profile._json.passwordFromClient);
    // console.log(profile);
    // const newUserInfo = {
    //     username: usernameFromClient, 
    //     profilePicture: profile.photos[0].value || "",
    //     pWD: profile.passwordFromClient
    // }
    // console.log(newUserInfo);

    // let newHash = "newHASH";
    // const saltRounds = 10;
    // console.log("132 " + passwordFromClient);
    // bcrypt.genSalt(saltRounds, (err, salt) => {
    //     console.log("134 " + passwordFromClient);
    //     bcrypt.hash(passwordFromClient, salt, (err, hash) => {
    //         newHash = hash;
    //     });
    // });
    // console.log("233 ******************************");
    // let newHashedPassword = await hashPassword(passwordFromClient);

    User.findOrCreate({ 
        username: usernameFromClient, 
        // pwdResetCode: passwordResetCodeFromClient,
        profilePicture: profile.photos[0].value || "",
        email: profile.emails[0].value || "No email address",
        password: passwordCheck
        // isSignedUpForSurvey: isSignedUpForSurveyFromClient
    }, async function (err, user) {
        const userWithPW = await Users.findOneAndUpdate({ username: usernameFromClient }, {
            password: passwordFromClient,
            // pwdResetCode: passwordResetCodeFromClient,
        }, { new: true });
        console.log("updatedUser");
        console.log(userWithPW);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
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
    passwordResetCodeFromClient = params.resetCode;
    // passwordFromClient = params.password;
    // isSignedUpForSurveyFromClient = params.isSignedUpForSurvey;

    // Hash password here:
    // passwordFromClient = await hashPassword(params.password);
    // console.log("206 " + passwordFromClient);
    // const saltRounds = 10;
    // console.log("208 " + params.password);
    // bcrypt.genSalt(saltRounds, (err, salt) => {
    //     console.log(params.password);
    //     bcrypt.hash(params.password, salt, (err, hash) => {
    //         passwordFromClient = hash;
    //         console.log(passwordFromClient);
    //         console.log("hash = " + hash);
    //     });
    // });
    // const password = passwordFromClient;
    const saltRounds = 10;
    // const hashedPassword = await new Promise((resolve, reject) => {
    //     bcrypt.hash(password, saltRounds, function(err, hash) {
    //         if (err) reject(err);
    //         resolve(hash);
    //     });
    // });
    const hashedPassword = await bcrypt.hash(params.password, saltRounds);
    // const hashedResetCode = await bcrypt.hash(params.resetCode, saltRounds);
    // console.log("237 hashedPassword = " + hashedPassword);
    passwordFromClient = hashedPassword;
    // passwordResetCodeFromClient = hashedResetCode;
    console.log("=====================================================================");
    
    next();
};

// const hashPassword = async (pw) => {
//     console.log("232 ******************************");
//     try {
//         let newHash = "";
//         const saltRounds = 10;
//         console.log("236 " + pw);
//         bcrypt.genSalt(saltRounds, (err, salt) => {
//             console.log("238 " + pw);
//             bcrypt.hash(pw, salt, (err, hash) => {
//                 newHash = hash;
//                 // console.log("219 " + passwordFromClient);
//                 // console.log("220 hash = " + hash);
//             });
//         });
//         console.log("245 ******************************");
//         return newHash;
//     } catch (error) {
//         console.error("error in hashPassword");
//         console.error(error);
//     };
// };

// const hashPassword = async (pw) => {
//     const password = pw;
//     const saltRounds = 10;
//     // const hashedPassword = await new Promise((resolve, reject) => {
//     //     bcrypt.hash(password, saltRounds, function(err, hash) {
//     //         if (err) reject(err);
//     //         resolve(hash);
//     //     });
//     // });
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     console.log("263 hashedPassword = " + hashedPassword);
//     return hashedPassword;
// };


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

// Get one user for logging in
app.get("/:username/:passwordOrResetCode/:isPassword", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        console.log(user);
        if (!user) {
            res.json({ loginSuccess: false, message: "This user does not exist in the database"});
        };
        let match;
        console.log(req.params);
        if (req.params.isPassword === "true") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.password);
        } else if (req.params.isPassword === "false") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.pwdResetCode);
        }
        if (match) {
            const userSession = await Sessions.findOne({ username: req.params.username });
            if (userSession) {
                res.cookie("secureCookie", JSON.stringify(userSession), {
                    secure: true,
                    httpOnly: true,
                    expires: new Date("August 01, 2022 11:00:00")
                });
            } else {
                // let string = user.id+sdfufysdf87gdfgdbwjhbjh4b3jh6b543kj6b45h;
                const newHash = await bcrypt.hash(user._id.toString(), 10); 
                const newSession = new Sessions({
                    sessionID: newHash,
                    expiration: new Date("August 01, 2022 11:00:00").toString(),
                    username: req.params.username
                });
                // const newSessionSaved = newSession.save();
                newSession.save();
                res.cookie("secureCookie", JSON.stringify(newSession), {
                    secure: true,
                    httpOnly: true,
                    expires: new Date("August 01, 2022 11:00:00")
                });
            };
            res.json(user);
        } else {
            res.json({ loginSuccess: false, message: "Password/reset code does not match that stored in the database"});
        };
        // res.json({ loginSuccess: false, message: "An error occurred"});
    } catch (error) {
        console.error("Error in router.get/username/password in server.js");
        console.error(error);
    };
});

app.delete("/deleteSession", async (req, res) => {
    try {
        const sessionIDFromCookie = req.cookies.secureCookie.slice(req.cookies.secureCookie.indexOf("sessionID")+12, 107);
        await Sessions.findOneAndDelete({ sessionID: sessionIDFromCookie });
    } catch (err) {
        console.error("Error in deleteSession");
        console.error(error);
    };
});

app.get("/logout", function(req, res) {
    res.redirect("https://fantasy-forecast-politics.herokuapp.com");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Port listening
app.listen(port, () => console.log(`listening on port ${port}`));