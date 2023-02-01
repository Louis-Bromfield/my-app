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
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const Sessions = require('../models/Sessions');
const Surveys = require('../models/Surveys');

router.use(cookieParser());

const checkCookie = async (req, res, next) => {
    try {
        // console.log("=========1======");
        // // console.log(req.cookies);
        // console.log(req.cookies.secureCookie);
        // console.log("=========2======");
        // console.log(typeof req.cookies.secureCookie);
        // console.log(req.cookies.secureCookie.sessionID);
        // console.log(req.cookies.secureCookie.indexOf("sessionID"));
        // console.log(req.cookies.secureCookie.slice(req.cookies.secureCookie.indexOf("sessionID")+12, 107));

        // if no doc with sessionID exists, return err
        const sessionIDFromCookie = req.cookies.secureCookie.slice(req.cookies.secureCookie.indexOf("sessionID")+12, 107);
        const sessionInDB = await Sessions.findOne({ sessionID: sessionIDFromCookie});
        // console.log(sessionInDB);
        // console.log("=========6======");
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
            const err = new Error(`Session is in DB but expired!!`);
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
    // err.statusCode= err.statusCode || 500
    // err.status= err.status || 'error'
    // res.status(err.statusCode).json({
    //     status:err.status,
    //     message:err.message,
    //     signUserOut: true
    // });
    res.redirect("/");
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
// router.get("/:username", checkCookie, async (req, res) => {
router.get("/:username", async (req, res) => {
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
        } else if (user.isTeam === true) {
            res.json({ loginSuccess: false, message: "This is a team account. Please login to your individual account."})
        }
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
    console.log("NEW USER CREATION");
    // CHARMANDER - hash password:
    // const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({
        username: req.body.username,
        pID: req.body.pID,
        password: hashedPassword
    });
    try {
        // Save to DB
        const newUserSavedToDB = await newUser.save();
        // res.status(200).json(newUserSavedToDB);
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

// Persist a survey response
router.post("/surveyResponse", async (req, res) => {
    try {
        const newSurveyResponse = new Surveys({
            username: req.body.username,
            submitMsg: req.body.submitMsg,
            selfAssessedPolKnowledge: req.body.selfAssessedPolKnowledge,
            currentHomeSecretary: req.body.currentHomeSecretary,
            currentDeputyPM: req.body.currentDeputyPM,
            currentSOSHSC: req.body.currentSOSHSC,
            currentSOSLUHC: req.body.currentSOSLUHC,
            currentSOSScotland: req.body.currentSOSScotland,
            currentLibDemLeader: req.body.currentLibDemLeader,
            currentSNPHOCLeader: req.body.currentSNPHOCLeader,
            currentShadowChanc: req.body.currentShadowChanc,
            currentShadowSOST: req.body.currentShadowSOST,
            currentSpeaker: req.body.currentSpeaker,
            pollStationCloseTime: req.body.pollStationCloseTime,
            dayOfPMQs: req.body.dayOfPMQs,
            constituencyCount: req.body.constituencyCount,
            depositPay: req.body.depositPay,
            electoralSystemName: req.body.electoralSystemName,
            ethicsAdvisorNames: req.body.ethicsAdvisorNames,
            inflationPercentage: req.body.inflationPercentage,
            unemploymentPercentage: req.body.unemploymentPercentage,
            noConfidenceVoteCount: req.body.noConfidenceVoteCount,
            publicBillsName: req.body.publicBillsName,
            opposingArgumentConvince: req.body.opposingArgumentConvince,
            evidenceAgainstBeliefs: req.body.evidenceAgainstBeliefs,
            reviseBeliefs: req.body.reviseBeliefs,
            changingYourMind: req.body.changingYourMind,
            intuitionIsBest: req.body.intuitionIsBest,
            perservereBeliefs: req.body.perservereBeliefs,
            disregardEvidence: req.body.disregardEvidence,
            foxHedgehogRating: req.body.foxHedgehogRating,
            politicalInterest: req.body.politicalInterest,
            politicalSpectrumPosition: req.body.politicalSpectrumPosition,
            ukPartySupporter: req.body.ukPartySupporter,
            currentAge: req.body.currentAge,
            identification: req.body.identification,
            highestQual: req.body.highestQual,
            householdIncome: req.body.householdIncome,
            ukBased: req.body.ukBased,
        });
        await newSurveyResponse.save();
        res.json({ surveySuccess: true });
    } catch (err) {
        console.err("Error in users > surveyResponse");
        console.err(err);
        res.json({ surveySuccess: false });
    };
});

// Add a notification to the user's notification array
router.patch("/newNotification/:username", async (req, res) => {
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
            // await Users.findOneAndUpdate({ username: req.body.author }, {
            //     ratings: user.ratings
            // });
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
router.patch("/editNotifications/:username", async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        console.log("+++++++++++++++++++++++++++");
        let user = await Users.findOne({ username: req.params.username });
        console.log(user);
        console.log("+++++++++++++++++++++++++++++++++++++");
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
        console.log("======================");
        console.log(userOnboarding);
        console.log(userFFPoints);
        console.log("======================");

        // Check if they've completed all onboarding tasks
        let allOnboardingTrue = true;
console.log("allOnboardingTrue should be true = " + allOnboardingTrue);
        for (let i = 0; i < Object.keys(userOnboarding).length; i++) {
console.log("Current item = " + Object.values(userOnboarding)[i]);
            if (Object.values(userOnboarding)[i] === false) {
console.log("I have found an onboarding task you haven't completed yet");
                allOnboardingTrue = false;
                // break;
            };
        };
console.log("the for loop checking your onboarding has now finished, time to see if allOnboardingTrue is true or not. It should be false in these tests = " + allOnboardingTrue);
        if (allOnboardingTrue === true) {
console.log("allOnboardingTrue is " + allOnboardingTrue + ", it should only be calling this code if true");
            for (let i = 0; i < user.trophies.length; i++) {
                if (user.trophies[i].trophyText === "Ready To Go" && user.trophies[i].obtained === false) {
console.log("we have found the ready to go trophy, time to award it to you!");
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
            articleVisits: req.body.articleVisits,
            completedSurvey: req.body.completedSurvey,
            notifications: req.body.notifications,
            trophies: req.body.trophies,
            inTeam: req.body.inTeam,
            teamName: req.body.teamName
        },
        { new: true }
    );
    res.json(updatedUser);
    } catch (error) {
        res.json({ error: error.message })
    }
});

router.patch("/createJoinLeaveTeam/:username", async (req, res) => {
    try {
        const document = await Users.findOne({ username: req.params.username });
        console.log("_________________");
        console.log(document);
        
        if (req.body.action === "leave") {
            // const updatedUser = await Users.findByIdAndUpdate(document._id, {
            //     inTeam: false,
            //     teamName: ""
            // });
            // console.log("_________________");
            // console.log(updatedUser);
            console.log("oldteam = " + req.body.oldTeam);
            const teamDocument = await Users.findOne({ username: req.body.oldTeam });
            console.log(teamDocument);
            console.log(teamDocument.members);
            console.log(teamDocument.members.length);
            let newMembersArr = [];
            for (let i = 0; i < teamDocument.members.length; i++) {
                if (teamDocument.members[i] !== req.params.username) {
                    newMembersArr.push(teamDocument.members[i]);
                };
            };
            await Users.findByIdAndUpdate(teamDocument._id, {
                members: newMembersArr
            });
            res.json({ success: true, message: "Member has left team"});

        } else if (req.body.action === "join") {
            // check if they joining user is already in the team
            let team = await Users.findOne({ username: req.body.teamName});
            for (let i = 0; i < team.members.length; i++) {
                if (team.members[i] === req.params.username) {
                    res.json({ success: false, message: "User is already in this team" });
                };
            };
            // update user document
            const user = await Users.findOneAndUpdate({ username: req.params.username}, {
                inTeam: true,
                teamName: req.body.teamName 
            });
            // update team document members array (just push)
            // let team = await Users.findOne({ username: req.body.teamName});
            team.members.push(req.params.username);
            const updatedTeam = await Users.findByIdAndUpdate(team._id, {
                members: team.members
            });
            // send notification to all team members informing them of new team mate
            for (let i = 0; i < team.members.length; i++) {
                if (team.members[i] !== req.params.username) {
                    let user = await Users.findOne({ username: team.members[i] });
                    user.notifications.push({
                        notificationMessage: `${team.members[i]} has joined your team! Head to your profile page and select "My Team" to see them!)`,
                        notificationSourcePath: "/profile",
                        notificationSourceObjectID: 1
                    });
                    await Users.findByIdAndUpdate(user._id, {
                        notifications: user.notifications
                    });
                };
            };

        } else if (req.body.action === "create") {
            // Check if name has already been taken
            const users = await Users.findOne();
            for (let i = 0; i < users.length; i++) {
                if (users[i].username === req.body.teamName) {
                    res.json({ success: false, message: "Team name already taken. Please choose a different one."});
                } 
            }
            const res = await Users.findOneAndUpdate({ username: req.params.username }, {
                inTeam: true,
                teamName: req.body.teamName
            });
            // create new user document for the team
            const newTeamDocument = new Users({
                username: req.body.teamName,
                members: [req.params.username],
                profilePicture: "https://lh3.googleusercontent.com/a/AItbvmkRUSgd_Izrhz4X-ft3do7Li1X0OsBPAzgh9r4G=s96-c",
                isTeam: false
            });
            await newTeamDocument.save();
            res.json({ success: true, message: "Team successfully created"});
        };
    } catch (error) {
        console.log("ERROR");
        console.log(error);
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
                // $push: { brierScores: toPush },
                brierScores: user.brierScores,
                trophies: user.trophies,
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                notifications: user.notifications,
                // $push: { notifications: {
                //     notificationMessage: `You scored ${toPush.brierScore} on the following forecast: ${toPush.problemName}!`,
                //     notificationSourcePath: "/forecast",
                //     notificationSourceObjectID: forecastObj._id,
                //     seenByUser: false,
                //     date: new Date(),
                //     notificationIndex: user.notifications.length+1
                // }},
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
        let teamsArr = [];

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
                // $push: { brierScores: toPush },
                brierScores: user.brierScores,
                fantasyForecastPoints: Number(user.fantasyForecastPoints) + toPush.brierScore,
                forecastClosedStatus: true,
                numberOfClosedForecasts: Number(user.numberOfClosedForecasts) + 1,
                notifications: user.notifications,
                // $push: { notifications: {
                //     notificationMessage: `You scored ${toPush.brierScore} on the following forecast: ${toPush.problemName}!`,
                //     notificationSourcePath: "/forecast",
                //     notificationSourceObjectID: forecastObj._id,
                //     seenByUser: false,
                //     date: new Date(),
                //     notificationIndex: user.notifications.length+1
                // }},
                unseenNotificationCount: Number(user.unseenNotificationCount) + 1
            },
            { new: true }
            );
            toPush.username = calculatedBriers[i].username;
            scoresToReturn.push(toPush);
            // if user is in team, add to teams array
            if (user.inTeam === true && teamsArr.length > 0) {
                let found = false;
                for (let j = 0; j < teamsArr.length; j++) {
                    if (teamsArr[j][0] === user.teamName) {
                        found = true;
                        teamsArr[j].push({
                            username: user.username,
                            score: calculatedBriers[i].finalScore
                        });
                    }
                };
                if (found === false) {
                    teamsArr.push([
                        user.teamName,
                        {
                            username: user.username,
                            score: calculatedBriers[i].finalScore
                        }
                    ])
                }
            };
        };
        // Calculate team scores
        let allUserDocuments = await Users.find();
        for (let i = 0; i < teamsArr.length; i++) {
            let teamTotalScore = 0;
            // j = 1 as we don't want to include first element - as that's the team name string
            for (let j = 1; j < teamsArr[i].length; j++) {
                teamTotalScore += teamsArr[i][j].score
            };
            // length-1 as we don't want to include first element
            let teamFinalScore = teamTotalScore / teamsArr[i].length-1;
            for (let k = 0; k < allUserDocuments.length; k++) {
                if (allUserDocuments[k].username === teamsArr[i][0]) {
                    let updatedTeamDoc = allUserDocuments[k];
                    updatedTeamDoc.brierScores.push({
                        brierScore: teamFinalScore,
                        problemName: req.body.problemName,
                        marketName: req.params.marketName,
                        averageScore: averageScoreForProblem
                    });
                    await Users.findByIdAndUpdate(updatedTeamDoc._id, {
                        brierScores: updatedTeamDoc.brierScores
                    });
                }
            }
            // Send each team member a notification about how their team performed
            for (let j = 1; j < teamsArr[i].length; j++) {
                let userForTeamNoti = await Users.findOne({ username: teamsArr[i][j].username });
                userForTeamNoti.notifications.unshift({
                    notificationMessage: `Your team scored ${teamTotalScore.toFixed(2)} on the following forecast: ${req.body.problemName}! To see the breakdown of how your team performed, go to your profile page, select your team from the dropdown at the top, and go to the "My Team" tab!`,
                    notificationSourcePath: "/profile",
                    notificationSourceObjectID: 1,
                    seenByUser: false,
                    date: new Date(),
                    notificationIndex: userForTeamNoti.notifications.length+1
                });
                await Users.findOneAndUpdate({ username: teamsArr[i][j].username }, {
                    notifications: userForTeamNoti.notifications
                });
            };
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

// Reset user's password
router.patch("/reset/resetUserAccFromLogin/fireEmail/resetPW/r", async (req, res) => {
    try {
        console.log("In reset");
        const user = await Users.findOne({ username: req.body.username, email: req.body.email });
        const fakeUser = await Users.findOne({ username: "78w5786y3487ty65348e75", email: "88w7e8r678sdfsdhjfbsdjh" });
        console.log(user);
        console.log("this is response when user isn't found vvvvv");
        console.log(fakeUser);
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
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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