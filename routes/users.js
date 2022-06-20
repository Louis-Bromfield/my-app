const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Forecasts = require('../models/Forecasts');
const { UploadImage } = require("../controllers/uploadImage");
const parser = require("../middleware/cloudinary.config");
const Images = require("../models/Images");
const HomePageNewsFeedPosts = require('../models/HomePageNewsFeedPosts');
const Leaderboards = require('../models/Leaderboards');
const findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Sessions = require('../models/Sessions');

router.use(cookieParser());

const checkCookie = async (req, res, next) => {
    try {
        console.log("=========1======");
        // console.log(req.cookies);
        console.log(req.cookies.secureCookie);
        console.log("=========2======");
        console.log(typeof req.cookies.secureCookie);
        console.log(req.cookies.secureCookie.sessionID);
        console.log(req.cookies.secureCookie.indexOf("sessionID"));
        console.log(req.cookies.secureCookie.slice(req.cookies.secureCookie.indexOf("sessionID")+12, 107));
        console.log("=========3======");
        // console.log(JSON.parse(req.cookies.secureCookie.sessionID));
        // console.log("=========4======");
        // console.log(JSON.stringify(req.cookies.secureCookie.sessionID));
        // console.log("=========5======");

        // if no doc with sessionID exists, return err
        const sessionInDB = await Sessions.findOne({ sessionID: req.cookies.secureCookie.sessionID});
        console.log(sessionInDB);
        console.log("=========6======");
        if (!sessionInDB) {
            console.log("No session in DB!");
            //  send error that will trigger user logout in frontend
            const err = new Error(`No session exists.`);
            err.status=404;
            err.statusCode=404;
            next(err);
        // or if doc with sessionID exists, but it is expired, delete session object 
        // (so that logging back in creates a new one) and return err
        } else if (sessionInDB && (new Date() > new Date(sessionInDB.expiration))) {
            console.log("Session is in DB but expired!!");
            const err = new Error(`Session is expired.`);
            err.status=401;
            err.statusCode=401;
            next(err);
        } else {
            // else if both tests pass, go next()
            next();
        };
    } catch (error) {
        console.error("error in users > checkCookie");
        console.error(error);
        // return back to log user out?
    };
};

// Error handling 
router.use((err, req, res, next) => {
    err.statusCode= err.statusCode || 500
     err.status= err.status || 'error'
     res.status(err.statusCode).json({
          status:err.status,
          message:err.message
     });
});

// Get all forecasts that are in the user's markets that the user has NOT yet attempted (for home page C2A)
router.get("/unattemptedForecasts/:username", async (req, res) => {
    try {
        const allForecastData = await Forecasts.find(); 
        const userData = await Users.find({ username: req.params.username });
        let unattemptedForecasts = [];
        // Get all markets the user is in
        for (let i = 0; i < userData[0].markets.length; i++) {
            if (userData[0].markets[i] !== '"Fantasy Forecast All-Time"' || userData[0].markets[i] !== "Fantasy Forecast All-Time") {
                unattemptedForecasts.push([userData[0].markets[i]]);
            };
        };
        // Get all unattempted forecasts from the markets the user is in
        let today = new Date();
        for (let i = 0; i < allForecastData.length; i++) {
            if (new Date(allForecastData[i].closeDate) > today && today > new Date(allForecastData[i].startDate)) {
                let found = false;
                if (userData[0].markets.includes(allForecastData[i].market)) {
                    for (let j = 0; j < allForecastData[i].submittedForecasts.length; j++) {
                        if (allForecastData[i].submittedForecasts[j].username === req.params.username) {
                            // forecast from the user was found, we can move on to next
                            found = true;
                            continue;
                        };
                    };
                    // No forecasts from the user have been found, so needs to be shown to user in C2A
                    if (found === false) {
                        let index = userData[0].markets.indexOf(allForecastData[i].market);
                        unattemptedForecasts[index].push(allForecastData[i]);
                    };
                };
            };
        };
        res.json(unattemptedForecasts);
    } catch (error) {
        console.error("Error in users.js > get notAttempted/username");
        console.error(error);
    };
});

