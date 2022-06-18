const express = require('express');
const router = express.Router();
const Leaderboards = require('../models/Leaderboards');

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
            leaderboardNames.push([leaderboard.leaderboardName, leaderboard.isPublic, leaderboard.isFFLeaderboard, false]);
        } else if (leaderboard.rankings.find(el => el.username === req.params.username) !== undefined || req.params.username === "admin") {
            // User IS in this market
            leaderboardNames.push([leaderboard.leaderboardName, leaderboard.isPublic, leaderboard.isFFLeaderboard, true]);
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
router.get("/leaderboard/:leaderboardName", async (req, res) => {
    const data = await Leaderboards.findOne({ leaderboardName: req.params.leaderboardName });
    const sortedData = data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
    res.json(sortedData);
})

// Get all leaderboard info to render
router.get("/leaderboard/getAllInfoToRender", async (req, res) => {
    try {
        console.log(req.body);
        // req.body contains 
        // rankings leaderboard (array)
        // username of logged in user (string)
        // isFFLeaderboard boolean
        // leaderboardTitle string

        // must return
        // value for setUserInMarket 
        // new rankings array containing all info

        let rankingsFromBody = req.body.rankings;
        let userInMarket = false;
        let usersData = [];
        let ffData = [];
        let ffRankings = [];
          for (let i = 0; i < rankingsFromBody.length; i++) {
            console.log(rankingsFromBody[i]);
            const userDocumentFF = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${rankings[i].username}`);
            // Check if logged in user is in market, true will allow them to invite etc
            if (userDocumentFF.data[0].username === props.username) {
                userInMarket = true;
            };
            if (req.body.isFFLeaderboard === false || req.body.leaderboardTitle === "Fantasy Forecast All-Time") {
              ffRankings[i] = {
                profilePicture: rankingsFromBody[i].profilePicture,
                username: rankingsFromBody[i].username,
                marketPoints: 0.0,
                brierScores: [],
                avgAllTimeBrier: 0.0
              };
              ffRankings[i].profilePicture = rankingsFromBody[i].profilePicture;
              ffRankings[i].username = rankingsFromBody[i].username;
              ffRankings[i].marketPoints = userDocumentFF.data[0].fantasyForecastPoints;
              ffRankings[i].brierScores = userDocumentFF.data[0].brierScores;
      
              let totalBrierForUser = 0;
              for (let j = 0; j < userDocumentFF.data[0].brierScores.length; j++) {
                totalBrierForUser += userDocumentFF.data[0].brierScores[j].brierScore;
              }
              let avgAllTimeBrier = (totalBrierForUser / userDocumentFF.data[0].brierScores.length);
              ffRankings[i].avgAllTimeBrier = isNaN(avgAllTimeBrier) ? 0.0 : avgAllTimeBrier;
            } else {
              rankingsFromBody[i].brierScores = [];
              let totalBrier = 0;
              let numberOfBriersInThisMarket = 0;
              if (userDocumentFF.data[0].brierScores.length > 0) {
                // Loop through the user's briers, adding to the user's average calculation while pushing simultaneously
                  for (let j = 0; j < userDocumentFF.data[0].brierScores.length; j++) {
                      if (userDocumentFF.data[0].brierScores[j].marketName === req.body.leaderboardTitle) {
                          numberOfBriersInThisMarket++;
                          rankingsFromBody[i].brierScores.push({
                              problemName: userDocumentFF.data[0].brierScores[j].problemName,
                              brierScore: userDocumentFF.data[0].brierScores[j].brierScore
                          });
                          totalBrier += userDocumentFF.data[0].brierScores[j].brierScore;
                      };
                  };
              };
              if (userDocumentFF.data[0].brierScores.length === 0) {
                    rankingsFromBody[i].avgBrierScore = 0;
              } else {
                  let avgBrierScore = totalBrier / numberOfBriersInThisMarket;
                  rankingsFromBody[i].avgBrierScore = isNaN(avgBrierScore) ? 0.0 : totalBrier/numberOfBriersInThisMarket;
              };
            };
          };
          // Outside of main loop:
          if (req.body.isFFLeaderboard === false || req.body.leaderboardTitle === "Fantasy Forecast All-Time") {
            ffRankings = ffRankings.sort((a, b) => b.marketPoints - a.marketPoints);
            // usersData = ffRankings;
            // ffData = ffRankings;
            res.json({
                rankings: rankingsFromBody,
                userInMarket: userInMarket,
                usersData: ffRankings,
                ffData: ffRankings
            });
          } else {
            // setUsersData(rankingsFromBody);
            if (rankingsFromBody.find(el => el.username === props.username) !== undefined) {
                userInMarket = true;
            };
            res.json({
                rankings: rankingsFromBody,
                userInMarket: userInMarket,
                usersData: ffRankings,
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