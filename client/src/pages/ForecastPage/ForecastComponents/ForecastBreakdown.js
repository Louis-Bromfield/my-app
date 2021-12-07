import React, { useState, useEffect } from 'react';
import './ForecastBreakdown.css';
import axios from 'axios';

function ForecastBreakdown(props) {
    const [predictionData, setPredictionData] = useState([]);
    const [tScore, setTScore] = useState(0);

    useEffect(() => {
        if (props.userHasAttempted === true) {
            getPredictionData(props.selectedForecast, props.username);
        };
    }, [props.selectedForecast, props.username, props.userHasAttempted]);

    const getPredictionData = async (selectedForecast, username) => {
        try {
            const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${username}`);
            setPredictionData(userForecastsDocument.data);
            calculateTScore(userForecastsDocument.data);
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
    return (
        <div className="predictions-container">
            {props.userHasAttempted === true &&
                <div className="to-show">
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
                    <ul className="prediction-ul">
                        {predictionData.map((item, index) => {
                            // Index !== 0 is because at element 0 is an object containing start and close dates
                            // Predictions submitted after closing date will still be in DB so must be filtered
                            if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                const duration = timeFormatter(item.duration);
                                if (index === 1) {
                                    totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
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
                                } else {
                                    totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
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
                                }
                            } else return null;
                        })}
                    </ul>
                    <h2 style={{ color: "#404d72"}}>Combined Brier Score: <u>{totalScore.toFixed(2)} / 100</u></h2>
                    <h2 style={{ color: "#404d72"}}>Time Score: <u>{tScore.toFixed(2)} / 10</u></h2>
                    <h2 style={{ color: "#404d72"}}>Final Score For This Problem: <u>{(totalScore + tScore).toFixed(2)} / 110</u></h2>
                </div>
            }
        </div>
    )
};

export default ForecastBreakdown;