// Get global data for profile page stats - could get quite expensive, so maybe remove this if it is
router.get("/globalData", async (req, res) => {
    try {
        const allUsers = await Users.find();
        let bestBrier = 0;
        let worstBrier = 110;
        let averageBrier = 0;
        let totalBrier = 0;
        let brierCount = 0;
        for (let i = 0; i < allUsers.length; i++) {
            for (let j = 0; j < allUsers[i].brierScores.length; j++) {
                if (allUsers[i].brierScores[j].brierScore >= bestBrier) {
                    bestBrier = allUsers[i].brierScores[j].brierScore;
                };
                if (allUsers[i].brierScores[j].brierScore <= worstBrier) {
                    worstBrier = allUsers[i].brierScores[j].brierScore;
                };
                brierCount++;
                totalBrier += allUsers[i].brierScores[j].brierScore;
            };
        };
        averageBrier = totalBrier / brierCount;
        res.json({ bestBrier: bestBrier, worstBrier: worstBrier, averageBrier: averageBrier });
    } catch (error) {
        console.error("Error in router.get/globalData in users.js");
        console.error(error);
    };
});

// Get user info for profile / search page
router.get("/profileData/:username", async (req, res) => {
    try {
        const user = await Users.find({ username: req.params.username });
        // console.log(user);
        if (user.length === 0) {
            res.json({ 
                userObj: null,
                bestBrier: null,
                bestForecastProblem: null,
                averageBrier: null,})
        } else {
            // Get Brier Average / Highest Brier / Best Forecast
            let bestBrier = 0;
            let bestForecastProblem = "";
            let totalBrier = 0;
            let averageBrier = 0;
            for (let i = 0; i < user[0].brierScores.length; i++) {
                totalBrier += user[0].brierScores[i].brierScore;
                // Brier Scores array to consist of { brierScore: X.XX, problemName: "Problem to be forecasted" }
                if (user[0].brierScores[i].brierScore > bestBrier) {
                    bestBrier = user[0].brierScores[i].brierScore;
                    bestForecastProblem = user[0].brierScores[i].problemName;
                };
                
            };
            averageBrier = (totalBrier / user[0].brierScores.length).toFixed(2);

            const toReturn = {
                userObj: user[0],
                bestBrier: bestBrier,
                bestForecastProblem: bestForecastProblem,
                averageBrier: averageBrier,
            };

            res.json(toReturn);
        };
    } catch (error) {
        console.error("Error in users > profileData/:username");
        console.error(error);
    };
});

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        console.error("Error in router.get/ in users.js");
        console.error(error);
    };
});

// Get one user
router.get("/:username", checkCookie, async (req, res) => {
    try {
        const user = await Users.find({ username: req.params.username });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username in users.js");
        console.error(error);
    };
});

// Get one user using their prolificID
router.get("/findByProlificID/:prolificID", async (req, res) => {
    try {
        const user = await Users.find({ prolificID: req.params.prolificID });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username in users.js");
        console.error(error);
    };
});

// Get one user for logging in
router.get("/:username/:passwordOrResetCode/:isPassword", async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.params.username });
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
            res.json(user);
        } else {
            res.json({ loginSuccess: false, message: "Password/reset code does not match that stored in the database"});
        };
        // res.json({ loginSuccess: false, message: "An error occurred"});
    } catch (error) {
        console.error("Error in router.get/username/password in users.js");
        console.error(error);
    };
});

// Get all scores for an individual forecast problem
router.get("/getIndividualProblemResults/:problemName", async (req, res) => {
    try {
        console.log(req.params.problemName);
        // get all users
        const allUsers = await Users.find();
        // console.log(allUsers)
        // make an array of all who have
        let problemRankings = [];
        // loop through all, see if they have a brier for this problem
        for (let i = 0; i < allUsers.length; i++) {
            // console.log("=============");
            // console.log(allUsers[i]);
            // console.log("=============");
            for (let j = 0; j < allUsers[i].brierScores.length; j++) {
                console.log("currently on user " + allUsers[i].username);
                console.log(`${allUsers[i].brierScores[j].problemName} === ${req.params.problemName}`);
                if (allUsers[i].brierScores[j].problemName === req.params.problemName) {
                    console.log("found one!");
                    problemRankings.push({
                        username: allUsers[i].username,
                        score: allUsers[i].brierScores[j].brierScore.toFixed(2)
                    });
                };
            };
        };
        // sort by score
        const sortedProblemRankings = problemRankings.sort((a, b) => b.score - a.score);
        console.log(sortedProblemRankings);
        // return array
        res.json(sortedProblemRankings);
    } catch (error) {
        console.error("Error in getIndividualProblemResults");
        console.error(error);
        return [];  
    };
});

