import React, { useState, useEffect } from 'react';
import './ForecastSubmission.css';
import axios from 'axios';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function ForecastSubmission(props) {
    const [forecastProblems, setForecastProblems] = useState([]);
    const [forecastProblemsForDropdown, setForecastProblemsForDropdown] = useState([]);
    const [selectedForecast, setSelectedForecast] = useState("No forecast problem selected");
    const [hasAForecastBeenSelected, setHasAForecastBeenSelected] = useState(false);
    const [potentialCorrectBrier, setPotentialCorrectBrier] = useState(0.00);
    const [potentialIncorrectBrier, setPotentialIncorrectBrier] = useState(0.00);
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
        if (props.markets === undefined || typeof props.markets === "string") {
            getAllForecastsFromDB(localStorage.getItem('markets').split(","));    
        } else {
            getAllForecastsFromDB(props.markets);
        }
        getLeaderboardFromDB(props.selectedForecast.market);
    }, [props.selectedForecast, props.markets]);

    const getAllForecastsFromDB = async (userMarkets) => {
        try {
            const allForecastsUnfiltered = await axios.get('http://localhost:5000/forecasts');
            let filtered = [];
            let filteredAndOrganised = [];
            for (let i = 0; i < userMarkets.length; i++) {
                if (userMarkets[i] !== '"Fantasy Forecast All-Time"' || userMarkets[i] !== "Fantasy Forecast All-Time") {
                    filteredAndOrganised.push([userMarkets[i]]);
                };
            };
            for (let i = 0; i < allForecastsUnfiltered.data.length; i++) {
                if (userMarkets.includes(allForecastsUnfiltered.data[i].market) && new Date() > new Date(allForecastsUnfiltered.data[i].startDate)) {
                    filtered.push(allForecastsUnfiltered.data[i]);
                    let index = userMarkets.indexOf(allForecastsUnfiltered.data[i].market);
                    filteredAndOrganised[index].push(allForecastsUnfiltered.data[i]);
                };
            };
            setForecastProblems(filtered);
            setForecastProblemsForDropdown(filteredAndOrganised);
        } catch (error) {
            console.error(error);
        };
    };

    const getLeaderboardFromDB = async (marketName) => {
        // marketName === undefined when useEffect runs before a problem is selected
        if (marketName === undefined) return;
        try {
            const leaderboardResponse = await axios.get(`http://localhost:5000/leaderboards/leaderboard/${marketName}`);
            let lbRankings = leaderboardResponse.data.rankings;
            let newRankings = await lbRankings.sort((a, b) => b.marketPoints - a.marketPoints);
            formatUserRank(newRankings);
            props.handleLeaderboardChange(newRankings);
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
        if (new Date(forecast.closeDate) < new Date()) {
            getBrierForClosedForecast(props.username, etv);
            setButtonDisabled(true);
            setForecastClosed(true);
            setForecastCloseDate(`FORECAST CLOSED: ${new Date(forecast.closeDate).toString()}`);
            let highest = 0;
            let lowest = 100;
            let highestChanged, lowestChanged = false;
            for (let i = 0; i < forecast.submittedForecasts.length; i++) {
                if (forecast.submittedForecasts[i].username === props.username) {
                    setNumberOfForecastsSubmitted(forecast.submittedForecasts[i].forecasts.length);
                    if (forecast.submittedForecasts[i].forecasts.length === 0) {
console.log("Here1");
                        highest = "N/A";
                        lowest = "N/A";
                        setFinalCertainty("N/A");
                        return;
                    } else {
                        for (let j = 0; j < forecast.submittedForecasts[i].forecasts.length; j++) {
                            if (forecast.submittedForecasts[i].forecasts[j].certainty*100 > highest) {
                                highest = forecast.submittedForecasts[i].forecasts[j].certainty*100;
                                highestChanged = true;
                            };
                            if (forecast.submittedForecasts[i].forecasts[j].certainty*100 < lowest) {
                                lowest = forecast.submittedForecasts[i].forecasts[j].certainty*100;
                                lowestChanged = true;
                            };
                        };
                        setFinalCertainty(`${forecast.submittedForecasts[i].forecasts[forecast.submittedForecasts[i].forecasts.length-1].certainty*100}%`);
                    };
                };
            };
            if (highestChanged === true && lowestChanged === true) {
                setHighestCertainty(`${highest}%`);
                setLowestCertainty(`${lowest}%`);
            } else {
                setHighestCertainty("N/A");
                setLowestCertainty("N/A");
            }
        } else {
            setButtonDisabled(false);
            setForecastClosed(false);
            setForecastCloseDate(`Deadline: ${new Date(forecast.closeDate).toString()}`);
        };
    };

    const getBrierForClosedForecast = async (username, problemName) => {
        try {
            const userDocument = await axios.get(`http://localhost:5000/users/${username}`);
            const forecastDetails = userDocument.data[0].brierScores.find(el => el.problemName === problemName);
            setClosedForecastScore(forecastDetails === undefined ? "No Forecast Submitted" : forecastDetails.brierScore.toFixed(0));
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

    // Nested loop - clean this up if you can
    const pullForecastDetailsAndCheckIfAlreadyAttempted = (forecast) => {
        for (let i = 0; i < forecastProblems.length; i++) {
            if (forecastProblems[i].problemName === forecast) {
                // console.log(forecastProblems[i]);
                setSelectedForecastMarket(forecastProblems[i].market);
                props.changeForecast(forecastProblems[i]);
                if (forecastProblems[i].submittedForecasts.length === 0) {
                    setUserHasAttempted(false);
                    setUserPreviousAttemptCertainty("-");
                    setUserPreviousAttemptComments("No Forecast Submitted");
                    return;
                } else {
                    for (let j = 0; j < forecastProblems[i].submittedForecasts.length; j++) {
                        if (forecastProblems[i].submittedForecasts[j].username === props.username) {
                            setUserHasAttempted(true);
                            setUserPreviousAttemptCertainty((forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].certainty*100).toFixed(2));
                            setUserPreviousAttemptComments(forecastProblems[i].submittedForecasts[j].forecasts[forecastProblems[i].submittedForecasts[j].forecasts.length-1].comments);
                            return;
                        } else {
                            setUserHasAttempted(false);
                            setUserPreviousAttemptCertainty("-");
                            setUserPreviousAttemptComments("No Forecast Submitted");
                        };
                    };
                };
            };
        };
    };

    const handleCertaintyChange = (e) => {
        const certainty = e.target.value;
        // setPotentialCorrectBrier(certainty);

        if (certainty > 100) {
            setButtonDisabled(true);
            setPotentialCorrectBrier("N/A");
            setPotentialIncorrectBrier("N/A");
            setForecastResponseMessage("Please enter a certainty BELOW or equal to 100");
            return;
        } else if (certainty < 0) {
            setPotentialCorrectBrier("N/A");
            setPotentialIncorrectBrier("N/A");
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

        //Correct Forecast
        let correctBrier = Math.pow((1-currentPrediction), 2);
        let incorrectBrier = Math.pow((0-(1-currentPrediction)), 2);
        let brierScore = (correctBrier + incorrectBrier).toFixed(2);
        setPotentialCorrectBrier(brierScore);

        //Incorrect Forecast
        let correctBrier2 = Math.pow(1-(1-currentPrediction), 2);
        let incorrectBrier2 = Math.pow((0-currentPrediction), 2);
        let incorrectBrierScore = (correctBrier2 + incorrectBrier2).toFixed(2);
        setPotentialIncorrectBrier(incorrectBrierScore);

        setCertainty(currentPrediction);
    };

    const handleCommentsChange = (e) => {
        setForecastResponseMessage("");
        setForecastComments(e.target.value);
        if (e.target.value.length === 0) {
            setButtonDisabled(true);
            setForecastResponseMessage("Please enter a comment.");
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
            const document = await axios.get(`http://localhost:5000/forecasts/${forecast}`);
            const documentForecastData = document.data[0].submittedForecasts;
            let index = 0;
            for (let i = 0; i < documentForecastData.length; i++) {
                if (documentForecastData[i].username === username) {
                    index = i;
                };
            };
            const newForecast = await axios.patch(`http://localhost:5000/forecasts/update/${forecast}`, {
                updatedForecastsForUser: {certainty: newCertainty, comments: newComments, date: new Date().toString()},
                locationOfForecasts: `submittedForecasts.${index}.forecasts`,
                locationOfForecastCount: `submittedForecasts.${index}.numberOfForecastsSubmittedByUser`
            });
            props.changeForecast(newForecast.data);
        } catch (error) {
            console.error("error in ForecastSubmission.js > handleForecastUpdate");
            console.error(error);
        };
    };

    const handleForecastSubmit = async (forecast, certainty, comments, username) => {
        try {
            const submittedForecast = await axios.patch(`http://localhost:5000/forecasts/submit/${forecast}`, {
                username: username,
                certainty: certainty,
                comments: comments,
                date: new Date().toString(),
                brierScore: -1
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
            // Try to redo this so that we don't need to do the GET first 
            const userDocument = await axios.get(`http://localhost:5000/users/${username}`);
            if (userDocument.data[0].onboarding.submitAForecast === true) {
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 25;
                await axios.patch(`http://localhost:5000/users/${username}`, 
                    { 
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                setShowModal(true);
                setModalContent("You just got 75 points for submitting a forecast!");
            } else {
                userDocument.data[0].onboarding.submitAForecast = true;
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 300
                await axios.patch(`http://localhost:5000/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                setShowModal(true);
                setModalContent("You just got 300 Fantasy Forecast Points for submitting your first forecast! Any forecasts submitted from now on will yield 25 points. You can see your latest prediction from each day outlined in orange in the 'Forecast Stats' tab below.");
            };
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div className="forecast-submission-and-selection-div">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <div className="forecast-top-bar">
                <div className="forecast-selection-div">
                    <label htmlFor="forecast-selection"><h2 className="header-label">Select a Forecast</h2></label>
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
                            onClick={() => { setShowModal(true); setModalContent(`This is where you will submit all of your predictions. Each problem has a deadline, found below the button that opened this box, and you are able to submit as many predictions as you want before said deadline. EVERY forecast you make contributes to your final score for the problem, so getting it right earlier will be more rewarding! We also ask that you submit an explanation of your 0-100% forecast, this will help remind you why you forecasted what you did in case you come back to update it. The Articles tab below returns articles based on a web scrape of the problem, so they may vary in terms of usefulness. The Forecast Stats tab will show you what other forecasters are saying for this problem.`)}}
                        />
                    </h2>
                    <h4 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 38)}</h4>
                    <div className="forecast-submission-and-error-container">
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
                                <h3>Forecast Explanation</h3>
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
                                        placeholder="Explain why you gave the above certainty"
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
                                <h4>{userPreviousAttemptComments}</h4>
                            </div>
                        </div>
                        <div className="scores">
                            <h4 className="brier-info">FF Scores range from 0-110, and are made up of the accuracy of your prediction and when you submitted it, 
                            meaning more accuracy earlier is more rewarding! For more info, visit the Brier Scores tab on the Learn page!</h4>
                        </div>
                    </div>
                </div>
            }
            {(forecastClosed === true && hasAForecastBeenSelected === true) && 
                <div className="forecast-submission-div">
                <h2 className="selected-forecast">{selectedForecast}</h2>
                <h4 className="selected-forecast-close-date" style={{ color: "darkred" }}>{forecastCloseDate.slice(0, 41)}</h4>
                <div className="forecast-review-div">
                    <div className="forecast-review-div-left">
                        <h2 style={{ color: "#404d72" }}><u>Your Stats</u></h2>
                        <h3># of Forecasts Submitted: {numberOfForecastsSubmitted}</h3>
                        <h3>Highest Certainty: {highestCertainty}</h3>
                        <h3>Lowest Certainty: {lowestCertainty}</h3>
                        <h3 style={{ color: "#404d72" }}>Final Certainty: {finalCertainty}</h3>
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
