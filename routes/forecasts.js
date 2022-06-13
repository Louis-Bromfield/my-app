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
                    fullArrayToReturn[i+1] = {certainty1: "", certainty2: "", certainty3: "", date: "", comments: "", newBrier: 0, duration: "", percentageOfTimeAtThisScore: ""};

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let originalBrier;

                        let firstBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty1, 2);
                        let firstBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty1, 2)
                        let secondBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty2, 2);
                        let secondBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty2, 2)
                        let thirdBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty3, 2);
                        let thirdBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty3, 2)

                        // Change to working out Brier for if higher is correct, same is correct, or lower is correct
                        // .happened needs to be changed to .outcome === "higher" / .outcome === "same" / .outcome === "lower"
                        if (forecastObj[0].outcome === "outcome1") {
                            originalBrier = firstBrierIfCorrect + secondBrierIfIncorrect + thirdBrierIfIncorrect;
                        } else if (forecastObj[0].outcome === "outcome2") {
                            originalBrier = secondBrierIfCorrect + firstBrierIfIncorrect + thirdBrierIfIncorrect;
                        } else if (forecastObj[0].outcome === "outcome3") {
                            originalBrier = thirdBrierIfCorrect + firstBrierIfIncorrect + secondBrierIfIncorrect;
                        }

                        let newBrier = (2 - originalBrier) * 50;

                        fullArrayToReturn[i+1].certainty1 = userForecastData.forecasts[i].certainties.certainty1;
                        fullArrayToReturn[i+1].certainty2 = userForecastData.forecasts[i].certainties.certainty2;
                        fullArrayToReturn[i+1].certainty3 = userForecastData.forecasts[i].certainties.certainty3;
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

                let sumOfNewWeightedOutcomeOneBriers = 0;
                let sumOfNewWeightedOutcomeTwoBriers = 0;
                let sumOfNewWeightedOutcomeThreeBriers = 0;
                let fullArrayToReturn = [];

                for (let i = 0; i < userForecastData.forecasts.length; i++) {
                    fullArrayToReturn[i+1] = {
                        certainty1: "", 
                        certainty2: "", 
                        certainty3: "", 
                        date: "", 
                        comments: "",                    
                        newOutcomeOneBrier: 0, 
                        newOutcomeTwoBrier: 0, 
                        newOutcomeThreeBrier: 0, 
                        duration: "", 
                        percentageOfTimeAtThisScore: ""
                    };

                    // Forecast WAS made before close date
                    if (new Date(userForecastData.forecasts[i].date) < closeDate) {
                        let firstBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty1, 2);
                        let firstBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty1, 2)
                        let secondBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty2, 2);
                        let secondBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty2, 2)
                        let thirdBrierIfCorrect = Math.pow(1 - userForecastData.forecasts[i].certainties.certainty3, 2);
                        let thirdBrierIfIncorrect = Math.pow(0 - userForecastData.forecasts[i].certainties.certainty3, 2)

                        let outcomeOneBrier = firstBrierIfCorrect + secondBrierIfIncorrect + thirdBrierIfIncorrect;
                        let outcomeTwoBrier = secondBrierIfCorrect + firstBrierIfIncorrect + thirdBrierIfIncorrect;
                        let outcomeThreeBrier = thirdBrierIfCorrect + firstBrierIfIncorrect + secondBrierIfIncorrect;

                        let newOutcomeOneBrier = (2 - outcomeOneBrier) * 50;
                        let newOutcomeTwoBrier = (2 - outcomeTwoBrier) * 50;
                        let newOutcomeThreeBrier = (2 - outcomeThreeBrier) * 50;

                        fullArrayToReturn[i+1].certainty1 = userForecastData.forecasts[i].certainties.certainty1;
                        fullArrayToReturn[i+1].certainty2 = userForecastData.forecasts[i].certainties.certainty2;
                        fullArrayToReturn[i+1].certainty3 = userForecastData.forecasts[i].certainties.certainty3;
                        fullArrayToReturn[i+1].date = userForecastData.forecasts[i].date;
                        fullArrayToReturn[i+1].comments = userForecastData.forecasts[i].comments;
                        fullArrayToReturn[i+1].newOutcomeOneBrier = newOutcomeOneBrier;
                        fullArrayToReturn[i+1].newOutcomeTwoBrier = newOutcomeTwoBrier;
                        fullArrayToReturn[i+1].newOutcomeThreeBrier = newOutcomeThreeBrier;

                        let outcomeOneBrierWeightedByDuration, outcomeTwoBrierWeightedByDuration, outcomeThreeBrierWeightedByDuration;
                        let thisForecastTimeDate = new Date(userForecastData.forecasts[i].date);
                        if (i < userForecastData.forecasts.length-1) {
                            let nextForecastTimeDate = new Date(userForecastData.forecasts[i+1].date);
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (nextForecastTimeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;

                            outcomeOneBrierWeightedByDuration = (newOutcomeOneBrier * (percentageOfTimeAtThisScore/100));
                            outcomeTwoBrierWeightedByDuration = (newOutcomeTwoBrier * (percentageOfTimeAtThisScore/100));
                            outcomeThreeBrierWeightedByDuration = (newOutcomeThreeBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedOutcomeOneBriers = sumOfNewWeightedOutcomeOneBriers + outcomeOneBrierWeightedByDuration;
                            sumOfNewWeightedOutcomeTwoBriers = sumOfNewWeightedOutcomeTwoBriers + outcomeTwoBrierWeightedByDuration;
                            sumOfNewWeightedOutcomeThreeBriers = sumOfNewWeightedOutcomeThreeBriers + outcomeThreeBrierWeightedByDuration;
                        }
                        else if (i === userForecastData.forecasts.length-1) {
                            let forecastTimeFrame = (closeDate - startDate)/1000;
                            let duration = (closeDate - thisForecastTimeDate)/1000;
                            fullArrayToReturn[i+1].duration = duration;
                            let percentageOfTimeAtThisScore = ((duration/forecastTimeFrame)*100);
                            fullArrayToReturn[i+1].percentageOfTimeAtThisScore = percentageOfTimeAtThisScore;
                            
                            outcomeOneBrierWeightedByDuration = (newOutcomeOneBrier * (percentageOfTimeAtThisScore/100));
                            outcomeTwoBrierWeightedByDuration = (newOutcomeTwoBrier * (percentageOfTimeAtThisScore/100));
                            outcomeThreeBrierWeightedByDuration = (newOutcomeThreeBrier * (percentageOfTimeAtThisScore/100));

                            sumOfNewWeightedOutcomeOneBriers = sumOfNewWeightedOutcomeOneBriers + outcomeOneBrierWeightedByDuration;
                            sumOfNewWeightedOutcomeTwoBriers = sumOfNewWeightedOutcomeTwoBriers + outcomeTwoBrierWeightedByDuration;
                            sumOfNewWeightedOutcomeThreeBriers = sumOfNewWeightedOutcomeThreeBriers + outcomeThreeBrierWeightedByDuration;
                            
                            formulaComponents[0].finalOutcomeOneBrierSumUncaptained = sumOfNewWeightedOutcomeOneBriers;
                            formulaComponents[0].finalOutcomeTwoBrierSumUncaptained = sumOfNewWeightedOutcomeTwoBriers;
                            formulaComponents[0].finalOutcomeThreeBrierSumUncaptained = sumOfNewWeightedOutcomeThreeBriers;
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
            potentialOutcomes: req.body.potentialOutcomes,
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
            ]
            // ], 
            // captainedStatus: req.body.captainedStatus
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
                        certainty1: req.body.certainty1,
                        certainty2: req.body.certainty2,
                        certainty3: req.body.certainty3, 
                    },
                    comments: req.body.comments, 
                    date: req.body.date
                }
            ]
            // ], 
            // captainedStatus: req.body.captainedStatus
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
        // ---------------------Prev-------------------------
        // Brute force approach, does work but concerns of race conditions
        // find the Object in submittedForecasts[] where username = username
        // const document = await Forecasts.findOne({ _id: req.body.problemID });
        
        // const updatedForecastDocument = await Forecasts.findByIdAndUpdate(req.body.problemID, 
        //     {
        //         submittedForecasts: req.body.newSubmittedForecasts,
        //     },
        //     { new: true }
        // );
        // res.json(updatedForecastDocument);
        // --------------------------------------------------
        
        // ---------------------First approach, but was causing incorrect forecast attribution------------------
        // push the passed in {certainty, comments} object to the end of the submittedForecasts.forecasts array
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
        // --------------------------------------------------

        // New idea, do location finding on this end.
        // Req body = 
        // documentID: setSelectedForecastDocumentID,           DOCUMENT ID
        // newForecastObject: newForecastObj,                   FORECASTOBJ CONTAINING CERTAINTY, COMMENTS, DATE
        // user: username                                       USERNAME
        console.log("req.body.documentID");
        console.log(req.body.documentID);
        const forecastDocument = await Forecasts.findById(req.body.documentID);
        console.log("forecastDocument");
        console.log(forecastDocument);
        console.log("username");
        console.log(req.body.username);
        let indexLocation = 0;
        for (let i = 0; i < forecastDocument.submittedForecasts.length; i++) {
            if (forecastDocument.submittedForecasts[i].username === req.body.username) {
                console.log(`found user ${forecastDocument.submittedForecasts[i].username} at index ${i}`);
                indexLocation = i;
                console.log(`indexLocation = ${indexLocation}`);
                return;
            };
        };
        const updatedForecastDocument = await Forecasts.findByIdAndUpdate(req.body.documentID, {
            // { $push: { [`submittedForecasts[${indexLocation}].forecasts`]: req.body.newForecastObj }
            $push: { [submittedForecasts[indexLocation].forecasts]: {
                "certainty": req.body.newForecastObj.certainty,
                "comments": req.body.newForecastObj.comments,
                "date": req.body.newForecastObj.date
            }}
        }, 
        { 
            new: true
        });
        console.log(updatedForecastDocument);

    } catch (error) {
        console.error("Error in forecasts.js > update");
        console.error(error);
    }
});