// Create a new user
router.post("/", async (req, res) => {
    const newUser = new Users({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fantasyForecastPoints: req.body.fantasyForecastPoints,
        name: req.body.name,
        markets: ["Fantasy Forecast All-Time"],
        onboarding: {},
        learnQuizzes: {},
        brierScores: [],
        numberOfClosedForecasts: 0,
        profilePicture: req.body.profilePicture,
        isGroup: req.body.isGroup
    });
    try {
        // Save to DB
        const newUserSavedToDB = await newUser.save();

        res.status(200).json(newUserSavedToDB);
    } catch (error) {
        console.error("Error in router.post in users.js");
        console.error(error);
        res.json({ message: error.message });
    };
});

// Picture upload
router.patch("/imageAPI/:username", parser.single("image"), async (req, res) => {
    try {
        const imageUploaded = new Images({
            image: req.file.path,
        });
        // Update User Document
        const userDocument = await Users.findOne({ username: req.params.username });
        const response = await Users.findByIdAndUpdate(userDocument._id, {
            profilePicture: imageUploaded.image
        },
        {
            new: true
        });
        // Update all news feed posts
        const allNewsFeedPosts = await HomePageNewsFeedPosts.find();
        for (let i = 0; i < allNewsFeedPosts.length; i++) {
            if (allNewsFeedPosts[i].author === req.params.username) {
                await HomePageNewsFeedPosts.findByIdAndUpdate(allNewsFeedPosts[i]._id, { authorProfilePicture: imageUploaded.image });
            };
        };
        // Update all instances of user in all leaderboards
        const allLeaderboards = await Leaderboards.find();
        for (let i = 0; i < allLeaderboards.length; i++) {
            for (let j = 0; j < allLeaderboards[i].rankings.length; j++) {
                if (allLeaderboards[i].rankings[j].username === req.params.username) {
                    allLeaderboards[i].rankings[j].profilePicture = imageUploaded.image;
                };
            };
            await Leaderboards.findByIdAndUpdate(allLeaderboards[i]._id, { rankings: allLeaderboards[i].rankings });
        };
        res.json({message: "great success!", profilePicture: imageUploaded.image});
    } catch (error) {
        console.error("Error in router.post/imageAPI in users.js");
        console.error(error);
        res.json({errorMsg: "An error happened!", errorFull: error});
    };
});

router.patch("/newPW/:username", async (req, res) => {
    try {
        const document = await Users.findOne({ username: req.params.username });
        const newHashedPW = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await Users.findByIdAndUpdate(document._id, { password: newHashedPW },
        { new: true }
    );
    res.json(updatedUser);
    } catch (error) {
        res.json({ error: error.message })
    }
});

