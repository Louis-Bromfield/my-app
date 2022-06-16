import React, { useState, useEffect } from 'react';
import './Forecast.css';
import ForecastAdmin from './ForecastComponents/ForecastAdmin';
import ForecastSubmission from './ForecastComponents/ForecastSubmission';
import ForecastTabPane from './ForecastComponents/ForecastTabPane';
import axios from 'axios';

function Forecast(props) {
    const [forecastSelected, setForecastSelected] = useState(false);
    const [forecast, setForecast] = useState("");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [forecastSingleCertainty, setForecastSingleCertainty] = useState();
    const [allForecasts, setAllForecasts] = useState([]);

    const handleForecastChange = (newForecast) => {
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
            console.log(allForecastsUnfiltered);
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

    return (
        <div className="forecast">
            <div className="forecast-header">
                <h1>My Forecasts</h1>
                <p>This is the page for submitting your forecasts. In the dropdown menu below, you can
                    select a problem to make a prediction on. The available forecasts in the list are
                    determined by which markets you have joined. 
                </p>
            </div>
            {/* Replace aPW with JWT verification? */}
            {(props.username === "LouisB" && localStorage.getItem("aPW") === "73485093485734974592398190489025736hbn45") && <ForecastAdmin username={props.username} allForecasts={allForecasts} />}
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
            />
            {forecastSelected &&
                <ForecastTabPane 
                    selectedForecast={forecast} 
                    username={props.username} 
                    leaderboard={leaderboardData}
                    refresh={refresh} 
                    forecastSingleCertainty={forecastSingleCertainty}
                />
            }
            {!forecastSelected &&
                <div className="empty-div"></div>
            }
        </div>
    )
}

export default Forecast;