import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LeaderboardGrid.css';
import PropTypes from 'prop-types';
import LeaderboardShortcut from './LeaderboardShortcut';

function LeaderboardGrid(props) {
    
    useEffect(() => {
        console.log(props);
    }, [props])

    return (
        <div>
            <div className="leaderboard-grid">
                {props.user === true && props.markets.map((item, index) => {  
                    const leaderboardProps = {
                        pathname: "/leaderboard",
                        leaderboardName: item.leaderboardName,
                        navigationOrderUnsorted: props.markets,
                        username: props.username,
                        user: true
                    };
                    return (
                        <Link 
                            key={index} 
                            to={leaderboardProps} 
                            className="your-markets-leaderboards">
                                <LeaderboardShortcut name={item.leaderboardName} className="leaderboard-shortcut"/>
                        </Link>
                    )
                })}
                {props.user === false && props.markets.map((item, index) => {
                    // if (item[1] === true) {
                        console.log("yes is true")
                        const leaderboardProps = {
                            pathname: "/leaderboard",
                            leaderboardName: item.leaderboardName,
                            navigationOrderUnsorted: props.markets,
                            username: props.username,
                            user: false
                        };
                        // if (item[2] === true) {
                            return (
                                <Link 
                                    key={index} 
                                    to={leaderboardProps}
                                    className="all-markets-leaderboards">
                                        <LeaderboardShortcut name={item.leaderboardName} className="leaderboard-shortcut-blue"/>
                                </Link>
                            )
                        // } else if (item[2] === false) {
                        //     return (
                        //         <Link 
                        //             key={index} 
                        //             to={leaderboardProps}
                        //             className="all-markets-leaderboards">
                        //                 <LeaderboardShortcut name={item[0]} className="leaderboard-shortcut-red" />
                        //         </Link>
                        //     )
                        // } else return null;
                    // } else return null;
                })}
            </div>
        </div>
    )
}

export default LeaderboardGrid;


LeaderboardGrid.propTypes = {
    user: PropTypes.bool.isRequired
};