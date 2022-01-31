import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import FakeProfilePic2 from '../../media/ProfileP.png';
import { Line } from 'react-chartjs-2';
import ReactLoading from 'react-loading';

function Search(props) {
    const [markets, setMarkets] = useState("");
    const [index, setIndex] = useState();
    const [searchName, setSearchName] = useState("");
    const [playerUsername, setPlayerUsername] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerPoints, setPlayerPoints] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [brierAverage, setBrierAverage] = useState("N/A");
    const [bestForecast, setBestForecast] = useState("N/A");
    const [playerProfilePic, setPlayerProfilePic] = useState("");
    const [recentData, setRecentData] = useState([]);
    const [recentLabels, setRecentLabels] = useState([]);
    const [allData, setAllData] = useState([]);
    const [allLabels, setAllLabels] = useState([]);
    const [playerBestBrier, setPlayerBestBrier] = useState();
    const [playerWorstBrier, setPlayerWorstBrier] = useState();
    const [playerAverageBrier, setPlayerAverageBrier] = useState();
    const [problemsAttempted, setProblemsAttempted] = useState(0);
    const [marketsIn, setMarketsIn] = useState(0);
    const [ffPoints, setFFPoints] = useState(0);
    const [onboardingProgress, setOnboardingProgress] = useState(0);
    const [bestChanged, setBestChanged] = useState(false);
    const [worstChanged, setWorstChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bestBrierMe, setBestBrierMe] = useState();
    const [worstBrierMe, setWorstBrierMe] = useState();
    const [averageBrierMe, setAverageBrierMe] = useState();
    const [bestChangedMe, setBestChangedMe] = useState(false);
    const [worstChangedMe, setWorstChangedMe] = useState(false);
    const [selectedStats, setSelectedStats] = useState("selected");
    const [selectedStats2, setSelectedStats2] = useState("unselected");

    useEffect(() => {
        console.log(props);
        if (props.location.clickedUsername !== undefined) {
            retrievePlayerInfo(props.location.clickedUsername);
        };
    }, []);

    const retrieveUserRankFromDB = async (username) => {
        try {
            const lbName = "Fantasy Forecast All-Time"
            const userData = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${lbName}`);
            const lbRankings = userData.data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
            for (let i = 0; i < lbRankings.length; i++) {
                if (lbRankings[i].username === username) {
                    let k = i+1 % 10;
                    let l = i+1 % 100;
                    if (k === 1 && l !== 11) {
                        setIndex(i+1+"st");
                    } else if (k === 2 && l !== 12) {
                        setIndex(i+1+"nd");
                    } else if (k === 3 && l !== 13) {
                        setIndex(i+1+"rd");
                    } else {
                        setIndex(i+1+"th");
                    };
                };
            };
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/profileData/${username}`);
            formatBrierData(userDocument.data.userObj, playerUsername);
            findUniquePlayerStats(userDocument.data.userObj, playerUsername);
            // setSearchedUserBrierScoresArr(userDocument.data.userObj.brierScoresArr);
            // setFantasyForecastPoints(userDocument.data.ffPoints);
            setBrierAverage(userDocument.data.averageBrier);
            setBestForecast(`${userDocument.data.bestBrier} - ${userDocument.data.bestForecastProblem}`);
        } catch (error) {
            console.error("Error in Profile.js > retrieveUserInfoFromDB");
            console.error(error);
        };
    };

    // Move to backend?
    const formatMarketsString = (markets) => {
        let string = "";
        for (let i = 0; i < markets.length; i++) {
            if (markets[i] !== '"Fantasy Forecast All-Time"') {
                string += `${markets[i]}, `;
            };
        };
        string = string.slice(0, string.length-2);
        setMarkets(string);
    };

    const retrievePlayerInfo = async (username) => {
        setLoading(true);
        if (username === "" || username.length === 0) return;
        try {
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (userDocument.data.length === 0) {
                setErrorMessage("No profiles were found with this username. Please try again.");
            } else if (userDocument.data.length > 0) {
                retrieveUserRankFromDB(username);
                setPlayerUsername(userDocument.data[0].username);
                setPlayerName(userDocument.data[0].name);
                setPlayerPoints(userDocument.data[0].fantasyForecastPoints.toFixed(0));
                formatMarketsString(userDocument.data[0].markets);
                setPlayerProfilePic(userDocument.data[0].profilePicture);
            };
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        } catch (error) {
            console.error("Error in Search > retrievePlayerInfo");
            console.error(error);
        };
    };

    const formatBrierData = async (userObj, username) => {
        let allBrierArray = [null];
        let recentBrierArray = [null];
        let bestBrierPlayer = 0;
        let worstBrierPlayer = 110;
        let averageBrierPlayer = 0;
        let allLabelsArray = [""];
        let recentLabelsArray = [""];
        let counter = 0;
        for (let i = userObj.brierScores.length-1; i >= 0; i--) {
            allLabelsArray.push(`${userObj.brierScores[i].problemName}`);
            if (userObj.brierScores[i].brierScore > bestBrierPlayer) {
                setBestChanged(true);
                bestBrierPlayer = userObj.brierScores[i].brierScore;
            };
            if (userObj.brierScores[i].brierScore < worstBrierPlayer) {
                setWorstChanged(true);
                worstBrierPlayer = userObj.brierScores[i].brierScore;
            };
            averageBrierPlayer += userObj.brierScores[i].brierScore;
            allBrierArray.push(userObj.brierScores[i].brierScore);
            if (counter < 10) {
                recentBrierArray.push(userObj.brierScores[i].brierScore);
                recentLabelsArray.push(`${userObj.brierScores[i].problemName}`);
            };
            counter++;
        };
        setPlayerBestBrier(bestBrierPlayer.toFixed(0));
        setPlayerWorstBrier(worstBrierPlayer.toFixed(0));
        setPlayerAverageBrier((averageBrierPlayer/userObj.brierScores.length).toFixed(0));

        // Recent Data
        allBrierArray.push(null);
        recentBrierArray.push(null);
        setRecentData(recentBrierArray.reverse());
        setAllData(allBrierArray.reverse());
        allLabelsArray.push("");
        recentLabelsArray.push("");
        setAllLabels(allLabelsArray.reverse());
        setRecentLabels(recentLabelsArray.reverse());

        // Logged in user's data for comparative stats
        let bestBrierMe = 0;
        let worstBrierMe = 110;
        let averageBrierMe = 0;
        const myStats = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${localStorage.getItem("username")}`);
        for (let i = 0; i < myStats.data[0].brierScores.length; i++) {
            if (myStats.data[0].brierScores[i].brierScore > bestBrierMe) {
                setBestChangedMe(true);
                bestBrierMe = myStats.data[0].brierScores[i].brierScore;
            };
            if (myStats.data[0].brierScores[i].brierScore < worstBrierMe) {
                setWorstChangedMe(true);
                worstBrierMe = myStats.data[0].brierScores[i].brierScore;
            };
            averageBrierMe += myStats.data[0].brierScores[i].brierScore;
        };
        setBestBrierMe(bestBrierMe.toFixed(0));
        setWorstBrierMe(worstBrierMe.toFixed(0));
        setAverageBrierMe((averageBrierMe/myStats.data[0].brierScores.length).toFixed(0));
    };

    const recentForecastData = {
        labels: recentLabels,
        datasets: [
            {
                label: "Forecast Scores",
                data: recentData,
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 1)",
                borderColor: "rgba(75, 192, 192, 1)",
                pointRadius: 4,
                borderWidth: 4
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
        redraw: false
    };

    const allTimeForecastData = {
        labels: allLabels,
        datasets: [
            {
                label: "Forecast Scores",
                data: allData,
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 1)",
                borderColor: "rgba(75, 192, 192, 1)",
                pointRadius: 4,
                borderWidth: 4
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
        redraw: false
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                display: false
            }
        }
    };

    const [stats, setStats] = useState();

    const findUniquePlayerStats = async (userObj, username) => {
        try {
            if (userObj === null) {
                const userDoc = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
                userObj = userDoc.data[0];
            };
            setProblemsAttempted(userObj.brierScores.length || "X");
            setMarketsIn(userObj.markets.length || "X");
            setFFPoints(userObj.fantasyForecastPoints.toFixed(0) || "X");
            let onboardingCount = 0;
            Object.entries(userObj.onboarding).forEach(
                ([key, value]) => value === true ? onboardingCount++ : onboardingCount += 0
            );
            setOnboardingProgress(onboardingCount);
        } catch (error) {
            console.error("Error in ProfileStats > findUniquePlayerStats");
            console.error(error);
        };
    };

    return (
        <div className="profile">
            <h1>Search</h1>
            <div className="search-container">
                <input className="search-field" type="text" onChange={(e) => { setSearchName(e.target.value); setErrorMessage("")}}/>
                <button className="search-btn" onClick={() => retrievePlayerInfo(searchName)}>Search</button>
            </div>
            {errorMessage !== "" && <h3 className="error-message" style={{ color: "red" }}>{errorMessage}</h3>}
            <div className="main-profile-grid">
                {loading === true && 
                    <div className="profile-grid">
                        <h1 className="profile-header">Gathering player details...</h1>
                        <ReactLoading type="bars" color="#404d72" height="15%" width="15%" />
                    </div>
                }
                {loading === false &&
                    <div className="profile-grid">
                        <h1 className="profile-header">{playerUsername}</h1>
                        <div className="profile-main-info">
                            <img className="profile-profile-pic" src={playerProfilePic || FakeProfilePic2} alt="Temporary profile pic"/>
                            <div className="profile-summary">
                                <ul className="profile-summary-list">
                                    <li key={1} className="profile-summary-list-item">
                                        <h3>Fantasy Forecast Points:</h3>
                                        <h4>{playerPoints}</h4>
                                    </li>
                                    <li key={2} className="profile-summary-list-item">
                                        <h3>Brier Score Average:</h3>
                                        <h4>{brierAverage}</h4>
                                    </li>
                                    <li key={3} className="profile-summary-list-item">
                                        <h3>Best Forecast:</h3>
                                        <h4>{bestForecast}</h4>
                                    </li>
                                    <li key={4} className="profile-summary-list-item">
                                        <h3>Fantasy Forecast All-Time Rank:</h3>
                                        <h4>{index}</h4>
                                    </li>
                                    <li key={5} className="profile-summary-list-item">
                                        <h3>Markets</h3>
                                        <h4>{markets}</h4>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <br/>
                        <hr/>
                        <div className="profile-stats">
                            <h1 className="profile-header">{playerUsername !== "" ? `${playerUsername}'s Stats` : "Player Stats"}</h1>
                            <div className="profile-stats-inner">
                                <div className="profile-stats-recent-forecasts">
                                    <br/>
                                    <ul className="profile-stats-selectors">
                                    <li className={selectedStats} onClick={() => { setStats(recentForecastData); setSelectedStats("selected"); setSelectedStats2("unselected")}}><h3>Recent Forecasts</h3></li>
                                        <h2>|</h2>
                                        <li className={selectedStats2} onClick={() => { setStats(allTimeForecastData); setSelectedStats("unselected"); setSelectedStats2("selected")}}><h3>All Forecasts</h3></li>
                                    </ul>
                                    <Line className="profile-stats-line-chart" data={stats || recentForecastData} options={options} />
                                </div>
                                <div className="profile-stats-grid">
                                    <br/>
                                    <h2>Comparative Stats</h2>
                                    <hr />
                                    <div className="profile-stats-grid-headers">
                                        <h3>{playerUsername === "" ? "User" : playerUsername}</h3>
                                        <h3>Me</h3>
                                        <hr />
                                        <hr />
                                    </div>
                                    <div className="profile-stats-grid-body-three-cols">
                                        <h4 className="oddrow">{bestChanged === true ? playerBestBrier : "N/A"}</h4>
                                        <h3 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Best Brier</h3>
                                        <h4 className="oddrow">{bestChangedMe === true ? bestBrierMe : "N/A"}</h4>
                                        <h4>{worstChanged === true ? playerWorstBrier : "N/A"}</h4>
                                        <h3 style={{ color: "#404d72" }}>Worst Brier</h3>
                                        <h4>{worstChangedMe === true ? worstBrierMe : "N/A"}</h4>
                                        <h4 className="oddrow">{isNaN(playerAverageBrier) ? "N/A" : playerAverageBrier}</h4>
                                        <h3 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Average Brier</h3>
                                        <h4 className="oddrow">{isNaN(averageBrierMe) ? "N/A" : averageBrierMe}</h4>
                                    </div>
                                    <br />
                                    <h2 className="player-stats-title">Unique Player Stats</h2>
                                    <hr className="player-stats-title-hr" />
                                    <div className="profile-stats-grid-body-two-cols">
                                        <h4>Fantasy Forecast Points:</h4>
                                        <h3 style={{ color: "#404d72" }}>{ffPoints}</h3>
                                        <h4>Problems Attempted:</h4>
                                        <h3 style={{ color: "#404d72" }}>{problemsAttempted}</h3>
                                        <h4># of Markets In:</h4>
                                        <h3 style={{ color: "#404d72" }}>{marketsIn}</h3>
                                        <h4>Onboarding Tasks Complete:</h4>
                                        <h3 style={{ color: "#404d72" }}>{onboardingProgress} / 5</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                }
            </div>
        </div>
    )
}

export default Search;
