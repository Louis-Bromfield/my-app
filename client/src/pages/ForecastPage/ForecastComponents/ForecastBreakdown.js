import React, { useState, useEffect } from 'react';
import './ForecastBreakdown.css';
import axios from 'axios';

function ForecastBreakdown(props) {
    const [predictionData, setPredictionData] = useState([]);
    const [tScore, setTScore] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [forecastClosed, setForecastClosed] = useState(props.forecastClosed);
    const [showForecastByForecastBreakdown, setShowForecastByForecastBreakdown] = useState(true);


    useEffect(() => {
        if (props.userHasAttempted === true) {
            getPredictionData(props.selectedForecast, props.username, forecastClosed);
        };
    }, [props.selectedForecast, props.username, props.userHasAttempted, forecastClosed]);

    const getPredictionData = async (selectedForecast, username) => {
        try {
            if (props.forecastClosed === true) {
                const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${true}/${username}`);
                setPredictionData(userForecastsDocument.data);
                calculateTScore(userForecastsDocument.data);
            } else if (props.forecastClosed === false) {
                const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${false}/${username}`);
                setPredictionData(userForecastsDocument.data);
                calculateTScore(userForecastsDocument.data);
            }
        } catch (error) {
            console.error("Error in ForecastBreakdown > getPredictionData");
            console.error(error);
        };
    };

    const calculateTScore = (data) => {
        let tScore;
        if (new Date(data[1].date) < new Date(data[0].closeDate)) {
            let tValue = (new Date(data[0].closeDate) - new Date(data[1].date))/1000;
            let timeFrame = (new Date(data[0].closeDate) - new Date(data[0].startDate))/1000;
            tScore = (tValue/timeFrame)*10;
        } else {
            tScore = 0;
        };
        setTScore(tScore);
    };

    const timeFormatter = (time) => {
        let timeArray = {weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
        // At least one week
        if (time >= 604800) {
            timeArray.weeks = Math.floor(time / 604800);
            time -= timeArray.weeks * 604800;
            if (time > 0) {
                timeArray.days = Math.floor(time / 86400);
                time -= timeArray.days * 86400;
                if (time > 0) {
                    timeArray.hours = Math.floor(time / 3600);
                    time -= timeArray.hours * 3600;
                    if (time > 0) {
                        timeArray.minutes = Math.floor(time / 60);
                        time -= timeArray.minutes * 60;
                        if (time > 0) {
                            timeArray.seconds = time;
                        };
                    };
                };
            }
        }
        // At least one day
        else if (time >= 86400) {
            timeArray.days = Math.floor(time / 86400);
            time -= timeArray.days * 86400;
            if (time > 0) {
                timeArray.hours = Math.floor(time / 3600);
                time -= timeArray.hours * 3600;
                if (time > 0) {
                    timeArray.minutes = Math.floor(time / 60);
                    time -= timeArray.minutes * 60;
                    if (time > 0) {
                        timeArray.seconds = time;
                    };
                };
            };
        }
        // At least one hour
        else if (time >= 3600) {
            timeArray.hours = Math.floor(time / 3600);
            time -= timeArray.hours * 3600;
            if (time > 0) {
                timeArray.minutes = Math.floor(time / 60);
                time -= timeArray.minutes * 60;
                if (time > 0) {
                    timeArray.seconds = time;
                }
            }
        }
        // At least one minute
        else if (time >= 60) {
            timeArray.minutes = Math.floor(time / 60);
            time -= timeArray.minutes * 60;
            if (time > 0) {
                timeArray.seconds = time;
            }
        }
        // At least one second
        else if (time >= 1) {
            timeArray.seconds = time;
        };
        return timeArray;
    };

    let totalScore = 0;
    let totalIfHappenedNoBoost = 0;
    let totalIfHappenedAndBoost = 0;
    let totalIfNotHappenedNoBoost = 0;
    let totalIfNotHappenedAndBoost = 0;
    return (
        <div className="predictions-container">
            {showBreakdown === false && 
                <button className="show-btn" onClick={() => setShowBreakdown(!showBreakdown)}>Show Prediction Breakdown</button>
            }
            {(props.userHasAttempted === true && showBreakdown === true) &&
                <div className="to-show">
                    <button className="hide-btn" onClick={() => setShowBreakdown(!showBreakdown)}>Hide Prediction Breakdown</button>
                    <h2 style={{ color: "#404d72" }}><u>Your Predictions</u></h2>
                    {(props.userHasAttempted === true && predictionData[0].happened === true) && 
                        <h2>This problem did happen - higher certainties will have scored you more points.</h2>
                    }
                    {(props.userHasAttempted === true && predictionData[0].happened === false) && 
                        <h2>This problem did happen - lower certainties will have scored you more points.</h2>
                    }
                    <hr />
                    {predictionData[0] !== undefined && 
                        <div className="date-container">
                            <div className="sub-date-container">
                                <h3 style={{ color: "#404d72" }}>{predictionData[0].startDate}</h3>
                                <h4>Start Date</h4>
                            </div>
                            <div className="sub-date-container">
                                <h3 style={{ color: "#404d72" }}>{predictionData[0].closeDate}</h3>
                                <h4>Close Date</h4>
                            </div>
                        </div>
                    }
                    <hr />
                    {forecastClosed === true && 
                        <div className="container">
                            <button className="show-btn" onClick={() => setShowForecastByForecastBreakdown(!showForecastByForecastBreakdown)}>{showForecastByForecastBreakdown === true ? "Hide" : "Show"} Individual Predictions</button>
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    // Index !== 0 is because at element 0 is an object containing start and close dates
                                    // Predictions submitted after closing date will still be in DB so must be filtered
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        const duration = timeFormatter(item.duration);
                                        if (index === 1) {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                                        <h4>Date: {item.date}</h4>
                                                        <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: {item.percentageOfTimeAtThisScore.toFixed(2)}~</h4>
                                                        <h4>Comments: <i>{item.comments}</i></h4>
                                                        <br />
                                                        <h4>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (aka how early was this prediction made?)</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        } else {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                                        <h4>Date: {item.date}</h4>
                                                        <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: {item.percentageOfTimeAtThisScore.toFixed(2)}~</h4>
                                                        <h4>Comments: <i>{item.comments}</i></h4>
                                                        <br />
                                                        <h4>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        }
                                    } else return null;
                                })}
                            </ul>
                            <ForecastResultsBreakdown 
                                forecastClosed={true}
                                totalScore={totalScore}
                                tScore={tScore}
                            />
                        </div>
                    }
                    {forecastClosed === false && 
                        <div className="container">
                            <button className="show-btn" onClick={() => setShowForecastByForecastBreakdown(!showForecastByForecastBreakdown)}>{showForecastByForecastBreakdown === true ? "Hide" : "Show"} Individual Predictions</button>
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    // Index !== 0 is because at element 0 is an object containing start and close dates
                                    // Predictions submitted after closing date will still be in DB so must be filtered
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        const duration = timeFormatter(item.duration);
                                        if (index === 1) {
                                            totalIfHappenedNoBoost += (item.newHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfHappenedAndBoost += item.happenedBrierWeightedAndCaptained;
                                            totalIfNotHappenedNoBoost += (item.newNotHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfNotHappenedAndBoost += item.notHappenedBrierWeightedAndCaptained;
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%</h4>
                                                        <h4>Date: {item.date}</h4>
                                                        <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: {item.percentageOfTimeAtThisScore.toFixed(2)}~</h4>
                                                        <h4>Comments: <i>{item.comments}</i></h4>
                                                        <br />
                                                        <h4>If this problem does happen, this forecast will score you: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        {/* <h4>If this problem does happen, and you boost your prediction, this forecast will score you: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4> */}
                                                        <h4>If this problem does happen, and you boost your prediction, this forecast will score you: {item.happenedBrierWeightedAndCaptained.toFixed(2)}</h4>
                                                        <h4>If this problem does not happen, this forecast will score you: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        {/* <h4>If this problem does not happen, and you boost your prediction,  this forecast will score you: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4> */}
                                                        <h4>If this problem does not happen, and you boost your prediction,  this forecast will score you: {item.notHappenedBrierWeightedAndCaptained.toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (aka how early was this prediction made?)</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        } else {
                                            totalIfHappenedNoBoost += (item.newHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfHappenedAndBoost += item.happenedBrierWeightedAndCaptained;
                                            totalIfNotHappenedNoBoost += (item.newNotHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfNotHappenedAndBoost += item.notHappenedBrierWeightedAndCaptained;
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%</h4>
                                                        <h4>Date: {item.date}</h4>
                                                        <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: {item.percentageOfTimeAtThisScore.toFixed(2)}~</h4>
                                                        <h4>Comments: <i>{item.comments}</i></h4>
                                                        <br />
                                                        <h4>If this problem does happen, this forecast will score you: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        {/* <h4>If this problem does happen, and you boost your prediction, this forecast will score you: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4> */}
                                                        <h4>If this problem does happen, and you boost your prediction, this forecast will score you: {item.happenedBrierWeightedAndCaptained.toFixed(2)}</h4>
                                                        <h4>If this problem does not happen, this forecast will score you: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        {/* <h4>If this problem does not happen, and you boost your prediction,  this forecast will score you: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4> */}
                                                        <h4>If this problem does not happen, and you boost your prediction,  this forecast will score you: {item.notHappenedBrierWeightedAndCaptained.toFixed(2)}</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        }
                                    } else return null;
                                })}
                            </ul>
                            <ForecastResultsBreakdown 
                                forecastClosed={false}
                                totalIfHappenedNoBoost={totalIfHappenedNoBoost}
                                totalIfHappenedAndBoost={totalIfHappenedAndBoost}
                                totalIfNotHappenedNoBoost={totalIfHappenedNoBoost}
                                totalIfNotHappenedAndBoost={totalIfNotHappenedAndBoost}
                                tScore={tScore}                                
                            />
                        </div>
                    }
                </div>
            }
        </div>
    )
};

export default ForecastBreakdown;