import React, { useState, useEffect } from 'react';
import './LeaderboardMenu.css';
import LeaderboardGrid from './LeaderboardComponents/LeaderboardGrid';
import Modal from '../../components/Modal';

function LeaderboardMenu(props) {
    const [shouldRefresh, setShouldRefresh] = useState(0);
    const [allMarkets, setAllMarkets] = useState([]);
    const [allUserLeaderboardsWithInviteAccepted, setAllUserLeaderboardsWithInviteAccepted] = useState([]);
    const [causeRefresh, setCauseRefresh] = useState(0);

    useEffect(() => {
        setAllUserLeaderboardsWithInviteAccepted(props.userObject.markets);
        setAllMarkets(props.userObject.markets);
    }, [causeRefresh, props.username]);

    return (
        <div className="leaderboard-menu">
            <h1>Leaderboards</h1>
            <LeaderboardGrid 
                user={true} 
                username={props.username} 
                markets={allUserLeaderboardsWithInviteAccepted} 
                shouldRefresh={shouldRefresh}
            />
            <hr/>
        </div>
    )
}

export default LeaderboardMenu;