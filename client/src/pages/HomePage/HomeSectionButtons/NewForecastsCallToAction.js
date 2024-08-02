import React, { useState, useEffect } from 'react'
import './NewForecastsCallToAction.css';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import axios from 'axios';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function NewForecastsCallToAction(props) {
    const [isPanelHidden, setIsPanelHidden] = useState(false);
    const [unattemptedForecasts, setUnattemptedForecasts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const checkForForecastsUserHasNotAttempted = async (username) => {
        try {
            const forecastData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/unattemptedForecasts/${username}`);
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
        <div className="new-forecasts-container" style={unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length >= 1 ? {border: "3px solid orange"} : {borderBottom: "2px solid lightgray"}}>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <div className="container-header">
                <h2 className="new-forecasts-title">
                    New Forecasts ({unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length})
                    <FaInfoCircle 
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(`Whenever a new problem is released, you'll be notified of it here, so keep an eye out!`)
                        }}
                        style={{ "color": "orange", "cursor": "pointer" }}
                    />
                </h2>
                <button 
                    className="show-hide-new-forecasts-c2a"
                    onClick={() => setIsPanelHidden(!isPanelHidden)}>
                        {isPanelHidden ? "Show" : "Hide"}
                </button>
            </div>
            {isPanelHidden && <div className="new-forecasts-container-minimised"></div>}
            {!isPanelHidden &&
                <div className="new-forecasts-panel">
                    {unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length === 0 && <h2 className="forecast-list-subtitle">No new forecasts yet!</h2>}
                    {unattemptedForecasts.join(",").split(",").length-unattemptedForecasts.length >= 1 && 
                        <div className="forecast-list-div">
                            <p className="forecast-list-subtitle" style={{ margin: "0 auto" }}>You have some problems you haven't submitted a forecast for yet!</p>
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
