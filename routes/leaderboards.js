const express = require('express');
const router = express.Router();
const Leaderboards = require('../models/Leaderboards');
const Users = require("../models/Users");

// Get all leaderboards
router.get("/", async (req, res) => {
    const leaderboards = await Leaderboards.find();
    let leaderboardNames = [];
    Object.values(leaderboards).forEach(leaderboard => {
        leaderboardNames.push(leaderboard);
    });
    res.json(leaderboardNames);
});

// Get all leaderboards
router.get("/justNames/:username", async (req, res) => {
    const leaderboards = await Leaderboards.find();
    let leaderboardNames = [];
    Object.values(leaderboards).forEach(leaderboard => {
        if (leaderboard.rankings.find(el => el.username === req.params.username) === undefined || req.params.username === "admin") {
            // User is NOT in this market
            leaderboardNames.push([leaderboard.leaderboardName, leaderboard.isPublic, leaderboard.isFFLeaderboard, false, leaderboard.rankings]);
        } else if (leaderboard.rankings.find(el => el.username === req.params.username) !== undefined || req.params.username === "admin") {
            // User IS in this market
            leaderboardNames.push([leaderboard.leaderboardName, leaderboard.isPublic, leaderboard.isFFLeaderboard, true, leaderboard.rankings]);
        }
    });
    res.json(leaderboardNames);
});

// Get all leaderboards that a user is in
router.get("/:username", async (req, res) => {
    const allLeaderboards = await Leaderboards.find();
    let allUserLeaderboards = [];
    Object.values(allLeaderboards).forEach(leaderboard => {
        const found = leaderboard.rankings.some(rankings => rankings.username === req.params.username);
        if (found) {
            allUserLeaderboards.push(leaderboard);
        };
    });
    res.json(allUserLeaderboards);
});

// Get all the info from one leaderboard
router.get("/leaderboard/:leaderboardName/", async (req, res) => {
    const data = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
    const sortedData = data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
    res.json(sortedData);
})

// New version of service above this, as we aren't really using the leaderboard collection anymore
router.get("/newGetLeaderboardRoute/:leaderboardName", async (req, res) => {
    try {
        const allUsers = await Users.find();
        console.log(allUsers);
        let usersForMarket = [];
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].markets.includes(req.params.leaderboardName)) {
                console.log("yes it does include this market");
                allUsers[i].totalForMarket = 0;
                for (let j = 0; j < allUsers[i].brierScores.length; j++) {
                    if (allUsers[i].brierScores[j].marketName === req.params.leaderboardName) {
                        allUsers[i].totalForMarket += allUsers[i].brierScores[j].brierScore;
                    };
                };
                usersForMarket.push(allUsers[i]);
                console.log("new user pushed!");
            };
        };
        usersForMarket = usersForMarket.sort((a, b) => b.totalScoreForMarket - a.totalScoreForMarket);
        console.log(usersForMarket);
        res.json(usersForMarket);
    } catch (err) {
        console.error("Error in leaderboards > newGetLeaderboardRoute");
        console.error(err);
    };
});

