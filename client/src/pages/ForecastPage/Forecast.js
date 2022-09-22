import React, { useState, useEffect } from 'react';
import './Forecast.css';
import ForecastAdmin from './ForecastComponents/ForecastAdmin';
import ForecastSubmission from './ForecastComponents/ForecastSubmission';
// import ForecastTabPane from './ForecastComponents/ForecastTabPane';
import axios from 'axios';
import ForecastArticlesDisplay from './ForecastComponents/ForecastArticlesDisplay';
// import ForecastProblemLineChart from './ForecastComponents/ForecastProblemLineChart';
// import ForecastStatistics from './ForecastComponents/ForecastStatistics';
// import MarketStatistics from './ForecastComponents/MarketStatistics';
// import ForecastMarketLeaderboard from './ForecastComponents/ForecastMarketLeaderboard';
// import ForecastResults from './ForecastComponents/ForecastResults';
import ForecastChat from './ForecastComponents/ForecastChat';
import Modal from '../../components/Modal';

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

    const updateTodayStats = (avg, fc) => {
        setTodayAverage(avg);
        setTodayForecastCount(fc);
    };

    const handleForecastChange = (newForecast) => {
        console.log("yes there's been a change");
        setForecast(newForecast);
    };

    const handleLeaderboardChange = (newLeaderboard) => {
        setLeaderboardData(newLeaderboard);
    };

    const causeRefresh = () => {
        setRefresh(refresh+1);
    };

    const getAllForecastsFromDB = async () => {
        try {
            const allForecastsUnfiltered = await axios.get('https://fantasy-forecast-politics.herokuapp.com/forecasts');
            // console.log(allForecastsUnfiltered);
            setAllForecasts(allForecastsUnfiltered.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        getAllForecastsFromDB();
        console.log("Forecast.js UE TWO")
    }, []);

    useEffect(() => {
        handleForecastChange(forecast);
        handleLeaderboardChange(leaderboardData);
        console.log("Forecast.js UE")
    }, [refresh, forecast, leaderboardData]);

    // const testNotification = async () => {
    //     try {
    //         const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/newNotification/LouisB`, {
    //             notificationMessage: "This is a new notification!",
    //             notificationSourcePath: "/forecast",
    //             notificationSourceObjectID: "62a8f6dc2ad128ed5f3f951e"
    //         });
    //         console.log(res);
    //     } catch (err) {
    //         console.error(err);
    //     };
    // };

    return (
        <div className="forecast">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
                <p>{modalContent2}</p>
            </Modal>
            <div className="forecast-header">
                <h1>My Forecasts</h1>
                <p>This is the page for submitting your forecasts. In the dropdown menu below, you can
                    select a problem to make a prediction on. The available forecasts in the list are
                    determined by which markets you have joined. 
                </p>
            </div>
            {/* Replace aPW with JWT verification? */}
            {(props.username === "LouisB" && localStorage.getItem("aPW") === "73485093485734974592398190489025736hbn45") && <ForecastAdmin username={props.username} allForecasts={allForecasts} />}
            <div className="forecast-info-bar-container">
                <div className="individual-forecast-info-container" onClick={() => {
                    setShowModal(true);
                    setModalContent("This is where you manage all of your forecasts. Select a problem from the dropdown menu below and submit new forecasts or update previous ones. A chart will show the forecasts submitted by all other users who have attempted this problem, and relevant statistics and articles will be available to assist you, as well as a comment section for you to discuss with other forecasters.")
                    setModalContent2("");
                    // testNotification();
                }}>
                    <h3>What do I do on this page?</h3>
                </div>
                <div className="individual-forecast-info-container" onClick={() => {
                    setShowModal(true);
                    setModalContent("You can submit an unlimited number of predictions for any given forecast problem, with each one contributing to your final score. Each forecast is assessed based on how accurate you were and then weighted by that submission's duration (so forecasts that aren't updated for longer will receive a larger weighting than one that was updated quickly, so as to incentivise you to update your forecasts as soon as possible).")
                    setModalContent2(<a href="https://youtu.be/OkLP72O3hmo" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}><p>For a full breakdown, watch this video</p></a>)
                }}>
                    <h3>How are forecasts assessed for accuracy?</h3>
                </div>
            </div>
            <div className="new-forecast-container">
                <div className="new-forecast-container-top-half">
                    {/* submissions */}
                    <ForecastSubmission 
                        allForecasts={allForecasts}
                        toggleDiv={setForecastSelected} 
                        setForecastSingleCertainty={setForecastSingleCertainty}
                        changeForecast={handleForecastChange} 
                        handleLeaderboardChange={handleLeaderboardChange}
                        markets={props.markets} 
                        selectedForecast={forecast} 
                        username={props.username}
                        causeRefresh={causeRefresh}
                        userObjectMarkets={props.userObjectMarkets}
                        userBriers={props.userBriers}
                        updateTodayStats={updateTodayStats}
                        handleForecastSet={setHasAForecastBeenSelected}
                        leaderboardData={leaderboardData}
                        refresh={refresh}
                    />
                    {/* line chart */}
                </div>
                {hasAForecastBeenSelected === true &&
                    <div className="new-forecast-container-bottom-half">
                        {/* articles */}
                        <div className="bottom-half-articles-div">
                            <ForecastArticlesDisplay 
                                searchTerm={forecast}   
                            />
                        </div>
                        {/* stats and leaderboard */}
                        <div className="bottom-half-right-results-and-metrics">
                            <div className="forecast-results">
                                {/* {forecast.isClosed === true && 
                                    <ForecastResults 
                                        market={forecast.market} 
                                        problemName={forecast.problemName}
                                        leaderboard={leaderboardData} 
                                        username={props.username} 
                                        isClosed={forecast.isClosed}
                                    />
                                } */}
                            </div>
                            <div className="bottom-half-stats-and-leaderboard">
                                {/* Add chat window here */}
                                <ForecastChat
                                    forecast={forecast}
                                    username={props.username}
                                    userObject={props.userObject}
                                />
                                {/* <ForecastStatistics 
                                    selectedForecast={forecast} 
                                    today={false} 
                                    forecastSingleCertainty={forecastSingleCertainty}
                                />
                                <ForecastStatistics 
                                    selectedForecast={forecast} 
                                    today={true} 
                                    todayAverage={todayAverage} 
                                    todayForecastCount={todayForecastCount} 
                                    forecastSingleCertainty={forecastSingleCertainty}
                                />
                                <MarketStatistics 
                                    leaderboard={leaderboardData} 
                                    username={props.username} 
                                    refresh={refresh} 
                                    market={forecast.market}
                                />
                                <ForecastMarketLeaderboard 
                                    market={forecast.market} 
                                    leaderboard={leaderboardData} 
                                    username={props.username} 
                                /> */}
                            </div>
                        </div>
                    </div>
                }
            </div>
            {/* <ForecastSubmission 
                allForecasts={allForecasts}
                toggleDiv={setForecastSelected} 
                setForecastSingleCertainty={setForecastSingleCertainty}
                changeForecast={handleForecastChange} 
                handleLeaderboardChange={handleLeaderboardChange}
                markets={props.markets} 
                selectedForecast={forecast} 
                username={props.username}
                causeRefresh={causeRefresh}
                userObjectMarkets={props.userObjectMarkets}
                userBriers={props.userBriers}
            />
            {forecastSelected &&
                <ForecastTabPane 
                    selectedForecast={forecast} 
                    username={props.username} 
                    userObject={props.userObject}
                    leaderboard={leaderboardData}
                    refresh={refresh} 
                    forecastSingleCertainty={forecastSingleCertainty}
                />
            }
            {!forecastSelected &&
                <div className="empty-div"></div>
            } */}
        </div>
    )
}

export default Forecast;