const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Forecasts = require('../models/Forecasts');
const { UploadImage } = require("../controllers/uploadImage");
const parser = require("../middleware/cloudinary.config");
const Images = require("../models/Images");
const HomePageNewsFeedPosts = require('../models/HomePageNewsFeedPosts');
const Leaderboards = require('../models/Leaderboards');

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
router.get("/:username", async (req, res) => {
    try {
        const user = await Users.find({ username: req.params.username });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username in users.js");
        console.error(error);
    };
});

// Get one user for logging in
router.get("/:username/:password", async (req, res) => {
    try {
        const user = await Users.find({ username: req.params.username, password: req.params.password });
        res.json(user);
    } catch (error) {
        console.error("Error in router.get/username/password in users.js");
        console.error(error);
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
        brierScores: [],
        numberOfClosedForecasts: 0,
        profilePicture: req.body.profilePicture
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
            markets: req.body.markets,
            numberOfClosedForecasts: req.body.numberOfClosedForecasts,
            profilePicture: req.body.profilePicture
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

router.patch("/calculateBrier/:problemName/:happenedStatus/:marketName/:closeEarly", async (req, res) => {
    try {
        // Get usernames of everyone who made a forecast + their forecasts
        // const forecastDocument = await Forecasts.find();
        const forecastObj = await Forecasts.findOne({ problemName: req.params.problemName });
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
        const calculatedBriers = calculateBriers(forecastObj, happened);
        let scoresToReturn = [];
        for (let i = 0; i < calculatedBriers.length; i++) {
            const user = await Users.findOne({ username: calculatedBriers[i].username });
            // Work out if they should receive a performance bonus for this Brier Score
            let scoreChain = 1;
            if (calculatedBriers[i].finalScore >= 90 || (calculatedBriers[i].captainedStatus === true && calculatedBriers[i].finalScore >= 180)) {
                for (let i = user.brierScores.length-1; i >= 0; i--) {
                    if (user.brierScores[i].marketName === req.params.marketName) {
                        if (user.brierScores[i].brierScore >= 90) {
                            scoreChain++;
                        } else {
                            break;
                        }
                    }
                };
                // If scoreChain === 1, the only prediction >= 90 is the current one, 1x streak = 5% boost
                if (scoreChain === 1) {
                    boost = 0.05;
                    newScorePerformanceBoosted = calculatedBriers[i].finalScore + (calculatedBriers[i].finalScore * boost);
                } else {
                    // If scoreChain > 1, they're on a streak of more than 1 consecutive problems in this market scoring >= 90
                    // 2x streak = 6% boost, 3x streak = 7% boost, 4x streak = 8% boost, etc etc.
                    boost = 0.04 + (scoreChain/100);
                    newScorePerformanceBoosted = calculatedBriers[i].finalScore + (calculatedBriers[i].finalScore * boost);
                };
            };
            const toPush = {
                brierScore: newScorePerformanceBoosted,
                problemName: req.params.problemName,
                marketName: req.params.marketName,
                captainedStatus: calculatedBriers[i].captainedStatus
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
const calculateBriers = (forecastObj, happened) => {
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
            let tValue = (closeDate - new Date(forecastObj.submittedForecasts[i].forecasts[0].date))/1000;
            let timeFrame = (closeDate - startDate)/1000;
            tScore = (tValue/timeFrame)*10;
        } else {
            tScore = 0;
        };
        formulaComponents[i].tScore = tScore;

        // Sum of Weighted Briers
        let sumOfNewWeightedBriers = 0;
        for (let j = 0; j < forecastObj.submittedForecasts[i].forecasts.length; j++) {
            // Double check to make sure that no forecasts submitted after the problem has closed are included
            // This is especially important for instances where I have had to close the problem early 
            // as someone may have submitted a forecast before I had a chance to close it

            // Forecast WAS made before close date
            console.log(`${new Date(forecastObj.submittedForecasts[i].forecasts[j].date)} < ${closeDate}`);
            if (new Date(forecastObj.submittedForecasts[i].forecasts[j].date) < closeDate) {
                let originalBrier;
                if (happened === true) {
                    originalBrier = (((1 - forecastObj.submittedForecasts[i].forecasts[j].certainty) * (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) + ((0 - (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) * (0 - (1 -forecastObj.submittedForecasts[i].forecasts[j].certainty))));
                } else if (happened === false) {
                    originalBrier = (((0 - forecastObj.submittedForecasts[i].forecasts[j].certainty) * (0 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) + ((1 - (1 - forecastObj.submittedForecasts[i].forecasts[j].certainty)) * (1 - (1 -forecastObj.submittedForecasts[i].forecasts[j].certainty))));
                };
                let newBrier = (2 - originalBrier) * 50;

                let newBrierWeightedByDuration;
                let thisForecastTimeDate = new Date(forecastObj.submittedForecasts[i].forecasts[j].date);
                if (j < forecastObj.submittedForecasts[i].forecasts.length-1) {
                    let nextForecastTimeDate = new Date(forecastObj.submittedForecasts[i].forecasts[j+1].date);
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);

                    // Boosting
                    if (forecastObj.submittedForecasts[i].captainedStatus === true) {
                        if (happened === true) {
                            if (forecastObj.submittedForecasts[i].forecasts[j].certainty > 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))*2);
                            } else if (forecastObj.submittedForecasts[i].forecasts[j].certainty < 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))/2);
                            } else {
                                newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            }
                        } else if (happened === false) {
                            if (forecastObj.submittedForecasts[i].forecasts[j].certainty > 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))/2);
                            } else if (forecastObj.submittedForecasts[i].forecasts[j].certainty < 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))*2);
                            } else {
                                newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            }
                        }
                    } else if (forecastObj.submittedForecasts[i].captainedStatus === false) {
                        newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                    }
                    sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                }
                else if (j === forecastObj.submittedForecasts[i].forecasts.length-1) {
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (closeDate - thisForecastTimeDate)/1000;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);

                    // Boosting
                    if (forecastObj.submittedForecasts[i].captainedStatus === true) {
                        if (happened === true) {
                            if (forecastObj.submittedForecasts[i].forecasts[j].certainty > 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))*2);
                            } else if (forecastObj.submittedForecasts[i].forecasts[j].certainty < 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))/2);
                            } else {
                                newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            }
                        } else if (happened === false) {
                            if (forecastObj.submittedForecasts[i].forecasts[j].certainty > 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))/2);
                            } else if (forecastObj.submittedForecasts[i].forecasts[j].certainty < 0.5) {
                                newBrierWeightedByDuration = ((newBrier * (percentageOfTimeAtThisScore/100))*2);
                            } else {
                                newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            }
                        }
                    } else if (forecastObj.submittedForecasts[i].captainedStatus === false) {
                        newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                    }

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
        arrToReturn[i].finalScore = Number((formulaComponents[i].finalBrierSum + formulaComponents[i].tScore).toFixed(2));
        arrToReturn[i].captainedStatus = forecastObj.submittedForecasts[i].captainedStatus;
    };
    return arrToReturn;
};

module.exports = router;