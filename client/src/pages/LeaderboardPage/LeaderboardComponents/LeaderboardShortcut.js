import React from 'react';
import './LeaderboardShortcut.css';
import PlaceholderIcon from '../../../media/leaderboard.png';

function LeaderboardShortcut(props) {
    return (
        <div className="leaderboard-shortcut" onClick={props.handleClick}>
            {/* {window.innerWidth > 400 && <img className="leaderboard-shortcut-img" src={PlaceholderIcon} alt=""/>} */}
            <h4>{props.name == "Fantasy Forecast All-Time" ? "Horse Race Politics All-Time" : props.name}</h4>
        </div>
    )
}

export default LeaderboardShortcut;