// Get all leaderboard info to render
// Issue at the moment is that none of the additons to the allUsers[i] objects is persisting
// e.g. line 74: .brierScoresForMarket is non-existent in returned allUsers array of objects
router.get("/getAllInfoToRender/:isFFLeaderboard/:leaderboardTitle/:localStorageLBName", async (req, res) => {
    try {
        const allUsers = await Users.find();
        let ffRankings = [];
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].markets.includes(req.params.leaderboardTitle)) {
                if (req.params.isFFLeaderboard === "false" || req.params.leaderboardTitle === "Fantasy Forecast All-Time") {
                    ffRankings[i] = {
                        profilePicture: allUsers[i].profilePicture,
                        username: allUsers[i].username,
                        marketPoints: 0.0,
                        brierScores: [],
                        avgAllTimeBrier: 0.0
                      };
                      ffRankings[i].profilePicture = allUsers[i].profilePicture;
                      ffRankings[i].username = allUsers[i].username;
                      ffRankings[i].marketPoints = allUsers[i].fantasyForecastPoints;
                      ffRankings[i].brierScores = allUsers[i].brierScores;
                } else {
                    allUsers[i].brierScoresForMarket = [];
                    let totalBrier = 0;
                    let numberOfBriersInThisMarket = 0;
                    if (allUsers[i].brierScores.length > 0) {
                        for (let j = 0; j < allUsers[i].brierScores.length; j++) {
                            if (allUsers[i].brierScores[j].marketName === req.params.leaderboardTitle || allUsers[i].brierScores[j].marketName === req.params.localStorageLBName) {
                                numberOfBriersInThisMarket++;
                                allUsers[i].brierScoresForMarket.push({
                                    problemName: allUsers[i].brierScores[j].problemName,
                                    brierScore: allUsers[i].brierScores[j].brierScore
                                });
                                totalBrier += allUsers[i].brierScores[j].brierScore;
                            };
                        };
                    };
                    if (allUsers[i].brierScores.length === 0) {
                        allUsers[i].avgBrierScore = 0;
                    } else {
                        let avgBrierScore = totalBrier / numberOfBriersInThisMarket;
                        allUsers[i].avgBrierScore = isNaN(avgBrierScore) ? 0.0 : totalBrier/numberOfBriersInThisMarket;
                        allUsers[i].totalBrier = totalBrier;
                    };
                }
            }
        };
        // Outside of main loop:
        if (req.params.isFFLeaderboard === false || req.params.leaderboardTitle === "Fantasy Forecast All-Time" || req.params.localStorageLBName === "Fantasy Forecast All-Time") {
            const ffRankingsSorted = ffRankings.sort((a, b) => b.marketPoints - a.marketPoints);
            console.log("ffRankings")
            res.json({
                rankings: ffRankingsSorted,
                topThree: [ffRankingsSorted[0], ffRankingsSorted[1], ffRankingsSorted[2]]
            });
        } else {
            console.log(allUsers);
            const allUsersSorted = allUsers.sort((a, b) => b.totalBrier - a.totalBrier);
            console.log("allUsersSorted");
            res.json({
                rankings: allUsersSorted,
                topThree: [allUsersSorted[0], allUsersSorted[1], allUsersSorted[2]]
            });
        };
    } catch (err) {
        console.error("Error in getAllInfoToRender");
        console.error(err);
        res.json({ Error: "Error, failed to return leaderboard data"});
    };
});

// Create a leaderboard
router.post("/", async (req, res) => {
    const newLeaderboard = new Leaderboards({
        leaderboardName: req.body.leaderboardName,
        rankings: req.body.rankings,
        isPublic: req.body.isPublic,
        isFFLeaderboard: req.body.isFFLeaderboard
    });
    try {
        const leaderboardSavedToDB = await newLeaderboard.save();
        res.status(200).json(leaderboardSavedToDB);  
    } catch (error) {
        res.json({ message: error.message });
    };
});

// Update market points for a closed problem
router.patch("/closedProblem/:market", async (req, res) => {
    try {
        const marketDocument = await Leaderboards.findOne({ leaderboardName: req.params.market });
        for (let i = 0; i < req.body.scores.scores.length; i++) {
            const index = marketDocument.rankings.indexOf(marketDocument.rankings.find(el => el.username === req.body.scores.scores[i].username));
            marketDocument.rankings[index].marketPoints += req.body.scores.scores[i].brierScore;
// console.log(`${i} done`);
        };
        const updatedMarket = await Leaderboards.findByIdAndUpdate(marketDocument._id, { rankings: marketDocument.rankings }, { new: true });
        res.json(updatedMarket);
    } catch (error) {
        console.error("Error in leaderboards > closedProblem/market/scores");
        console.error(error);
    };
});

// Add a user to a leaderboard
router.patch("/:leaderboardName", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        if (document.rankings.some(user => user.username === req.body.username)) {
            res.json({ message: "User is already in this market"});
        } else if (req.params.leaderboardName === "Fantasy Forecast All-Time") {
            const toPushToDB = { username: req.body.username, marketPoints: 0, isGroup: req.body.isGroup, acceptedInvite: true, profilePicture: req.body.profilePicture };
            const newLeaderboardDataPushedToDB = await Leaderboards.findByIdAndUpdate(document._id,
                {
                    $push: { rankings: toPushToDB },
                },
                { new: true }
            );
            res.json(newLeaderboardDataPushedToDB);
        } else {
            const toPushToDB = { username: req.body.username, marketPoints: 0, isGroup: req.body.isGroup, acceptedInvite: false };
            const newLeaderboardDataPushedToDB = await Leaderboards.findByIdAndUpdate(document._id,
                {
                    $push: { rankings: toPushToDB },
                },
                { new: true }
            );
            res.json(newLeaderboardDataPushedToDB);
        };
    } catch (error) {
        console.error("Error in leaderboards.js > patch");
        console.error(error);
    }
});

// Kick a user from a leaderboard
router.patch("/kick/:leaderboardName", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        let userIndex = document.rankings.findIndex(el => el.username === req.body.username);
        document.rankings.splice(userIndex, 1);
        const newLeaderboardDataPushedToDB = await Leaderboards.findByIdAndUpdate(document._id,
            {
                rankings: document.rankings
            },
            { new: true }
        );
        res.json(newLeaderboardDataPushedToDB);
    } catch (error) {
        console.error("Error in leaderboards.js > patch");
        console.error(error);
    }
});

