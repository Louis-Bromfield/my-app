const express = require('express');
const router = express.Router();
const Forecasts = require('../models/Forecasts');

// Get all forecasts
router.get("/", async (req, res) => {
    try {
        const allForecastData = await Forecasts.find();
        const sorted = allForecastData.sort(function (a, b){
            return new Date(a.closeDate) - new Date(b.closeDate);
        });
        res.json(sorted);
    } catch (error) {
        console.error(error);
    };
});

// Get one forecast
router.get("/:problemName", async (req, res) => {
    try {
        const forecast = await Forecasts.find({ problemName: req.params.problemName });
        res.json(forecast);
    } catch (error) {
        console.error("error in forecasts.js > get /:problemName");
        console.error(error);
    };
});

// Get a specific user's forecast object for a given problem
router.get("/:problemName/:username", async (req, res) => {
    try {
        const forecastObj = await Forecasts.find({ problemName: req.params.problemName });
        const userForecastData = forecastObj[0].submittedForecasts.find(el => el.username === req.params.username);
        const startDate = new Date(forecastObj[0].startDate);
        const closeDate = new Date(forecastObj[0].closeDate);

        const formulaComponents = [];
        let arrToReturn = [];

        formulaComponents[0] = [];
        formulaComponents[0].username = userForecastData.username;
        arrToReturn[0] = [];
        arrToReturn[0].username = userForecastData.username;

        // tScore
        let tScore;
        if (new Date(userForecastData.forecasts[0].date) < closeDate) {
            let tValue = (closeDate - new Date(userForecastData.forecasts[0].date))/1000;
            let timeFrame = (closeDate - startDate)/1000;
            tScore = (tValue/timeFrame)*10;
        } else {
            tScore = 0;
        };
        formulaComponents[0].tScore = tScore;

        let sumOfNewWeightedBriers = 0;
        let fullArrayToReturn = [];
        for (let i = 0; i < userForecastData.forecasts.length; i++) {
            fullArrayToReturn[i] = {certainty: "", date: "", comments: "", newBrier: 0, duration: "", percentageOfTimeAtThisScore: ""};

            // Forecast WAS made before close date
            if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                let originalBrier;
                if (forecastObj[0].happened === true) {
                    originalBrier = (((1 - userForecastData.forecasts[i].certainty) * (1 - userForecastData.forecasts[i].certainty)) + ((0 - (1 - userForecastData.forecasts[i].certainty)) * (0 - (1 -userForecastData.forecasts[i].certainty))));
                } else if (forecastObj[0].happened === false) {
                    originalBrier = (((0 - userForecastData.forecasts[i].certainty) * (0 - userForecastData.forecasts[i].certainty)) + ((1 - (1 - userForecastData.forecasts[i].certainty)) * (1 - (1 -userForecastData.forecasts[i].certainty))));
                };
                let newBrier = (2 - originalBrier) * 50;
                fullArrayToReturn[i].certainty = userForecastData.forecasts[i].certainty;
                fullArrayToReturn[i].date = userForecastData.forecasts[i].date;
                fullArrayToReturn[i].comments = userForecastData.forecasts[i].comments;
                fullArrayToReturn[i].newBrier = newBrier;

                let newBrierWeightedByDuration;
                let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                if (i < userForecastData.forecasts.length-1) {
                    let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                    fullArrayToReturn[i].duration = duration;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                    fullArrayToReturn[i].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                    newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                    sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                }
                else if (i === userForecastData.forecasts.length-1) {
                    let forecastTimeFrame = (closeDate - startDate)/1000;
                    let duration = (closeDate - thisForecastTimeDate)/1000;
                    fullArrayToReturn[i].duration = duration;
                    let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                    fullArrayToReturn[i].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                    newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                    sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                    formulaComponents[0].finalBrierSum = sumOfNewWeightedBriers;
                };
            // Forecast was NOT made before close date
            } else if (new Date(userForecastData.forecasts[i].date) > closeDate) {
                sumOfNewWeightedBriers = sumOfNewWeightedBriers + 0;
                if (i === userForecastData.forecasts.length-1) {
                    formulaComponents[0].finalBrierSum = sumOfNewWeightedBriers;
                };
            };
        };
        // formulaComponents[0].brierSumPlusTScore = formulaComponents[0].finalBrierSum + formulaComponents[0].tScore;
        // arrToReturn[0].finalScore = Number((formulaComponents[0].finalBrierSum + formulaComponents[0].tScore).toFixed(2));
        // console.log(formulaComponents);
        // console.log(arrToReturn);
        res.send(fullArrayToReturn);
    } catch (error) {
        console.error("error in forecasts.js > get /:problemName/:username");
        console.error(error);
    };
});

