import React, { useState, useEffect } from 'react';
import './ForecastMarketLeaderboard.css';

function ForecastMarketLeaderboard(props) {
    const [start, setStart] = useState(0);
    const [finish, setFinish] = useState(0);

    useEffect(() => {
        findUserRank(props.leaderboard, props.username, start, finish);
    });

    const findUserRank = (leaderboard, username) => {
        let rank = 0;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].username === username) {
                rank = i;
                break;
            };
        };
        if (rank === 0 || rank === 1 || rank === 2) {
            setStart(0);
            setFinish(5);
            return;
        } else if (leaderboard.length - rank <= 2) {
            setStart(leaderboard.length - 5 < 0 ? 0 : leaderboard.length - 5);
            setFinish(leaderboard.length);
        } else {
            setStart(rank - 2);
            setFinish(rank + 3);
        };
    };

    return (
        <div className="leaderboard-snapshot">
            <h2 className="leaderboard-title">Leaderboard Snapshot</h2>
            <table className="leaderboard-snapshot-table">
                <tbody>
                    <tr className="leaderboard-snapshot-title-row">
                        <th className="snapshot-position-column">#</th>
                        <th className="snapshot-username-column">Username</th>
                        <th className="snapshot-ffpoints-column">Market Points</th>
                    </tr>
                    {props.leaderboard.slice(start, finish).map((item, index) => {
                        if (item.username !== "Guest") {
                            if (item.username === props.username) {
                                return (
                                    <tr key={index+1} className="leaderboard-snapshot-row-matching-username">
                                        <td className="leaderboard-snapshot-rank-data">{index+start+1}</td>
                                        <td className="leaderboard-snapshot-username-data">{item.username}</td>
                                        <td className="leaderboard-snapshot-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr key={index+1} className="leaderboard-snapshot-row">
                                        <td className="leaderboard-snapshot-rank-data">{index+start+1}</td>
                                        <td className="leaderboard-snapshot-username-data">{item.username}</td>
                                        <td className="leaderboard-snapshot-ffPoints-data">{item.marketPoints.toFixed(0)}</td>
                                    </tr>
                                )
                            }
                        }
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ForecastMarketLeaderboard;