// Add a user to a leaderboard from market sign up - always add
router.patch("/marketSignUp/:leaderboardName", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        if (document.rankings.some(user => user.username === req.body.username)) {
            res.json({ message: "User is already in this market"});
        } else {
            const toPushToDB = { username: req.body.username, marketPoints: 0, isGroup: req.body.isGroup, acceptedInvite: true, profilePicture: req.body.profilePicture };
            const newLeaderboardDataPushedToDB = await Leaderboards.findByIdAndUpdate(document._id,
                {
                    $push: { rankings: toPushToDB },
                },
                { new: true }
            );
            // Update user document
            const user = await Users.findOne({ username: req.body.username });
            const newMarkets = [user.markets, ...req.params.leaderboardName];
            await Users.findOneAndUpdate(user.username, { markets: newMarkets });
            res.json(newLeaderboardDataPushedToDB);
        };
    } catch (error) {
        console.error("Error in leaderboards.js > patch");
        console.error(error);
    }
});

// Remove a user from a leaderboard
router.patch("/removeUser/:leaderboardName/:username", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        if (document.rankings.some(user => user.username === req.params.username) === false) {
            res.json({ message: "User is not in this market" });
        } else {
            const index = document.rankings.findIndex(user => user.username === req.params.username);
            document.rankings.splice(index, 1);
            const newLeaderboardDataPushedToDB = await Leaderboards.findByIdAndUpdate(document._id,
                {
                    rankings: document.rankings,
                },
                { new: true }
            );
            // If the user who leaves is the last user in the leaderboard, delete it
            if (newLeaderboardDataPushedToDB.rankings.length === 0) {
                await Leaderboards.findByIdAndDelete(document._id);
            };
            // Also need to update userDocument markets array
            const userDocument = await Users.findOne({ username: req.params.username });
            const marketIndex = userDocument.markets.findIndex(market => market === req.params.leaderboardName);
            userDocument.markets.splice(marketIndex, 1);
            const newMarketDataPushedToDB = await Users.findByIdAndUpdate(userDocument._id,
                {
                    markets: userDocument.markets,
                },
                { new: true }
            );
            res.json({ 
                newLeaderboardDataPushedToDB: newLeaderboardDataPushedToDB, 
                newMarketDataPushedToDB: newMarketDataPushedToDB 
            });
        };
    } catch (error) {
        console.error("Error in Leaderboards > patch > remove user from leaderboard");
        console.error(error);
    }
});

// User accepts request to join leaderboard
router.patch("/:leaderboardName/acceptInvite/:username", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        for (let i = 0; i < document.rankings.length; i++) {
            if (document.rankings[i].username === req.params.username) {
                document.rankings[i].acceptedInvite = true;
            };
        };
        const updatedLBData = await Leaderboards.findByIdAndUpdate(document._id, 
            {
                rankings: document.rankings
            },
            { new: true }
        );
        res.json(updatedLBData);
    } catch (error) {
        console.error("Error in leaderboards.js > patch > acceptInvite");
        console.error(error);
    };
});

// User rejects invite or when user leaves leaderboard
router.patch("/:leaderboardName/removeUser/:username", async (req, res) => {
    try {
        const document = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
        for (let i = 0; i < document.rankings.length; i++) {
            if (document.rankings[i].username === req.params.username) {
                document.rankings.splice(i, 1);
            };
        };
        const updatedLBData = await Leaderboards.findByIdAndUpdate(document._id, 
            {
                rankings: document.rankings
            },
            { new: true }
        );
        res.json(updatedLBData);
    } catch (error) {
        console.error("Error in leaderboards.js > patch > acceptInvite");
        console.error(error);
    };
});

// Update all leaderboards when a user changes their username
router.patch("/changeUsername/:currentUsername", async (req, res) => {
    try {
        const allLeaderboards = await Leaderboards.find();
        let updatedArr = [];
        for (let i = 0; i < allLeaderboards.length; i++) {
            for (let j = 0; j < allLeaderboards[i].rankings.length; j++) {
                if (allLeaderboards[i].rankings[j].username === req.params.currentUsername) {
                    allLeaderboards[i].rankings[j].username = req.body.username;
                };
            };
            const updatedLBData = await Leaderboards.findByIdAndUpdate(allLeaderboards[i]._id, 
                {
                    rankings: allLeaderboards[i].rankings
                }, {
                    new: true 
                }
            );
            updatedArr.push(updatedLBData);
        };
        res.json(updatedArr);
    } catch (error) {
        console.error("Error in leaderboards > changeUsername");
        console.error(error);
    }
});

module.exports = router;