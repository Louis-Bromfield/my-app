import React, { useState, useEffect } from 'react';
import './LeaderboardShortcut.css';
import PlaceholderIcon from '../../../media/leaderboard.png';
import FFLogo from '../../../media/Icon.png';
import UnionJackFlag from '../../../media/UnionJackFlag.jpg'

function LeaderboardShortcut(props) {
    const [leaderboardLogo, setLeaderboardLogo] = useState();

    useEffect(() => {
        if (props.name === "Fantasy Forecast All-Time") {
            setLeaderboardLogo({FFLogo});
        } else if (props.name === "UK Politics") {
            setLeaderboardLogo({UnionJackFlag});
        };
        console.log("LS UE");
    }, [props.name]);

    return (
        <div className={props.className}>
            <img src={leaderboardLogo} alt="Leaderboard logo" />
            <h3>{props.name}</h3>
        </div>
    )
}

export default LeaderboardShortcut;
