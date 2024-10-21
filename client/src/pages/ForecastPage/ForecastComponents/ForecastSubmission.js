import React, { useState, useEffect } from 'react';
import './ForecastSubmission.css';
import axios from 'axios';
import Modal from '../../../components/Modal';
import { FaInfoCircle, FaHorseHead } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import ForecastBreakdown from './ForecastBreakdown';
import ForecastProblemLineChart from './ForecastProblemLineChart';

function ForecastSubmission(props) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [forecastProblems, setForecastProblems] = useState([]);
    const [forecastProblemsForDropdown, setForecastProblemsForDropdown] = useState([]);
    const [selectedForecast, setSelectedForecast] = useState("No forecast problem selected");
    const [selectedForecastObject, setSelectedForecastObject] = useState({});
    const [hasAForecastBeenSelected, setHasAForecastBeenSelected] = useState(false);
    const [forecastPotentialOutcomes, setForecastPotentialOutcomes] = useState([ "outcome1", "outcome2", "outcome3" ]);
    const [dropdownHighlight, setDropdownHighlight] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [selectedForecastMarket, setSelectedForecastMarket] = useState("N/A");
    const [userRank, setUserRank] = useState("N/A");
    const [userHasAttempted, setUserHasAttempted] = useState(false);
    const [userPreviousAttemptCertainty, setUserPreviousAttemptCertainty] = useState();
    const [userPreviousAttemptComments, setUserPreviousAttemptComments] = useState("");
    const [certainty, setCertainty] = useState(50);
    const [noCertainty, setNoCertainty] = useState(50);
    const [certaintyToShow, setCertaintyToShow] = useState(50);
    const [noCertaintyToShow, setNoCertaintyToShow] = useState(50);
    const [tripleCertainty1ToShow, setTripleCertainty1ToShow] = useState(0);
    const [tripleCertainty2ToShow, setTripleCertainty2ToShow] = useState(0);
    const [tripleCertainty3ToShow, setTripleCertainty3ToShow] = useState(0);
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
    const [previousCertaintyOne, setPreviousCertaintyOne] = useState(0);
    const [previousCertaintyTwo, setPreviousCertaintyTwo] = useState(0);
    const [previousCertaintyThree, setPreviousCertaintyThree] = useState(0);
    const [forecastObjForAnalysis, setForecastObjForAnalysis] = useState({});
    const [outcomeOneCertainty, setOutcomeOneCertainty] = useState("0%");
    const [outcomeTwoCertainty, setOutcomeTwoCertainty] = useState("0%");
    const [outcomeThreeCertainty, setOutcomeThreeCertainty] = useState("0%");
    const [selectedForecastDocumentID, setSelectedForecastDocumentID] = useState("");
    // const [switcherTab, setSwitcherTab] = useState("chart");
    // const [todayAverage, setTodayAverage] = useState("");
    // const [todayForecastCount, setTodayForecastCount] = useState("");
    const [forecastFoundFromNotifications, setForecastFoundFromNotifications] = useState(false);
    const [refreshChartAppearance, setRefreshChartAppearance] = useState(0);

    useEffect(() => {
        console.log("ForecastSubmission UE");
        getAllForecastsFromDB(props.userObjectMarkets);
        // getLeaderboardFromDB(props.selectedForecast.market);
    }, [props.selectedForecast, props.markets, props.allForecasts, props.userObject]);

    const getAllForecastsFromDB = async (userMarkets) => {
        try {
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
                let found = false;
                for (let j = 0; j < props.allForecasts[i].submittedForecasts.length; j++) {
                    if (props.allForecasts[i].submittedForecasts[j].username === props.username) {
                        found = true;
                        continue;
                    };
                };
                if (found) {
                    props.allForecasts[i].userHasAttempted = true;
                } else {
                    props.allForecasts[i].userHasAttempted = false;
                };
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
            if (localStorage.getItem("forecastSelectedFromNotifications") === "true") {
                for (let i = 0; i < filtered.length; i++) {
                    if (filtered[i]._id === localStorage.getItem("selectedForecastID")) {
                        props.toggleDiv(true);
                        setHasAForecastBeenSelected(true);
                        props.handleForecastSet(true);
                        setSelectedForecast(filtered[i].problemName);
                        pullForecastDetailsAndCheckIfAlreadyAttempted(filtered[i].problemName, true, filtered);
                        setIsInputDisabled(false);
                        getForecastDetails(filtered[i].problemName, true, filtered);
                        setForecastResponseMessage("");
                        setCertainty(0);
                        setCertaintyOne(0);
                        setCertaintyTwo(0);
                        setCertaintyThree(0);
                        setForecastComments("");
                        setForecastFoundFromNotifications(true);
                        localStorage.setItem("forecastSelectedFromNotifications", false);
                        continue;
                    };
                };
            };
        } catch (error) {
            console.error(error);
        };
    };

    const getLeaderboardFromDB = async (marketName) => {
        if (marketName === undefined) return;
        try {
            const leaderboardResponse = await axios.get(`${process.env.REACT_APP_API_CALL_L}/newGetLeaderboardRoute/${marketName}`);
            for (let i = 0; i < leaderboardResponse.data.length; i++) {
                leaderboardResponse.data[i].marketPoints = 0;
                for (let j = 0; j < leaderboardResponse.data[i].brierScores.length; j++) {
                    if (leaderboardResponse.data[i].brierScores[j].marketName === marketName) {
                        leaderboardResponse.data[i].marketPoints += leaderboardResponse.data[i].brierScores[j].brierScore;
                    };
                };
            };
            let lbRankings = leaderboardResponse.data.sort((a, b) => b.marketPoints - a.marketPoints);
            formatUserRank(lbRankings);
            props.handleLeaderboardChange(lbRankings);
        } catch (error) { 
            console.error(error);
        };
    };

    // When a forecast problem is selected from the dropdown
    const handleChange = (e) => {
console.log(e);
        if (e === "All currently open forecasts are available here...") {
            props.toggleDiv(false);
            setHasAForecastBeenSelected(false);
            props.handleForecastSet(false);
            setSelectedForecast("No forecast problem selected");
            setSelectedForecastMarket("N/A");
            setUserRank("N/A");
            setIsInputDisabled(true);
            setForecastCloseDate("");
            setForecastClosed(true);
        } else {
            props.toggleDiv(true);
            setHasAForecastBeenSelected(true);
            props.handleForecastSet(true);
            setSelectedForecast(e);
            pullForecastDetailsAndCheckIfAlreadyAttempted(e, false);
            setIsInputDisabled(false);
            getForecastDetails(e, false);
            setForecastResponseMessage("");
            setCertainty(0);
            setCertaintyOne(0);
            setCertaintyTwo(0);
            setCertaintyThree(0);
            setTripleCertainty1ToShow(0);
            setTripleCertainty2ToShow(0);
            setTripleCertainty3ToShow(0);
            setForecastComments("");
            setRefreshChartAppearance(0);
        };
    };

    const getForecastDetails = (etv, fromNotifications, filtered) => {
        let forecast; 
        if (fromNotifications === true) {
            forecast = filtered[filtered.findIndex(f => f.problemName === etv)];
        } else {
            forecast = forecastProblems[forecastProblems.findIndex(fP => fP.problemName === etv)];
        }
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
            // const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            const forecastDetails = props.userBriers.find(el => el.problemName === problemName);
            setClosedForecastScore(forecastDetails === undefined ? "No Score (Yet)" : forecastDetails.brierScore.toFixed(0));
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

    const pullForecastDetailsAndCheckIfAlreadyAttempted = (forecast, fromNotifications, filtered) => {
        let forecastProbs;
        if (fromNotifications === true) {
            forecastProbs = filtered;
        } else {
            forecastProbs = forecastProblems;
        }
        for (let i = 0; i < forecastProbs.length; i++) {
            if (forecastProbs[i].problemName === forecast) {
                setSelectedForecastMarket(forecastProbs[i].market);
                setSelectedForecastDocumentID(forecastProbs[i]._id);
                setSelectedForecastObject(forecastProbs[i]);
                props.changeForecast(forecastProbs[i]);
                if (forecastProbs[i].singleCertainty === false) {
                    setForecastPotentialOutcomes(forecastProbs[i].potentialOutcomes);
                };
                // If only one certainty, this = true. False is multiple certainties are required from user.
                setForecastSingleCertainty(forecastProbs[i].singleCertainty);
                props.setForecastSingleCertainty(forecastProbs[i].singleCertainty);
                setForecastPotentialOutcomes(forecastProbs[i].potentialOutcomes);
                // If no forecasts have been submitted by anyone at all
                if (forecastProbs[i].submittedForecasts.length === 0) {
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
                    for (let j = 0; j < forecastProbs[i].submittedForecasts.length; j++) {
                        if (forecastProbs[i].submittedForecasts[j].username === props.username) {
                            // You have submitted at least one forecast for this problem
                            setUserHasAttempted(true);
                            if (forecastProbs[i].singleCertainty === true) {
                                setUserPreviousAttemptCertainty((forecastProbs[i].submittedForecasts[j].forecasts[forecastProbs[i].submittedForecasts[j].forecasts.length-1].certainty*100).toFixed(2));    
                            } else if (forecastProbs[i].singleCertainty === false) {
                                setUserPreviousAttemptCertainty(`${(forecastProbs[i].submittedForecasts[j].forecasts[forecastProbs[i].submittedForecasts[j].forecasts.length-1].certainties.certainty1*100).toFixed(2)}% / ${(forecastProbs[i].submittedForecasts[j].forecasts[forecastProbs[i].submittedForecasts[j].forecasts.length-1].certainties.certainty2*100).toFixed(2)}% / ${(forecastProbs[i].submittedForecasts[j].forecasts[forecastProbs[i].submittedForecasts[j].forecasts.length-1].certainties.certainty3*100).toFixed(2)}`);
                            }
                            setUserPreviousAttemptComments(forecastProbs[i].submittedForecasts[j].forecasts[forecastProbs[i].submittedForecasts[j].forecasts.length-1].comments);
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

    // Charmander - need to handle the certainty changing here, not in the new function I made at bottom of this before renders
    const handleCertaintyChange = (e, isCertaintyYes) => {
        console.log("1, the number just entered is:" + e.target.value);
		console.log("2, true for option 0, false for option 1: " + isCertaintyYes);
		const thisCertainty = e.target.value;
		console.log("3 = " + thisCertainty)
		if (certainty > 100) {
			setButtonDisabled(true);
			setForecastResponseMessage('Please enter a certainty between 0 and 100');
			return;
		} else if (thisCertainty < 0) {
			setForecastResponseMessage('Please enter a forecast from 0-100');
			setButtonDisabled(true);
			return;
		} else {
			setForecastResponseMessage('');
			setButtonDisabled(false);
		}
		if (e.target.value.length === 0) {
			setButtonDisabled(true);
			setForecastResponseMessage('Please input a certainty between 0 and 100');
		}
		if (isCertaintyYes === true) {
			console.log('yessir');
			setCertaintyToShow(thisCertainty);
			setNoCertaintyToShow(100 - thisCertainty);
			let currentPrediction = thisCertainty / 100;
			setCertainty(currentPrediction);
			console.log("certainty Var is now = " + currentPrediction);
		} else if (isCertaintyYes === false) {
			console.log('nosir');
			setCertaintyToShow(100 - thisCertainty);
			setNoCertaintyToShow(thisCertainty);
            
			let currentPrediction = (100 - thisCertainty) / 100;
			setCertainty(currentPrediction);
			console.log("certainty Var is now = " + currentPrediction);
		}
	};

    const handleMultipleCertaintyChange = (certaintyVal, e) => {
        const certainty = e.target.value;
        if (certainty > 100) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please enter forecasts between 0 and 100");
            return;
        } else if (certainty < 0) {
            setForecastResponseMessage("Please enter forecasts between 0 and 100");
            setButtonDisabled(true);
            return;
        } else if (e.target.value.length === 0) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please input forecasts between 0 and 100");
        } else {
            setForecastResponseMessage("");
            setButtonDisabled(false);
            if (certaintyVal === 1) {
                if ((Number(certainty) + Number((certaintyTwo*100)) + Number((certaintyThree*100))) > 100) {
                    let amount = ((Number(certainty) + Number((certaintyTwo*100)) + Number((certaintyThree*100))))-100;
                    setForecastResponseMessage(`The three forecasts cannot exceed 100. Reduce your %s by ${amount}`);
                    setCertaintyOne(Number(certainty/100));
                    setTripleCertainty1ToShow(certainty);
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyOne(Number(certainty/100));
                    setTripleCertainty1ToShow(certainty);
                    return;
                }
            } else if (certaintyVal === 2) {
                if ((Number((certaintyOne*100)) + Number(certainty) + Number((certaintyThree*100))) > 100) {
                    let amount = ((Number((certaintyOne*100)) + Number(certainty) + Number((certaintyThree*100))))-100;
                    setForecastResponseMessage(`The three forecasts cannot exceed 100. Reduce your %s by ${amount}`);
                    setCertaintyTwo(Number(certainty/100));
                    setTripleCertainty2ToShow(certainty);
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyTwo(Number(certainty/100));
                    setTripleCertainty2ToShow(certainty);
                    return;
                };
            } else if (certaintyVal === 3) {
                if ((Number((certaintyOne*100)) + Number((certaintyTwo*100)) + Number(certainty)) > 100) {
                    let amount = ((Number((certaintyOne*100)) + Number((certaintyTwo*100)) + Number(certainty)))-100;
                    setForecastResponseMessage(`The three forecasts cannot exceed 100. Reduce your %s by ${amount}`);
                    setCertaintyThree(Number(certainty/100));
                    setTripleCertainty3ToShow(certainty);
                    setButtonDisabled(true);
                    return;
                } else {
                    setButtonDisabled(false);
                    setCertaintyThree(Number(certainty/100));
                    setTripleCertainty3ToShow(certainty);
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
        console.log(forecast);
        console.log(newCertainty);
        console.log(newComments);
        console.log(username);
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to submit a forecast.");
            setModalContent2("");
            return;
        } else {
            if (newCertainty === undefined) {
                setForecastResponseMessage("Please enter a certainty between 0-100");
                return;
            };
            if ((newCertainty*100) > 100 || (newCertainty*100) < 0) {
                setForecastResponseMessage("Please enter a certainty within 0-100");
                return;
            };
            if (newComments === "") {
                setForecastResponseMessage("Please enter a comment");
                return;
            }
            try {
                // const newForecastTwo = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/update`, {
                // const newForecastTwo = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/submitOrUpdateSingle`, {
                const newForecastTwo = await axios.patch(`http://localhost:8000/forecasts/submitOrUpdateSingle`, {
                    documentID: selectedForecastDocumentID,
                    problemName: forecast,
                    // newForecastObject: newForecastObj,
                    certainty: newCertainty, 
                    comments: `(${username})~ ${newComments}`, 
                    date: new Date().toString(),
                    username: username
                });
                props.changeForecast(newForecastTwo.data);
                setForecastResponseMessage("Forecast successfully updated! Check out the chart to see it!");
                document.getElementsByClassName("forecast-certainty-input").value = 0;
                setCertainty(0);
                setCertaintyOne(0);
                setCertaintyTwo(0);
                setCertaintyThree(0);
                setForecastComments("");
                setUserPreviousAttemptCertainty(certainty*100);
                setUserPreviousAttemptComments(forecastComments);
                updateOnboarding(username);
                setRefreshChartAppearance(refreshChartAppearance+1);
            } catch (error) {
                console.error("error in ForecastSubmission.js > handleForecastUpdate");
                console.error(error);
            };
        };
    };

    const handleForecastSubmit = async (forecast, certainty, comments, username) => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to submit a forecast.");
            setModalContent2("");
            return;
        } else {
            if (certainty === undefined) {
                setForecastResponseMessage("Please enter a certainty between 0.00-100.00");
                return;
            };
            if ((certainty*100) > 100 || (certainty*100) < 0) {
                setForecastResponseMessage("Please enter a certainty within 0.00-100.00");
                return;
            };
            if (certainty === "") {
                setForecastResponseMessage("Please enter a comment");
                return;
            }
            console.log(certainty);
            try {
                // const submittedForecast = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/submitOrUpdateSingle`, {
                    const submittedForecast = await axios.patch(`http://localhost:8000/forecasts/submitOrUpdateMultiple`, {
                    documentID: selectedForecastDocumentID,
                    problemName: forecast,
                    username: username,
                    certainty: certainty,
                    comments: `(${username})~ ${comments}`,
                    date: new Date().toString()
                });
                setForecastResponseMessage("Forecast successfully submitted! Check out the chart to see it!")
                props.changeForecast(submittedForecast.data);
                setUserHasAttempted(true);
                document.getElementsByClassName("forecast-certainty-input").value = 0;
                setCertainty(0);
                setCertaintyOne(0);
                setCertaintyTwo(0);
                setCertaintyThree(0);
                setForecastComments("");
                setUserPreviousAttemptCertainty(certainty*100);
                setUserPreviousAttemptComments(forecastComments);
                updateOnboarding(username);
                setRefreshChartAppearance(refreshChartAppearance+1);
                if ((new Date() - new Date(selectedForecastObject.startDate))/1000 <= 86400) {
                    setShowModal(true);
                    setModalContent("You submitted within 24 hours of the problem going live, if you haven't yet got it, you've just unlocked the Quick off the Mark trophy! If you select a new forecast from the dropdown and then return to this one and your forecast isn't showing, just refresh the page and it should be there.");
                };
            } catch (error) {
                console.error("error in ForecastSubmission.js > handleForecastSubmit")
                console.error(error);
            };
        };
    };

    // Add the loading animation until it's submitted?
    const handleMultipleForecastUpdate = async (forecast, newCertainty1, newCertainty2, newCertainty3, newComments, username) => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to submit a forecast.");
            setModalContent2("");
            return;
        } else {
            if (newCertainty1 === undefined || newCertainty2 === undefined || newCertainty3 === undefined) {
                setForecastResponseMessage("One or more certainties is missing.");
                return;
            };
            if (((newCertainty1*100) > 100 || (newCertainty1*100) < 0) || ((newCertainty2*100) > 100 || (newCertainty2*100) < 0) || ((newCertainty3*100) > 100 || (newCertainty3*100) < 0)) {
                setForecastResponseMessage("One or more certainties is not between 0 and 100.");
                return;
            };
            if ((newCertainty1*100) + (newCertainty2*100) + (newCertainty3*100) !== 100) {
                setForecastResponseMessage("The three certainties must equal 100");
                return;
            }
            if (newComments === "") {
                setForecastResponseMessage("Please enter a comment");
                return;
            }
            try {
                // const newForecastObj = {
                //     certainties: {
                //         certainty1: newCertainty1, 
                //         certainty2: newCertainty2, 
                //         certainty3: newCertainty3, 
                //     },
                //     comments: `(${username})~ ${newComments}`, 
                //     date: new Date().toString()
                // };
                // const newForecastTwo = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/submitOrUpdateMultiple`, {
                const newForecastTwo = await axios.patch(`http://localhost:8000/forecasts/submitOrUpdateMultiple`, {
                    documentID: selectedForecastDocumentID,
                    problemName: forecast,
                    certainty1: newCertainty1, 
                    certainty2: newCertainty2, 
                    certainty3: newCertainty3,
                    comments: `(${username})~ ${newComments}`, 
                    date: new Date().toString(),
                    // newForecastObject: newForecastObj,
                    username: username
                });
                setForecastResponseMessage("Forecast successfully updated! Check out the chart to see it!");
                props.changeForecast(newForecastTwo.data);
                document.getElementsByClassName("forecast-certainty-input").value = 0;
                setCertainty(0);
                setCertaintyOne(0);
                setCertaintyTwo(0);
                setCertaintyThree(0);
                setForecastComments("");
                setUserPreviousAttemptCertainty(`${newCertainty1*100} / ${newCertainty2*100} / ${newCertainty3*100}`);
                setUserPreviousAttemptComments(newComments);
                updateOnboarding(username);
                setPreviousCertaintyOne(newCertainty1);
                setPreviousCertaintyTwo(newCertainty2);
                setPreviousCertaintyThree(newCertainty3);
                setRefreshChartAppearance(refreshChartAppearance+1);
            } catch (error) {
                console.error("error in ForecastSubmission.js > handleForecastUpdate");
                console.error(error);
            };
        };
    };

    const handleMultipleForecastSubmit = async (forecast, certainty1, certainty2, certainty3, comments, username) => {
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to submit a forecast.");
            setModalContent2("");
            return;
        } else {
            if ((certainty1*100) + (certainty2*100) + (certainty3*100) !== 100) {
                setForecastResponseMessage("Your certainties do not equal 100.");
                return;
            };
            if (certainty1 === undefined || certainty2 === undefined || certainty3 === undefined) {
                setForecastResponseMessage("One or more certainties is missing.");
                return;
            };
            if (((certainty1*100) > 100 || (certainty1*100) < 0) || ((certainty2*100) > 100 || (certainty2*100) < 0) || ((certainty3*100) > 100 || (certainty3*100) < 0)) {
                setForecastResponseMessage("One or more certainties is not between 0 and 100.");
                return;
            };
            if (comments === "") {
                setForecastResponseMessage("Please enter a comment");
                return;
            }
            try {
                // const submittedForecast = await axios.patch(`${process.env.REACT_APP_API_CALL_F}/submitOrUpdateMultiple`, {
                const submittedForecast = await axios.patch(`http://localhost:8000/forecasts/submitOrUpdateMultiple`, {
                    documentID: selectedForecastDocumentID,
                    problemName: forecast,
                    username: username,
                    certainty1: certainty1,
                    certainty2: certainty2,
                    certainty3: certainty3,
                    comments: `(${username})~ ${comments}`,
                    date: new Date().toString()
                });
                setForecastResponseMessage("Forecast successfully submitted! Check out the chart to see it!")
                props.changeForecast(submittedForecast.data);
                setUserHasAttempted(true);
                document.getElementsByClassName("forecast-certainty-input").value = 0;
                setCertainty(0);
                setCertaintyOne(0);
                setCertaintyTwo(0);
                setCertaintyThree(0);
                setForecastComments("");
                setUserPreviousAttemptCertainty(`${certainty1*100} / ${certainty2*100} / ${certainty3*100}`);
                setUserPreviousAttemptComments(comments);
                updateOnboarding(username);
                setPreviousCertaintyOne(certainty1);
                setPreviousCertaintyTwo(certainty2);
                setPreviousCertaintyThree(certainty3);
                setRefreshChartAppearance(refreshChartAppearance+1);
                if ((new Date() - new Date(selectedForecastObject.startDate))/1000 <= 86400) {
                    setShowModal(true);
                    setModalContent("You submitted within 24 hours of the problem going live, if you haven't yet got it, you've just unlocked the Quick off the Mark trophy! If you select a new forecast from the dropdown and then return to this one and your forecast isn't showing, just refresh the page and it should be there.");
                };
            } catch (error) {
                console.error("error in ForecastSubmission.js > handleForecastSubmit")
                console.error(error);
            };
        };
    };
    
    const updateOnboarding = async (username) => {
        try {
            const updatedUserDocument = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/onboardingTask/${username}`, {
                onboardingTask: "submitAForecast",
                ffPointsIfFalse: 300,
                ffPointsIfTrue: 15
            });
            if (updatedUserDocument.data.firstTime === true) {
                setShowModal(true);
                setModalContent("You just got 300 Fantasy Forecast Points for submitting your first forecast! Any forecasts submitted from now on will yield 15 points. You can see your predictions from each day in the 'Forecast Stats' tab below.");
                setModalContent2("");
            }
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
            <div className={width > 700 ? "new-forecast-layout-container" : "new-forecast-layout-container-mobile" }>
            {width > 700 && <div className="forecast-top-bar">
                {marketWarning === true &&
                    <div className="forecast-selection-div-empty">
                        <h4>There are currently no forecasts available right now. Try refreshing and returning to this page or hang tight until new forecast problems are released!</h4>
                    </div>
                }
                {marketWarning === false && 
                    <div className="forecast-selection-div">
                        <h2 className="forecast-selection-question-header">Pick a Horse Race</h2>
                            {props.allForecasts.map((item, index) => {
                                if (new Date() > new Date(item.startDate)) {
                                    if (item.isClosed === true) {
                                        return (
                                            <div>
                                                <h4 className="forecast-selection-item" onClick={() => handleChange(item.problemName)}>
                                                    <FaIcons.FaHorseHead color={"#404d72"} />
                                                    <span style={{ color: "red"}}> (CLOSED)</span> 
                                                    &nbsp;{item.problemName}
                                                </h4>
                                                <hr />
                                            </div>
                                        )
                                    } else if (item.isClosed === false) {
                                        return (
                                            <div>
                                                <h4 className="forecast-selection-item" onClick={() => handleChange(item.problemName)}>
                                                    <FaIcons.FaHorseHead color={"#404d72"} />
                                                    <span style={{ color: "green"}}> (LIVE - {Math.floor((Math.abs(new Date(item.closeDate) - new Date()))/(1000*60*60*24))} days)</span> 
                                                    &nbsp;{item.problemName}
                                                </h4>
                                                <hr />
                                            </div>
                                        )
                                    }
                                }
                            })}
                    </div>
                }
            </div>}
                {/* chart and submission */}
                {(forecastClosed === false && hasAForecastBeenSelected === true) &&
                    <div className="forecast-submission-and-chart-div">
                        {width > 700 && <h2 className="selected-forecast">
                            {selectedForecast}
                            <FaInfoCircle 
                                color={"orange"} 
                                className="modal-i-btn"
                                onClick={() => { 
                                    setShowModal(true); 
                                    setModalContent(`This is where you will submit all of your forecasts! All races have a deadline, found below the button that opened this box, and you can submit AS MANY forecasts as you want before the deadline. EVERY forecast you make contributes to your final score, so allocating more points to the correct outcome SOONER will be more rewarding! You can also submit an explanation to accompany your forecast, this will help you if you come back and update it!`); 
                                    setModalContent2(`The Articles section below contains links to news articles using the question wording. Use the Chart to see how you're forecasting compared to everyone else. Do you agree? Or are you thinking differently to the crowd?`)
                                }}
                            />
                        </h2>}
                        {width <= 700 && 
                            <div className="forecast-selection-div">
                                <select className="race-selector" id="race-selector" onChange={(e) => { handleChange(e.target.value)}}>
                                    <option value="" selected disabled hidden>Choose a Race to predict here!</option>
                                    {props.allForecasts.map((item, index) => {
                                        if (new Date() > new Date(item.startDate)) {
                                            if (item.isClosed === true) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>CLOSED: {item.problemName}</option>
                                                )
                                            } else if (item.isClosed === false) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>OPEN: {item.problemName}</option>
                                                )
                                            }
                                        }
                                    })}
                                </select>
                                {selectedForecast !== "No forecast problem selected" && <h2 className="selected-forecast">
                                    {selectedForecast}
                                    <FaInfoCircle 
                                        color={"orange"} 
                                        className="modal-i-btn"
                                        onClick={() => { 
                                            setShowModal(true); 
                                            setModalContent(`This is where you will submit all of your forecasts! All races have a deadline, found below the button that opened this box, and you can submit AS MANY forecasts as you want before the deadline. EVERY forecast you make contributes to your final score, so allocating more points to the correct outcome SOONER will be more rewarding! You can also submit an explanation to accompany your forecast, this will help you if you come back and update it!`); 
                                            setModalContent2(`The Articles section below contains links to news articles using the question wording. Use the Chart to see how you're forecasting compared to everyone else. Do you agree? Or are you thinking differently to the crowd?`)
                                        }}
                                    />
                                </h2>}
                            </div>
                        }
                        <h3 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 31)}</h3>
                        <div className="forecast-chart-stats-switcher">
                            <ForecastProblemLineChart
                                selectedForecastObject={selectedForecastObject} 
                                updateTodayStats={props.updateTodayStats} 
                                username={props.username} 
                                refreshChartAppearance={refreshChartAppearance} 
                                forecastSingleCertainty={forecastSingleCertainty}
                                userPreviousAttemptCertainty={userPreviousAttemptCertainty}
                                userPreviousAttemptComments={userPreviousAttemptComments}
                                previousCertaintyOne={previousCertaintyOne}
                                previousCertaintyTwo={previousCertaintyTwo}
                                previousCertaintyThree={previousCertaintyThree}
                            />
                            {/* <div className="forecast-chart-stats-switcher-tab-menu">
                                <div className={switcherTab === "problemStats" ? "forecast-chart-stats-switcher-tab-selected" : "forecast-chart-stats-switcher-tab"} onClick={() => setSwitcherTab("chart")}><h3>Chart</h3></div>
                                <div className={switcherTab === "chart" ? "forecast-chart-stats-switcher-tab-selected" : "forecast-chart-stats-switcher-tab"} onClick={() => setSwitcherTab("problemStats")}><h3>Problem Stats</h3></div>
                            </div>
                            {switcherTab === "problemStats" && 
                                <div className="switcher-problem-stats">
                                    <ForecastStatistics 
                                        selectedForecast={props.selectedForecast} 
                                        today={false} 
                                        forecastSingleCertainty={forecastSingleCertainty}
                                    />
                                    <ForecastStatistics 
                                        selectedForecast={props.selectedForecast}
                                        today={true} 
                                        todayAverage={todayAverage} 
                                        todayForecastCount={todayForecastCount} 
                                        forecastSingleCertainty={forecastSingleCertainty}
                                    />
                                    <MarketStatistics 
                                        leaderboard={props.leaderboardData} 
                                        username={props.username} 
                                        refresh={props.refresh} 
                                        market={props.selectedForecast.market}
                                    />
                                    <ForecastMarketLeaderboard 
                                        market={props.selectedForecast.market} 
                                        leaderboard={props.leaderboardData} 
                                        username={props.username} 
                                    />
                                </div>
                            }
                            {switcherTab === "chart" && 
                                <ForecastProblemLineChart
                                    selectedForecastObject={selectedForecastObject} 
                                    updateTodayStats={props.updateTodayStats} 
                                    username={props.username} 
                                    refreshChartAppearance={refreshChartAppearance} 
                                    forecastSingleCertainty={forecastSingleCertainty}
                                    userPreviousAttemptCertainty={userPreviousAttemptCertainty}
                                    userPreviousAttemptComments={userPreviousAttemptComments}
                                    previousCertaintyOne={previousCertaintyOne}
                                    previousCertaintyTwo={previousCertaintyTwo}
                                    previousCertaintyThree={previousCertaintyThree}
                                />
                            } */}
                        </div>
                        <div className="forecast-submission-div">
                            <div className="forecast-submission-and-error-container">
                                {(forecastSingleCertainty === true && (forecastResponseMessage !== "Forecast successfully updated! Check out the chart to see it!" && forecastResponseMessage !== "Forecast successfully submitted! Check out the chart to see it!")) &&
                                    <div className="forecast-submission-input">
                                        <div className="forecast-submission-input-certainty-section">
                                            <h2 className="new-forecast-input-header">
                                                Enter Your Forecast (0 - 100%)
                                                <FaInfoCircle 
                                                    color={"orange"} 
                                                    className="modal-i-btn"
                                                    onClick={() => { 
                                                        setShowModal(true); 
                                                        setModalContent(`How likely do you think each possible outcome is? Using the sliders, allocate 100 points across across the two outcomes. The more you allocate to one outcome, the more you'll gain if that outcome happens. As you update one number, the other will automatically change for you. You can come back and update your forecast as often as you like!`);
                                                        setModalContent2("");
                                                    }}
                                                />
                                            </h2>
                                            <div className="new-forecast-binary-container">
                                                <div className="new-forecast-input-binaries">
                                                    <h2>{selectedForecastObject.potentialOutcomes[0]}</h2>
                                                    <h1 className="certainty-show">{Math.round(certaintyToShow, 2)}%</h1>
                                                    <input 
                                                        type="range" 
                                                        id="certaintyYes" 
                                                        name="certaintyYes" 
                                                        min="0" 
                                                        max="100" 
                                                        step="1"
                                                        default="50"
                                                        onChange={(e) => handleCertaintyChange(e, true)}
                                                        value={certaintyToShow}
                                                        style={{ width: "100%", accentColor: "#404d72" }}
                                                    />
                                                    {/* <input
                                                        type="number"
                                                        defaultValue={0}
                                                        className="forecast-certainty-input"    
                                                    >
                                                    </input> */}
                                                    {/* <label for="certaintyYes">{selectedForecastObject.potentialOutcomes[0]}</label> */}
                                                </div>
                                                <div className="new-forecast-input-binaries">
                                                    <h2>{selectedForecastObject.potentialOutcomes[1]}</h2>
                                                    <h1 className="certainty-show">{Math.round(noCertaintyToShow, 2)}%</h1>
                                                    <input 
                                                        type="range" 
                                                        id="certaintyNo" 
                                                        name="certaintyNo" 
                                                        min="0" 
                                                        max="100" 
                                                        step="1"
                                                        default="50"
                                                        onChange={(e) => handleCertaintyChange(e, false)}
                                                        value={noCertaintyToShow}
                                                        style={{ width: "100%", accentColor: "#404d72" }}
                                                    />
                                                    {/* <h2>{selectedForecastObject.potentialOutcomes[1]}</h2>
                                                    <input
                                                        type="number"
                                                        defaultValue={0}
                                                        className="forecast-certainty-input"    
                                                    >
                                                    </input> */}
                                                </div>
                                            </div>

                                            {/* CHARMANDER: Old input form */}
                                                {/* <input 
                                                    type="number" 
                                                    placeholder="Enter Your Prediction" 
                                                    defaultValue={0}
                                                    className="forecast-certainty-input" 
                                                    onChange={handleCertaintyChange}
                                                    min="0"
                                                    max="100"
                                                    step="0.05"
                                                    disabled={isInputDisabled}
                                                /> */}
                                            {/* CHARMANDER: Old input form */}
                                        </div>
                                        <div className="forecast-submission-explanation-and-btn-container">
                                            <div className="forecast-submission-input-explanation-section">
                                                <h2>
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
                                                </h2>
                                                {userHasAttempted === true &&
                                                    <textarea 
                                                        className="forecast-submission-explanation-input"
                                                        name="forecast-explanation"
                                                        style={{ width: "100%", maxWidth: "100%" }}
                                                        disabled={isInputDisabled}
                                                        onChange={handleCommentsChange}>
                                                    </textarea>
                                                }
                                                {userHasAttempted === false &&
                                                    <textarea 
                                                        placeholder="Explain why you gave the above certainty/certainties"
                                                        className="forecast-submission-explanation-input"
                                                        style={{ width: "100%", maxWidth: "100%" }}
                                                        name="forecast-explanation"
                                                        disabled={isInputDisabled}
                                                        onChange={handleCommentsChange}>
                                                    </textarea>
                                                }
                                            </div>
                                            <br />
                                            <hr />
                                            <h2>
                                                Resolution Criteria
                                                <FaInfoCircle 
                                                        color={"orange"} 
                                                        className="modal-i-btn"
                                                        onClick={() => { 
                                                            setShowModal(true); 
                                                            setModalContent(`These are the rules behind how we will use to decide which outcome actually happened. This allows for you to see, transparently, how outcomes are arrived at.`)
                                                            setModalContent2("");
                                                            }}
                                                    />
                                            </h2>
                                            <p style={{ fontSize: "95%" }}>{selectedForecastObject.resolutionCriteria !== undefined ? selectedForecastObject.resolutionCriteria : "No criteria established yet."}</p>
                                            {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                            <button 
                                                className="disabled-submit-forecast-btn" 
                                                disabled={buttonDisabled}>
                                                    <h2>Error</h2>
                                            </button>
                                            }
                                            {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                                <button 
                                                    className="submit-forecast-btn" 
                                                    disabled={buttonDisabled}
                                                    onClick={() => {
                                                        handleForecastUpdate(selectedForecast, certainty, forecastComments, props.username); 
                                                    }}>
                                                        <h2>Update Forecast</h2>
                                                </button>
                                            }
                                            {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                                <button 
                                                    className="disabled-submit-forecast-btn" 
                                                    disabled={buttonDisabled}>
                                                        <h2>ERROR</h2>
                                                </button>
                                            }
                                            {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                                <button 
                                                    className="submit-forecast-btn" 
                                                    disabled={buttonDisabled}
                                                    onClick={() => {
                                                        // console.log(certainty);
                                                        handleForecastSubmit(selectedForecast, certainty, forecastComments, props.username, selectedForecastObject); 
                                                    }}>
                                                        <h2>Submit Forecast</h2>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                }
                                {(forecastSingleCertainty === false && (forecastResponseMessage !== "Forecast successfully updated! Check out the chart to see it!" && forecastResponseMessage !== "Forecast successfully submitted! Check out the chart to see it!")) &&
                                    <div className="multiple-forecast-submission-input">
                                        <div className="forecast-submission-input-certainty-section">
                                        <h2 className="new-forecast-input-header">
                                                Enter Your Forecast (0 - 100%)
                                                <FaInfoCircle 
                                                    color={"orange"} 
                                                    className="modal-i-btn"
                                                    onClick={() => { 
                                                        setShowModal(true); 
                                                        setModalContent(`How likely do you think each possible outcome is? Using the sliders, allocate 100 points across across the three outcomes. The more you allocate to one outcome, the more you'll gain if that outcome happens. You can come back and update your forecast as often as you like!`);
                                                        setModalContent2("");
                                                    }}
                                                />
                                            </h2>
                                            <div className="multiple-input-fields">
                                                <div className="new-forecast-input-binaries">
                                                    <h3>{forecastPotentialOutcomes[0]}</h3>
                                                    <h1 className="certainty-show">{Math.round(tripleCertainty1ToShow, 2)}%</h1>
                                                    <input 
                                                        type="range" 
                                                        id="tripleCertainty1" 
                                                        name="tripleCertainty1" 
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                        onChange={(e) => handleMultipleCertaintyChange(1, e)}
                                                        value={tripleCertainty1ToShow}
                                                        style={{ width: "100%", accentColor: "#404d72" }}
                                                    />
                                                </div>
                                                <div className="new-forecast-input-binaries">
                                                    <h3>{forecastPotentialOutcomes[1]}</h3>
                                                    <h1 className="certainty-show">{Math.round(tripleCertainty2ToShow, 2)}%</h1>
                                                    <input 
                                                        type="range" 
                                                        id="tripleCertainty2" 
                                                        name="tripleCertainty2" 
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                        onChange={(e) => handleMultipleCertaintyChange(2, e)}
                                                        value={tripleCertainty2ToShow}
                                                        style={{ width: "100%", accentColor: "#404d72" }}
                                                    />
                                                </div>
                                                <div className="new-forecast-input-binaries">
                                                    <h3>{forecastPotentialOutcomes[2]}</h3>
                                                    <h1 className="certainty-show">{Math.round(tripleCertainty3ToShow, 2)}%</h1>
                                                    <input 
                                                        type="range" 
                                                        id="tripleCertainty3" 
                                                        name="tripleCertainty3" 
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                        onChange={(e) => handleMultipleCertaintyChange(3, e)}
                                                        value={tripleCertainty3ToShow}
                                                        style={{ width: "100%", accentColor: "#404d72" }}
                                                    />
                                                </div>


                                                {/* Previous format */}
                                                {/* <div className="input-header-container">
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
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="forecast-submission-explanation-and-btn-container">
                                            <div className="forecast-submission-input-explanation-section">
                                                <h2>
                                                    Forecast Explanation
                                                    <FaInfoCircle 
                                                        color={"orange"} 
                                                        className="modal-i-btn"
                                                        onClick={() => { 
                                                            setShowModal(true); 
                                                            setModalContent(`Feel free to note what resources, articles, key events or info helped to inform your prediction. This will be helpful for when you update your predictions (to see how you justified prior forecasts).`);
                                                            setModalContent2("")}}
                                                    />
                                                </h2>
                                                {userHasAttempted === true &&
                                                    <textarea 
                                                        className="forecast-submission-explanation-input"
                                                        name="forecast-explanation"
                                                        style={{ width: "100%", maxWidth: "100%" }}
                                                        disabled={isInputDisabled}
                                                        onChange={handleCommentsChange}>
                                                    </textarea>
                                                }
                                                {userHasAttempted === false &&
                                                    <textarea 
                                                        placeholder="Explain why you gave the above certainty/certainties"
                                                        className="forecast-submission-explanation-input"
                                                        style={{ width: "100%", maxWidth: "100%" }}
                                                        name="forecast-explanation"
                                                        disabled={isInputDisabled}
                                                        onChange={handleCommentsChange}>
                                                    </textarea>
                                                }
                                                <br />
                                                <hr />
                                                <h2>
                                                    Resolution Criteria
                                                    <FaInfoCircle 
                                                            color={"orange"} 
                                                            className="modal-i-btn"
                                                            onClick={() => { 
                                                                setShowModal(true); 
                                                                setModalContent(`These are the rules behind how we will use to decide which outcome actually happened. This allows for you to see, transparently, how outcomes are arrived at.`)
                                                                setModalContent2("");
                                                                }}
                                                        />
                                                </h2>
                                                <p style={{ fontSize: "95%" }}>{selectedForecastObject.resolutionCriteria !== undefined ? selectedForecastObject.resolutionCriteria : "No criteria established yet."}</p>
                                                {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                                <button 
                                                    className="disabled-submit-forecast-btn" 
                                                    disabled={buttonDisabled}>
                                                       <h2>Error</h2>
                                                </button>
                                                }
                                                {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === true)) &&
                                                    <button 
                                                        className="submit-forecast-btn" 
                                                        disabled={buttonDisabled}
                                                        onClick={() => {
                                                            handleMultipleForecastUpdate(selectedForecast, certaintyOne, certaintyTwo, certaintyThree, forecastComments, props.username); 
                                                            setUserPreviousAttemptCertainty(`${certaintyOne*100} / ${certaintyTwo*100} / ${certaintyThree*100}`);
                                                            setUserPreviousAttemptComments(forecastComments);
                                                        }}>
                                                            <h2>Update Forecast</h2>
                                                    </button>
                                                }
                                                {(buttonDisabled === true && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                                    <button 
                                                        className="disabled-submit-forecast-btn" 
                                                        disabled={buttonDisabled}>
                                                            <h2>ERROR</h2>
                                                    </button>
                                                }
                                                {(buttonDisabled === false && (hasAForecastBeenSelected === true && userHasAttempted === false)) &&
                                                    <button 
                                                        className="submit-forecast-btn" 
                                                        disabled={buttonDisabled}
                                                        onClick={() => {
                                                            handleMultipleForecastSubmit(selectedForecast, certaintyOne, certaintyTwo, certaintyThree, forecastComments, props.username, selectedForecastObject); 
                                                            setUserPreviousAttemptCertainty(`${certaintyOne*100} / ${certaintyTwo*100} / ${certaintyThree*100}`);
                                                            setUserPreviousAttemptComments(forecastComments);
                                                        }}>
                                                            <h2>Submit Forecast</h2>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                {(forecastResponseMessage === "Forecast successfully updated! Check out the chart to see it!" || forecastResponseMessage === "Forecast successfully submitted! Check out the chart to see it!") && 
                                    <h2 className="forecast-message" style={{ color: "green" }}>{forecastResponseMessage}</h2>
                                }
                                {(forecastResponseMessage !== "" && (forecastResponseMessage !== "Forecast successfully updated! Check out the chart to see it!" && forecastResponseMessage !== "Forecast successfully submitted! Check out the chart to see it!")) && 
                                    <h2 className="forecast-message" style={{ color: "red" }}>{forecastResponseMessage}</h2>
                                }
                            </div>
                            {/* <div className="forecast-submission-potential-scores">
                                <div className="placeholder-container-no-error">
                                    <div className="last-certainty-div">
                                        <h2 className="previous-attempt-titles">
                                            Your Last Forecast:
                                            <FaInfoCircle 
                                                color={"orange"} 
                                                className="modal-i-btn"
                                                onClick={() => { 
                                                    setShowModal(true); 
                                                    setModalContent(`If you submit a forecast, click on a different problem from the dropdown menu, and then click back onto this one, the "Your Last Forecast" and "Your Last Comments" field may not have updated and still be showing an older forecast or none at all if you had only submitted one forecast for this problem. Don't worry, it's there, you just need to refresh the page :) I'm working on a fix!`); 
                                                }}
                                            />
                                        </h2>
                                        <h3>{userPreviousAttemptCertainty}%</h3>
                                    </div>
                                    <div className="last-comments-div">
                                        <h2 className="previous-attempt-titles">
                                            Your Last Comments:
                                            <FaInfoCircle 
                                                color={"orange"} 
                                                className="modal-i-btn"
                                                onClick={() => { 
                                                    setShowModal(true); 
                                                    setModalContent(`If you submit a forecast, click on a different problem from the dropdown menu, and then click back onto this one, the "Your Last Forecast" and "Your Last Comments" field may not have updated and still be showing an older forecast or none at all if you had only submitted one forecast for this problem. Don't worry, it's there, you just need to refresh the page :) I'm working on a fix!`); 
                                                }}
                                            />
                                        </h2>
                                        <h4>{userPreviousAttemptComments.includes("~") ? userPreviousAttemptComments.split("~")[1] : userPreviousAttemptComments}</h4>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                }
                {(forecastClosed === true && hasAForecastBeenSelected === true) && 
                    <div className="forecast-submission-and-chart-div">
                        {forecastClosed === true ? 
                            <h2 className="selected-forecast" style={{ backgroundColor: "darkred" }}>{selectedForecast}</h2> : 
                            <h2 className="selected-forecast">{selectedForecast}</h2>
                        }
                        {width > 700 && <h2 className="selected-forecast" style={{ backgroundColor: "darkred" }}>
                            {selectedForecast}
                            <FaInfoCircle 
                                color={"orange"} 
                                className="modal-i-btn"
                                onClick={() => { 
                                    setShowModal(true); 
                                    setModalContent(`This is where you will submit all of your forecasts! All races have a deadline, found below the button that opened this box, and you can submit AS MANY forecasts as you want before the deadline. EVERY forecast you make contributes to your final score, so allocating more points to the correct outcome SOONER will be more rewarding! You can also submit an explanation to accompany your forecast, this will help you if you come back and update it!`); 
                                    setModalContent2(`The Articles section below contains links to news articles using the question wording. Use the Chart to see how you're forecasting compared to everyone else. Do you agree? Or are you thinking differently to the crowd?`)
                                }}
                            />
                        </h2>}
                        {width <= 700 && 
                            <div className="forecast-selection-div">
                                <select className="race-selector" id="race-selector" onChange={(e) => { handleChange(e.target.value)}}>
                                    <option value="" selected disabled hidden>Choose a Race to predict here!</option>
                                    {props.allForecasts.map((item, index) => {
                                        if (new Date() > new Date(item.startDate)) {
                                            if (item.isClosed === true) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>CLOSED: {item.problemName}</option>
                                                )
                                            } else if (item.isClosed === false) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>OPEN: {item.problemName}</option>
                                                )
                                            }
                                        }
                                    })}
                                </select>
                            </div>
                        }
                        <h3 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 38)}</h3>
                        <div className="forecast-chart-stats-switcher">
                            {/* Non-switcher version: July 2024 */}
                            <ForecastProblemLineChart
                                selectedForecastObject={selectedForecastObject} 
                                updateTodayStats={props.updateTodayStats} 
                                username={props.username} 
                                refreshChartAppearance={refreshChartAppearance} 
                                forecastSingleCertainty={forecastSingleCertainty}
                                userPreviousAttemptCertainty={userPreviousAttemptCertainty}
                                userPreviousAttemptComments={userPreviousAttemptComments}
                                previousCertaintyOne={previousCertaintyOne}
                                previousCertaintyTwo={previousCertaintyTwo}
                                previousCertaintyThree={previousCertaintyThree}
                            />

                            {/* Switcher version */}

                            {/* <div className="forecast-chart-stats-switcher-tab-menu-three">
                                <div className="forecast-chart-stats-switcher-tab" onClick={() => setSwitcherTab("chart")}><h3>Chart</h3></div>
                                <div className="forecast-chart-stats-switcher-tab" onClick={() => setSwitcherTab("problemStats")}><h3>Problem Stats</h3></div>
                                <div className="forecast-chart-stats-switcher-tab" onClick={() => setSwitcherTab("results")}><h3>Results</h3></div>
                            </div>
                            {switcherTab === "problemStats" && 
                                <div className="switcher-problem-stats">
                                    <ForecastStatistics 
                                        selectedForecast={props.selectedForecast} 
                                        today={false} 
                                        forecastSingleCertainty={forecastSingleCertainty}
                                    />
                                    <ForecastStatistics 
                                        selectedForecast={props.selectedForecast}
                                        today={true} 
                                        todayAverage={todayAverage} 
                                        todayForecastCount={todayForecastCount} 
                                        forecastSingleCertainty={forecastSingleCertainty}
                                    />
                                    <MarketStatistics 
                                        leaderboard={props.leaderboardData} 
                                        username={props.username} 
                                        refresh={props.refresh} 
                                        market={props.selectedForecast.market}
                                    />
                                    <ForecastMarketLeaderboard 
                                        market={props.selectedForecast.market} 
                                        leaderboard={props.leaderboardData} 
                                        username={props.username} 
                                    />
                                </div>
                            }
                            {switcherTab === "chart" && 
                                <ForecastProblemLineChart
                                    selectedForecastObject={selectedForecastObject} 
                                    updateTodayStats={props.updateTodayStats} 
                                    username={props.username} 
                                    refreshChartAppearance={refreshChartAppearance} 
                                    forecastSingleCertainty={forecastSingleCertainty}
                                    userPreviousAttemptCertainty={userPreviousAttemptCertainty}
                                    userPreviousAttemptComments={userPreviousAttemptComments}
                                    previousCertaintyOne={previousCertaintyOne}
                                    previousCertaintyTwo={previousCertaintyTwo}
                                    previousCertaintyThree={previousCertaintyThree}
                                />
                            }
                            {switcherTab === "results" && 
                                <ForecastResults 
                                    selectedForecast={props.selectedForecast} 
                                    leaderboard={props.leaderboardData} 
                                    username={props.username} 
                                />
                            } */}
                        </div>
                        <div className="forecast-submission-div">
                            <div className="">
                                <div className="forecast-review-div">
                                    <div className="forecast-review-div-left">
                                        <h2 style={{ color: "#404d72" }}><u>Your Stats</u></h2>
                                        <h3># of Forecasts Submitted: {numberOfForecastsSubmitted}</h3>
                                        {forecastSingleCertainty === true &&
                                        <div>
                                            <h3>Highest Certainty: {highestCertainty}</h3>
                                            <h3>Lowest Certainty: {lowestCertainty}</h3>
                                        </div>
                                        }
                                        {forecastSingleCertainty === false &&
                                        <div>
                                            <h3>Average {forecastPotentialOutcomes[0]}: {outcomeOneCertainty}</h3>
                                            <h3>Average {forecastPotentialOutcomes[1]}: {outcomeTwoCertainty}</h3>
                                            <h3>Average {forecastPotentialOutcomes[2]}: {outcomeThreeCertainty}</h3>
                                        </div>
                                        }
                                        <br />
                                        {forecastObjForAnalysis.singleCertainty === false &&
                                            <h2 style={{ color: "#404d72", border: "1px solid black" }}>Actual Outcome: {forecastObjForAnalysis.isClosed === false ? "TBD" : forecastObjForAnalysis.outcome === "outcome1" ? forecastPotentialOutcomes[0] : forecastObjForAnalysis.outcome === "outcome2" ? forecastPotentialOutcomes[1] : forecastPotentialOutcomes[2]}</h2>
                                        }
                                    </div>
                                    <div className="forecast-review-div-right">
                                    <h3 style={{ color: "#404d72" }}>You Scored:</h3>
                                    <h2>{closedForecastScore} / 110</h2>
                                    <h3 style={{ color: "#404d72" }}>Earning you {closedForecastScore} Market and FF Points</h3>
                                    </div>
                                </div>
                            </div>
                            {(hasAForecastBeenSelected === true && forecastClosed === true) &&
                                <ForecastBreakdown 
                                    username={props.username} 
                                    selectedForecast={selectedForecast}
                                    userHasAttempted={userHasAttempted}
                                    forecastClosed={forecastObjForAnalysis.isClosed}
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
                                    forecastClosed={forecastObjForAnalysis.isClosed}
                                    forecastSingleCertainty={forecastSingleCertainty}
                                    forecastObjForAnalysis={forecastObjForAnalysis}
                                    forecastPotentialOutcomes={forecastPotentialOutcomes}
                                />
                            }
                        </div>
                    </div>
                }
                {(forecastClosed === true && hasAForecastBeenSelected === false) && 
                    <div className="forecast-submission-div">
                        {width > 700 && <h2 className="selected-forecast">
                            {selectedForecast}
                            <FaInfoCircle 
                                color={"orange"} 
                                className="modal-i-btn"
                                onClick={() => { 
                                    setShowModal(true); 
                                    setModalContent(`This is where you will submit all of your forecasts! All races have a deadline, found below the button that opened this box, and you can submit AS MANY forecasts as you want before the deadline. EVERY forecast you make contributes to your final score, so allocating more points to the correct outcome SOONER will be more rewarding! You can also submit an explanation to accompany your forecast, this will help you if you come back and update it!`); 
                                    setModalContent2(`The Articles section below contains links to news articles using the question wording. Use the Chart to see how you're forecasting compared to everyone else. Do you agree? Or are you thinking differently to the crowd?`)
                                }}
                            />
                        </h2>}
                        {width <= 700 && 
                            <div className="forecast-selection-div">
                                <select className="race-selector" id="race-selector" onChange={(e) => { handleChange(e.target.value)}}>
                                    <option value="" selected disabled hidden>Choose a Race to predict here!</option>
                                    {props.allForecasts.map((item, index) => {
                                        if (new Date() > new Date(item.startDate)) {
                                            if (item.isClosed === true) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>CLOSED: {item.problemName}</option>
                                                )
                                            } else if (item.isClosed === false) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>OPEN: {item.problemName}</option>
                                                )
                                            }
                                        }
                                    })}
                                </select>
                            </div>
                        }
                    </div>
                }
                {(forecastClosed === false && hasAForecastBeenSelected === false) && 
                    <div className="forecast-submission-div">
                        {width > 700 && <h2 className="selected-forecast">
                            {selectedForecast}
                            <FaInfoCircle 
                                color={"orange"} 
                                className="modal-i-btn"
                                onClick={() => { 
                                    setShowModal(true); 
                                    setModalContent(`This is where you will submit all of your forecasts! All races have a deadline, found below the button that opened this box, and you can submit AS MANY forecasts as you want before the deadline. EVERY forecast you make contributes to your final score, so allocating more points to the correct outcome SOONER will be more rewarding! You can also submit an explanation to accompany your forecast, this will help you if you come back and update it!`); 
                                    setModalContent2(`The Articles section below contains links to news articles using the question wording. Use the Chart to see how you're forecasting compared to everyone else. Do you agree? Or are you thinking differently to the crowd?`)
                                }}
                            />
                        </h2>}
                        {width <= 700 && 
                            <div className="forecast-selection-div">
                                <select className="race-selector" id="race-selector" onChange={(e) => { handleChange(e.target.value)}}>
                                    <option value="" selected disabled hidden>Choose a Race to predict here!</option>
                                    {props.allForecasts.map((item, index) => {
                                        if (new Date() > new Date(item.startDate)) {
                                            if (item.isClosed === true) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>CLOSED: {item.problemName}</option>
                                                )
                                            } else if (item.isClosed === false) {
                                                return (
                                                    <option className="race-option" value={item.problemName}>OPEN: {item.problemName}</option>
                                                )
                                            }
                                        }
                                    })}
                                </select>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default ForecastSubmission;