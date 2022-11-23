import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ForecastResults.css';
import ReactLoading from 'react-loading';

function ForecastResults(props) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Forecast Results UE2");
        console.log(props);
        // async function doEffect() {
            if (props.isClosed === true) {
            setLoading(true);
            // get all users
            // const allUsers = await getAllUsers();
            // scrape all users for those names that appear in the leaderboard
            // findAllScores(allUsers, props.problemName);
            pullAllScores(props.selectedForecast.problemName);
        // };
        setTimeout(() => {
            setLoading(false);
        }, 500);
        };
        // doEffect();
    }, [props.problemName, props.isClosed]);

    const pullAllScores = async (problemName) => {
        try {
            const resultsFromDB = await axios.get(`${process.env.REACT_APP_API_CALL_U}/getIndividualProblemResults/${problemName}`);
            setResults(resultsFromDB.data);      
        } catch (err) {
            console.error("Error in ForecastResults > pullAllScores");
            console.error(err);
        };
    };

    // const getAllUsers = async () => {
    //     try {
    //         const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}`);
    //         return userDocument.data;
    //     } catch (err) {
    //         console.error("Error in ForecastResults > getAllUsers");
    //         console.error(err);
    //         return {};
    //     };
    // };

    // const findAllScores = (users, problemName) => {
    //     let problemLeaderboard = [];
    //     if (users === {}) {
    //         setResults([]);
    //         return;
    //     };

    //     for (let i = 0; i < users.length; i++) {
    //         for (let j = 0; j < users[i].brierScores.length; j++) {
    //             if (users[i].brierScores[j].problemName === problemName) {
    //                 problemLeaderboard.push({
    //                     username: users[i].username,
    //                     score: Number(users[i].brierScores[j].brierScore.toFixed(2))
    //                 });
    //             };
    //         };
    //     };
    //     const sortedLeaderboard = problemLeaderboard.sort((a, b) => b.score - a.score);
    //     setResults(sortedLeaderboard);
    // };

    return (
        <div className="forecast-results">
            {/* <h2 className="forecast-results-title">Forecast Results</h2> */}
            <div className="show-div">
                <h4>Here's a breakdown of how everyone who attempted this problem fared.</h4>
                <table className="forecast-results-table">
                    <tbody>
                        <tr className="table-title-row">
                            <th><h3>#</h3></th>
                            <th><h3>Username</h3></th>
                            <th><h3>Score</h3></th>
                        </tr>
                        {results.map((item, index) => {
                            if (item.username === props.username) {
                                return (
                                    <tr
                                        key={item.username}
                                        className="forecast-results-matching-username-row">
                                            <td><h3>{index+1}</h3></td>
                                            <td><h3>{item.username}</h3></td>
                                            <td><h3>{item.score}</h3></td>
                                    </tr>
                                )
                            } else if (index % 2 === 0) {
                                return (
                                    <tr
                                        key={item.username}
                                        className="forecast-results-even-row">
                                            <td><h3>{index+1}</h3></td>
                                            <td><h3>{item.username}</h3></td>
                                            <td><h3>{item.score}</h3></td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr
                                        key={item.username}
                                        className="forecast-results-odd-row">
                                            <td><h3>{index+1}</h3></td>
                                            <td><h3>{item.username}</h3></td>
                                            <td><h3>{item.score}</h3></td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
            {/* </div>} */}
            </div>
        </div>
    )
}

export default ForecastResults;