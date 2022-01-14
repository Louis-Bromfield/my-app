import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import PropTypes from 'prop-types';
import ProfileP from '../../../../media/ProfileP.png';

function Leaderboard(props) {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        getAllUserFFPoints(props.leaderboardRankings);
        console.log("Leaderboard UE");
    }, [props.leaderboardRankings, props.isFFLeaderboard, props.leaderboardTitle]);

    const getAllUserFFPoints = async (rankings) => {
        try {
            if (props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") {
                let ffRankings = [];
                for (let i = 0; i < rankings.length; i++) {
                    const userDocumentFF = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${rankings[i].username}`);

                    if (userDocumentFF.data[0].username === props.username) {
                        props.setUserInMarket(true);
                    }

                    ffRankings[i] = {};
                    ffRankings[i].profilePicture = userDocumentFF.data[0].profilePicture;
                    ffRankings[i].username = rankings[i].username;
                    ffRankings[i].marketPoints = 0;
                    ffRankings[i].marketPoints = userDocumentFF.data[0].fantasyForecastPoints;
                    ffRankings[i].brierScores = [];
                    ffRankings[i].brierScores = userDocumentFF.data[0].brierScores;
                    let totalBrierForUser = 0;
                    for (let j = 0; j < userDocumentFF.data[0].brierScores.length; j++) {
                        totalBrierForUser += userDocumentFF.data[0].brierScores[j].brierScore;
                    }
                    // ffRankings[i].avgAllTimeBrier = (totalBrierForUser / userDocumentFF.data[0].brierScores.length);
                    let avgAllTimeBrier = (totalBrierForUser / userDocumentFF.data[0].brierScores.length);
                    if (isNaN(avgAllTimeBrier)) {
                        ffRankings[i].avgAllTimeBrier = 0.0
                    } else {
                        ffRankings[i].avgAllTimeBrier = avgAllTimeBrier;
                    };
                };
                ffRankings = ffRankings.sort((a, b) => b.marketPoints - a.marketPoints);
                // props.setAverageBrier(totalAverageBrier / rankings.length);
                setUsersData(ffRankings);
                return;
            };
            let totalAverageBrier = 0;
            for (let i = 0; i < rankings.length; i++) {
                const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${rankings[i].username}`);

                if (userDocument.data[0].username === props.username) {
                    props.setUserInMarket(true);
                }

                if (props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") {
                    rankings[i].marketPoints = userDocument.data[0].fantasyForecastPoints;
                };
                rankings[i].brierScores = [];
                let totalBrier = 0;
                let numberOfBriersInThisMarket = 0;
                if (userDocument.data[0].brierScores.length > 0) {
                    for (let j = 0; j < userDocument.data[0].brierScores.length; j++) {
                        if (userDocument.data[0].brierScores[j].marketName === props.leaderboardTitle || userDocument.data[0].brierScores[j].marketName === localStorage.getItem('currentLeaderboardName')) {
                            numberOfBriersInThisMarket++;
                            rankings[i].brierScores.push(userDocument.data[0].brierScores[j].brierScore);
                            totalBrier += userDocument.data[0].brierScores[j].brierScore;
                        };
                    };
                };
                // rankings[i].brierScores.reverse();
                if (userDocument.data[0].brierScores.length === 0) {
                    rankings[i].avgBrierScore = 0;
                } else {
                    let avgBrierScore = totalBrier / numberOfBriersInThisMarket;
                    if (isNaN(avgBrierScore)) {
                        rankings[i].avgBrierScore = 0.0;
                    } else if (!isNaN(avgBrierScore)) {
                        rankings[i].avgBrierScore = totalBrier / numberOfBriersInThisMarket;
                    }
                    totalAverageBrier += (totalBrier / userDocument.data[0].brierScores.length);
                };
                rankings = rankings.sort((a, b) => b.marketPoints - a.marketPoints);
            };
            props.setAverageBrier(totalAverageBrier / rankings.length);
            setUsersData(rankings);
            if (rankings.find(el => el.username === props.username) !== undefined) {
                props.setUserInMarket(true);
            };
        } catch (error) {
            console.error("Error in Leaderboard > getAllUserFFPoints");
            console.error(error);
        }
    };

    return (
        <div className="leaderboard">
            <table className="leaderboard-table">
            {(props.isFFLeaderboard === false || props.leaderboardTitle !== "Fantasy Forecast All-Time") &&
                <tbody>
                    {console.log("Here1")}
                    <tr className="leaderboard-title-row">
                        <th className="position-column">#</th>
                        <th className="username-column">Username</th>
                        <th className="ffpoints-column">Market Points</th>
                        <th className="avg-brier-column">Average Brier Score</th>
                        <th className="last-five-briers-column">Last 5 Forecasts (&nbsp;&nbsp;/110&nbsp;&nbsp;)</th>
                    </tr>
                    {usersData.map((item, index) => {
                        if (item.username === props.username) {
                            return (
                                <tr className="leaderboard-row-matching-username" key={index}>
                                    <td className="leaderboard-rank-data">{index+1}</td>
                                    <td className="leaderboard-username-data">
                                        <img src={item.profilePicture || ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                                        {item.username}
                                    </td>
                                    <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                    <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                    <td className="leaderboard-last5Forecasts-data">
                                        <span className="last-five-data-span">
                                            {item.brierScores.map((item2, index) => {
                                                if (index >= item.brierScores.length - 5) {
                                                    return (
                                                        <h4 
                                                            key={index} 
                                                            className="last-five-data-single-result">
                                                                &nbsp;&nbsp;{Number(item2).toFixed(1)}&nbsp;&nbsp;
                                                        </h4> 
                                                    )
                                                } else return null;
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            )
                        } else if (item.username !== props.username && item.acceptedInvite === true) {
                            return (
                                <tr className="leaderboard-row" key={index}>
                                    <td className="leaderboard-rank-data">{index+1}</td>
                                    <td className="leaderboard-username-data">
                                        <img src={item.profilePicture || ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                                        {item.username}
                                    </td>
                                    <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                    <td className="leaderboard-avgBrierScore-data">{Number(item.avgBrierScore).toFixed(1)}</td>
                                    <td className="leaderboard-last5Forecasts-data">
                                        <span className="last-five-data-span">
                                            {item.brierScores.map((item2, index) => {
                                                if (index >= item.brierScores.length - 5) {
                                                    return (
                                                        <h4 
                                                            key={index} 
                                                            className="last-five-data-single-result">
                                                                &nbsp;&nbsp;{Number(item2).toFixed(1)}&nbsp;&nbsp;
                                                        </h4> 
                                                    )
                                                } else return null;
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            )
                        }
                        else return null;
                    })
                    // : props.leaderboardRankings.map((item, index) => {
                    //     if (item.username === props.username) {
                    //         return (
                    //             <tr className="leaderboard-row-matching-username" key={index}>
                    //                 <td className="leaderboard-rank-data">{index+1}</td>
                    //                 <td className="leaderboard-username-data">
                    //                     <img src={ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                    //                     {item.username}
                    //                 </td>
                    //                 <td className="leaderboard-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                    //                 <td className="leaderboard-avgBrierScore-data">{item.avgBrierScore}</td>
                    //                 <td className="leaderboard-last5Forecasts-data">[Insert Scores Here]</td>
                    //             </tr>
                    //         )
                    //     } else if (item.username !== props.username && item.acceptedInvite === true) {
                    //         return (
                    //             <tr className="leaderboard-row" key={index}>
                    //                 <td className="leaderboard-rank-data">{index+1}</td>
                    //                 <td className="leaderboard-username-data">
                    //                     <img src={ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                    //                     {item.username}
                    //                 </td>
                    //                 <td className="leaderboard-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                    //                 <td className="leaderboard-avgBrierScore-data">{item.avgBrierScore}</td>
                    //                 <td className="leaderboard-last5Forecasts-data">[Insert Scores Here]</td>
                    //             </tr>
                    //         )
                    //     }
                    //     else return null;
                    // })
                    }
                </tbody>
                }
                {(props.isFFLeaderboard === false || props.leaderboardTitle === "Fantasy Forecast All-Time") &&
                <tbody>
                    {console.log("Here2")}
                    <tr className="leaderboard-title-row">
                        <th className="position-column">#</th>
                        <th className="username-column">Username</th>
                        <th className="ffpoints-column">Fantasy Forecast Points</th>
                        <th className="avg-brier-column">AVG Brier Score (All Markets)</th>
                        <th className="last-five-briers-column">Last 5 Forecasts (All Markets)</th>
                    </tr>
                    {usersData.map((item, index) => {
                        if (item.username === props.username) {
                            return (
                                <tr className="leaderboard-row-matching-username" key={index}>
                                    <td className="leaderboard-rank-data">{index+1}</td>
                                    <td className="leaderboard-username-data">
                                        <img src={item.profilePicture || ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                                        {item.username}
                                    </td>
                                    <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                    <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                    <td className="leaderboard-last5Forecasts-data">
                                        <span className="last-five-data-span">
                                            {item.brierScores.map((item2, index) => {
                                                if (index >= item.brierScores.length - 5) {
                                                    return (
                                                        <h4 
                                                            key={index} 
                                                            className="last-five-data-single-result">
                                                                &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                        </h4> 
                                                    )
                                                } else return null;
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            )
                        } else if (item.username !== props.username) {
                            return (
                                <tr className="leaderboard-row" key={index}>
                                    <td className="leaderboard-rank-data">{index+1}</td>
                                    <td className="leaderboard-username-data">
                                        <img src={item.profilePicture || ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                                        {item.username}
                                    </td>
                                    <td className="leaderboard-ffPoints-data">{Number(item.marketPoints).toFixed(0)}</td>
                                    <td className="leaderboard-avgBrierScore-data">{Number(item.avgAllTimeBrier).toFixed(1)}</td>
                                    <td className="leaderboard-last5Forecasts-data">
                                        <span className="last-five-data-span">
                                            {item.brierScores.map((item2, index) => {
                                                if (index >= item.brierScores.length - 5) {
                                                    return (
                                                        <h4 
                                                            key={index} 
                                                            className="last-five-data-single-result">
                                                                &nbsp;&nbsp;{Number(item2.brierScore).toFixed(1)}&nbsp;&nbsp;
                                                        </h4> 
                                                    )
                                                } else return null;
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            )
                        }
                        else return null;
                    })
                    // : props.leaderboardRankings.map((item, index) => {
                    //     if (item.username === props.username) {
                    //         return (
                    //             <tr className="leaderboard-row-matching-username" key={index}>
                    //                 <td className="leaderboard-rank-data">{index+1}</td>
                    //                 <td className="leaderboard-username-data">
                    //                     <img src={ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                    //                     {item.username}
                    //                 </td>
                    //                 <td className="leaderboard-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                    //                 <td className="leaderboard-avgBrierScore-data">{item.avgBrierScore}</td>
                    //                 <td className="leaderboard-last5Forecasts-data">[Insert Scores Here]</td>
                    //             </tr>
                    //         )
                    //     } else if (item.username !== props.username && item.acceptedInvite === true) {
                    //         return (
                    //             <tr className="leaderboard-row" key={index}>
                    //                 <td className="leaderboard-rank-data">{index+1}</td>
                    //                 <td className="leaderboard-username-data">
                    //                     <img src={ProfileP} alt="Mini user profile pic" className="leaderboards-profile-pic"/>
                    //                     {item.username}
                    //                 </td>
                    //                 <td className="leaderboard-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                    //                 <td className="leaderboard-avgBrierScore-data">{item.avgBrierScore}</td>
                    //                 <td className="leaderboard-last5Forecasts-data">[Insert Scores Here]</td>
                    //             </tr>
                    //         )
                    //     }
                    //     else return null;
                    // })
                    }
                </tbody>
                }
            </table>
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