import React, { useState, useEffect } from 'react';
import './ProfileStats.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function ProfileStats(props) {
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
    const [bestGlobalBrier, setGlobalBestBrier] = useState();
    const [worstGlobalBrier, setGlobalWorstBrier] = useState();
    const [averageGlobalBrier, setGlobalAverageBrier] = useState();
    const [selectedStats, setSelectedStats] = useState("selected");
    const [selectedStats2, setSelectedStats2] = useState("unselected");

    useEffect(() => {
        if (props.userObj === undefined) {
            formatBrierData(null, props.username);
            findUniquePlayerStats(null, props.username);
            getGlobalData();
        } else if (props.userObj !== undefined) {
            formatBrierData(props.userObj, props.username);
            findUniquePlayerStats(props.userObj, props.username);
            getGlobalData();
        };
        setStats(recentForecastData);
        console.log("Profile Stats UE");
    }, [props.username, props.brierScores]);

    const getGlobalData = async () => {
        try {
            const res = await axios.get('https://fantasy-forecast-politics.herokuapp.com/users/globalData');
            setGlobalBestBrier(res.data.bestBrier.toFixed(0));
            setGlobalWorstBrier(res.data.worstBrier.toFixed(0));
            setGlobalAverageBrier(res.data.averageBrier.toFixed(0));
        } catch (error) {
            console.error("Error in ProfileStats > getGlobalData");
            console.error(error);
        };
    }

    const formatBrierData = async (userObj, username) => {
        if (userObj === null) {
            const brierData = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            userObj = brierData.data[0];
        };
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
            if (userObj.brierScores[i].brierScore >= bestBrierPlayer) {
                setBestChanged(true);
                bestBrierPlayer = userObj.brierScores[i].brierScore;
            };
            if (userObj.brierScores[i].brierScore <= worstBrierPlayer) {
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
        <div className="profile-stats">
            <h1 className="profile-header">My Stats</h1>
            <h3>Check out your Fantasy Forecast stats and how you're stacking up to the rest of the playerbase.</h3>
            <div className="profile-stats-inner">
                <div className="profile-stats-recent-forecasts">
                    <br/>
                    <ul className="profile-stats-selectors">
                        <li className={selectedStats} onClick={() => { setStats(recentForecastData); setSelectedStats("selected"); setSelectedStats2("unselected")}}><h3>Recent Forecasts</h3></li>
                        <h2>|</h2>
                        <li className={selectedStats2} onClick={() => { setStats(allTimeForecastData); setSelectedStats("unselected"); setSelectedStats2("selected")}}><h3>All Forecasts</h3></li>
                    </ul>
                    {/* <h4>*Until you've forecasted on more than 10 problems, these charts will look identical*</h4> */}
                    <Line className="profile-stats-line-chart" data={stats || recentForecastData} options={options} />
                </div>
                <div className="profile-stats-grid">
                    <br/>
                    <h2>Comparative Stats</h2>
                    <hr />
                    <div className="profile-stats-grid-headers">
                        <h3>Me</h3>
                        <h3>Global</h3>
                        <hr />
                        <hr />
                    </div>
                    <div className="profile-stats-grid-body-three-cols">
                        <h4 className="oddrow">{bestChanged === true ? playerBestBrier : "N/A"}</h4>
                        <h3 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Best Brier</h3>
                        <h4 className="oddrow">{bestGlobalBrier}</h4>
                        <h4>{worstChanged === true ? playerWorstBrier : "N/A"}</h4>
                        <h3 style={{ color: "#404d72" }}>Worst Brier</h3>
                        <h4>{worstGlobalBrier}</h4>
                        <h4 className="oddrow">{isNaN(playerAverageBrier) ? "N/A" : playerAverageBrier}</h4>
                        <h3 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Average Brier</h3>
                        <h4 className="oddrow">{averageGlobalBrier}</h4>
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
                        <h3 style={{ color: "#404d72" }}>{onboardingProgress} / 6</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileStats;
