import React, { useState, useEffect } from 'react';
import './ForecastBreakdown.css';
import axios from 'axios';
import ForecastResultsBreakdown from './ForecastResultsBreakdown';
import { Link } from 'react-router-dom';

function ForecastBreakdown(props) {
    const [predictionData, setPredictionData] = useState([]);
    const [tScore, setTScore] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [forecastClosed, setForecastClosed] = useState(props.forecastClosed);
    const [showForecastByForecastBreakdown, setShowForecastByForecastBreakdown] = useState(true);
    const [singleCertainty, setSingleCertainty] = useState(props.forecastSingleCertainty);
    const [linkObject, setLinkObject] = useState({});
    const [needLocalStorage, setNeedLocalStorage] = useState(true);

    useEffect(() => {
        if (props.userHasAttempted === true) {
            getPredictionData(props.selectedForecast, props.username, forecastClosed);
        };
        if (forecastClosed === true) {
            setNeedLocalStorage(false);
            setLinkObject({
                forecastObj: props.forecastObjForAnalysis,
                pathname: "/forecast-analysis",
                needLocalStorage: false
            });
        };
        console.log(linkObject);
    }, [props.selectedForecast, props.username, props.userHasAttempted, forecastClosed]);

    const getPredictionData = async (selectedForecast, username, forecastClosed) => {
        try {
            console.log(`forecastClosed === ${forecastClosed}`)
            if (forecastClosed === true) {
                const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${true}/${username}/${singleCertainty}`);
                setPredictionData(userForecastsDocument.data);
                calculateTScore(userForecastsDocument.data);
            } else if (forecastClosed === false) {
                const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${false}/${username}/${singleCertainty}`);
                console.log(userForecastsDocument.data);
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

    // const timeFormatter = (time) => {
    //     let timeArray = {weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
    //     // At least one week
    //     if (time >= 604800) {
    //         timeArray.weeks = Math.floor(time / 604800);
    //         time -= timeArray.weeks * 604800;
    //         if (time > 0) {
    //             timeArray.days = Math.floor(time / 86400);
    //             time -= timeArray.days * 86400;
    //             if (time > 0) {
    //                 timeArray.hours = Math.floor(time / 3600);
    //                 time -= timeArray.hours * 3600;
    //                 if (time > 0) {
    //                     timeArray.minutes = Math.floor(time / 60);
    //                     time -= timeArray.minutes * 60;
    //                     if (time > 0) {
    //                         timeArray.seconds = time;
    //                     };
    //                 };
    //             };
    //         }
    //     }
    //     // At least one day
    //     else if (time >= 86400) {
    //         timeArray.days = Math.floor(time / 86400);
    //         time -= timeArray.days * 86400;
    //         if (time > 0) {
    //             timeArray.hours = Math.floor(time / 3600);
    //             time -= timeArray.hours * 3600;
    //             if (time > 0) {
    //                 timeArray.minutes = Math.floor(time / 60);
    //                 time -= timeArray.minutes * 60;
    //                 if (time > 0) {
    //                     timeArray.seconds = time;
    //                 };
    //             };
    //         };
    //     }
    //     // At least one hour
    //     else if (time >= 3600) {
    //         timeArray.hours = Math.floor(time / 3600);
    //         time -= timeArray.hours * 3600;
    //         if (time > 0) {
    //             timeArray.minutes = Math.floor(time / 60);
    //             time -= timeArray.minutes * 60;
    //             if (time > 0) {
    //                 timeArray.seconds = time;
    //             }
    //         }
    //     }
    //     // At least one minute
    //     else if (time >= 60) {
    //         timeArray.minutes = Math.floor(time / 60);
    //         time -= timeArray.minutes * 60;
    //         if (time > 0) {
    //             timeArray.seconds = time;
    //         }
    //     }
    //     // At least one second
    //     else if (time >= 1) {
    //         timeArray.seconds = time;
    //     };
    //     return timeArray;
    // };

    let totalScore = 0;
    let totalIfHappenedNoBoost = 0;
    let totalIfNotHappenedNoBoost = 0;
    let totalIfIncrease = 0;
    let totalIfSame = 0;
    let totalIfDecrease = 0;
    return (
        <div className="predictions-container">
            {showBreakdown === false && 
                <div className="show-prediction-breakdown-buttons">
                    <button 
                        className="show-btn" 
                        onClick={() => setShowBreakdown(!showBreakdown)}>
                            Show Prediction Breakdown
                    </button>
                    {forecastClosed === true &&
                        <Link  
                            className="go-to-analysis-page-btn" 
                            to={linkObject}>
                                Open Forecast Analysis Page
                        </Link>
                    }
                </div>
            }
            {(props.userHasAttempted === true && showBreakdown === true && singleCertainty === true) &&
                <div className="to-show">
                    <button className="hide-btn" onClick={() => setShowBreakdown(!showBreakdown)}>Hide Prediction Breakdown</button>
                    <h2 style={{ color: "#404d72" }}><u>Your Predictions</u></h2>
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
                                        // const duration = timeFormatter(item.duration);
                                        if (index === 1) {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        {/* <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4> */}
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h4>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</h4>
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
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
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
                                singleCertainty={singleCertainty}
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
                                        if (index === 1) {
                                            totalIfHappenedNoBoost += (item.newHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfNotHappenedNoBoost += (item.newNotHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me?</h3>
                                                        <h4>If this problem <u>does</u> happen: {(item.newHappenedBrier).toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {((item.newHappenedBrier).toFixed(0) * (item.percentageOfTimeAtThisScore/100)).toFixed(2)}</h4>
                                                        <h4>If this problem does <u>not</u> happen: {(item.newNotHappenedBrier).toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {((item.newNotHappenedBrier).toFixed(0) * (item.percentageOfTimeAtThisScore/100)).toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        } else {
                                            totalIfHappenedNoBoost += (item.newHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfNotHappenedNoBoost += (item.newNotHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Certainty: {(item.certainty*100).toFixed(2)}%</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me?</h3>
                                                        <h4>If this problem <u>does</u> happen: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <h4>If this problem does <u>not</u> happen: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
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
                                singleCertainty={singleCertainty}
                                totalIfHappenedNoBoost={totalIfHappenedNoBoost}
                                totalIfNotHappenedNoBoost={totalIfNotHappenedNoBoost}
                                tScore={tScore}
                            />
                        </div>
                    }
                </div>
            }
            {(props.userHasAttempted === true && showBreakdown === true && singleCertainty === false) &&
                <div className="to-show">
                    <button className="hide-btn" onClick={() => setShowBreakdown(!showBreakdown)}>Hide Prediction Breakdown</button>
                    <h2 style={{ color: "#404d72" }}><u>Your Predictions</u></h2>
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
                            <button 
                                className="show-btn" 
                                onClick={() => setShowForecastByForecastBreakdown(!showForecastByForecastBreakdown)}>
                                    {showForecastByForecastBreakdown === true ? "Hide" : "Show"} Individual Predictions
                            </button>
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        if (index === 1) {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Increase by 2+: {(item.certaintyHigher*100).toFixed(2)}%</h4>
                                                        <h4>Stay within +/- 2: {(item.certaintySame*100).toFixed(2)}%</h4>
                                                        <h4>Decrease by 2+: {(item.certaintyLower*100).toFixed(2)}%</h4>
                                                        <br />
                                                        <h4>Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h4>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</h4>
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
                                                        <h4>Increase by 2+: {(item.certaintyHigher*100).toFixed(2)}%</h4>
                                                        <h4>Stay within +/- 2: {(item.certaintySame*100).toFixed(2)}%</h4>
                                                        <h4>Decrease by 2+: {(item.certaintyLower*100).toFixed(2)}%</h4>
                                                        <h4>Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
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
                                singleCertainty={singleCertainty}
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
                                        if (index === 1) {
                                            totalIfIncrease += (item.newHigherBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfSame += (item.newSameBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfDecrease += (item.newLowerBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Increase by 2+: {(item.certaintyHigher*100).toFixed(2)}%</h4>
                                                        <h4>Stay within +/- 2: {(item.certaintySame*100).toFixed(2)}%</h4>
                                                        <h4>Decrease by 2+: {(item.certaintyLower*100).toFixed(2)}%</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me?</h3>
                                                        <h4>If Increase Happens: {item.newHigherBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHigherBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <h4>If Stay Within Happens: {item.newSameBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newSameBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <h4>If Decrease Happens: {item.newLowerBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newLowerBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <h4>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</h4>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        } else {
                                            totalIfIncrease += (item.newHigherBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfSame += (item.newSameBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfDecrease += (item.newLowerBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Prediction #{index}</u></h3>
                                                        <h4>Increase by 2+: {(item.certaintyHigher*100).toFixed(2)}%</h4>
                                                        <h4>Stay within +/- 2: {(item.certaintySame*100).toFixed(2)}%</h4>
                                                        <h4>Decrease by 2+: {(item.certaintyLower*100).toFixed(2)}%</h4>
                                                        <h4>Comments: <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>Forecast Duration</h3>
                                                        <h4>Date: {item.date.slice(0, 24)}</h4>
                                                        <h4>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</h4>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me?</h3>
                                                        <h4>If Increase Happens: {item.newHigherBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHigherBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <h4>If Stay Within Happens: {item.newSameBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newSameBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                                        <h4>If Decrease Happens: {item.newLowerBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newLowerBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
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
                                singleCertainty={singleCertainty}
                                totalIfIncrease={totalIfIncrease}
                                totalIfSame={totalIfSame}
                                totalIfDecrease={totalIfDecrease}
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