// Update onboarding
router.patch("/onboardingTask/:username", async (req, res) => {
    try {
        console.log(req.body);
        const user = await Users.findOne({ username: req.params.username });
        let userOnboarding = user.onboarding;
        let userFFPoints = user.fantasyForecastPoints;
        let firstTime;
        // console.log(user);
        const onboardingTaskToUpdate = req.body.onboardingTask;
        console.log(onboardingTaskToUpdate);
        if (onboardingTaskToUpdate === "visitProfilePage") {
            if (userOnboarding.visitProfilePage === false) {
                userOnboarding.visitProfilePage = true;
                userFFPoints += req.body.ffPointsIfFalse;
                firstTime = true;
            } else {
                userFFPoints += req.body.ffPointsIfTrue;
                firstTime = false;
            };
        } else if (onboardingTaskToUpdate === "joinAMarket") {
            if (userOnboarding.joinAMarket === false) {
                userOnboarding.joinAMarket = true;
                userFFPoints += req.body.ffPointsIfFalse;
                firstTime = true;
            } else {
                userFFPoints += req.body.ffPointsIfTrue;
                firstTime = false;
            };
        } else if (onboardingTaskToUpdate === "submitAPost") {
            if (userOnboarding.submitAPost === false) {
                userOnboarding.submitAPost = true;
                userFFPoints += req.body.ffPointsIfFalse;
                firstTime = true;
            } else {
                userFFPoints += req.body.ffPointsIfTrue;
                firstTime = false;
            };
        } else if (onboardingTaskToUpdate === "submitAForecast") {
            if (userOnboarding.submitAForecast === false) {
                userOnboarding.submitAForecast = true;
                userFFPoints += req.body.ffPointsIfFalse;
                firstTime = true;
            } else {
                userFFPoints += req.body.ffPointsIfTrue;
                firstTime = false;
            };
        } else if (onboardingTaskToUpdate === "completeALearnQuiz") {
            if (userOnboarding.completeALearnQuiz === false) {
                userOnboarding.completeALearnQuiz = true;
                userFFPoints += req.body.ffPointsIfFalse;
                firstTime = true;
            } else {
                userFFPoints += req.body.ffPointsIfTrue;
                firstTime = false;
            };
        };
        console.log("======================");
        console.log(userOnboarding);
        console.log(userFFPoints);
        console.log("======================");
        const updatedUser = await Users.findByIdAndUpdate(user._id, {
            onboarding: userOnboarding,
            fantasyForecastPoints: userFFPoints
        });
        res.json({ user: updatedUser, firstTime: firstTime });
    } catch (error) {
        console.error("Error in onboardingTask");
        console.error(error);
        res.json({ error: "error", errorMessage: error })
    };
});

// Update a user
router.patch("/:username", async (req, res) => {
    try {
        const document = await Users.findOne({ username: req.params.username });
        const updatedUser = await Users.findByIdAndUpdate(document._id, {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fantasyForecastPoints: req.body.fantasyForecastPoints,
            markets: req.body.markets,
            name: req.body.name,
            onboarding: req.body.onboarding,
            learnQuizzes: req.body.learnQuizzes,
            markets: req.body.markets,
            numberOfClosedForecasts: req.body.numberOfClosedForecasts,
            profilePicture: req.body.profilePicture,
            articleVisits: req.body.articleVisits
        },
        { new: true }
    );
    res.json(updatedUser);
    } catch (error) {
        res.json({ error: error.message })
    }
});

// Add a user to market
router.patch("/:username/addMarket/:marketName", async (req, res) => {
    try {
        const document = await Users.findOne({ username: req.params.username });
        if (document.markets.includes(req.params.marketName)) {
            res.json({message: "user already in market"});
            return;
        } else {
            document.markets.push(req.params.marketName);
            const updatedUser = await Users.findByIdAndUpdate(document._id, { markets: document.markets }, { new: true });
            res.json(updatedUser);
        };
    } catch (error) {
        console.error("error in users > patch addMarket");
        console.error(error);
    };
});

// Remove a market from markets array
router.patch("/:username/removeMarket/:marketName", async (req, res) => {
    try {
        let updatedUser = { message: "User not in this market" };
        const document = await Users.findOne({ username: req.params.username });
        for (let i = 0; i < document.markets.length; i++) {
            if (document.markets[i] === req.params.marketName) {
                document.markets = document.markets.slice(0, i);
                updatedUser = await Users.findByIdAndUpdate(document._id, { markets: document.markets }, { new: true });
            };
        };
        res.json(updatedUser);
    } catch (error) {
        console.error("error in users > patch addMarket");
        console.error(error);
    };
});

