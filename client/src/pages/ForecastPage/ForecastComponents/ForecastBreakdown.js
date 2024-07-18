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
    }, [props.selectedForecast, props.username, props.userHasAttempted, forecastClosed]);

    const getPredictionData = async (selectedForecast, username, forecastClosed) => {
        try {
            if (forecastClosed === true) {
                const userForecastsDocument = await axios.get(`${process.env.REACT_APP_API_CALL_F}/${selectedForecast}/${true}/${username}/${singleCertainty}`);
                setPredictionData(userForecastsDocument.data);
                calculateTScore(userForecastsDocument.data);
            } else if (forecastClosed === false) {
                const userForecastsDocument = await axios.get(`${process.env.REACT_APP_API_CALL_F}/${selectedForecast}/${false}/${username}/${singleCertainty}`);
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

    let totalScore = 0;
    let totalIfHappenedNoBoost = 0;
    let totalIfNotHappenedNoBoost = 0;
    let totalIfOutcomeOne = 0;
    let totalIfOutcomeTwo = 0;
    let totalIfOutcomeThree = 0;

    return (
        <div className="predictions-container">
            {showBreakdown === false && 
                <div className="show-prediction-breakdown-buttons">
                    {props.username !== "Guest" &&
                        <button 
                            className="show-btn" 
                            onClick={() => setShowBreakdown(!showBreakdown)}>
                                Show Prediction Breakdown
                        </button>
                    }
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
                    <div className="show-prediction-breakdown-buttons">
                        <button className="hide-btn" onClick={() => setShowBreakdown(!showBreakdown)}>Hide Prediction Breakdown</button>
                        {forecastClosed === true &&
                            <Link  
                                className="go-to-analysis-page-btn" 
                                to={linkObject}>
                                    Open Forecast Analysis Page
                            </Link>
                        }
                    </div>
                    <h2 style={{ color: "#404d72" }}><u>Your Predictions</u></h2>
                    <hr />
                    {forecastClosed === true && 
                        <div className="container">
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        if (index === 1) {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>Certainty:</strong> {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier === undefined  || item.newBrier === null ? "N/A" : item.newBrier.toFixed(0)} / 100</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore === undefined || item.percentageOfTimeAtThisScore === null ? "N/A" : item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <p>This forecast scored you: {item.newBrier === undefined  || item.newBrier === null ? "N/A" : item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {item.newBrier === undefined  || item.newBrier === null ? "N/A" : (item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <p>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</p>
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
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>Certainty:</strong> {(item.certainty*100).toFixed(2)}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Brier Score: {item.newBrier.toFixed(0)} / 100</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <p>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
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
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        if (index === 1) {
                                            totalIfHappenedNoBoost += (item.newHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfNotHappenedNoBoost += (item.newNotHappenedBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>Certainty:</strong> {(item.certainty*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me? (Brier Score * Duration)</h3>
                                                        <p>If this problem <u>does</u> happen: {(item.newHappenedBrier).toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {((item.newHappenedBrier).toFixed(0) * (item.percentageOfTimeAtThisScore/100)).toFixed(2)}</p>
                                                        <p>If this problem does <u>not</u> happen: {(item.newNotHappenedBrier).toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {((item.newNotHappenedBrier).toFixed(0) * (item.percentageOfTimeAtThisScore/100)).toFixed(2)}</p>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <p>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</p>
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
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>Certainty:</strong> {(item.certainty*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me? (Brier Score * Duration)</h3>
                                                        <p>If this problem <u>does</u> happen: {item.newHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <p>If this problem does <u>not</u> happen: {item.newNotHappenedBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newNotHappenedBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
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
                    {forecastClosed === true && 
                        <div className="container">
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        if (index === 1) {
                                            totalScore += (item.newBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>{props.forecastPotentialOutcomes[0]}:</strong> {(item.certainty1*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[1]}:</strong> {(item.certainty2*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[2]}:</strong> {(item.certainty3*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Brier Score:</strong> {item.newBrier.toFixed(0)} / 100</p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <p>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <p>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</p>
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
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>{props.forecastPotentialOutcomes[0]}:</strong> {(item.certainty1*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[1]}:</strong> {(item.certainty2*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[2]}:</strong> {(item.certainty3*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Brier Score:</strong> {item.newBrier.toFixed(0)} / 100</p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <p>This forecast scored you: {item.newBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
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
                                forecastPotentialOutcomes={props.forecastPotentialOutcomes}
                            />
                        </div>
                    }
                    {forecastClosed === false && 
                        <div className="container">
                            <ul className="prediction-ul">
                                {predictionData.map((item, index) => {
                                    if (index !== 0 && new Date(item.date) < new Date(predictionData[0].closeDate)) {
                                        if (index === 1) {
                                            totalIfOutcomeOne += (item.newOutcomeOneBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfOutcomeTwo += (item.newOutcomeTwoBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfOutcomeThree += (item.newOutcomeThreeBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>{props.forecastPotentialOutcomes[0]}:</strong> {(item.certainty1*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[1]}:</strong> {(item.certainty2*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[2]}:</strong> {(item.certainty3*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me? (Brier Score * Duration)</h3>
                                                        <p>If {props.forecastPotentialOutcomes[0]} Happens: {item.newOutcomeOneBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeOneBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <p>If {props.forecastPotentialOutcomes[1]} Happens: {item.newOutcomeTwoBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeTwoBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <p>If {props.forecastPotentialOutcomes[2]} Happens: {item.newOutcomeThreeBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeThreeBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <br />
                                                        <h2 style={{ color: "#404d72"}}>Time Score - {tScore.toFixed(2)} / 10</h2>
                                                        <p>As this was your first prediction, it determines your Time Score (Earlier = Higher Score)</p>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            } else return null;
                                        } else {
                                            totalIfOutcomeOne += (item.newOutcomeOneBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfOutcomeTwo += (item.newOutcomeTwoBrier * (item.percentageOfTimeAtThisScore/100));
                                            totalIfOutcomeThree += (item.newOutcomeThreeBrier * (item.percentageOfTimeAtThisScore/100));
                                            if (showForecastByForecastBreakdown === true) {
                                                return (
                                                    <li key={index} className="prediction-li">
                                                        <h3 style={{ color: "#404d72" }}><u>Forecast #{index}</u></h3>
                                                        <p><strong>{props.forecastPotentialOutcomes[0]}:</strong> {(item.certainty1*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[1]}</strong>: {(item.certainty2*100).toFixed(2)}%</p>
                                                        <p><strong>{props.forecastPotentialOutcomes[2]}</strong>: {(item.certainty3*100).toFixed(2)}%</p>
                                                        <p><strong>Comments:</strong> <i>{item.comments.includes("~") ? item.comments.split("~")[1] : item.comments}</i></p>
                                                        <br />
                                                        <p><strong>Date:</strong> {item.date.toString().slice(0, 15)}</p>
                                                        <p>% of the entire forecast window spent at this prediction: <u>{item.percentageOfTimeAtThisScore.toFixed(2)}%</u>~</p>
                                                        <br />
                                                        <h3 style={{ color: "#404d72" }}>What Will This Forecast Score Me? (Brier Score * Duration)</h3>
                                                        <p>If {props.forecastPotentialOutcomes[0]} Happens: {item.newOutcomeOneBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeOneBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <p>If {props.forecastPotentialOutcomes[1]} Happens: {item.newOutcomeTwoBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeTwoBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
                                                        <p>If {props.forecastPotentialOutcomes[2]} Happens: {item.newOutcomeThreeBrier.toFixed(0)} * {(item.percentageOfTimeAtThisScore/100).toFixed(2)}~ = {(item.newOutcomeThreeBrier.toFixed(0) * item.percentageOfTimeAtThisScore/100).toFixed(2)}</p>
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
                                totalIfOutcomeOne={totalIfOutcomeOne}
                                totalIfOutcomeTwo={totalIfOutcomeTwo}
                                totalIfOutcomeThree={totalIfOutcomeThree}
                                tScore={tScore}
                                forecastPotentialOutcomes={props.forecastPotentialOutcomes}
                            />
                        </div>
                    }
                </div>
            }
        </div>
    )
};

export default ForecastBreakdown;