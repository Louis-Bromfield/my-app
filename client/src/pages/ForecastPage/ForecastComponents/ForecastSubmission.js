import React, { useState, useEffect } from 'react';
import './ForecastSubmission.css';
import axios from 'axios';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';
import ForecastBreakdown from './ForecastBreakdown';


function ForecastSubmission(props) {
    const [forecastProblems, setForecastProblems] = useState([]);
    const [forecastProblemsForDropdown, setForecastProblemsForDropdown] = useState([]);
    const [selectedForecast, setSelectedForecast] = useState("No forecast problem selected");
    const [hasAForecastBeenSelected, setHasAForecastBeenSelected] = useState(false);
    const [forecastPotentialOutcomes, setForecastPotentialOutcomes] = useState([ "outcome1", "outcome2", "outcome3" ]);
    const [dropdownHighlight, setDropdownHighlight] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [selectedForecastMarket, setSelectedForecastMarket] = useState("N/A");
    const [userRank, setUserRank] = useState("N/A");
    const [userHasAttempted, setUserHasAttempted] = useState(false);
    const [userPreviousAttemptCertainty, setUserPreviousAttemptCertainty] = useState();
    const [userPreviousAttemptComments, setUserPreviousAttemptComments] = useState("");
    const [certainty, setCertainty] = useState();
    const [forecastComments, setForecastComments] = useState("");
    const [forecastResponseMessage, setForecastResponseMessage] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [forecastCloseDate, setForecastCloseDate] = useState("");
    const [forecastClosed, setForecastClosed] = useState(false);
    const [numberOfForecastsSubmitted, setNumberOfForecastsSubmitted] = useState(0);
    const [highestCertainty, setHighestCertainty] = useState(0);
    const [lowestCertainty, setLowestCertainty] = useState(0);
    const [finalCertainty, setFinalCertainty] = useState(0);
    const [closedForecastScore, setClosedForecastScore] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalContent2, setModalContent2] = useState("");
    const [marketWarning, setMarketWarning] = useState(false);
    const [forecastSingleCertainty, setForecastSingleCertainty] = useState();
    const [certaintyOne, setCertaintyOne] = useState(0);
    const [certaintyTwo, setCertaintyTwo] = useState(0);
    const [certaintyThree, setCertaintyThree] = useState(0);
    const [forecastObjForAnalysis, setForecastObjForAnalysis] = useState({});
    const [outcomeOneCertainty, setOutcomeOneCertainty] = useState("0%");
    const [outcomeTwoCertainty, setOutcomeTwoCertainty] = useState("0%");
    const [outcomeThreeCertainty, setOutcomeThreeCertainty] = useState("0%");
    const [selectedForecastDocumentID, setSelectedForecastDocumentID] = useState("");

    let alertStyle;
    if (dropdownHighlight === true) {
        alertStyle = {
            border: "5px solid red",
            borderRadius: "8px"
        };
    }
    else {
        alertStyle = {
            border: "1px solid black"
        };
    };

    useEffect(() => {
        console.log("ForecastSubmission UE");
        // console.log(props);
        getAllForecastsFromDB(props.userObjectMarkets);
        getLeaderboardFromDB(props.selectedForecast.market);
    }, [props.selectedForecast, props.markets, props.allForecasts, props.userObject]);

    const getAllForecastsFromDB = async (userMarkets) => {
        try {
            // console.log(userMarkets);
            let filtered = [];
            let filteredAndOrganised = [];
            for (let i = 0; i < userMarkets.length; i++) {
                if (userMarkets[i] !== '"Fantasy Forecast All-Time"' || userMarkets[i] !== "Fantasy Forecast All-Time") {
                    filteredAndOrganised.push([userMarkets[i]]);
                };
            };
            let forecastsAreAvailable = false;
            for (let i = 0; i < props.allForecasts.length; i++) {
                if (userMarkets.includes(props.allForecasts[i].market) && new Date() > new Date(props.allForecasts[i].startDate)) {
                    filtered.push(props.allForecasts[i]);
                    let index = userMarkets.indexOf(props.allForecasts[i].market);
                    filteredAndOrganised[index].push(props.allForecasts[i]);
                    forecastsAreAvailable = true;
                };
            };
            if (forecastsAreAvailable === false) {
                setMarketWarning(true);
            } else {
                setMarketWarning(false);
            };
            setForecastProblems(filtered);
            setForecastProblemsForDropdown(filteredAndOrganised);
        } catch (error) {
            console.error(error);
        };
    };

    // Market Statistics uses the output of this (see props line at bottom of try block), good!
    const getLeaderboardFromDB = async (marketName) => {
        if (marketName === undefined) return;
        try {
            // const leaderboardResponse = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${marketName}`);
            const leaderboardResponse = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/newGetLeaderboardRoute/${marketName}`);
            // console.log(leaderboardResponse);
            for (let i = 0; i < leaderboardResponse.data.length; i++) {
                leaderboardResponse.data[i].marketPoints = 0;
                for (let j = 0; j < leaderboardResponse.data[i].brierScores.length; j++) {
                    if (leaderboardResponse.data[i].brierScores[j].marketName === marketName) {
                        leaderboardResponse.data[i].marketPoints += leaderboardResponse.data[i].brierScores[j].brierScore;
                    };
                };
            };
            let lbRankings = leaderboardResponse.data.sort((a, b) => b.marketPoints - a.marketPoints);
            // console.log(lbRankings);
            formatUserRank(lbRankings);
            props.handleLeaderboardChange(lbRankings);
        } catch (error) { 
            console.error(error);
        };
    };

    // When a forecast problem is selected from the dropdown
    const handleChange = (e) => {
        if (e.target.value === "All currently open forecasts are available here...") {
            props.toggleDiv(false);
            setHasAForecastBeenSelected(false);
            setSelectedForecast("No forecast problem selected");
            setSelectedForecastMarket("N/A");
            setUserRank("N/A");
            setIsInputDisabled(true);
            setForecastCloseDate("");
            setForecastClosed(true);
        } else {
            props.toggleDiv(true);
            setHasAForecastBeenSelected(true);
            setSelectedForecast(e.target.value);
            pullForecastDetailsAndCheckIfAlreadyAttempted(e.target.value);
            setIsInputDisabled(false);
            getForecastDetails(e.target.value);
        };
    };

    const getForecastDetails = (etv) => {
        const forecast = forecastProblems[forecastProblems.findIndex(fP => fP.problemName === etv)];
        setForecastObjForAnalysis(forecast);
        localStorage.setItem("selectedForecastID", forecast._id);
        if (new Date(forecast.closeDate) < new Date()) {
            getBrierForClosedForecast(props.username, etv);
            setButtonDisabled(true);
            setForecastClosed(true);
            setForecastCloseDate(`FORECAST CLOSED: ${new Date(forecast.closeDate).toString()}`);
            let highest = 0;
            let lowest = 100;
            let totalOutcomeOne = 0;
            let totalOutcomeTwo = 0;
            let totalOutcomeThree = 0;
            let highestChanged, lowestChanged = false;
            let totalNumOfForecasts = 0;
            let finalCertainty = 0;
            for (let i = 0; i < forecast.submittedForecasts.length; i++) {
                if (forecast.submittedForecasts[i].username === props.username) {
                    if (forecast.submittedForecasts[i].forecasts.length === 0) {
                        highest = "N/A";
                        lowest = "N/A";
                        setFinalCertainty("N/A");
                        return;
                    } else {
                        for (let j = 0; j < forecast.submittedForecasts[i].forecasts.length; j++) {
                            if (new Date(forecast.submittedForecasts[i].forecasts[j].date) < new Date(forecast.closeDate)) {
                                totalNumOfForecasts++;
                                if (forecast.singleCertainty === true) {
                                    finalCertainty = forecast.submittedForecasts[i].forecasts[j].certainty*100;
                                    if (forecast.submittedForecasts[i].forecasts[j].certainty*100 > highest) {
                                        highest = forecast.submittedForecasts[i].forecasts[j].certainty*100;
                                        highestChanged = true;
                                    };
                                    if (forecast.submittedForecasts[i].forecasts[j].certainty*100 < lowest) {
                                        lowest = forecast.submittedForecasts[i].forecasts[j].certainty*100;
                                        lowestChanged = true;
                                    };
                                } else if (forecast.singleCertainty === false) {
                                    totalOutcomeOne += (forecast.submittedForecasts[i].forecasts[j].certainties.certainty1*100);
                                    totalOutcomeTwo += (forecast.submittedForecasts[i].forecasts[j].certainties.certainty2*100);
                                    totalOutcomeThree += (forecast.submittedForecasts[i].forecasts[j].certainties.certainty3*100);
                                };
                            };
                        };
                        setFinalCertainty(`${finalCertainty}%`);
                    };
                };
            };
            if (forecast.singleCertainty === true) {
                if (highestChanged === true && lowestChanged === true) {
                    setHighestCertainty(`${highest}%`);
                    setLowestCertainty(`${lowest}%`);
                } else {
                    setHighestCertainty("N/A");
                    setLowestCertainty("N/A");
                }
            } else if (forecast.singleCertainty === false) {
                setOutcomeOneCertainty(`${(totalOutcomeOne / totalNumOfForecasts).toFixed(2)}%`);
                setOutcomeTwoCertainty(`${(totalOutcomeTwo / totalNumOfForecasts).toFixed(2)}%`);
                setOutcomeThreeCertainty(`${(totalOutcomeThree / totalNumOfForecasts).toFixed(2)}%`);
            };
            setNumberOfForecastsSubmitted(totalNumOfForecasts);
        } else {
            setButtonDisabled(false);
            setForecastClosed(false);
            setForecastCloseDate(`Deadline: ${new Date(forecast.closeDate).toString()}`);
        };
    };

    const getBrierForClosedForecast = async (username, problemName) => {
        try {
            // console.log(props.userBriers);
            // const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            const forecastDetails = props.userBriers.find(el => el.problemName === problemName);
            setClosedForecastScore(forecastDetails === undefined ? "No Forecast Submitted" : forecastDetails.brierScore.toFixed(0));
            localStorage.setItem("closedForecastScore", forecastDetails.brierScore);
        } catch (error) {
            console.error("Error in ForecastSubmission > getBrierForClosedForecast");
            console.error(error);
        };
    };

    const formatUserRank = (leaderboard) => {
        if (leaderboard === []) return;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].username === props.username) {
                let k = i+1 % 10;
                let l = i+1 % 100;
                if (k === 1 && l !== 11) {
                    setUserRank(i+1+"st");
                } else if (k === 2 && l !== 12) {
                    setUserRank(i+1+"nd");
                } else if (k === 3 && l !== 13) {
                    setUserRank(i+1+"rd");
                } else {
                    setUserRank(i+1+"th");
                };               
            };
        };
    };

    // Nested loop - clean this up if you can. Over half the lines are state setting but could be moved to backend?
    const pullForecastDetailsAndCheckIfAlreadyAttempted = (forecast) => {
        console.log(forecast);
        for (let i = 0; i < forecastProblems.length; i++) {
            if (forecastProblems[i].problemName === forecast) {
                setSelectedForecastMarket(forecastProblems[i].market);
                setSelectedForecastDocumentID(forecastProblems[i]._id);
                props.changeForecast(forecastProblems[i]);
                if (forecastProblems[i].singleCertainty === false) {
                    setForecastPotentialOutcomes(forecastProblems[i].potentialOutcomes);
                };
                // If only one certainty, this = true. False is multiple certainties are required from user.
                setForecastSingleCertainty(forecastProblems[i].singleCertainty);
                props.setForecastSingleCertainty(forecastProblems[i].singleCertainty);
                setForecastPotentialOutcomes(forecastProblems[i].potentialOutcomes);
                // If no forecasts have been submitted by anyone at all
                if (forecastProblems[i].submittedForecasts.length === 0) {
                    setUserHasAttempted(false);
                    setUserPreviousAttemptCertainty("-");
                    setUserPreviousAttemptComments("No Forecast Submitted");
                    setNumberOfForecastsSubmitted(0);
                    setHighestCertainty("N/A");
                    setLowestCertainty("N/A");
                    setFinalCertainty("N/A")
                    return;
                } else {
                    // If at least one forecast has been submitted by anyone
                    for (let j = 0; j < forecastProblems[i].submittedForecasts.length; j++) {
                        if (forecastProblems[i].submittedForecasts[j].username === props.username) {
                            // You have submitted at least one forecast for this problem
                            setUserHasAttempted(true);
                            if (forecastProblems[i].singleCertainty === true) {
                                setUserPreviousAttemptCertainty((forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].certainty*100).toFixed(2));    
                            } else if (forecastProblems[i].singleCertainty === false) {
                                setUserPreviousAttemptCertainty(`${(forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].certainties.certainty1*100).toFixed(2)}% / ${(forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].certainties.certainty2*100).toFixed(2)}% / ${(forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].certainties.certainty3*100).toFixed(2)}`);
                            }
                            setUserPreviousAttemptComments(forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].comments);
                            return;
                        } else {
                            // You have not attempted this problem yet
                            setUserHasAttempted(false);
                            setUserPreviousAttemptCertainty("-");
                            setUserPreviousAttemptComments("No Forecast Submitted");
                            setNumberOfForecastsSubmitted(0);
                            setHighestCertainty("N/A");
                            setLowestCertainty("N/A");
                            setFinalCertainty("N/A")
                        };
                    };
                };
            };
        };
    };

    const handleCertaintyChange = (e) => {
        const certainty = e.target.value;
        console.log(e.target.value);
        // if (certainty.contains("e") || certainty.contains("--")) {
        //     setButtonDisabled(true);
        //     setForecastResponseMessage("Certainty contains letters or symbols it shouldn't. Only numbers are allowed.");
        //     return;
        // };
        if (certainty > 100) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please enter a certainty BELOW or equal to 100");
            return;
        } else if (certainty < 0) {
            setForecastResponseMessage("Please enter a certainty ABOVE or equal to 100");
            setButtonDisabled(true);
            return;
        } else {
            setForecastResponseMessage("");
            setButtonDisabled(false);
        }
        if (e.target.value.length === 0) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please input a certainty between 0 and 100");
        };
        let currentPrediction = certainty/100;
        setCertainty(currentPrediction);
    };

    const handleMultipleCertaintyChange = (certaintyVal, e) => {
        const certainty = e.target.value;
        console.log(e.target.value);
        // if (certainty.contains("e") || certainty.contains("--")) {
        //     setButtonDisabled(true);
        //     setForecastResponseMessage("Certainty contains letters or symbols it shouldn't. Only numbers are allowed.");
        //     return;
        // };
        if (certainty > 100) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please enter a certainty BELOW or equal to 100");
            return;
        } else if (certainty < 0) {
            setForecastResponseMessage("Please enter a certainty ABOVE or equal to 100");
            setButtonDisabled(true);
            return;
        } else if (e.target.value.length === 0) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please input a certainty between 0 and 100");
        } else {
            setForecastResponseMessage("");
            setButtonDisabled(false);
            if (certaintyVal === 1) {
                if ((Number(certainty) + Number((certaintyTwo*100)) + Number((certaintyThree*100))) > 100) {
                    setForecastResponseMessage("The three certainties cannot exceed 100.");
                    setCertaintyOne(Number(certainty/100));
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyOne(Number(certainty/100));
                    return;
                }
            } else if (certaintyVal === 2) {
                if ((Number((certaintyOne*100)) + Number(certainty) + Number((certaintyThree*100))) > 100) {
                    setForecastResponseMessage("The three certainties cannot exceed 100.");
                    setCertaintyTwo(Number(certainty/100));
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyTwo(Number(certainty/100));
                    return;
                };
            } else if (certaintyVal === 3) {
                if ((Number((certaintyOne*100)) + Number((certaintyTwo*100)) + Number(certainty)) > 100) {
                    setForecastResponseMessage("The three certainties cannot exceed 100.");
                    setCertaintyThree(Number(certainty/100));
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyThree(Number(certainty/100));
                    return;
                };
            };
        };
    };

    const handleCommentsChange = (e) => {
        setButtonDisabled(false);
        setForecastResponseMessage("");
        setForecastComments(e.target.value);
        if (e.target.value.length === 0) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please enter a comment.");
        } else if (e.target.value.includes("~")) {
            setButtonDisabled(true);
            setForecastResponseMessage("~ symbol is not allowed.");
        };
    };

    // Add the loading animation until it's submitted?
    const handleForecastUpdate = async (forecast, newCertainty, newComments, username) => {
        if (newCertainty === undefined) {
            setForecastResponseMessage("Please enter a certainty between 0.00-100.00");
            return;
        };
        if ((newCertainty*100) > 100 || (newCertainty*100) < 0) {
            setForecastResponseMessage("Please enter a certainty within 0.00-100.00");
            return;
        };
        if (newComments === "") {
            setForecastResponseMessage("Please enter a comment");
            return;
        }
        try {
            // ------------------------------------------------- //
            // This is brute-force approach of just altering and replacing the entire submitted forecasts array. It works, but I'm 
            // concerned about race conditions. I'm also questioning why I'm working out indices here on client (on previous approach below), 
            // when I should just send the forecast object to the backend and do it all there.
            // const document = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${forecast}`);
            // const documentForecastData = document.data[0].submittedForecasts;
            // let index = 0;
            // for (let i = 0; i < documentForecastData.length; i++) {
            //     if (documentForecastData[i].username === username) {
            //         index = i;
            //     };
            // };
            // documentForecastData[index].forecasts.push({
            //     certainty: newCertainty, 
            //     comments: `(${username})~ ${newComments}`, 
            //     date: new Date().toString()
            // });
            // const newForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/update`, {
            //     problemID: document.data[0]._id,
            //     newSubmittedForecasts: documentForecastData
            // });
            // console.log(newForecast);
            // ------------------------------------------------- //

            let date = new Date().toString();
            let convertedDate = new Date(date).toLocaleString("en-GB", { timeZone: "Europe/London" });
            let nDate = new Date(convertedDate.slice(6, 10), Number(convertedDate.slice(3, 5))-1, convertedDate.slice(0, 2), convertedDate.slice(12, 14), convertedDate.slice(15, 17), convertedDate.slice(18, 20)).toString();
            let nDateBSTSuffix = nDate.slice(0, 25) + "GMT+0100 (British Summer Time)";
            const newForecastObj = {
                certainty: newCertainty, 
                comments: `(${username})~ ${newComments}`, 
                // date: new Date().toString()
                date: nDateBSTSuffix
            };
            const newForecastTwo = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/update`, {
                documentID: selectedForecastDocumentID,
                newForecastObject: newForecastObj,
                username: username
            });

            console.log(newForecastTwo);
            props.changeForecast(newForecastTwo.data);

            // const newForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/update`, {
            //     problemName: forecast,
            //     updatedForecastsForUser: { certainty: newCertainty, comments: `(${username})~ ${newComments}`, date: new Date().toString() },
            //     locationOfForecasts: `submittedForecasts.${index}.forecasts`,
            // });
            // props.changeForecast(newForecast.data);

        } catch (error) {
            console.error("error in ForecastSubmission.js > handleForecastUpdate");
            console.error(error);
        };
    };

    const handleForecastSubmit = async (forecast, certainty, comments, username) => {
        try {
            let date = new Date().toString();
            let convertedDate = new Date(date).toLocaleString("en-GB", { timeZone: "Europe/London" });
            let nDate = new Date(convertedDate.slice(6, 10), Number(convertedDate.slice(3, 5))-1, convertedDate.slice(0, 2), convertedDate.slice(12, 14), convertedDate.slice(15, 17), convertedDate.slice(18, 20)).toString();
            let nDateBSTSuffix = nDate.slice(0, 25) + "GMT+0100 (British Summer Time)";
            const submittedForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/submit`, {
                problemName: forecast,
                username: username,
                certainty: certainty,
                comments: `(${username})~ ${comments}`,
                // date: new Date().toString()
                date: nDateBSTSuffix
            });
            setForecastResponseMessage("Forecast successfully submitted!")
            updateOnboarding(username);
            props.changeForecast(submittedForecast.data);
            setUserHasAttempted(true);
        } catch (error) {
            console.error("error in ForecastSubmission.js > handleForecastSubmit")
            console.error(error);
        };
    };

    // Add the loading animation until it's submitted?
    const handleMultipleForecastUpdate = async (forecast, newCertainty1, newCertainty2, newCertainty3, newComments, username) => {
        if (newCertainty1 === undefined || newCertainty2 === undefined || newCertainty3 === undefined) {
            setForecastResponseMessage("One or more certainties is missing.");
            return;
        };
        if (((newCertainty1*100) > 100 || (newCertainty1*100) < 0) || ((newCertainty2*100) > 100 || (newCertainty2*100) < 0) || ((newCertainty3*100) > 100 || (newCertainty3*100) < 0)) {
            setForecastResponseMessage("One or more certainties is not between 0 and 100.");
            return;
        };
        if (newComments === "") {
            setForecastResponseMessage("Please enter a comment");
            return;
        }
        try {
            let date = new Date().toString();
            let convertedDate = new Date(date).toLocaleString("en-GB", { timeZone: "Europe/London" });
            let nDate = new Date(convertedDate.slice(6, 10), Number(convertedDate.slice(3, 5))-1, convertedDate.slice(0, 2), convertedDate.slice(12, 14), convertedDate.slice(15, 17), convertedDate.slice(18, 20)).toString();
            let nDateBSTSuffix = nDate.slice(0, 25) + "GMT+0100 (British Summer Time)";
            const newForecastObj = {
                certainties: {
                    certainty1: newCertainty1, 
                    certainty2: newCertainty2, 
                    certainty3: newCertainty3, 
                },
                comments: `(${username})~ ${newComments}`, 
                // date: new Date().toString()
                date: nDateBSTSuffix
            };
            const newForecastTwo = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/updateMultiple`, {
                documentID: selectedForecastDocumentID,
                newForecastObject: newForecastObj,
                username: username
            });

            updateOnboarding(username);
            console.log(newForecastTwo);
            props.changeForecast(newForecastTwo.data);

            // Brute force method
            // const document = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${forecast}`);
            // console.log("the document you just got was this one:");
            // console.log(document);
            // const documentForecastData = document.data[0].submittedForecasts;
            // let index = 0;
            // for (let i = 0; i < documentForecastData.length; i++) {
            //     if (documentForecastData[i].username === username) {
            //         index = i;
            //     };
            // };
            // documentForecastData[index].forecasts.push({
            //     certainties: {
            //         certainty1: newCertainty1, 
            //         certainty2: newCertainty2, 
            //         certainty3: newCertainty3, 
            //     },
            //     comments: `(${username})~ ${newComments}`, 
            //     date: new Date().toString()
            // });
            // const newForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/updateMultiple`, {
            //     problemID: document.data[0]._id,
            //     newSubmittedForecasts: documentForecastData
            // });
            // console.log(newForecast);

            // const newForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/updateMultiple`, {
            //     problemName: forecast,
            //     updatedForecastsForUser: {
            //         certainty1: newCertainty1, 
            //         certainty2: newCertainty2, 
            //         certainty3: newCertainty3, 
            //         comments: `(${username})~ ${newComments}`,
            //         date: new Date().toString()
            //     },
            //     locationOfForecasts: `submittedForecasts.${index}.forecasts`,
            //     locationOfForecastCount: `submittedForecasts.${index}.numberOfForecastsSubmittedByUser`
            // });
            // props.changeForecast(newForecast.data);
        } catch (error) {
            console.error("error in ForecastSubmission.js > handleForecastUpdate");
            console.error(error);
        };
    };

    const handleMultipleForecastSubmit = async (forecast, certainty1, certainty2, certainty3, comments, username) => {
        if ((certainty1*100) + (certainty2*100) + (certainty3*100) !== 100) {
            setForecastResponseMessage("Your certainties do not equal 100.");
            return;
        };
        try {
            let date = new Date().toString();
            let convertedDate = new Date(date).toLocaleString("en-GB", { timeZone: "Europe/London" });
            let nDate = new Date(convertedDate.slice(6, 10), Number(convertedDate.slice(3, 5))-1, convertedDate.slice(0, 2), convertedDate.slice(12, 14), convertedDate.slice(15, 17), convertedDate.slice(18, 20)).toString();
            let nDateBSTSuffix = nDate.slice(0, 25) + "GMT+0100 (British Summer Time)";
            const submittedForecast = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/submitMultiple`, {
                problemName: forecast,
                username: username,
                certainty1: certainty1,
                certainty2: certainty2,
                certainty3: certainty3,
                comments: `(${username})~ ${comments}`,
                // date: new Date().toString()
                date: nDateBSTSuffix
            });
            setForecastResponseMessage("Forecast successfully submitted!")
            updateOnboarding(username);
            props.changeForecast(submittedForecast.data);
            setUserHasAttempted(true);
        } catch (error) {
            console.error("error in ForecastSubmission.js > handleForecastSubmit")
            console.error(error);
        };
    };
    
    const updateOnboarding = async (username) => {
        try {
            const updatedUserDocument = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/onboardingTask/${username}`, {
                onboardingTask: "submitAForecast",
                ffPointsIfFalse: 300,
                ffPointsIfTrue: 15
            });
            if (updatedUserDocument.data.firstTime === true) {
                setShowModal(true);
                setModalContent("You just got 300 Fantasy Forecast Points for submitting your first forecast! Any forecasts submitted from now on will yield 15 points. You can see your predictions from each day in the 'Forecast Stats' tab below.");
                setModalContent2("");
            }
            // // Try to redo this so that we don't need to do the GET first 
            // const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            // if (userDocument.data[0].onboarding.submitAForecast === true) {
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 15;
            //     await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
            //         { 
            //             fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
            //         }
            //     );
            //     setShowModal(true);
            //     setModalContent("You just got 15 points for submitting a forecast!");
            //     setModalContent2("");
            // } else {
            //     userDocument.data[0].onboarding.submitAForecast = true;
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 300
            //     await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
            //         { 
            //             onboarding: userDocument.data[0].onboarding,
            //             fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
            //         }
            //     );
            //     setShowModal(true);
            //     setModalContent("You just got 300 Fantasy Forecast Points for submitting your first forecast! Any forecasts submitted from now on will yield 15 points. You can see your predictions from each day in the 'Forecast Stats' tab below.");
            //     setModalContent2("");
            // };
        } catch (error) {
            console.error("Error in updateOnboarding");
            console.error(error);
        };
    };

    return (
        <div className="forecast-submission-and-selection-div">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
                <br />
                <p>{modalContent2}</p>
            </Modal>
            <div className="forecast-top-bar">
                {marketWarning === true &&
                    <div className="forecast-selection-div">
                        <h4>You are not currently in any markets, so no forecasts are available. To join a market, go to the Leaderboards page and press the Join A Market button. If you've joined a market and are still seeing this message, refresh the page and the dropdown should appear here.</h4>
                    </div>
                }
                {marketWarning === false && 
                    <div className="forecast-selection-div">
                        <label htmlFor="forecast-selection"><h2 className="header-label">Select a Problem</h2></label>
                        <select 
                            className="forecast-selection-select"
                            name="forecast-selection" 
                            id="forecast-selection"
                            defaultValue={selectedForecast}
                            onChange={handleChange}
                            style={alertStyle}
                            onClick={() => setDropdownHighlight(false)}>
                                <option 
                                    key={-1} 
                                    value={"All currently open forecasts are available here..."}>
                                        All currently open forecasts are available here...
                                </option>
                                {forecastProblemsForDropdown.map((item, index) => {
                                    if (item[0] === "Fantasy Forecast All-Time") return null;
                                    if (typeof(item[0]) === 'string') {
                                        return (
                                            <optgroup label={item[0]} key={index}>
                                                {item.map((nestedItem, nestedIndex) => {
                                                    if ((typeof(nestedItem) === 'object') && (new Date(nestedItem.closeDate) > new Date())) {
                                                        return (
                                                            <option 
                                                                key={nestedIndex} 
                                                                value={nestedItem.problemName}
                                                                style={{  color: "green" }}>
                                                                    OPEN: {nestedItem.problemName}
                                                            </option>
                                                        )
                                                    } else if ((typeof(nestedItem) === 'object') && (new Date(nestedItem.closeDate) <= new Date())) {
                                                        return (
                                                            <option 
                                                                key={nestedIndex} 
                                                                value={nestedItem.problemName}
                                                                style={{  color: "red" }}>
                                                                    CLOSED: {nestedItem.problemName}
                                                            </option>
                                                        )
                                                    } else return null;
                                                })}
                                            </optgroup>
                                        )
                                    } else return null;
                                })}
                        </select>
                    </div>
                }
                <div className="forecast-market-name-div">
                    <h2 className="header-label">Current Market</h2>
                    <h3>{selectedForecastMarket}</h3>
                </div>
                <div className="forecast-market-stats-div">
                    <h2 className="header-label">Your Rank</h2>
                    <h3>{userRank}</h3>
                </div>
            </div>
            {(forecastClosed === false && hasAForecastBeenSelected === true) &&
                <div className="forecast-submission-div">
                    <h2 className="selected-forecast">
                        {selectedForecast}
                        <FaInfoCircle 
                            color={"orange"} 
                            className="modal-i-btn"
                            onClick={() => { 
                                setShowModal(true); 
                                setModalContent(`This is where you will submit all of your predictions. Each problem has a deadline, found below the button that opened this box, and you are able to submit as many predictions as you want before said deadline. EVERY forecast you make contributes to your final score for the problem, so getting it right earlier will be more rewarding! We also ask that you submit an explanation of your 0-100% forecast, this will help remind you why you forecasted what you did in case you come back to update it.`); 
                                setModalContent2(`The Articles tab below returns articles based on a web scrape of the problem, so they may vary in terms of usefulness. The Forecast Stats tab will show you what other forecasters are saying for this problem.`)
                            }}
                        />
                        {selectedForecast.includes("Politico's") && <a style={{ color: "#fff", textDecoration: "none" }} href="https://www.politico.eu/europe-poll-of-polls/united-kingdom/" target="_blank"><h4>(<u>Link: Politico</u>)</h4></a>}
                    </h2>
                    <h3 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 38)}</h3>
                    {/* {selectedForecast.includes("Politico's") && <h2><a href="https://www.politico.eu/europe-poll-of-polls/united-kingdom/" target="_blank">Click Here For Politico's Poll of Polls</a></h2>} */}
                    {/* <br /> */}
                    <div className="forecast-submission-and-error-container">
                        {forecastSingleCertainty === true &&
                            <div className="forecast-submission-input">
                                <div className="forecast-submission-input-certainty-section">
                                    <h3>Your Certainty (0.00 - 100.00%)</h3>
                                    {userHasAttempted === false && 
                                        <input 
                                            type="number" 
                                            placeholder="Enter Your Prediction" 
                                            className="forecast-certainty-input" 
                                            onChange={handleCertaintyChange}
                                            min="0"
                                            max="100"
                                            step="0.05"
                                            disabled={isInputDisabled}
                                        />
                                    }
                                    {userHasAttempted === true && 
                                        <input 
                                            type="number" 
                                            className="forecast-certainty-input" 
                                            onChange={handleCertaintyChange}
                                            min="0"
                                            max="100"
                                            step="0.05"
                                            disabled={isInputDisabled}
                                        />
                                    }
                                </div>
                                <div className="forecast-submission-input-explanation-section">
                                    <h3>
                                        Forecast Explanation
                                        <FaInfoCircle 
                                            color={"orange"} 
                                            className="modal-i-btn"
                                            onClick={() => { 
                                                setShowModal(true); 
                                                setModalContent(`Feel free to note what resources, articles, key events or info helped to inform your prediction. This will be helpful for when you update your predictions (to see how you justified prior forecasts).`)
                                                setModalContent2("");
                                                }}
                                        />
                                    </h3>
                                    {userHasAttempted === true &&
                                        <textarea 
                                            className="forecast-submission-explanation-input"
                                            name="forecast-explanation"
                                            disabled={isInputDisabled}
                                            onChange={handleCommentsChange}>
                                        </textarea>
                                    }
                                    {userHasAttempted === false &&
                                        <textarea 
                                            placeholder="Explain why you gave the above certainty/certainties"
                                            className="forecast-submission-explanation-input"
                                            name="forecast-explanation"
                                            disabled={isInputDisabled}
                                            onChange={handleCommentsChange}>
                                        </textarea>
                                    }
                                </div>
                                {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                    <button 
                                        className="disabled-submit-forecast-btn" 
                                        disabled={buttonDisabled}>
                                            Error
                                    </button>
                                }
                                {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                    <button 
                                        className="submit-forecast-btn" 
                                        disabled={buttonDisabled}
                                        onClick={() => {
                                            handleForecastUpdate(selectedForecast, certainty, forecastComments, props.username); 
                                            setForecastResponseMessage("Forecast successfully updated!");
                                            setUserPreviousAttemptCertainty(certainty*100);
                                            setUserPreviousAttemptComments(forecastComments);
                                            props.causeRefresh();
                                        }}>
                                            Update Forecast
                                    </button>
                                }
                                {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                    <button 
                                        className="disabled-submit-forecast-btn" 
                                        disabled={buttonDisabled}>
                                            ERROR
                                    </button>
                                }
                                {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                    <button 
                                        className="submit-forecast-btn" 
                                        disabled={buttonDisabled}
                                        onClick={() => {
                                            handleForecastSubmit(selectedForecast, certainty, forecastComments, props.username); 
                                            setForecastResponseMessage("Forecast successfully submitted!");
                                            setUserPreviousAttemptCertainty(certainty*100);
                                            setUserPreviousAttemptComments(forecastComments);
                                            props.causeRefresh();
                                        }}>
                                            Submit Forecast
                                    </button>
                                }
                            </div>
                        }
                        {forecastSingleCertainty === false && 
                            <div className="multiple-forecast-submission-input">
                                <div className="forecast-submission-input-certainty-section">
                                    <h3>
                                        Your Certainty (0.00 - 100.00%)
                                        <FaInfoCircle 
                                            onClick={() => {
                                                setShowModal(true);
                                                setModalContent("You have 100 points to allocate between these three outcomes.");
                                                setModalContent2("");
                                            }}
                                            style={{ "color": "orange", "cursor": "pointer" }}
                                        />
                                    </h3>
                                    <div className="multiple-input-fields">
                                        <div className="input-header-container">
                                            <h3>{forecastPotentialOutcomes[0]}</h3>
                                            <input 
                                                type="number" 
                                                className="forecast-certainty-input" 
                                                onChange={(e) => handleMultipleCertaintyChange(1, e)}
                                                min="0"
                                                max="100"
                                                step="0.05"
                                                disabled={isInputDisabled}
                                            />
                                        </div>
                                        <div className="input-header-container">
                                            <h3>{forecastPotentialOutcomes[1]}</h3>
                                            <input 
                                                type="number" 
                                                className="forecast-certainty-input" 
                                                onChange={(e) => handleMultipleCertaintyChange(2, e)}
                                                min="0"
                                                max="100"
                                                step="0.05"
                                                disabled={isInputDisabled}
                                            />
                                        </div>
                                        <div className="input-header-container">
                                            <h3>{forecastPotentialOutcomes[2]}</h3>
                                            <input 
                                                type="number" 
                                                className="forecast-certainty-input" 
                                                onChange={(e) => handleMultipleCertaintyChange(3, e)}
                                                min="0"
                                                max="100"
                                                step="0.05"
                                                disabled={isInputDisabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="forecast-submission-explanation-and-btn-container">
                                    <div className="forecast-submission-input-explanation-section">
                                        <h3>
                                            Forecast Explanation
                                            <FaInfoCircle 
                                            color={"orange"} 
                                            className="modal-i-btn"
                                            onClick={() => { 
                                                setShowModal(true); 
                                                setModalContent(`Feel free to note what resources, articles, key events or info helped to inform your prediction. This will be helpful for when you update your predictions (to see how you justified prior forecasts).`);
                                                setModalContent2("")}}
                                            />
                                        </h3>
                                        {userHasAttempted === true &&
                                            <textarea 
                                                className="forecast-submission-explanation-input"
                                                name="forecast-explanation"
                                                disabled={isInputDisabled}
                                                onChange={handleCommentsChange}>
                                            </textarea>
                                        }
                                        {userHasAttempted === false &&
                                            <textarea 
                                                placeholder="Explain why you gave the above certainty/certainties"
                                                className="forecast-submission-explanation-input"
                                                name="forecast-explanation"
                                                disabled={isInputDisabled}
                                                onChange={handleCommentsChange}>
                                            </textarea>
                                        }
                                    </div>
                                    {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                        <button 
                                            className="disabled-submit-forecast-btn" 
                                            disabled={buttonDisabled}>
                                                Error
                                        </button>
                                    }
                                    {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                        <button 
                                            className="submit-forecast-btn" 
                                            disabled={buttonDisabled}
                                            onClick={() => {
                                                handleMultipleForecastUpdate(selectedForecast, certaintyOne, certaintyTwo, certaintyThree, forecastComments, props.username); 
                                                setForecastResponseMessage("Forecast successfully updated!");
                                                setUserPreviousAttemptCertainty(`${certaintyOne*100} / ${certaintyTwo*100} / ${certaintyThree*100}`);
                                                setUserPreviousAttemptComments(forecastComments);
                                                props.causeRefresh();
                                            }}>
                                                Update Forecast
                                        </button>
                                    }
                                    {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                        <button 
                                            className="disabled-submit-forecast-btn" 
                                            disabled={buttonDisabled}>
                                                ERROR
                                        </button>
                                    }
                                    {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                        <button 
                                            className="submit-forecast-btn" 
                                            disabled={buttonDisabled}
                                            onClick={() => {
                                                handleMultipleForecastSubmit(selectedForecast, certaintyOne, certaintyTwo, certaintyThree, forecastComments, props.username); 
                                                setForecastResponseMessage("Forecast successfully submitted!");
                                                setUserPreviousAttemptCertainty(`${certaintyOne*100} / ${certaintyTwo*100} / ${certaintyThree*100}`);
                                                setUserPreviousAttemptComments(forecastComments);
                                                props.causeRefresh();
                                            }}>
                                                Submit Forecast
                                        </button>
                                    }
                                </div>
                            </div>
                        }
                        {(forecastResponseMessage === "Forecast successfully updated!" || forecastResponseMessage === "Forecast successfully submitted!") && 
                            <h3 className="forecast-message" style={{ color: "green" }}>{forecastResponseMessage}</h3>
                        }
                        {(forecastResponseMessage !== "" && (forecastResponseMessage !== "Forecast successfully updated!" && forecastResponseMessage !== "Forecast successfully submitted!")) && 
                            <h3 className="forecast-message" style={{ color: "red" }}>{forecastResponseMessage}</h3>
                        }
                    </div>
                    <div className="forecast-submission-potential-scores">
                        <div className="placeholder-container-no-error">
                            <div className="last-certainty-div">
                                <h2 className="previous-attempt-titles">Your Last Forecast:</h2>
                                <h3>{userPreviousAttemptCertainty}%</h3>
                            </div>
                            <div className="last-comments-div">
                                <h2 className="previous-attempt-titles">Your Last Comments:</h2>
                                <h4>{userPreviousAttemptComments.includes("~") ? userPreviousAttemptComments.split("~")[1] : userPreviousAttemptComments}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="forecast-submission-div">
                {(forecastClosed === true && hasAForecastBeenSelected === true) && 
                    <div className="">
                        {forecastClosed === true ? <h2 className="selected-forecast" style={{ backgroundColor: "darkred" }}>{selectedForecast}</h2> : <h2 className="selected-forecast">{selectedForecast}</h2>}
                        <h4 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 41)}</h4>
                        <div className="forecast-review-div">
                            <div className="forecast-review-div-left">
                                <h2 style={{ color: "#404d72" }}><u>Your Stats</u></h2>
                                <h3># of Forecasts Submitted: {numberOfForecastsSubmitted}</h3>
                                {/* Add a check to see if it's multiple outcomes or not, if true: */}
                                {forecastSingleCertainty === true &&
                                <div>
                                    <h3>Highest Certainty: {highestCertainty}</h3>
                                    <h3>Lowest Certainty: {lowestCertainty}</h3>
                                </div>
                                }
                                {/* And if false */}
                                {forecastSingleCertainty === false &&
                                <div>
                                    <h3>Average {forecastPotentialOutcomes[0]}: {outcomeOneCertainty}</h3>
                                    <h3>Average {forecastPotentialOutcomes[1]}: {outcomeTwoCertainty}</h3>
                                    <h3>Average {forecastPotentialOutcomes[2]}: {outcomeThreeCertainty}</h3>
                                </div>
                                }
                            </div>
                            <div className="forecast-review-div-right">
                                <h1>{closedForecastScore}</h1>
                                <h2 style={{ color: "#404d72" }}>Your Brier Score</h2>
                                <h3>(110 = Best, 0 = Worst)</h3>
                                <br />
                                <h1>{closedForecastScore}</h1>
                                <h2 style={{ color: "#404d72" }}>Market / FantasyForecast Points Earned</h2>
                            </div>
                        </div>
                    </div>
                }
                {(hasAForecastBeenSelected === true && forecastClosed === true) &&
                    <ForecastBreakdown 
                        username={props.username} 
                        selectedForecast={selectedForecast}
                        userHasAttempted={userHasAttempted}
                        forecastClosed={true}
                        forecastSingleCertainty={forecastSingleCertainty}
                        forecastObjForAnalysis={forecastObjForAnalysis}
                        forecastPotentialOutcomes={forecastPotentialOutcomes}
                    />
                }
                {(hasAForecastBeenSelected === true && forecastClosed === false) &&
                    <ForecastBreakdown 
                        username={props.username} 
                        selectedForecast={selectedForecast}
                        userHasAttempted={userHasAttempted}
                        forecastClosed={false}
                        forecastSingleCertainty={forecastSingleCertainty}
                        forecastObjForAnalysis={forecastObjForAnalysis}
                        forecastPotentialOutcomes={forecastPotentialOutcomes}
                    />
                }
            </div>
            {(forecastClosed === true && hasAForecastBeenSelected === false) && 
                <div className="forecast-submission-div">
                    <h2 className="selected-forecast">{selectedForecast}</h2>
                </div>
            }
            {(forecastClosed === false && hasAForecastBeenSelected === false) && 
                <div className="forecast-submission-div">
                    <h2 className="selected-forecast">{selectedForecast}</h2>
                </div>
            }
        </div>
    )
}

export default ForecastSubmission;