// Update a prediction to a multiple certainty problem
router.patch("/updateMultiple", async (req, res) => {
    try {
        const forecastDocument = await Forecasts.findById(req.body.documentID);
        let indexLocation = 0;
        for (let i = 0; i < forecastDocument.submittedForecasts.length; i++) {
            if (forecastDocument.submittedForecasts[i].username === req.body.username) {
                indexLocation = i;
                return;
            };
        };
        const updatedForecastDocument = await Forecasts.findByIdAndUpdate(
            {_id: req.body.documentID },
            { $push: { [`submittedForecasts[${indexLocation}].forecasts`]: req.body.newForecastObj }
            }, 
            { new: true }
        );
        console.log(updatedForecastDocument);
        res.json(updatedForecastDocument);

        // const updatedForecastDocument = await Forecasts.findByIdAndUpdate(req.body.problemID, 
        //     {
        //         submittedForecasts: req.body.newSubmittedForecasts,
        //     },
        //     { new: true }
        // );
        // res.json(updatedForecastDocument);

        // push the passed in {certainty, comments} object to the end of the submittedForecasts.forecasts array
        // increase numberOfForecastsSubmittedByUser by 1 - not essential, as we could just take submittedForecasts.forecasts.length
        // const updatedForecastPushedToDB = await Forecasts.findByIdAndUpdate(document._id, 
        //     { 
        //         $push: { [req.body.locationOfForecasts]: {
        //             "certainties": {
        //                 certainty1: req.body.updatedForecastsForUser.certainty1, 
        //                 certainty2: req.body.updatedForecastsForUser.certainty2,
        //                 certainty3: req.body.updatedForecastsForUser.certainty3
        //             },
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