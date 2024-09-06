const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Forecasts = require('../models/Forecasts');
// const HomePageNewsFeedPosts = require('../models/HomePageNewsFeedPosts');
// const Leaderboards = require('../models/Leaderboards');
// const findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cors = require('cors');
const bodyParser = require('body-parser');

// Error handling 
router.use((err, req, res, next) => {
    res.redirect("/");
});

// Get all forecasts that are in the user's markets that the user has NOT yet attempted (for home page C2A)
router.get("/unattemptedForecasts/:username", cors(), async (req, res) => {
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
router.get("/globalData", cors(), async (req, res) => {
    try {
        const allUsers = await Users.find();
        let bestBrier = 0;
        let worstBrier = 110;
        let averageBrier = 0;
        let totalBrier = 0;
        let brierCount = 0;
        let bestChanged = false;
        let worstChanged = false;
        for (let i = 0; i < allUsers.length; i++) {
            for (let j = 0; j < allUsers[i].brierScores.length; j++) {
                if (allUsers[i].brierScores[j].brierScore >= bestBrier) {
                    bestBrier = allUsers[i].brierScores[j].brierScore;
                    bestChanged = true;
                };
                if (allUsers[i].brierScores[j].brierScore <= worstBrier) {
                    worstBrier = allUsers[i].brierScores[j].brierScore;
                    worstChanged = true;
                };
                brierCount++;
                totalBrier += allUsers[i].brierScores[j].brierScore;
            };
        };
        averageBrier = totalBrier / brierCount;
        res.json({ bestBrier: bestChanged === true ? bestBrier : -1, worstBrier: worstChanged === true ? worstBrier : -1, averageBrier: averageBrier });
    } catch (error) {
        console.error("Error in router.get/globalData in users.js");
        console.error(error);
    };
});

// Get user info for profile / search page
router.get("/profileData/:username", cors(), async (req, res) => {
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
router.get("/", cors(), async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        console.error("Error in router.get/ in users.js");
        console.error(error);
    };
});

// Get one user
// router.get("/:username", checkCookie, cors(), async (req, res) => {
router.get("/:username", cors(), cors(), async (req, res) => {
    try {
        const user = await Users.find({ username: req.params.username });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username in users.js");
        console.error(error);
    };
});

// Get one user using their prolificID
router.get("/findByProlificID/:prolificID", cors(), async (req, res) => {
    try {
        const user = await Users.find({ prolificID: req.params.prolificID });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username in users.js");
        console.error(error);
    };
});

// Get one user for logging in
router.get("/:username/:passwordOrResetCode/:isPassword", cors(), async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.params.username });
        if (!user) {
            res.json({ loginSuccess: false, message: "This user does not exist in the database"});
        } 
        if (user.isTeam === true) {
            res.json({ loginSuccess: false, message: "This is a team account. Please login to your individual account."});
        }
        let match;
        // console.log(req.params);
        if (req.params.isPassword === "true") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.password);
        } else if (req.params.isPassword === "false") {
            match = await bcrypt.compare(req.params.passwordOrResetCode, user.pwdResetCode);
        }
        if (match) {
            res.json(user);
        } else if (user.isTeam === true) {
            res.json({ loginSuccess: false, message: "This is a team account. Please login to your individual account."});
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
router.get("/getIndividualProblemResults/:problemName", cors(), async (req, res) => {
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
                // console.log("currently on user " + allUsers[i].username);
                // console.log(`${allUsers[i].brierScores[j].problemName} === ${req.params.problemName}`);
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
        // console.log(sortedProblemRankings);
        // return array
        res.json(sortedProblemRankings);
    } catch (error) {
        console.error("Error in getIndividualProblemResults");
        console.error(error);
        return [];  
    };
});

// Create a new user
router.post("/", cors(), async (req, res) => {
    const user = await Users.findOne({ username: req.body.username });
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    if (user !== null) {
        res.json({
            userCreationSuccess: false,
            err: true,
            message: "User already exists."
        })
        return;
    }
    console.log("NEW USER CREATION");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({
        username: req.body.username,
        pID: req.body.pID,
        password: hashedPassword
    });
    try {
        // Save to DB
        const newUserSavedToDB = await newUser.save();
        res.json({
            userCreationSuccess: true,
            userObject: newUserSavedToDB,
            err: false
        });
    } catch (error) {
        console.error("Error in router.post in users.js");
        console.error(error);
        res.json({
            message: error.message,
            err: true
        });
    };
});