router.patch("/calculateBrier/:happenedStatus/:marketName/:closeEarly", async (req, res) => {
console.log("1 REQPARAMS");
console.log(req.params);
console.log("2 REQBODY");
console.log(req.body);
    try {
        const forecastObj = await Forecasts.findOne({ problemName: req.body.problemName });
console.log("3 FORECASTOBJ");
console.log(forecastObj);
        let happened;
        if (req.params.happenedStatus === "true") {
            happened = true;
        } else if (req.params.happenedStatus === "false") {
            happened = false;
        };
        // If a problem is being closed early, update the date in the obj and then persist to DB
        if (req.params.closeEarly === "true") {
console.log("4 SHOULD PRINT AS CLOSEEARLY = TRUE")
            forecastObj.closeDate = req.body.newProblemCloseDateTime;
            await Forecasts.findByIdAndUpdate(forecastObj._id, { closeDate: req.body.newProblemCloseDateTime, happened: happened, isClosed: true});
        } else if (req.params.closeEarly === "false") {
            // Close Forecast
console.log("SHOULD NOT NOT NOT PRINT AS CLOSEEARLY = TRUE")
            await Forecasts.findByIdAndUpdate(forecastObj._id, { isClosed: true, happened: happened });
        };
        const calculatedBriers = calculateBriers(forecastObj, happened, "N/A");
console.log("13 CALCULATEDBRIERS ARRAY");
console.log(calculatedBriers);
console.log("================");
        // Calculate overall average
        let total = 0;
        for (let i = 0; i < calculatedBriers.length; i++) {
            total += calculatedBriers[i].finalScore;
        };
        let averageScoreForProblem = total / calculatedBriers.length;
console.log("AVERAGE");
console.log(averageScoreForProblem);
        let scoresToReturn = [];
        // let newScorePerformanceBoosted;
        // let performanceBoostVal = 0;
        for (let i = 0; i < calculatedBriers.length; i++) {
            const user = await Users.findOne({ username: calculatedBriers[i].username });
console.log("14 - USERNAME");
console.log(user);
            const toPush = {
                brierScore: calculatedBriers[i].finalScore,
                problemName: req.body.problemName,
                marketName: req.params.marketName,
                // captainedStatus: calculatedBriers[i].captainedStatus,
                // performanceBoost: performanceBoostVal
                averageScore: averageScoreForProblem
            };
console.log("15 TOPUSH");
console.log(toPush);
            const updatedUser = await Users.findOneAndUpdate({ username: calculatedBriers[i].username }, {
                $push: { brierScores: toPush },
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                numberOfClosedForecasts: Number(user.numberOfClosedForecasts) + 1
            },
            { new: true }
            );
console.log("16 UPDATEDUSER");
console.log(updatedUser);
            toPush.username = calculatedBriers[i].username;
            scoresToReturn.push(toPush);
        };
console.log("====++++====");
console.log(scoresToReturn);
        // return scoresToReturn;
        res.json({ scores: scoresToReturn });
    } catch (error) {
        console.error("error in users > patch calculateBriers");
        console.error(error);
    };
});

