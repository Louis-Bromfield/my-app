import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import PropTypes from 'prop-types';
import ProfileP from '../../../../media/ProfileP.png';
import ToolTip from "@material-ui/core/Tooltip";
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

function Leaderboard(props) {
    const [usersData, setUsersData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth >= 600);
    const [biggerWidth, setBiggerWidth] = useState(window.innerWidth >= 1030);
    const [loading, setLoading] = useState(true);
    const [usernameSortOrder, setUsernameSortOrder] = useState("");
    const [pointsSortOrder, setPointsSortOrder] = useState("");
    const [avgBrierScoreSortOrder, setAvgBrierScoreSortOrder] = useState("");
    const [avgAllTimeBrierScoreSortOrder, setAvgAllTimeBrierScoreSortOrder] = useState("");

    const updateWidth = () => {
        setWidth(window.innerWidth >= 600);
        setBiggerWidth(window.innerWidth >= 1030);
    };

    useEffect(() => {
        setLoading(true);
        if (props.leaderboardRankings.length > 0) {
            getAllUserFFPoints(props.leaderboardRankings);
        };
        console.log("Leaderboard UE");
        setWidth(window.innerWidth > 600);
        setBiggerWidth(window.innerWidth > 1030);
        window.addEventListener("resize", updateWidth);
        return () => window.addEventListener("resize", updateWidth);
    }, [props.leaderboardRankings]);

    // Refactored version, approx 20 lines less code, takes about 4.5 seconds (down from 5.5)
    const getAllUserFFPoints = async (rankings) => {
        try {
            let ffRankings = [];
            for (let i = 0; i < rankings.length; i++) {
                if (rankings[i].username !== "Guest") {
                    if (rankings[i].markets.includes(props.leaderboardTitle)) {
                        if (props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") {
                            ffRankings[i] = {
                                profilePicture: rankings[i].profilePicture,
                                username: rankings[i].username,
                                marketPoints: 0.0,
                                brierScores: [],
                                avgAllTimeBrier: 0.0,
                                isTeam: rankings[i].isTeam
                            };
                            ffRankings[i].profilePicture = rankings[i].profilePicture;
                            ffRankings[i].username = rankings[i].username;
                            ffRankings[i].marketPoints = rankings[i].fantasyForecastPoints;
                            ffRankings[i].brierScores = rankings[i].brierScores;
                            ffRankings[i].brierScoresForMarket = [];
                            ffRankings[i].totalBrier = 0;
                            let numberOfBriers = 0;
                            if (rankings[i].brierScores.length > 0) {
                                for (let j = 0; j < rankings[i].brierScores.length; j++) {
                                    numberOfBriers++;
                                    ffRankings[i].totalBrier += rankings[i].brierScores[j].brierScore;
                                };
                            };
                            if (rankings[i].brierScores.length === 0) {
                                ffRankings[i].avgAllTimeBrier = 0;
                            } else {
                                let avgBrierScore = ffRankings[i].totalBrier / numberOfBriers;
                                ffRankings[i].avgAllTimeBrier = isNaN(avgBrierScore) ? 0.0 : ffRankings[i].totalBrier/numberOfBriers;
                            };
                        } else {
                            rankings[i].brierScoresForMarket = [];
                            rankings[i].totalBrier = 0;
                            let numberOfBriersInThisMarket = 0;
                            if (rankings[i].brierScores.length > 0) {
                                for (let j = 0; j < rankings[i].brierScores.length; j++) {
                                    if (rankings[i].brierScores[j].marketName === props.leaderboardTitle || rankings[i].brierScores[j].marketName === localStorage.getItem('currentLeaderboardName')) {
                                        numberOfBriersInThisMarket++;
                                        rankings[i].brierScoresForMarket.push({
                                            problemName: rankings[i].brierScores[j].problemName,
                                            brierScore: rankings[i].brierScores[j].brierScore
                                        });
                                        rankings[i].totalBrier += rankings[i].brierScores[j].brierScore;
                                    };
                                };
                            };
                            if (rankings[i].brierScores.length === 0) {
                                rankings[i].avgBrierScore = 0;
                            } else {
                                let avgBrierScore = rankings[i].totalBrier / numberOfBriersInThisMarket;
                                rankings[i].avgBrierScore = isNaN(avgBrierScore) ? 0.0 : rankings[i].totalBrier/numberOfBriersInThisMarket;
                            };
                        };
                    };
                };
            };
            // Outside of main loop:
            if (props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") {
                ffRankings = ffRankings.sort((a, b) => b.marketPoints - a.marketPoints);
                setUsersData(ffRankings);
                props.setRankingsForTop3([ffRankings[0], ffRankings[1], ffRankings[2]]);
                setLoading(false);
                return;
            } else {
                rankings = rankings.sort((a, b) => b.totalBrier - a.totalBrier);
                setUsersData(rankings);
                if (rankings.find(el => el.username === props.username) !== undefined) {
                    props.setUserInMarket(true);
                };
                props.setRankingsForTop3([rankings[0], rankings[1], rankings[2]]);
                setLoading(false);
            };
        } catch (error) {
          console.error("Error in Leaderboard > getAllUserFFPoints");
          console.error(error);
        };
      };

    let numOfConsecutiveSameIndices = 0;

    const sortByCol = (sort) => {
        setLoading(true);
        let newSortedData = [];
        if (sort === "Username") {
            if (usernameSortOrder === "" || usernameSortOrder === "ZA") {
                newSortedData = usersData.sort((a, b) => (a.username > b.username) ? 1: ((b.username > a.username) ? -1 : 0));
                setUsernameSortOrder("AZ");
            } else if (usernameSortOrder === "AZ") {
                newSortedData = usersData.sort((a, b) => (b.username > a.username) ? 1: ((a.username > b.username) ? -1 : 0));
                setUsernameSortOrder("ZA");
            };
        } else if (sort === "Market Points") {
            if (pointsSortOrder === "" || pointsSortOrder === "9-0") {
                newSortedData = usersData.sort((a, b) => (a.totalBrier < b.totalBrier) ? 1: ((b.totalBrier < a.totalBrier) ? -1 : 0));
                setPointsSortOrder("0-9");
            } else if (pointsSortOrder === "0-9") {
                newSortedData = usersData.sort((a, b) => (b.totalBrier < a.totalBrier) ? 1: ((a.totalBrier < b.totalBrier) ? -1 : 0));
                setPointsSortOrder("9-0");
            }
        } else if (sort === "Fantasy Forecast Points") {
            if (pointsSortOrder === "" || pointsSortOrder === "9-0") {
                newSortedData = usersData.sort((a, b) => (a.marketPoints < b.marketPoints) ? 1: ((b.marketPoints < a.marketPoints) ? -1 : 0));
                setPointsSortOrder("0-9")
            } else if (pointsSortOrder === "0-9") {
                newSortedData = usersData.sort((a, b) => (b.marketPoints < a.marketPoints) ? 1: ((a.marketPoints < b.marketPoints) ? -1 : 0));
                setPointsSortOrder("9-0")
            }
        } else if (sort === "Avg Brier Score") {
            if (avgBrierScoreSortOrder === "" || avgBrierScoreSortOrder === "9-0") {
                newSortedData = usersData.sort((a, b) => (a.avgBrierScore < b.avgBrierScore) ? 1: ((b.avgBrierScore < a.avgBrierScore) ? -1 : 0));
                setAvgBrierScoreSortOrder("0-9");
            } else if (avgBrierScoreSortOrder === "0-9") {
                newSortedData = usersData.sort((a, b) => (b.avgBrierScore < a.avgBrierScore) ? 1: ((a.avgBrierScore < b.avgBrierScore) ? -1 : 0));
                setAvgBrierScoreSortOrder("9-0");
            };
        } else if (sort === "Avg Brier Score (All Markets)") {
            if (avgAllTimeBrierScoreSortOrder === "" || avgAllTimeBrierScoreSortOrder === "9-0") {
                newSortedData = usersData.sort((a, b) => (a.avgAllTimeBrier < b.avgAllTimeBrier) ? 1: ((b.avgAllTimeBrier < a.avgAllTimeBrier) ? -1 : 0));
                setAvgAllTimeBrierScoreSortOrder("0-9");
            } else if (avgAllTimeBrierScoreSortOrder === "0-9") {
                newSortedData = usersData.sort((a, b) => (b.avgAllTimeBrier < a.avgAllTimeBrier) ? 1: ((a.avgAllTimeBrier < b.avgAllTimeBrier) ? -1 : 0));
                setAvgAllTimeBrierScoreSortOrder("9-0");
            };
        };
        setUsersData([...newSortedData]);
        setLoading(false);
    };

    return (
        <div className="leaderboard">
            {loading === true && 
                <div className="leaderboard-loading-container">
                    <h3>Loading market data...</h3>
                    <ReactLoading type="bars" color="#404d72" height="10%" width="10%" />
                </div>
            }
            {loading === false &&
                <table className="leaderboard-table">
                    {(props.isFFLeaderboard === true && props.leaderboardTitle !== "Fantasy Forecast All-Time") &&
                        <tbody>
                            <tr className="leaderboard-title-row">
                                <th className="position-column">#</th>
                                <th className="username-column" onClick={() => sortByCol("Username")} style={{ cursor: "pointer" }}>Username</th>
                                <th className="ffpoints-column" onClick={() => sortByCol("Market Points")} style={{ cursor: "pointer" }}>Market Points</th>
                                <th className="avg-brier-column" onClick={() => sortByCol("Avg Brier Score")} style={{ cursor: "pointer" }}>Average Brier Score</th>
                                {width && <th className="last-five-briers-column">Last 6 Forecasts (&nbsp;&nbsp;/110&nbsp;&nbsp;)</th>}
                            </tr>
                            {usersData.map((item, index) => {
                                if (props.leaderboardFilter === "all") {
                                    if (item.username === props.username) {
                                        if (item.username === "admin" || item.username === "Guest") return null;
                                        return (
                                            <tr className="leaderboard-row-matching-username" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.totalBrier === usersData[index-1].totalBrier) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    <Link 
                                                        to={{pathname: "/my-profile"}}
                                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                        style={{ textDecoration: "none", color: "#fff"}}>
                                                            {item.isTeam === true ? `${item.username} (T)` : item.username}
                                                    </Link>
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{isNaN(Number(item.totalBrier).toFixed(0)) ? 0.0 : Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{isNaN(Number(item.avgBrierScore).toFixed(1)) ? 0.0 : Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    } else if (item.username !== props.username) {
                                        if (item.username === "admin" || item.username === "Guest") return null;
                                        return (
                                            <tr className="leaderboard-row" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.totalBrier === usersData[index-1].totalBrier) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    <Link 
                                                        to={{pathname: "/search", clickedUsername: item.username}}
                                                        onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                        style={{ textDecoration: "none", color: "black"}}>
                                                            {item.isTeam === true ? `${item.username} (T)` : item.username}
                                                    </Link>
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{isNaN(Number(item.totalBrier).toFixed(0)) ? 0.0 : Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{isNaN(Number(item.avgBrierScore).toFixed(1)) ? 0.0 : Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                    {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    }
                                    else return null;
                                } else if (props.leaderboardFilter === "solo") {
                                    if (item.username === "admin" || item.username === "Guest") return null;
                                    if (item.username === props.username && item.isTeam === false) {
                                        return (
                                            <tr className="leaderboard-row-matching-username" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    } else if (item.username !== props.username && item.isTeam === false) {
                                        return (
                                            <tr className="leaderboard-row" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    }
                                    else return null;
                                } else if (props.leaderboardFilter === "teams") {
                                    if (item.username === "admin" || item.username === "Guest") return null;
                                    if (item.username === props.username && item.isTeam === true) {
                                        return (
                                            <tr className="leaderboard-row-matching-username" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    } else if (item.username !== props.username && item.isTeam === true) {
                                        return (
                                            <tr className="leaderboard-row" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.totalBrier).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScoresForMarket.map((item2, index) => {
                                                            return (
                                                                <ToolTip title={item2.problemName} key={index}>
                                                                    <h4 className="last-five-data-single-result">
                                                                        &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                    </h4>
                                                                </ToolTip>
                                                            )
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    }
                                    else return null;
                                }
                                else return null;
                            })}
                        </tbody>
                    }
                    {(props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") &&
                        <tbody>
                            <tr className="leaderboard-title-row">
                                <th className="position-column">#</th>
                                <th className="username-column" onClick={() => sortByCol("Username")} style={{ cursor: "pointer" }}>Username</th>
                                <th className="ffpoints-column" onClick={() => sortByCol("Fantasy Forecast Points")} style={{ cursor: "pointer" }}>Fantasy Forecast Points</th>
                                <th className="avg-brier-column" onClick={() => sortByCol("Avg Brier Score (All Markets)")} style={{ cursor: "pointer" }}>AVG Brier Score (All Markets)</th>
                                {width && <th className="last-five-briers-column">Last 6 Forecasts (All Markets)</th>}
                            </tr>
                            {usersData.map((item, index) => {
                                if (item.username === "admin" || item.username === "Guest") return null;
                                    if (props.leaderboardFilter === "all") {
                                        if (item.username === props.username) {
                                            return (
                                                <tr className="leaderboard-row-matching-username" key={index}>
                                                    <td className="leaderboard-rank-data">
                                                        {(() => {
                                                            if (index === 0) {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            } else {
                                                                if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                    numOfConsecutiveSameIndices++;
                                                                    return (index+1) - numOfConsecutiveSameIndices;
                                                                } else {
                                                                    numOfConsecutiveSameIndices = 0;
                                                                    return index+1;
                                                                }
                                                            }
                                                        })()}
                                                    </td>
                                                    <td className="leaderboard-username-data">
                                                        {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" style={{border: (item.marketPoints < 1500) ? "none" : (item.marketPoints >= 1500 && item.marketPoints < 2000) ? "2px solid rgb(205, 127, 50)" : (item.marketPoints >= 2000 && item.marketPoints < 2500 ? "2px solid silver" : (item.marketPoints >= 2500 && item.marketPoints < 5000) ? "2px solid goldenrod" : "2px solid #383D67")}}/>}
                                                        <Link 
                                                            to={{pathname: "/my-profile"}}
                                                            onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                            style={{ textDecoration: "none", color: "#fff"}}>
                                                                <p>{item.isTeam === true ? `${item.username} (T)` : item.username}</p>
                                                        </Link>
                                                    </td>
                                                    <td className="leaderboard-ffPoints-data">{isNaN(Number(item.marketPoints).toFixed(0)) ? 0.0 : Number(item.marketPoints).toFixed(0)}</td>
                                                    <td className="leaderboard-avgBrierScore-data">{isNaN(Number(item.avgAllTimeBrier).toFixed(1)) ? 0.0 : Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                    {width && <td className="leaderboard-last5Forecasts-data">
                                                        <span className="last-five-data-span">
                                                            {item.brierScores.map((item2, index) => {
                                                                if (index >= item.brierScores.length - 6) {
                                                                    return (
                                                                        <ToolTip title={item2.problemName} key={index}>
                                                                            <h4 className="last-five-data-single-result">
                                                                                &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                            </h4>
                                                                        </ToolTip>
                                                                    )
                                                                } else return null;
                                                            })}
                                                        </span>
                                                    </td>}
                                                </tr>
                                            )
                                        } else if (item.username !== props.username) {
                                            return (
                                                <tr className="leaderboard-row" key={index}>
                                                    <td className="leaderboard-rank-data">
                                                        {(() => {
                                                            if (index === 0) {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            } else {
                                                                if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                    numOfConsecutiveSameIndices++;
                                                                    return (index+1) - numOfConsecutiveSameIndices;
                                                                } else {
                                                                    numOfConsecutiveSameIndices = 0;
                                                                    return index+1;
                                                                }
                                                            }
                                                        })()}
                                                    </td>
                                                    <td className="leaderboard-username-data">
                                                        {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" style={{border: (item.marketPoints < 1500) ? "none" : (item.marketPoints >= 1500 && item.marketPoints < 2000) ? "2px solid rgb(205, 127, 50)" : (item.marketPoints >= 2000 && item.marketPoints < 2500 ? "2px solid silver" : (item.marketPoints >= 2500 && item.marketPoints < 5000) ? "2px solid goldenrod" : "2px solid #383D67")}}/>}
                                                        <Link 
                                                            to={{pathname: "/search", clickedUsername: item.username}}
                                                            onClick={() => localStorage.setItem("selectedPage", "Search")}
                                                            style={{ textDecoration: "none", color: "black"}}>
                                                                <p>{item.isTeam === true ? `${item.username} (T)` : item.username}</p>
                                                        </Link>
                                                    </td>
                                                    <td className="leaderboard-ffPoints-data">{isNaN(Number(item.marketPoints).toFixed(0)) ? 0.0 : Number(item.marketPoints).toFixed(0)}</td>
                                                    <td className="leaderboard-avgBrierScore-data">{isNaN(Number(item.avgAllTimeBrier).toFixed(1)) ? 0.0 : Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                    {width && <td className="leaderboard-last5Forecasts-data">
                                                        <span className="last-five-data-span">
                                                            {item.brierScores.map((item2, index) => {
                                                                if (index >= item.brierScores.length - 6) {
                                                                    return (
                                                                        <ToolTip title={item2.problemName} key={index}>
                                                                            <h4 className="last-five-data-single-result">
                                                                                &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                            </h4>
                                                                        </ToolTip>
                                                                    )
                                                                } else return null;
                                                            })}
                                                        </span>
                                                    </td>}
                                                </tr>
                                            )
                                        }
                                    else return null;
                                } else if (props.leaderboardFilter === "solo") {
                                    if (item.username === props.username && item.isTeam === false) {
                                        return (
                                            <tr className="leaderboard-row-matching-username" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScores.map((item2, index) => {
                                                            if (index >= item.brierScores.length - 6) {
                                                                return (
                                                                    <ToolTip title={item2.problemName} key={index}>
                                                                        <h4 className="last-five-data-single-result">
                                                                            &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                        </h4>
                                                                    </ToolTip>
                                                                )
                                                            } else return null;
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    } else if (item.username !== props.username && item.isTeam === false) {
                                        return (
                                            <tr className="leaderboard-row" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScores.map((item2, index) => {
                                                            if (index >= item.brierScores.length - 6) {
                                                                return (
                                                                    <ToolTip title={item2.problemName} key={index}>
                                                                        <h4 className="last-five-data-single-result">
                                                                            &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                        </h4>
                                                                    </ToolTip>
                                                                )
                                                            } else return null;
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    }
                                    else return null;
                                } else if (props.leaderboardFilter === "teams") {
                                    if ((item.username === props.username) && item.isTeam === true) {
                                        return (
                                            <tr className="leaderboard-row-matching-username" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScores.map((item2, index) => {
                                                            if (index >= item.brierScores.length - 6) {
                                                                return (
                                                                    <ToolTip title={item2.problemName} key={index}>
                                                                        <h4 className="last-five-data-single-result">
                                                                            &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                        </h4>
                                                                    </ToolTip>
                                                                )
                                                            } else return null;
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    } else if ((item.username !== props.username) && item.isTeam === true) {
                                        return (
                                            <tr className="leaderboard-row" key={index}>
                                                <td className="leaderboard-rank-data">
                                                    {(() => {
                                                        if (index === 0) {
                                                            numOfConsecutiveSameIndices = 0;
                                                            return index+1;
                                                        } else {
                                                            if (item.marketPoints === usersData[index-1].marketPoints) {
                                                                numOfConsecutiveSameIndices++;
                                                                return (index+1) - numOfConsecutiveSameIndices;
                                                            } else {
                                                                numOfConsecutiveSameIndices = 0;
                                                                return index+1;
                                                            }
                                                        }
                                                    })()}
                                                </td>
                                                <td className="leaderboard-username-data">
                                                    {biggerWidth && <img src={item.profilePicture || ProfileP} className="leaderboards-profile-pic" />}
                                                    {item.username}
                                                </td>
                                                <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                                <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                                {width && <td className="leaderboard-last5Forecasts-data">
                                                    <span className="last-five-data-span">
                                                        {item.brierScores.map((item2, index) => {
                                                            if (index >= item.brierScores.length - 6) {
                                                                return (
                                                                    <ToolTip title={item2.problemName} key={index}>
                                                                        <h4 className="last-five-data-single-result">
                                                                            &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                                        </h4>
                                                                    </ToolTip>
                                                                )
                                                            } else return null;
                                                        })}
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    }
                                    else return null;
                                }
                                else return null;
                            })}
                        </tbody>
                    } 
                </table>
            }
        </div>
    )
}

export default Leaderboard;

Leaderboard.propTypes = {
    rank: PropTypes.string,
    username: PropTypes.string,
    ffPoints: PropTypes.number,
    avgBrierScore: PropTypes.number
};