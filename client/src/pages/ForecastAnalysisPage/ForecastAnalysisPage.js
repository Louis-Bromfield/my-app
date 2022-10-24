import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ForecastAnalysisPage.css';
import ConfidenceFeedback from './ForecastAnalysisPageComponents/ConfidenceFeedback';
import ReactivenessFeedback from './ForecastAnalysisPageComponents/ReactivenessFeedback';
import TimelinessFeedback from './ForecastAnalysisPageComponents/TimelinessFeedback';
import Modal from '../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function ForecastAnalysisPage(props) {
    const history = useHistory();
    const [reactivenessScore, setReactivenessScore] = useState(0);
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [timelinessScore, setTimelinessScore] = useState(0);
    const [forecastObj, setForecastObj] = useState({});
    const [atLeastOneForecast, setAtLeastOneForecast] = useState(false); //use this variable to determine values of texts in render
    const [reactivenessScoreForCSS, setReactivenessScoreForCSS] = useState("0%");
    const [confidenceScoreForCSS, setConfidenceScoreForCSS] = useState("0%");
    const [timelinessScoreForCSS, setTimelinessScoreForCSS] = useState("0%");
    const [oppositeReactivenessScoreForCSS, setOppositeReactivenessScoreForCSS] = useState("100%");
    const [oppositeConfidenceScoreForCSS, setOppositeConfidenceScoreForCSS] = useState("100%");
    const [oppositeTimelinessScoreForCSS, setOppositeTimelinessScoreForCSS] = useState("100%");
    const [numberOfForecastsSubmitted, setNumberOfForecastsSubmitted] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        async function doUE() {
            if (props.username === "Guest") {
                setAtLeastOneForecast(true);
                setNumberOfForecastsSubmitted(2);
                setReactivenessScore(75);
                setReactivenessScoreForCSS(`${75}%`);
                setOppositeReactivenessScoreForCSS(`${100-75}%`);
                setConfidenceScore(63);
                setConfidenceScoreForCSS(`${63}%`)
                setOppositeConfidenceScoreForCSS(`${100-63}%`);
                setTimelinessScore(85);
                setTimelinessScoreForCSS(`${85}%`);
                setOppositeTimelinessScoreForCSS(`${100-85}%`);
            } else {
                console.log("ForecastAnalysisPage UE");
                let forecastInfo = {
                    submittedForecasts: ["empty"],
                    singleCertainty: false,
                    startDate: "",
                    closeDate: ""
                };
                if (props.location.needLocalStorage !== false || props.location === undefined) {
                    forecastInfo = await retrieveForecastInfo(localStorage.getItem("selectedForecastID"));
                    setForecastObj(forecastInfo);
                } else {
                    forecastInfo.singleCertainty = props.location.forecastObj.singleCertainty;
                    forecastInfo.startDate = props.location.forecastObj.startDate;
                    forecastInfo.closeDate = props.location.forecastObj.closeDate;
                }
                const submittedForecasts = props.location.forecastObj === undefined ? forecastInfo.submittedForecasts : props.location.forecastObj.submittedForecasts;
                const forecastObj = submittedForecasts[submittedForecasts.findIndex(sF => sF.username === props.username)];
                if (forecastObj.forecasts.length > 0) {
                    setAtLeastOneForecast(true);
                    setNumberOfForecastsSubmitted(forecastObj.forecasts.length);
                    calculateConfidenceScore(forecastObj, props.username, forecastInfo.singleCertainty);
                    calculateTimelinessScore(forecastObj, props.username, forecastInfo.startDate, forecastInfo.closeDate);
                    if (forecastObj.forecasts.length > 1) {
                        calculateReactivenessScore(forecastObj, props.username, forecastInfo.singleCertainty);
                    } else {
                        setReactivenessScore("N/A");
                    }
                } else {
                    setAtLeastOneForecast(false);
                };
            };
        };
        doUE();
    }, [props.location, props.username]);

    const retrieveForecastInfo = async (forecastID) => {
        try {
            // const forecastDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/getByID/${forecastID}`);
            const forecastDocument = await axios.get(`${process.env.REACT_APP_API_CALL_F}/forecasts/getByID/${forecastID}`);
            return forecastDocument.data[0];
        } catch (error) {
            console.log("Error in retrieveForecastInfo");
            console.log(error);
        }
    };

    const calculateReactivenessScore = (usersForecasts, username, singleCertaintyBool) => {
        let reactiveness = [];
        if (singleCertaintyBool === true) {
            for (let i = 0; i < usersForecasts.forecasts.length-1; i++) {
                let difference = Math.abs(usersForecasts.forecasts[i].certainty*100 - usersForecasts.forecasts[i+1].certainty*100);
                reactiveness.push(difference);
            }
        } else if (singleCertaintyBool === false) {
            // has to terminate at length-1 because it involves comparing each forecast to the next one
            for (let i = 0; i < usersForecasts.forecasts.length-1; i++) {
                let differenceOutcomeOne = Math.abs(usersForecasts.forecasts[i].certainties.certainty1*100 - usersForecasts.forecasts[i+1].certainties.certainty1*100);
                let differenceOutcomeTwo = Math.abs(usersForecasts.forecasts[i].certainties.certainty2*100 - usersForecasts.forecasts[i+1].certainties.certainty2*100);
                let differenceOutcomeThree = Math.abs(usersForecasts.forecasts[i].certainties.certainty3*100 - usersForecasts.forecasts[i+1].certainties.certainty3*100);
                let reactScore = (differenceOutcomeOne + differenceOutcomeTwo + differenceOutcomeThree)/3;
                reactiveness.push(reactScore);
            };
        };
        let sum = 0;
        for (let i = 0; i < reactiveness.length; i++) {
            sum += reactiveness[i];
        };
        let finalReactivenessScore = (sum / reactiveness.length).toFixed(0);
        setReactivenessScore(finalReactivenessScore);
        setReactivenessScoreForCSS(`${finalReactivenessScore}%`);
        setOppositeReactivenessScoreForCSS(`${100-finalReactivenessScore}%`);
    };

    const calculateConfidenceScore = (usersForecasts, username, singleCertaintyBool) => {
        let confidenceArray = [];
        if (singleCertaintyBool === false) {
            for (let i = 0; i < usersForecasts.forecasts.length; i++) {
                let highestCertainty = Math.max(usersForecasts.forecasts[i].certainties.certainty1*100, usersForecasts.forecasts[i].certainties.certainty2*100, usersForecasts.forecasts[i].certainties.certainty3*100);
                if (highestCertainty > 50) {
                    confidenceArray.push((100 - highestCertainty));
                } else {
                    confidenceArray.push(highestCertainty);
                }
            };
        } else if (singleCertaintyBool === true) {
            for (let i = 0; i < usersForecasts.forecasts.length; i++) {
                if (usersForecasts.forecasts[i].certainty*100 > 50) {
                    confidenceArray.push((100 - (usersForecasts.forecasts[i].certainty*100)));
                } else {
                    confidenceArray.push(usersForecasts.forecasts[i].certainty*100);
                }
            };
        };
        let sum = 0;
        for (let i = 0; i < confidenceArray.length; i++) {
            sum += confidenceArray[i];
        };
        // Smaller score = more confidence, so we subtract it from 100 to flip it.
        let finalConfidenceScore = (100 - (sum / confidenceArray.length)).toFixed(0)
        setConfidenceScore(finalConfidenceScore);
        setConfidenceScoreForCSS(`${finalConfidenceScore}%`)
        setOppositeConfidenceScoreForCSS(`${100-finalConfidenceScore}%`);
    };

    const calculateTimelinessScore = (usersForecasts, username, startDate, closeDate) => {
        let tScore;
        if (new Date(usersForecasts.forecasts[0].date) < new Date(closeDate)) {
            let tValue = (new Date(closeDate) - new Date(usersForecasts.forecasts[0].date))/1000;
            let timeFrame = (new Date(closeDate) - new Date(startDate))/1000;
            tScore = ((tValue/timeFrame)*10).toFixed(2)*10;
        } else {
            tScore = 0;
        };
        setTimelinessScore(tScore);
        setTimelinessScoreForCSS(`${tScore}%`);
        setOppositeTimelinessScoreForCSS(`${100-tScore}%`);
    };

    return (
        <div className="forecast-analysis">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <button 
                onClick={() => history.push("forecast")} 
                className="forecast-analysis-header-link">
                    Back to My Forecasts
            </button>
            <h1 className="forecast-analysis-header">Forecast Analysis</h1>
            <p className="forecast-analysis-para">This page is designed around giving you more detailed feedback on your forecast performance. Your predictions are assessed based on three key metrics - 
                Reactiveness (how big or small are your forecast updates?), Confidence (how close to 0 or 100 are your forecasts?) and Timeliness (how early was your first forecast submitted?). Under each
                sub-heading you'll find more information that corresponds to your specific scores in each dimension.<b> As you are currently logged in as a Guest, the scores below are made up to allow you to see what
                    information is given to forecasters to help them improve their performance. So long as you are logged in on the Guest account, these scores will be identical no matter what problem you select.</b>
            </p>
            <div className="problem-and-scores-container">
                {/* Problem name and what user scored */}
                <div className="problem-container">
                    <h2 className="selected-problem">{props.location.forecastObj === undefined ? forecastObj.problemName : props.location.forecastObj.problemName }</h2>
                    <h3>
                        You Scored: {props.username === "Guest" ? 104 : Number(localStorage.getItem("closedForecastScore")).toFixed(0)} / 110
                        <FaInfoCircle 
                            onClick={() => {
                                setShowModal(true);
                                setModalContent(`Note that your Reactiveness and Confidence scores do not contribute to your overall score for this problem (${Number(localStorage.getItem("closedForecastScore")).toFixed(0)} / 110), but exist purely for evaluative purposes, however your Time Score does. Your score (out of 110) was given a boost from 0-10 based on when you submitted your first forecast for this problem (the earlier, the better). You can also find this score on My Forecasts > Select a closed Problem > Show Prediction Breakdown.`)
                            }}
                            style={{ "color": "orange", "cursor": "pointer" }}
                        />
                    </h3>
                </div>
                {/* Scores w/ bars visualisation */}
                <div className="scores-container">
                    <div className="individual-score-container">
                        <div className="bar-container">
                            <div className="bar-div" style={{ backgroundColor: "lightgray", color: "lightgray", height: `${oppositeReactivenessScoreForCSS}`}}>.</div>
                            <div className="bar-div" style={{ backgroundColor: "#008B8B", color: "#008B8B", height: `${reactivenessScoreForCSS}`}}>.</div>
                        </div>
                        <h3 className="highlighted-header">Reactiveness</h3>
                        <h3>{reactivenessScore} / 100</h3>
                    </div>
                    <div className="individual-score-container">
                        <div className="bar-container">
                            <div className="bar-div" style={{ backgroundColor: "lightgray", color: "lightgray", height: `${oppositeConfidenceScoreForCSS}`}}>.</div>
                            <div className="bar-div" style={{ backgroundColor: "#228B22", color: "#228B22", height: `${confidenceScoreForCSS}`}}>.</div>
                        </div>
                        <h3 className="highlighted-header">Confidence</h3>
                        <h3>{confidenceScore} / 100</h3>
                    </div>
                    <div className="individual-score-container">
                    <div className="bar-container">
                            <div className="bar-div" style={{ backgroundColor: "lightgray", color: "lightgray", height: `${oppositeTimelinessScoreForCSS}`}}>.</div>
                            <div className="bar-div" style={{ backgroundColor: "#A52A2A", color: "#A52A2A", height: `${timelinessScoreForCSS}`}}>_</div>
                        </div>
                        <h3 className="highlighted-header">Time Score</h3>
                        <h3>{timelinessScore/10} / 10</h3>
                    </div>
                </div>
            </div>
            {/* Explanation of scores */}
            {atLeastOneForecast === true && 
                <div className="full-explanation-of-scores-container">
                    <div className="individual-score-explanation-container">
                        <h3 className="highlighted-header">Reactiveness: {reactivenessScore} / 100</h3>
                        <ReactivenessFeedback 
                            finalScore={Number(localStorage.getItem("closedForecastScore")).toFixed(0)} 
                            reactivenessScore={reactivenessScore}
                            numberOfForecastsSubmitted={numberOfForecastsSubmitted}
                        />
                        <hr />
                    </div>
                    <div className="individual-score-explanation-container">
                        <h3 className="highlighted-header">Confidence: {confidenceScore} / 100</h3>
                        <ConfidenceFeedback 
                            finalScore={Number(localStorage.getItem("closedForecastScore")).toFixed(0)} 
                            confidenceScore={confidenceScore}
                        />
                        <hr />
                    </div>
                    <div className="individual-score-explanation-container">
                        <h3 className="highlighted-header">Timeliness: {timelinessScore/10} / 10</h3>
                        <TimelinessFeedback 
                            finalScore={Number(localStorage.getItem("closedForecastScore")).toFixed(0)}
                            timelinessScore={timelinessScore}
                        />
                        <hr />
                    </div>
                </div>
            }
            {atLeastOneForecast === false &&
                <h3>You didn't attempt this problem. When you submit at least one forecast to a problem and it closes, come back here for detailed feedback on how you did!</h3>
            }
        </div>
    )
}

export default ForecastAnalysisPage