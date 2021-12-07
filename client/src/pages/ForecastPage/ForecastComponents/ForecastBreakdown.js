import React, { useState, useEffect } from 'react';
import './ForecastBreakdown.css';
import axios from 'axios';

function ForecastBreakdown(props) {
    const [predictionData, setPredictionData] = useState([]);

    useEffect(() => {
        if (props.userHasAttempted === true) {
            getPredictionData(props.selectedForecast, props.username);
        };
    }, [props.selectedForecast, props.username, props.userHasAttempted]);

    const getPredictionData = async (selectedForecast, username) => {
        try {
            const userForecastsDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/forecasts/${selectedForecast}/${username}`);
            setPredictionData(userForecastsDocument.data);
        } catch (error) {
            console.error("Error in ForecastBreakdown > getPredictionData");
            console.error(error);
        };
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

    return (
        <div className="predictions-container">
            {props.userHasAttempted === true &&
            <div className="to-show">
                <h2 style={{ color: "#404d72" }}><u>Your Predictions</u></h2>
                    <ul className="prediction-ul">
                        {predictionData.map((item, index) => {
                            const duration = timeFormatter(item.duration);
                            return (
                                <li key={index} className="prediction-li">
                                    <h3 style={{ color: "#404d72" }}><u>Prediction #{index+1}</u></h3>
                                    <h4>Certainty: {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier.toFixed(0)} / 100</h4>
                                    <h4>Date: {item.date.slice(0, 24)}</h4>
                                    <h4>Duration (Time spent as latest prediction): {duration.weeks} week(s), {duration.days} day(s), {duration.hours} hour(s), {duration.minutes} minute(s), {duration.seconds} second(s).</h4>
                                    <h4>% of the entire forecast window spent at this prediction: {item.percentageOfTimeAtThisScore.toFixed(2)}~</h4>
                                    <h4>Comments: <i>{item.comments}</i></h4>
                                    <br />
                                    <h4>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</h4>
                                    <br />
                                    <hr />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
        </div>
    )
};

export default ForecastBreakdown;