// Add a notification to the user's notification array
router.patch("/newNotification/:username", cors(), async (req, res) => {
    try {
        let user = await Users.findOne({ username: req.params.username });
        user.notifications.unshift({
            notificationMessage: req.body.notificationMessage,
            date: new Date(),
            // e.g. if it's someone liking your news feed post, then this will be /news-post
            // if it's a forecast closing, this will be /forecast
            notificationSourcePath: req.body.notificationSourcePath,
            // e.g. if it's someone liking your news feed post, then this will be the OID of that post so that onClick it takes you to the individual news feed post
            notificationSourceObjectID: req.body.notificationSourceObjectID,
            // set this to true when the user either clicks on the alert itself or set all falses to true when they select "See all notifications"
            seenByUser: false,
            notificationIndex: user.notifications.length+1
        });
        if (req.body.notificationRating === true) {
            for (let i = 0; i < user.trophies.length; i++) {
                if (user.trophies[i].trophyText === "Gather Round!" && user.trophies[i].obtained === false) {
                    user.trophies[i].obtained = true;
                };
            };
            if (req.body.truthful === true && req.body.relevant === true) {
                user.ratings = user.ratings + 2;
            } else if ((req.body.truthful === true && req.body.relevant === false) || (req.body.truthful === false && req.body.relevant === true)) {
                // do nothing as the positive and negative cancel each other out
            } else if (req.body.truthful === false && req.body.relevant === false) {
                user.ratings = user.ratings - 2;
            }
        };
        await Users.findOneAndUpdate({ username: req.params.username }, {
            notifications: user.notifications,
            trophies: user.trophies,
            ratings: user.ratings
        });
        res.json({message: "successful notification send" })
    } catch (error) {
        console.error("Error in patch users > newNotification");
        console.error(error);
    };
});

// Set seenByUser value to true
router.patch("/editNotifications/:username", cors(), async (req, res) => {
    try {
        let user = await Users.findOne({ username: req.params.username });
        if (req.body.setAllToTrue === true) {
            console.log("HERE TRUE");
            for (let i = 0; i < user.notifications.length; i++) {
                if (user.notifications[i].seenByUser === false) {
                    user.notifications[i].seenByUser = true;
                };
            };
        } else if (req.body.setAllToTrue === false) {
            console.log("HERE FALSE");
            for (let i = 0; i < user.notifications.length; i++) {
                if ((user.notifications[i].notificationMessage === req.body.notificationMessage) && (user.notifications[i].notificationIndex === req.body.notificationIndex)) {
                    user.notifications[i].seenByUser = true;
                    console.log("Changed one to true! Index " + req.body.notificationIndex);
                    break;
                };
            };
        };
        await Users.findOneAndUpdate({ username: req.params.username }, {
            notifications: user.notifications
        });
        res.json({ message: "Notification successfully updated "});
    } catch (err) {
        console.error("Error in patch users > editNotifications");
        console.error(err);
        res.json({
            message: "Notification unsuccessfully updated",
            err: err
        });
    };
});

