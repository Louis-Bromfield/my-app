import React, { useState, useEffect } from 'react'
import './NewForecastsCallToAction.css';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import axios from 'axios';

function NewForecastsCallToAction(props) {
    const [isPanelHidden, setIsPanelHidden] = useState(false);
    const [unattemptedForecasts, setUnattemptedForecasts] = useState([]);

    const checkForForecastsUserHasNotAttempted = async (username) => {
        try {
            const forecastData = await axios.get(`http://localhost:5000/users/unattemptedForecasts/${username}`);
            setUnattemptedForecasts(forecastData.data);
        } catch (error) {
            console.error(error);
            console.error("Error in NewForecastsC2A > checkForForecastsUserHasNotAttempted");
        };
    };

    useEffect(() => {
        checkForForecastsUserHasNotAttempted(props.username);
    }, [props.username]);


    return (
        <div className="new-forecasts-container" style={unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length >= 1 ? {border: "3px solid orange",} : {border: "none"}}>
            <div className="container-header">
                <h2 className="new-forecasts-title">New Forecasts ({unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length})</h2>
                <button 
                    className="show-hide-new-forecasts-c2a"
                    onClick={() => setIsPanelHidden(!isPanelHidden)}>
                        {isPanelHidden ? "Show" : "Hide"}
                </button>
            </div>
            {isPanelHidden && <div className="new-forecasts-container-minimised"></div>}
            {!isPanelHidden &&
                <div className="new-forecasts-panel">
                    {unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length === 0 && <h3 className="forecast-list-subtitle">No new forecasts yet!</h3>}
                    {unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length >= 1 && 
                        <div className="forecast-list-div">
                            <h3 className="forecast-list-subtitle">You have some problems you haven't submitted a forecast for yet!</h3>
                            <hr />
                            {unattemptedForecasts.map((item, index) => {
                                if (item.length > 1 && item.length > 4) {
                                    return (
                                        <ul className="forecast-ul" key={index}>
                                            <h2 className="forecast-li-market">{item[0]} ({item.length-1})</h2>
                                            {item.map((nestedItem, nestedIndex) => {
                                                if (nestedIndex < 4) {
                                                    if (typeof(nestedItem) === 'object') {
                                                        return (
                                                            <li className="forecast-li" key={nestedIndex}>
                                                                <h4 className="forecast-li-problem">{nestedItem.problemName}</h4>
                                                            </li>
                                                        )
                                                    } else return null;
                                                } else if (nestedIndex === 4) {
                                                    return (
                                                        <h3 key={nestedIndex} className="forecast-li-problem-more">and {item.length-4} more...</h3>
                                                    )
                                                } else return null;
                                            })}
                                        </ul>
                                    )
                                } else if (item.length > 1 && item.length <= 4) {
                                    return (
                                        <ul className="forecast-ul" key={index}>
                                            <h2 className="forecast-li-market">{item[0]} ({item.length-1})</h2>
                                            {item.map((nestedItem, nestedIndex) => {
                                                    if (typeof(nestedItem) === 'object') {
                                                        return (
                                                            <li className="forecast-li" key={nestedIndex}>
                                                                <h4 className="forecast-li-problem">{nestedItem.problemName}</h4>
                                                            </li>
                                                        )
                                                    } else return null;
                                            })}
                                        </ul>
                                    )
                                } else return null;
                            })}
                        </div>
                    }
                    <HomeButtonNavButton path="forecast" />
                </div>
            }
        </div>
    )
}

export default NewForecastsCallToAction;
