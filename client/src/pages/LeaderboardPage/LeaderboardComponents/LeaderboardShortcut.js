import React from 'react';
import './LeaderboardShortcut.css';
import PlaceholderIcon from '../../../media/leaderboard.png';

function LeaderboardShortcut(props) {
    return (
        <div className={props.className}>
            <img className="leaderboard-shortcut-img" src={PlaceholderIcon} alt=""/>
            <h3>{props.name}</h3>
        </div>
    )
}

export default LeaderboardShortcut;