router.patch("/calculateBriersMultipleOutcomes/:outcome/:marketName/:closeEarly", async (req, res) => {
    try {
        const forecastObj = await Forecasts.findOne({ problemName: req.body.problemName });
        let outcome = req.params.outcome;
        // If a problem is being closed early, update the date in the obj and then persist to DB
        if (req.params.closeEarly === "true") {
            forecastObj.closeDate = req.body.newProblemCloseDateTime;
            await Forecasts.findByIdAndUpdate(forecastObj._id, { closeDate: req.body.newProblemCloseDateTime, outcome: outcome, isClosed: true});
        } else if (req.params.closeEarly === "false") {
            // Close Forecast
            await Forecasts.findByIdAndUpdate(forecastObj._id, { isClosed: true, outcome: outcome });
        };
        const calculatedBriers = calculateBriers(forecastObj, "N/A", outcome);
        // Calculate overall average
        let total = 0;
        for (let i = 0; i < calculatedBriers.length; i++) {
            total += calculatedBriers[i].finalScore;
        };
        let averageScoreForProblem = total / calculatedBriers.length;
        let scoresToReturn = [];
        let newScorePerformanceBoosted;
        let performanceBoostVal = 0;
        for (let i = 0; i < calculatedBriers.length; i++) {
            const user = await Users.findOne({ username: calculatedBriers[i].username });
            // Work out if they should receive a performance bonus for this Brier Score
            // let scoreChain = 1;
            // if (calculatedBriers[i].finalScore >= 75) {
            // //     for (let i = user.brierScores.length-1; i >= 0; i--) {
            // //         if (user.brierScores[i].marketName === req.params.marketName) {
            // //             if (user.brierScores[i].brierScore >= 90) {
            // //                 scoreChain++;
            // //             } else {
            // //                 break;
            // //             }
            // //         }
            // //     };
            // //     // if scoreChain is 1, then only their current prediction is above 90 or 180, just a 1x streak, bonuses only start at 2x streak
            // //     if (scoreChain === 1) {
            // //         boost = 0;
            // //     // 2x streak = 0.03 + 0.02 = 0.05, 5% boost 
            // //     } else {
            // //         boost = 0.03 + (scoreChain/100);
            // //     }
            //     // console.log(`boost = ${boost}`);
            //     // newScorePerformanceBoosted = calculatedBriers[i].finalScore + (calculatedBriers[i].finalScore * boost);
            //     let boost = (calculatedBriers[i].finalScore/100)*5;
            //     console.log(`boost = ${boost}`);
            //     newScorePerformanceBoosted = (calculatedBriers[i].finalScore + boost);
            //     console.log(`so the boosted score is = ${newScorePerformanceBoosted}`);
            //     performanceBoostVal = 1;
            // } else {
            //     newScorePerformanceBoosted = calculatedBriers[i].finalScore;
            //     performanceBoostVal = 0;
            // }
            const toPush = {
                brierScore: calculatedBriers[i].finalScore,
                problemName: req.body.problemName,
                marketName: req.params.marketName,
                captainedStatus: calculatedBriers[i].captainedStatus,
                // performanceBoost: performanceBoostVal,
                averageScore: averageScoreForProblem
            };
            await Users.findOneAndUpdate({ username: calculatedBriers[i].username }, {
                $push: { brierScores: toPush },
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                numberOfClosedForecasts: Number(user.numberOfClosedForecasts) + 1
            },
            { new: true }
            );
            toPush.username = calculatedBriers[i].username;
            scoresToReturn.push(toPush);
        };
        res.json({ scores: scoresToReturn });
    } catch (error) {
        console.error("error in users > patch calculateBriers");
        console.error(error);
    };
});

