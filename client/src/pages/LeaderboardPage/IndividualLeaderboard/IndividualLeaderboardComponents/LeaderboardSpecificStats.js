import React from 'react';
import './LeaderboardSpecificStats.css';

function LeaderboardSpecificStats(props) {
    return (
        <div className="leaderboard-stats">
            <h1 className="leaderboard-stats-title">Leaderboard-Specific Stats</h1>
            <hr/>
            <ul className="leaderboard-stats-list">
                {(props.isFFLeaderboard === true && props.leaderboardTitle !== "Fantasy Forecast All-Time") &&
                    <li><strong>Average Brier Score: </strong>{props.averageBrier.toFixed(1)}</li>
                }
                <li><strong># of Forecasters: </strong>{props.numberOfForecasters}</li>
            </ul>
        </div>
    )
}

export default LeaderboardSpecificStats;
