import React, { useState, useEffect } from 'react';
import './ProfileStats.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function ProfileStats(props) {
    const [isHiddenBehindLevel, setIsHiddenBehindLevel] = useState();
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
    const [allAverageData, setAllAverageData] = useState([]);
    const [recentAverageData, setRecentAverageData] = useState([]);

    useEffect(() => {
        console.log(props.userObj);
        if (props.userObj.isTeam === true) {
            setIsHiddenBehindLevel(false);
            formatBrierData(props.userObj, props.username);
            findUniquePlayerStats(props.userObj, props.username);
        } else {
            if (props.ffPoints > 600 || props.userObj.trophies[0].obtained === true || props.username === "Guest") {
                    setIsHiddenBehindLevel(false);
                if (props.userObj === undefined) {
                    formatBrierData(null, props.username);
                    findUniquePlayerStats(null, props.username);
                } else if (props.userObj !== undefined) {
                    formatBrierData(props.userObj, props.username);
                    findUniquePlayerStats(props.userObj, props.username);
                };
                getGlobalData();
                setStats(recentForecastData);
            } else {
                setIsHiddenBehindLevel(true);
                return;
            };
        }
    }, [props.username, props.brierScores, props.profileTab, props.userObj, props.ffPoints]);

    const getGlobalData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_CALL_U}/globalData`);
            
            setGlobalBestBrier((res.data.bestBrier === null || res.data.bestBrier === -1)  ? "N/A" : res.data.bestBrier.toFixed(0));
            setGlobalWorstBrier((res.data.worstBrier === null || res.data.worstBrier === -1) ? "N/A" : res.data.worstBrier.toFixed(0));
            setGlobalAverageBrier(res.data.averageBrier === null ? "N/A" : res.data.averageBrier.toFixed(0));
        } catch (error) {
            console.error("Error in ProfileStats > getGlobalData");
            console.error(error);
        };
    }

    const formatBrierData = async (userObj, username) => {
        // Only executes a server query if the userObj obtained in Profile.js is undefined, so I think
        // keep it for insurance purposes as it doesn't fire otherwise
        if (userObj === null || userObj === undefined) {
            const brierData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            userObj = brierData.data[0];
        };
        let allBrierArray = [null];
        let recentBrierArray = [null];
        let averageScoreBrierArray = [null];
        let recentAverageArray = [null];
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
            averageScoreBrierArray.push(userObj.brierScores[i].averageScore);
            if (counter < 10) {
                recentBrierArray.push(userObj.brierScores[i].brierScore);
                recentLabelsArray.push(`${userObj.brierScores[i].problemName}`);
                recentAverageArray.push(userObj.brierScores[i].averageScore);
            };
            counter++;
        };
        setPlayerBestBrier(bestBrierPlayer.toFixed(0));
        setPlayerWorstBrier(worstBrierPlayer.toFixed(0));
        setPlayerAverageBrier((averageBrierPlayer/userObj.brierScores.length).toFixed(0));

        // Recent Data
        allBrierArray.push(null);
        recentBrierArray.push(null);
        averageScoreBrierArray.push(null);
        recentAverageArray.push(null);
        setRecentData(recentBrierArray.reverse());
        setRecentAverageData(recentAverageArray.reverse());
        setAllData(allBrierArray.reverse());
        setAllAverageData(averageScoreBrierArray.reverse());
        allLabelsArray.push("");
        recentLabelsArray.push("");
        setAllLabels(allLabelsArray.reverse());
        setRecentLabels(recentLabelsArray.reverse());
    };

    const recentForecastData = {
        labels: recentLabels,
        datasets: [
            {
                label: "My Scores",
                data: recentData,
                fill: false,
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                pointRadius: 4,
                borderWidth: 4
            }, {
                label: "Average Scores (All Players)",
                data: recentAverageData,
                fill: false,
                backgroundColor: "orange",
                borderColor: "orange",
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
                label: "My Scores",
                data: allData,
                fill: false,
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                pointRadius: 4,
                borderWidth: 4
            }, {
                label: "Average Scores (All Players)",
                data: allAverageData,
                fill: false,
                backgroundColor: "orange",
                borderColor: "orange",
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
                const userDoc = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
                userObj = userDoc.data[0];
            };
            setProblemsAttempted(userObj.brierScores.length || "X");
            setMarketsIn(userObj.markets.length || "X");
            setFFPoints(userObj.fantasyForecastPoints.toFixed(0) || "X");
            let onboardingCount = 0;
            Object.entries(userObj.onboarding).forEach(
                ([key, value]) => {
                    if (key !== "joinAMarket") {
                        value === true ? onboardingCount++ : onboardingCount += 0
                    }
                }
            );
            setOnboardingProgress(onboardingCount);
        } catch (error) {
            console.error("Error in ProfileStats > findUniquePlayerStats");
            console.error(error);
        };
    };

    return (
        <div className="profile-stats">
            <h2 className="profile-header">My Stats</h2>
            {isHiddenBehindLevel === true &&
                <h3>This section of your profile is locked until you reach Level 6 (600 Fantasy ForecastPoints) or you unlock the Ready To Go trophy. Complete the onboarding tasks on the Home page, submit forecasts, post to the feed and more to earn the points you need!</h3>
            }
            {isHiddenBehindLevel === false && 
                <div className="">
                    <h4>Check out your Fantasy Forecast stats and how you're stacking up to the rest of the playerbase.</h4>
                    <div className="profile-stats-inner">
                        <div className="profile-stats-recent-forecasts">
                            <br/>
                            <ul className="profile-stats-selectors">
                                <li className={selectedStats} onClick={() => { setStats(recentForecastData); setSelectedStats("selected"); setSelectedStats2("unselected")}}><h4>Recent Forecasts</h4></li>
                                <h2>|</h2>
                                <li className={selectedStats2} onClick={() => { setStats(allTimeForecastData); setSelectedStats("unselected"); setSelectedStats2("selected")}}><h4>All Forecasts</h4></li>
                            </ul>
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
                                <h4 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Best Score</h4>
                                <h4 className="oddrow">{bestGlobalBrier}</h4>
                                <h4>{worstChanged === true ? playerWorstBrier : "N/A"}</h4>
                                <h4 style={{ color: "#404d72" }}>Worst Score</h4>
                                <h4>{worstGlobalBrier}</h4>
                                <h4 className="oddrow">{isNaN(playerAverageBrier) ? "N/A" : playerAverageBrier}</h4>
                                <h4 className="oddrow" style={{backgroundColor: "rgb(250, 250, 250)", color: "#404d72" }}>Average Score</h4>
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
                                <h3 style={{ color: "#404d72" }}>{onboardingProgress} / 4</h3>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileStats;
