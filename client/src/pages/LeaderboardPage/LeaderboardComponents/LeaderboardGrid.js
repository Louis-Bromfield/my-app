import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LeaderboardGrid.css';
import PropTypes from 'prop-types';
import LeaderboardShortcut from './LeaderboardShortcut';

function LeaderboardGrid(props) {
    
    useEffect(() => {
    }, [props])

    return (
        <div>
            <div className="leaderboard-grid">
                {props.user === true && props.markets.map((item, index) => {  
                    const leaderboardProps = {
                        pathname: "/leaderboard",
                        leaderboardName: item,
                        navigationOrderUnsorted: props.markets,
                        username: props.username,
                        user: true
                    };
                    return (
                        <Link 
                            key={index} 
                            to={leaderboardProps} 
                            className="your-markets-leaderboards">
                                <LeaderboardShortcut name={item} className="leaderboard-shortcut"/>
                        </Link>
                    )
                })}
                {props.user === false && props.markets.map((item, index) => {
                        const leaderboardProps = {
                            pathname: "/leaderboard",
                            leaderboardName: item,
                            navigationOrderUnsorted: props.markets,
                            username: props.username,
                            user: false
                        };
                        return (
                            <Link 
                                key={index} 
                                to={leaderboardProps}
                                className="all-markets-leaderboards">
                                    <LeaderboardShortcut name={item} className="leaderboard-shortcut-blue"/>
                            </Link>
                        )
                })}
            </div>
        </div>
    )
}

export default LeaderboardGrid;


LeaderboardGrid.propTypes = {
    user: PropTypes.bool.isRequired
};