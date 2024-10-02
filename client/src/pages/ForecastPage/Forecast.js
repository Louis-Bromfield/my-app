import React, { useState, useEffect } from 'react';
import './Forecast.css';
import ForecastAdmin from './ForecastComponents/ForecastAdmin';
import ForecastSubmission from './ForecastComponents/ForecastSubmission';
import axios from 'axios';
import ForecastArticlesDisplay from './ForecastComponents/ForecastArticlesDisplay';
import Modal from '../../components/Modal';
// import { FaInfoCircle } from 'react-icons/fa';
// import ForecastSelection from './ForecastComponents/ForecastSelection';
// import ForecastDataSubmission from './ForecastComponents/ForecastDataSubmission';
import ForecastChat from './ForecastComponents/ForecastChat';

function Forecast(props) {
    const [forecastSelected, setForecastSelected] = useState(false);
    const [forecast, setForecast] = useState("");
    const [hasAForecastBeenSelected, setHasAForecastBeenSelected] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [forecastSingleCertainty, setForecastSingleCertainty] = useState();
    const [allForecasts, setAllForecasts] = useState([]);
    const [todayAverage, setTodayAverage] = useState("");
    const [todayForecastCount, setTodayForecastCount] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalContent2, setModalContent2] = useState("");
    const [selectedForecast, setSelectedForecast] = useState({ problemName: "No problem selected" });

    const updateTodayStats = (avg, fc) => {
        setTodayAverage(avg);
        setTodayForecastCount(fc);
    };

    const handleForecastChange = (newForecast) => {
console.log("CHARMANDER");
        setForecast(newForecast);
    };

    const handleLeaderboardChange = (newLeaderboard) => {
        setLeaderboardData(newLeaderboard);
    };

    const getAllForecastsFromDB = async () => {
        try {
            const allForecastsUnfiltered = await axios.get(`${process.env.REACT_APP_API_CALL_F}`);
            // const allForecastsUnfiltered = await axios.get(`http://localhost:8000/forecasts`);
            setAllForecasts(allForecastsUnfiltered.data);
        } catch (error) {
            console.error(error);
        };
    };

    // const handleClick = (forecastObj) => {
    //     setSelectedForecast(forecastObj);
    // };

    useEffect(() => {
        getAllForecastsFromDB();
    }, []);

    // Ideally like to delete this
    useEffect(() => {
        handleForecastChange(forecast);
        handleLeaderboardChange(leaderboardData);
    }, [refresh, forecast, leaderboardData]);

    return (
        <div className="forecast">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
                <p>{modalContent2}</p>
            </Modal>
            <h1 className="page-header">Races</h1>
            <div className="forecast-header">
                {/* <div className="forecast-header-left">
                    <h1>Races</h1>
                    <FaInfoCircle 
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(`This is the page for submitting your forecasts. Each forecast question is called a 'Race',
                            and you can submit predictions as to which outcome you think is going to happen. To do this, select a race 
                            from the list below. Your job is to predict how likely an outcome is to happen on a 
                            scale from 0-100, and you can update your prediction as many times as you like.`)
                        }}
                        style={{ "color": "orange", "cursor": "pointer" }}
                    />
                </div> */}
                <div className="forecast-info-bar-container">
                    <div className="individual-forecast-info-container" onClick={() => {
                        setShowModal(true);
                        setModalContent("This is where you manage all of your predictions. Your job is to select a race from the dropdown menu below and submit predictions based on how confident you are of the outcome happening on a scale of 0-100. Once you submit a prediction, you are free to update it as many times as you like! A chart will show the predictions submitted by all other users who have attempted this problem, and relevant statistics and articles will be available to assist you, as well as a comment section for you to discuss with other players.")
                        setModalContent2("");
                    }}>
                        <h4>What do I do on this page?</h4>
                    </div>
                    <div className="individual-forecast-info-container" onClick={() => {
                        setShowModal(true);
                        setModalContent("You can submit an unlimited number of predictions for any given forecast problem, with each one contributing to your final score. Each forecast is assessed based on how confident you were (i.e. how close to 0 or 100 you were with that prediction) and then weighted by that submission's duration (so forecasts that aren't updated for longer will receive a larger weighting than one that was updated quickly, so as to incentivise you to update your forecasts as soon as possible).")
                        setModalContent2(<a href="https://youtu.be/OkLP72O3hmo" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}><p>For a full breakdown, watch this video</p></a>)
                    }}>
                        <h4>How are forecasts assessed for accuracy?</h4>
                    </div>
                </div>
            </div>
            {(props.username === "LouisB" && localStorage.getItem("aPW") === "73485093485734974592398190489025736hbn45") && <ForecastAdmin username={props.username} allForecasts={allForecasts} />}


            {/* New forecast page layout */}
            {/* <div className="forecast-redesign-main-container">
                <ForecastSelection 
                    allForecasts={allForecasts} 
                    handleClick={handleClick} 
                />
                <ForecastSubmission 
                    allForecasts={allForecasts}
                    toggleDiv={setForecastSelected} 
                    setForecastSingleCertainty={setForecastSingleCertainty}
                    changeForecast={handleForecastChange} 
                    handleLeaderboardChange={handleLeaderboardChange}
                    markets={props.markets} 
                    selectedForecast={forecast} 
                    username={props.username}
                    userObjectMarkets={props.userObjectMarkets}
                    userBriers={props.userBriers}
                    updateTodayStats={updateTodayStats}
                    handleForecastSet={setHasAForecastBeenSelected}
                    leaderboardData={leaderboardData}
                    /> 
            </div> */}


            <div className="new-forecast-container">
                <div className="new-forecast-container-top-half">
                    <ForecastSubmission 
                        allForecasts={allForecasts}
                        toggleDiv={setForecastSelected} 
                        setForecastSingleCertainty={setForecastSingleCertainty}
                        changeForecast={handleForecastChange} 
                        handleLeaderboardChange={handleLeaderboardChange}
                        markets={props.markets} 
                        selectedForecast={forecast} 
                        username={props.username}
                        userObjectMarkets={props.userObjectMarkets}
                        userBriers={props.userBriers}
                        updateTodayStats={updateTodayStats}
                        handleForecastSet={setHasAForecastBeenSelected}
                        leaderboardData={leaderboardData}
                    />
                </div>
                {hasAForecastBeenSelected === true && 
                    <div className="new-forecast-container-bottom-half">
                        <div className="new-forecast-container-bottom-half-row">
                            <div></div>
                            <ForecastArticlesDisplay 
                                searchTerm={forecast}
                                userObject={props.userObject}   
                                username={props.username}
                            />
                        </div>
                        <div className="new-forecast-container-bottom-half-row">
                            <div></div>
                            <ForecastChat 
                                forecast={forecast}
                                username={props.username}
                            />
                        </div>
                    </div>                    
                }
                {/* {hasAForecastBeenSelected === true &&
                    <div className="new-forecast-container-bottom-half">
                        <div className="bottom-half-articles-div">
                            <ForecastArticlesDisplay 
                                searchTerm={forecast}
                                userObject={props.userObject}   
                                username={props.username}
                            />
                        </div>
                        <div className="bottom-half-right-results-and-metrics">
                            <div className="forecast-results">
                            </div>
                            <div className="bottom-half-stats-and-leaderboard">
                            </div>
                        </div>
                    </div>
                } */}
            </div>
        </div>
    )
}

export default Forecast;