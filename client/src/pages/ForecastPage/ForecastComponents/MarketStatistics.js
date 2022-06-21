import React, { useState, useEffect } from 'react';
import './MarketStatistics.css';

function MarketStatistics(props) {
    const [forecasterCount, setForecasterCount] = useState(0);
    const [marketLeader, setMarketLeader] = useState("");
    const [userRank, setUserRank] = useState(0);

    useEffect(() => {
        console.log(props);
        setForecasterCount(props.leaderboard.length);
        setMarketLeader(props.leaderboard[0].username.length > 9 ? `${props.leaderboard[0].username.slice(0, 9)}...` : props.leaderboard[0].username);
        for (let i = 0; i < props.leaderboard.length; i++) {
            if (props.leaderboard[i].username === props.username) {
                setUserRank(`${i+1} / ${props.leaderboard.length}`);
            };
        };
        console.log("Market Statistics UE");
    }, [props.leaderboard, props.username, props.refresh]);

    return (
        <div className="market-statistics">
            <h2 className="market-statistics-title">Market Statistics</h2>
            <div className="market-statistics-grid">
                <div className="market-statistics-grid-row-odd">
                    <h3>Market:</h3>
                    <h3>{props.market}</h3>
                </div>
                <div className="market-statistics-grid-row-even">
                    <h3># of Forecasters:</h3>
                    <h3>{forecasterCount}</h3>
                </div>
                <div className="market-statistics-grid-row-odd">
                    <h3>Market Leader:</h3>
                    <h3>{marketLeader}</h3>
                </div>
                <div className="market-statistics-grid-row-even">
                    <h3>Your Rank:</h3>
                    <h3>{userRank}</h3>
                </div>
            </div>
        </div>
    )
}

export default MarketStatistics;