// Get all forecasts that are in the user's markets - currently doing the filtering client-side
router.get("/:markets", async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
    };
});

// Add a new problem to the database
router.post("/newProblem", async (req, res) => {
    try {
        console.log(req.body);
        const newProblem = new Forecasts({
            problemName: req.body.problemName,
            startDate: req.body.startDate,
            closeDate: req.body.closeDate,
            market: req.body.market,
            isClosed: false
        });
        const newProblemSavedToDB = await newProblem.save();
        res.status(200).json(newProblemSavedToDB);
    } catch (error) {
        console.error("Error in forecasts.js > post newProblem");
        console.error(error);
        res.json({ message: error.message });
    };
});


// Submit a prediction to a problem for the first time
router.patch("/submit/:problemName", async (req, res) => {
    try {
        const document = await Forecasts.findOne({ problemName: req.params.problemName });
        const toPushToDB = {
            username: req.body.username, 
            forecasts: [
                {
                    certainty: req.body.certainty, 
                    comments: req.body.comments, 
                    date: req.body.date
                }
            ], 
        };
        const newForecastSavedToDB = await Forecasts.findByIdAndUpdate(document._id, 
            { 
                $push: { submittedForecasts: toPushToDB },
            }, 
            { new: true }
        );
        console.log(newForecastSavedToDB);
        res.json(newForecastSavedToDB);
    } catch (error) {
        console.error("Error in forecasts.js > patch");
        console.error(error);
    }
});

// Update a prediction to a problem
router.patch("/update/:problemName", async (req, res) => {
    try {
        // find the Object in submittedForecasts[] where username = username
        const document = await Forecasts.findOne({ problemName: req.params.problemName });
        // push the passed in {certainty, comments} object to the end of the submittedForecasts.forecasts array
        // increase numberOfForecastsSubmittedByUser by 1 - not essential, as we could just take submittedForecasts.forecasts.length
        const updatedForecastPushedToDB = await Forecasts.findByIdAndUpdate(document._id, 
            { 
                $push: { [req.body.locationOfForecasts]: {
                    "certainty": req.body.updatedForecastsForUser.certainty, 
                    "comments": req.body.updatedForecastsForUser.comments, 
                    "date": req.body.updatedForecastsForUser.date 
                }}
            }, 
            { new: true }
        );
        res.json(updatedForecastPushedToDB);
    } catch (error) {
        console.error("Error in forecasts.js > update");
        console.error(error);
    }
});

// Update all instances of a username where a user has changed theirs
router.patch("/changeUsername/:username", async (req, res) => {
    try {
        const allForecastData = await Forecasts.find();
        for (let i = 0; i < allForecastData.length; i++) {
            for (let j = 0; j < allForecastData[i].submittedForecasts.length; j++) {
                if (allForecastData[i].submittedForecasts[j].username === req.params.username) {
                    allForecastData[i].submittedForecasts[j].username = req.body.username;
                    await Forecasts.findByIdAndUpdate(allForecastData[i]._id, { submittedForecasts: allForecastData[i].submittedForecasts}, { new: true });
                };
            };
        };
res.send("Done");
    } catch (error) {
        console.error("error in forecasts.js > changeUsername patch");
        console.error(error);
    }
});

module.exports = router;