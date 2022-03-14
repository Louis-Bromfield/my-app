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

// Get one forecast using ID
router.get("/getByID/:problemID", async (req, res) => {
    console.log("get3");
    try {
        const forecast = await Forecasts.find({ _id: req.params.problemID });
        res.json(forecast);
    } catch (error) {
        console.error("error in forecasts.js > get /:problemName");
        console.error(error);
    };
});

// Get a specific user's forecast object for a given problem
router.get("/:problemName/:closedStatus/:username/:singleCertainty", async (req, res) => {
    console.log(`req.params.singleCertainty === ${req.params.singleCertainty}`);
    try {
        if (req.params.closedStatus === "true") {
            console.log("problem is closed!");
            // LONG TERM PROBLEMS THAT ARE ONLY ONE OUTCOME
            if (req.params.singleCertainty === "true") {
                console.log("Problem has a single outcome");
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
                    fullArrayToReturn[i+1] = {certainty: "", date: "", comments: "", newBrier: 0, duration: "", percentageOfTimeAtThisScore: ""};

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let originalBrier;
                        if (forecastObj[0].happened === true) {
                            originalBrier = (((1 - userForecastData.forecasts[i].certainty) * (1 - userForecastData.forecasts[i].certainty)) + ((0 - (1 - userForecastData.forecasts[i].certainty)) * (0 - (1 -userForecastData.forecasts[i].certainty))));
                        } else if (forecastObj[0].happened === false) {
                            originalBrier = (((0 - userForecastData.forecasts[i].certainty) * (0 - userForecastData.forecasts[i].certainty)) + ((1 - (1 - userForecastData.forecasts[i].certainty)) * (1 - (1 -userForecastData.forecasts[i].certainty))));
                        };
                        let newBrier = (2 - originalBrier) * 50;
                        fullArrayToReturn[i+1].certainty = userForecastData.forecasts[i].certainty;
                        fullArrayToReturn[i+1].date = userForecastData.forecasts[i].date;
                        fullArrayToReturn[i+1].comments = userForecastData.forecasts[i].comments;
                        fullArrayToReturn[i+1].newBrier = newBrier;

                        let newBrierWeightedByDuration;
                        let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                        if (i < userForecastData.forecasts.length-1) {
                            let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                            newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                        }
                        else if (i === userForecastData.forecasts.length-1) {
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (closeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
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
                fullArrayToReturn[0] = {startDate: forecastObj[0].startDate, closeDate: forecastObj[0].closeDate, singleCertainty: forecastObj[0].singleCertainty};
                res.send(fullArrayToReturn);


            // SHORT TERM PROBLEMS WITH THREE OUTCOMES
            } else if (req.params.singleCertainty === "false") {
                console.log("Problem has multiple outcomes");
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
                    fullArrayToReturn[i+1] = {certaintyHigher: "", certaintySame: "", certaintyLower: "", date: "", comments: "", newBrier: 0, duration: "", percentageOfTimeAtThisScore: ""};

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let originalBrier;

                        let higherBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintyHigher, 2);
                        let higherBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintyHigher, 2)
                        let sameBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintySame, 2);
                        let sameBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintySame, 2)
                        let lowerBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintyLower, 2);
                        let lowerBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintyLower, 2)

                        // Change to working out Brier for if higher is correct, same is correct, or lower is correct
                        // .happened needs to be changed to .outcome === "higher" / .outcome === "same" / .outcome === "lower"
                        if (forecastObj[0].outcome === "increase") {
                            originalBrier = higherBrierIfCorrect + sameBrierIfIncorrect + lowerBrierIfIncorrect;
                        } else if (forecastObj[0].outcome === "same") {
                            originalBrier = sameBrierIfCorrect + higherBrierIfIncorrect + lowerBrierIfIncorrect;
                        } else if (forecastObj[0].outcome === "decrease") {
                            originalBrier = lowerBrierIfCorrect + higherBrierIfIncorrect + sameBrierIfIncorrect;
                        }

                        let newBrier = (2 - originalBrier) * 50;

                        fullArrayToReturn[i+1].certaintyHigher = userForecastData.forecasts[i].certainties.certaintyHigher;
                        fullArrayToReturn[i+1].certaintySame = userForecastData.forecasts[i].certainties.certaintySame;
                        fullArrayToReturn[i+1].certaintyLower = userForecastData.forecasts[i].certainties.certaintyLower;
                        fullArrayToReturn[i+1].date = userForecastData.forecasts[i].date;
                        fullArrayToReturn[i+1].comments = userForecastData.forecasts[i].comments;
                        fullArrayToReturn[i+1].newBrier = newBrier;

                        let newBrierWeightedByDuration;
                        let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                        if (i < userForecastData.forecasts.length-1) {
                            let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                            newBrierWeightedByDuration = (newBrier * (percentageOfTimeAtThisScore/100));
                            sumOfNewWeightedBriers = sumOfNewWeightedBriers + newBrierWeightedByDuration;
                        }
                        else if (i === userForecastData.forecasts.length-1) {
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (closeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
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
                fullArrayToReturn[0] = {startDate: forecastObj[0].startDate, closeDate: forecastObj[0].closeDate};
                res.send(fullArrayToReturn);
            }
        } else if (req.params.closedStatus === "false") {
            console.log("Problem is open");
            // LONG TERM PROBLEMS WITH ONLY ONE OUTCOME
            if (req.params.singleCertainty === "true") {
                console.log("Problem has a single outcome");
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

                let sumOfNewWeightedCorrectBriers = 0;
                let sumOfNewWeightedIncorrectBriers = 0;
                let fullArrayToReturn = [];

                for (let i = 0; i < userForecastData.forecasts.length; i++) {
                    fullArrayToReturn[i+1] = {
                        certainty: "", 
                        date: "", 
                        comments: "",                    
                        newHappenedBrier: 0, 
                        newNotHappenedBrier: 0,    
                        duration: "", 
                        percentageOfTimeAtThisScore: ""
                    };

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let correctBrier = (((1 - userForecastData.forecasts[i].certainty) * (1 - userForecastData.forecasts[i].certainty)) + ((0 - (1 - userForecastData.forecasts[i].certainty)) * (0 - (1 -userForecastData.forecasts[i].certainty))));
                        let incorrectBrier = (((0 - userForecastData.forecasts[i].certainty) * (0 - userForecastData.forecasts[i].certainty)) + ((1 - (1 - userForecastData.forecasts[i].certainty)) * (1 - (1 -userForecastData.forecasts[i].certainty))));

                        let newHappenedBrier = (2 - correctBrier) * 50;
                        let newNotHappenedBrier = (2 - incorrectBrier) * 50;

                        fullArrayToReturn[i+1].certainty = userForecastData.forecasts[i].certainty;
                        fullArrayToReturn[i+1].date = userForecastData.forecasts[i].date;
                        fullArrayToReturn[i+1].comments = userForecastData.forecasts[i].comments;
                        fullArrayToReturn[i+1].newHappenedBrier = newHappenedBrier;
                        fullArrayToReturn[i+1].newNotHappenedBrier = newNotHappenedBrier;

                        let correctBrierWeightedByDuration, incorrectBrierWeightedByDuration;
                        let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                        if (i < userForecastData.forecasts.length-1) {
                            let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;

                            correctBrierWeightedByDuration = (newHappenedBrier * (percentageOfTimeAtThisScore/100));
                            incorrectBrierWeightedByDuration = (newNotHappenedBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedCorrectBriers = sumOfNewWeightedCorrectBriers + correctBrierWeightedByDuration;
                            sumOfNewWeightedIncorrectBriers = sumOfNewWeightedIncorrectBriers + incorrectBrierWeightedByDuration;
                        }
                        else if (i === userForecastData.forecasts.length-1) {
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (closeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                            
                            correctBrierWeightedByDuration = (newHappenedBrier * (percentageOfTimeAtThisScore/100));
                            incorrectBrierWeightedByDuration = (newNotHappenedBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedCorrectBriers = sumOfNewWeightedCorrectBriers + correctBrierWeightedByDuration;
                            sumOfNewWeightedIncorrectBriers = sumOfNewWeightedIncorrectBriers + incorrectBrierWeightedByDuration;
                            
                            formulaComponents[0].finalCorrectBrierSumUncaptained = sumOfNewWeightedCorrectBriers;
                            formulaComponents[0].finalIncorrectBrierSumUncaptained = sumOfNewWeightedIncorrectBriers;
                        };
                    // Forecast was NOT made before close date
                    } else if (new Date(userForecastData.forecasts[i].date) > closeDate) {
                        sumOfNewWeightedBriers = sumOfNewWeightedBriers + 0;
                        if (i === userForecastData.forecasts.length-1) {
                            formulaComponents[0].finalBrierSum = sumOfNewWeightedBriers;
                        };
                    };
                };
                fullArrayToReturn[0] = {startDate: forecastObj[0].startDate, closeDate: forecastObj[0].closeDate};
                res.send(fullArrayToReturn);


            // SHORT TERM PROBLEMS WITH MULTIPLE OUTCOMES
            } else if (req.params.singleCertainty === "false") {
                console.log("Problem has multiple outcomes.")
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

                let sumOfNewWeightedHigherBriers = 0;
                let sumOfNewWeightedSameBriers = 0;
                let sumOfNewWeightedLowerBriers = 0;
                let fullArrayToReturn = [];

                for (let i = 0; i < userForecastData.forecasts.length; i++) {
                    fullArrayToReturn[i+1] = {
                        certaintyHigher: "", 
                        certaintySame: "", 
                        certaintyLower: "", 
                        date: "", 
                        comments: "",                    
                        newHigherBrier: 0, 
                        newSameBrier: 0, 
                        newLowerBrier: 0, 
                        duration: "", 
                        percentageOfTimeAtThisScore: ""
                    };

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let higherBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintyHigher, 2);
                        let higherBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintyHigher, 2)
                        let sameBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintySame, 2);
                        let sameBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintySame, 2)
                        let lowerBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certaintyLower, 2);
                        let lowerBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certaintyLower, 2)

                        let higherBrier = higherBrierIfCorrect + sameBrierIfIncorrect + lowerBrierIfIncorrect;
                        let sameBrier = sameBrierIfCorrect + higherBrierIfIncorrect + lowerBrierIfIncorrect;
                        let lowerBrier = lowerBrierIfCorrect + higherBrierIfIncorrect + sameBrierIfIncorrect;

                        let newHigherBrier = (2 - higherBrier) * 50;
                        let newSameBrier = (2 - sameBrier) * 50;
                        let newLowerBrier = (2 - lowerBrier) * 50;

                        fullArrayToReturn[i+1].certaintyHigher = userForecastData.forecasts[i].certainties.certaintyHigher;
                        fullArrayToReturn[i+1].certaintySame = userForecastData.forecasts[i].certainties.certaintySame;
                        fullArrayToReturn[i+1].certaintyLower = userForecastData.forecasts[i].certainties.certaintyLower;
                        fullArrayToReturn[i+1].date = userForecastData.forecasts[i].date;
                        fullArrayToReturn[i+1].comments = userForecastData.forecasts[i].comments;
                        fullArrayToReturn[i+1].newHigherBrier = newHigherBrier;
                        fullArrayToReturn[i+1].newSameBrier = newSameBrier;
                        fullArrayToReturn[i+1].newLowerBrier = newLowerBrier;

                        let higherBrierWeightedByDuration, sameBrierWeightedByDuration, lowerBrierWeightedByDuration;
                        let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                        if (i < userForecastData.forecasts.length-1) {
                            let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;

                            higherBrierWeightedByDuration = (newHigherBrier * (percentageOfTimeAtThisScore/100));
                            sameBrierWeightedByDuration = (newSameBrier * (percentageOfTimeAtThisScore/100));
                            lowerBrierWeightedByDuration = (newLowerBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedHigherBriers = sumOfNewWeightedHigherBriers + higherBrierWeightedByDuration;
                            sumOfNewWeightedSameBriers = sumOfNewWeightedSameBriers + sameBrierWeightedByDuration;
                            sumOfNewWeightedLowerBriers = sumOfNewWeightedLowerBriers + lowerBrierWeightedByDuration;
                        }
                        else if (i === userForecastData.forecasts.length-1) {
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (closeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                            
                            higherBrierWeightedByDuration = (newHigherBrier * (percentageOfTimeAtThisScore/100));
                            sameBrierWeightedByDuration = (newSameBrier * (percentageOfTimeAtThisScore/100));
                            lowerBrierWeightedByDuration = (newLowerBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedHigherBriers = sumOfNewWeightedHigherBriers + higherBrierWeightedByDuration;
                            sumOfNewWeightedSameBriers = sumOfNewWeightedSameBriers + sameBrierWeightedByDuration;
                            sumOfNewWeightedLowerBriers = sumOfNewWeightedLowerBriers + lowerBrierWeightedByDuration;
                            
                            formulaComponents[0].finalHigherBrierSumUncaptained = sumOfNewWeightedHigherBriers;
                            formulaComponents[0].finalSameBrierSumUncaptained = sumOfNewWeightedSameBriers;
                            formulaComponents[0].finalLowerBrierSumUncaptained = sumOfNewWeightedLowerBriers;
                        };
                    // Forecast was NOT made before close date
                    } else if (new Date(userForecastData.forecasts[i].date) > closeDate) {
                        sumOfNewWeightedBriers = sumOfNewWeightedBriers + 0;
                        if (i === userForecastData.forecasts.length-1) {
                            formulaComponents[0].finalBrierSum = sumOfNewWeightedBriers;
                        };
                    };
                };
                fullArrayToReturn[0] = {startDate: forecastObj[0].startDate, closeDate: forecastObj[0].closeDate, singleCertainty: forecastObj[0].singleCertainty};
                res.send(fullArrayToReturn);
            };
        };
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
            isClosed: false,
            singleCertainty: req.body.singleCertainty === "true" ? true : false,
            outcome: ""
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
router.patch("/submit", async (req, res) => {
    try {
        const document = await Forecasts.findOne({ problemName: req.body.problemName });
        const toPushToDB = {
            username: req.body.username, 
            forecasts: [
                {
                    certainty: req.body.certainty, 
                    comments: req.body.comments, 
                    date: req.body.date
                }
            ], 
            captainedStatus: req.body.captainedStatus
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

// Submit a prediction to a problem for the first time
router.patch("/submitMultiple", async (req, res) => {
    try {
        const document = await Forecasts.findOne({ problemName: req.body.problemName });
        console.log(req.body.problemName);
        const toPushToDB = {
            username: req.body.username, 
            forecasts: [
                {
                    certainties: {
                        certaintyHigher: req.body.certainty1,
                        certaintySame: req.body.certainty2,
                        certaintyLower: req.body.certainty3, 
                    },
                    comments: req.body.comments, 
                    date: req.body.date
                }
            ], 
            captainedStatus: req.body.captainedStatus
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

// Update a prediction to a single certainty problem
router.patch("/update", async (req, res) => {
    try {
        // find the Object in submittedForecasts[] where username = username
        // const document = await Forecasts.findOne({ _id: req.body.problemID });
        
        const updatedForecastDocument = await Forecasts.findByIdAndUpdate(req.body.problemID, 
            {
                submittedForecasts: req.body.newSubmittedForecasts,
            },
            { new: true }
        );
        res.json(updatedForecastDocument);
        
        // push the passed in {certainty, comments} object to the end of the submittedForecasts.forecasts array
        // increase numberOfForecastsSubmittedByUser by 1 - not essential, as we could just take submittedForecasts.forecasts.length
        // const updatedForecastPushedToDB = await Forecasts.findByIdAndUpdate(document._id, 
        //     { 
        //         $push: { [req.body.locationOfForecasts]: {
        //             "certainty": req.body.updatedForecastsForUser.certainty, 
        //             "comments": req.body.updatedForecastsForUser.comments, 
        //             "date": req.body.updatedForecastsForUser.date 
        //         }}
        //     }, 
        //     { new: true }
        // );
        // res.json(updatedForecastPushedToDB);
    } catch (error) {
        console.error("Error in forecasts.js > update");
        console.error(error);
    }
});

// Update a prediction to a multiple certainty problem
router.patch("/updateMultiple", async (req, res) => {
    try {
        // find the Object in submittedForecasts[] where username = username
        // const document = await Forecasts.findOne({ _id: req.body.problemID });
        
        const updatedForecastDocument = await Forecasts.findByIdAndUpdate(req.body.problemID, 
            {
                submittedForecasts: req.body.newSubmittedForecasts,
            },
            { new: true }
        );
        res.json(updatedForecastDocument);

        // push the passed in {certainty, comments} object to the end of the submittedForecasts.forecasts array
        // increase numberOfForecastsSubmittedByUser by 1 - not essential, as we could just take submittedForecasts.forecasts.length
        // const updatedForecastPushedToDB = await Forecasts.findByIdAndUpdate(document._id, 
        //     { 
        //         $push: { [req.body.locationOfForecasts]: {
        //             "certainties": {
        //                 certaintyHigher: req.body.updatedForecastsForUser.certainty1, 
        //                 certaintySame: req.body.updatedForecastsForUser.certainty2,
        //                 certaintyLower: req.body.updatedForecastsForUser.certainty3
        //             },
        //             "comments": req.body.updatedForecastsForUser.comments, 
        //             "date": req.body.updatedForecastsForUser.date 
        //         }}
        //     }, 
        //     { new: true }
        // );
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

// Update whether or not a user is captaining a problem 
router.patch("/captainAProblem/:selectedForecast/:username/:captainedStatus", async (req, res) => {
    try {
        let booleanStatus;
        if (req.params.captainedStatus === "true") booleanStatus = true;
        else if (req.params.captainedStatus === "false") booleanStatus = false;
        const allForecastData = await Forecasts.findOne({ problemName: req.params.selectedForecast });
        for (let i = 0; i < allForecastData.submittedForecasts.length; i++) {
            if (allForecastData.submittedForecasts[i].username === req.params.username) {
                allForecastData.submittedForecasts[i].captainedStatus = booleanStatus;
                const new1 = await Forecasts.findByIdAndUpdate(allForecastData._id, { submittedForecasts: allForecastData.submittedForecasts }, {new: true});
                console.log(new1);
            };
        };
        res.send("Done");
    } catch (error) {
        console.error("error in forecasts.js > captainAProblem patch");
        console.error(error);
    }
});

module.exports = router;