// New version without comments
const calculateBriers = (forecastObj, happened, outcome) => {
console.log("5 SHOULD PRINT AS WE ARE IN CALCULATE BRIER FUNCTION");
console.log("6 ARGUMENTS");
console.log("7 FORECASTOBJ");
console.log(forecastObj);
console.log("8 HAPPENED - SHOULD BE TRUE");
console.log(happened)
console.log("9 OUTCOME");
console.log(outcome);
    const startDate = new Date(forecastObj.startDate);
    const closeDate = new Date(forecastObj.closeDate);

    const formulaComponents = [];
    let arrToReturn = [];

    for (let i = 0; i < forecastObj.submittedForecasts.length; i++) {
        formulaComponents[i] = [];
        formulaComponents[i].username = forecastObj.submittedForecasts[i].username;
        arrToReturn[i] = [];
        arrToReturn[i].username = forecastObj.submittedForecasts[i].username;

        // tScore
        let tScore;
        // Condition to catch if the first prediction a user makes is AFTER I have closed the market
        // i.e. they submit but I close the problem early, and it closes to a time before they submitted
        if (new Date(forecastObj.submittedForecasts[i].forecasts[0].date) < closeDate) {
            // Add in a check that says if first forecast submitted is ON THE SAME DAY as startDate, give them 10/10
            let tValue = (closeDate - new Date(forecastObj.submittedForecasts[i].forecasts[0].date))/1000;
            let timeFrame = (closeDate - startDate)/1000;
            tScore = (tValue/timeFrame)*10;
console.log("10 - tSCORE");
console.log(tScore);
        } else {
            tScore = 0;
        };
        formulaComponents[i].tScore = tScore;

        // Sum of Weighted Briers
        let sumOfNewWeightedBriers = 0;
        for (let j = 0; j < forecastObj.submittedForecasts[i].forecasts.length; j++) {
            // Forecast WAS made before close date
console.log(`${new Date(forecastObj.submittedForecasts[i].forecasts[j].date)} < ${closeDate}`);
            if (new Date(forecastObj.submittedForecasts[i].forecasts[j].date) < closeDate) {
console.log("This forecast counts");
                let originalBrier;
                // Single Cert Problem - using happened
                if (happened !== "N/A") {
                    if (happened === true) {
                        originalBrier = (((1 - forecastObj.submittedForecasts[i].forecasts[j].certainty) * (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) + ((0 - (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) * (0 - (1 -forecastObj.submittedForecasts[i].forecasts[j].certainty))));
                    } else if (happened === false) {
                        originalBrier = (((0 - forecastObj.submittedForecasts[i].forecasts[j].certainty) * (0 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) + ((1 - (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) * (1 - (1 -forecastObj.submittedForecasts[i].forecasts[j].certainty))));
                    };
                // Multi Cert Problem - using outcome
                } else if (happened === "N/A") {
                    let firstBrierIfCorrect = Math.pow(1 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty1, 2);
                    let firstBrierIfIncorrect = Math.pow(0 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty1, 2)
                    let secondBrierIfCorrect = Math.pow(1 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty2, 2);
                    let secondBrierIfIncorrect = Math.pow(0 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty2, 2)
                    let thirdBrierIfCorrect = Math.pow(1 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty3, 2);
                    let thirdBrierIfIncorrect = Math.pow(0 - forecastObj.submittedForecasts[i].forecasts[j].certainties.certainty3, 2)

                    if (outcome === "outcome1") {
                        originalBrier = firstBrierIfCorrect + secondBrierIfIncorrect + thirdBrierIfIncorrect;
                    } else if (outcome === "outcome2") {
                        originalBrier = secondBrierIfCorrect + firstBrierIfIncorrect + thirdBrierIfIncorrect;
                    } else if (outcome === "outcome3") {
                        originalBrier = thirdBrierIfCorrect + firstBrierIfIncorrect + secondBrierIfIncorrect;
                    };
                };
                let newBrier = (2 - originalBrier) * 50;
console.log("11 NEW BRIER");
console.log(newBrier);
                let newBrierWeightedByDuration;
                let thisForecastTimeDate = new Date(forecastObj.submittedForecasts[i].forecasts[j].date);
                if (j < forecastObj.submittedForecasts[i].forecasts.length-1) {
                    let nextForecastTimeDate = new Date(forecastObj.submittedForecasts[i].forecasts[j+1].date);
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                    newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                    sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                }
                else if (j === forecastObj.submittedForecasts[i].forecasts.length-1) {
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (closeDate - thisForecastTimeDate)/1000;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                    newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));

                    sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                    formulaComponents[i].finalBrierSum = sumOfNewWeightedBriers;
console.log("12 SUMOFNEWWEIGHTEDBRIERS");
console.log(sumOfNewWeightedBriers);
                };
            // Forecast was NOT made before close date
            } else if (new Date(forecastObj.submittedForecasts[i].forecasts[j].date) > closeDate) {
console.log("Forecast submitted after the problem's close date");
                sumOfNewWeightedBriers = sumOfNewWeightedBriers + 0;
                if (j === forecastObj.submittedForecasts[i].forecasts.length-1) {
                    formulaComponents[i].finalBrierSum = sumOfNewWeightedBriers;
                };
            };
        };
        formulaComponents[i].brierSumPlusTScore = formulaComponents[i].finalBrierSum + formulaComponents[i].tScore;
        arrToReturn[i].finalScore = formulaComponents[i].brierSumPlusTScore;
console.log(`arrToReturn[i].finalScore = ${arrToReturn[i].finalScore}`)
        arrToReturn[i].captainedStatus = forecastObj.submittedForecasts[i].captainedStatus;
    };
console.log("================");
    console.log(formulaComponents);
    console.log(arrToReturn);
console.log("================");
    return arrToReturn;
};

module.exports = router;