router.patch("/newPW/:username", cors(), async (req, res) => {
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
router.patch("/onboardingTask/:username", cors(), async (req, res) => {
    try {
        // console.log(req.body);
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
                for (let i = 0; i < user.trophies.length; i++) {
                    if (user.trophies[i].trophyText === "First Time Around") {
                        user.trophies[i].obtained = true;
                        break;
                    };
                };
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
        // Check if they've completed all onboarding tasks
        let allOnboardingTrue = true;
        for (let i = 0; i < Object.keys(userOnboarding).length; i++) {
            if (Object.values(userOnboarding)[i] === false) {
                allOnboardingTrue = false;
            };
        };
        if (allOnboardingTrue === true) {
            for (let i = 0; i < user.trophies.length; i++) {
                if (user.trophies[i].trophyText === "Ready To Go" && user.trophies[i].obtained === false) {
                    user.trophies[i].obtained = true;
                };
            };
        };

        let trophyUpdate = false;
        let trophyText = "";
        if ((user.fantasyForecastPoints < 1500) && (userFFPoints >= 1500)) {
            trophyUpdate = true;
            trophyText = "Seer"
        } else if ((user.fantasyForecastPoints < 2000) && (userFFPoints >= 2000)) {
            trophyUpdate = true;
            trophyText = "Soothsayer"
        } else if ((user.fantasyForecastPoints < 2500) && (userFFPoints >= 2500)) {
            trophyUpdate = true;
            trophyText = "Oracle"
        } else if ((user.fantasyForecastPoints < 5000) && (userFFPoints >= 5000)) {
            trophyUpdate = true;
            trophyText = "Diviner"
        };

        if (trophyUpdate === true) {
            for (let i = 0; i < user.trophies.length; i++) {
                if (user.trophies[i].trophyText === trophyText && user.trophies[i].obtained === false) {
                    user.trophies[i].obtained = true;
                };
            };
        };

        // Update user document
        const updatedUser = await Users.findByIdAndUpdate(user._id, {
            trophies: user.trophies,
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
router.patch("/:username", cors(), async (req, res) => {
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
            articleVisits: req.body.articleVisits,
            completedSurvey: req.body.completedSurvey,
            notifications: req.body.notifications,
            trophies: req.body.trophies,
            inTeam: req.body.inTeam,
            teamName: req.body.teamName
        },
        { new: true }
    );
    res.json({ newUser: updatedUser, error: "No error" });
    } catch (error) {
        res.json({ error: error.message })
    }
});

// Add a user to market
router.patch("/:username/addMarket/:marketName", cors(), async (req, res) => {
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
router.patch("/:username/removeMarket/:marketName", cors(), async (req, res) => {
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

router.patch("/calculateBrier/:happenedStatus/:marketName/:closeEarly", cors(), async (req, res) => {
    try {
        const forecastObj = await Forecasts.findOne({ problemName: req.body.problemName });
        let happened;
        if (req.params.happenedStatus === "true") {
            happened = true;
        } else if (req.params.happenedStatus === "false") {
            happened = false;
        };
        // If a problem is being closed early, update the date in the obj and then persist to DB
        if (req.params.closeEarly === "true") {
            forecastObj.closeDate = req.body.newProblemCloseDateTime;
            await Forecasts.findByIdAndUpdate(forecastObj._id, { closeDate: req.body.newProblemCloseDateTime, happened: happened, isClosed: true});
        } else if (req.params.closeEarly === "false") {
            // Close Forecast
            await Forecasts.findByIdAndUpdate(forecastObj._id, { isClosed: true, happened: happened });
        };
        const calculatedBriers = calculateBriers(forecastObj, happened, "N/A");
        // Calculate overall average
        let total = 0;
        for (let i = 0; i < calculatedBriers.length; i++) {
            total += calculatedBriers[i].finalScore;
        };
        let averageScoreForProblem = total / calculatedBriers.length;
        let scoresToReturn = [];
        let teamsArr = [];
        for (let i = 0; i < calculatedBriers.length; i++) {
            const user = await Users.findOne({ username: calculatedBriers[i].username });
            const toPush = {
                brierScore: calculatedBriers[i].finalScore,
                problemName: req.body.problemName,
                marketName: req.params.marketName,
                averageScore: averageScoreForProblem
            };
            if (calculatedBriers[i].finalScore >= 100) {
                for (let j = 0; j < user.trophies.length; j++) {
                    if (user.trophies[j].trophyText === "The Gold Standard" && user.trophies[j].obtained === false) {
                        user.trophies[j].obtained = true;
                        break;
                    };
                };
                // check it's length 2 or longer rather than 3 or longer as this current brier hasn't been added yet
                if (user.brierScores.length >= 2) {
                    if (user.brierScores[user.brierScores.length-1].brierScore >= 100 && user.brierScores[user.brierScores.length-2].brierScore >= 100) {
                        for (let j = 0; j < user.trophies.length; j++) {
                            if (user.trophies[j].trophyText === "The Triple Gold Standard" && user.trophies[j].obtained === false) {
                                user.trophies[j].obtained = true;
                                break;
                            };
                        };  
                    }
                };
            };
            user.brierScores.push(toPush);
            user.notifications.unshift({
                notificationMessage: `You scored ${toPush.brierScore.toFixed(2)} on the following forecast: ${toPush.problemName}!`,
                notificationSourcePath: "/forecast",
                notificationSourceObjectID: forecastObj._id,
                seenByUser: false,
                date: new Date(),
                notificationIndex: user.notifications.length+1
            });
            const updatedUser = await Users.findOneAndUpdate({ username: calculatedBriers[i].username }, {
                brierScores: user.brierScores,
                trophies: user.trophies,
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                notifications: user.notifications,
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

router.patch("/calculateBriersMultipleOutcomes/:outcome/:marketName/:closeEarly", cors(), async (req, res) => {
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
        for (let i = 0; i < calculatedBriers.length; i++) {
            const user = await Users.findOne({ username: calculatedBriers[i].username });
            const toPush = {
                brierScore: calculatedBriers[i].finalScore,
                problemName: req.body.problemName,
                marketName: req.params.marketName,
                captainedStatus: calculatedBriers[i].captainedStatus,
                averageScore: averageScoreForProblem
            };
            user.brierScores.push(toPush);
            user.notifications.unshift({
                notificationMessage: `You scored ${toPush.brierScore.toFixed(2)} on the following forecast: ${toPush.problemName}!`,
                notificationSourcePath: "/forecast",
                notificationSourceObjectID: forecastObj._id,
                seenByUser: false,
                date: new Date(),
                notificationIndex: user.notifications.length+1
            });
            await Users.findOneAndUpdate({ username: calculatedBriers[i].username }, {
                brierScores: user.brierScores,
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                numberOfClosedForecasts: Number(user.numberOfClosedForecasts) + 1,
                notifications: user.notifications,
                unseenNotificationCount: Number(user.unseenNotificationCount) + 1
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
        // Else-Condition to catch if the first prediction a user makes is AFTER I have closed the market
        // i.e. they submit but I close the problem early, and it closes to a time before they submitted
        if (new Date(forecastObj.submittedForecasts[i].forecasts[0].date) < closeDate) {
            // If first forecast submitted is ON THE SAME DAY as startDate, give them 10/10
            if (forecastObj.submittedForecasts[i].forecasts[0].date.slice(0, 14) === forecastObj.startDate.slice(0, 14)) {
                tScore = 10;
            } else {
                let tValue = (closeDate - new Date(forecastObj.submittedForecasts[i].forecasts[0].date))/1000;
                let timeFrame = (closeDate - startDate)/1000;
                tScore = (tValue/timeFrame)*10;
            }
            // console.log("10 - tSCORE");
            // console.log(tScore);
        } else {
            tScore = 0;
        };
        formulaComponents[i].tScore = tScore;

        // Sum of Weighted Briers
        let sumOfNewWeightedBriers = 0;
        for (let j = 0; j < forecastObj.submittedForecasts[i].forecasts.length; j++) {
            // Forecast WAS made before close date
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
                };
            // Forecast was NOT made before close date
            } else if (new Date(forecastObj.submittedForecasts[i].forecasts[j].date) > closeDate) {
                sumOfNewWeightedBriers = sumOfNewWeightedBriers + 0;
                if (j === forecastObj.submittedForecasts[i].forecasts.length-1) {
                    formulaComponents[i].finalBrierSum = sumOfNewWeightedBriers;
                };
            };
        };
        formulaComponents[i].brierSumPlusTScore = formulaComponents[i].finalBrierSum + formulaComponents[i].tScore;
        arrToReturn[i].finalScore = formulaComponents[i].brierSumPlusTScore;
        arrToReturn[i].captainedStatus = forecastObj.submittedForecasts[i].captainedStatus;
    };
    return arrToReturn;
};

// Reset user's password
router.patch("/reset/resetUserAccFromLogin/fireEmail/resetPW/r", cors(), async (req, res) => {
    try {
        console.log("In reset");
        const user = await Users.findOne({ username: req.body.username, email: req.body.email });
        if (user) {
            let newPW = crypto.randomBytes(20).toString("hex");
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "fantasyforecastcontact@gmail.com", // generated ethereal user
                    pass: "mhpfaejoxvlkftdw", // generated ethereal password
                },
                    tls: {
                        rejectUnauthorized: false
                }
            });
            const hashedNewPW = await bcrypt.hash(newPW, 10);

            const updatedUser = await Users.findByIdAndUpdate(user._id, { password: hashedNewPW });
            if (updatedUser) {
                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: 'fantasyforecastcontact@gmail.com', // sender address
                    to: user.email, // list of receivers
                    subject: "Fantasy Forecast Password Reset", // Subject line
                    text: `Your new password is ${newPW}. If this wasn't you, we recommend you log on to your account, head to your profile page, and change your password at the bottom of the profile page. If you did make this reset request, we still recommend you change your password yourself through your profile page just to be safe. Many thanks, Louis - Fantasy Forecast`, // plain text body
                    html:
                    `Your new password is ${newPW}</p><br /><p>If this wasn't you, we recommend you log on to your account, head to your profile page, and change your password at the bottom of the profile page.</p><br /><p>If you did make this reset request, we still recommend you change your password yourself through your profile page just to be safe.</p><p>Many thanks,</p><p>Louis - Fantasy Forecast</p>`, // html body
                });
                console.log("Message sent: %s", info.messageId);
                res.json({ resetSuccess: true, errorMessage: "User updated" });
            } else {
                res.json({ resetSuccess: false, errorMessage: "Unable to update user info" });
            }
        } else if (!user) {
            res.json({ resetSuccess: false, errorMessage: "No user exists with those credentials" });
        }
    } catch (err) {
        console.error("Error in users > reset");
        console.error(err);
        res.json({ resetSuccess: false, errorMessage: err });
    };
});

module.exports = router;