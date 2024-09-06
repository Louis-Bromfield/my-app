import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ForecastResults.css';

function ForecastResults(props) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log("Forecast Results UE2");
        if (props.selectedForecast.isClosed === true) {
            pullAllScores(props.selectedForecast.problemName);
        };
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

    return (
        <div className="forecast-results">
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
            </div>
        </div>
    )
}

export default ForecastResults;