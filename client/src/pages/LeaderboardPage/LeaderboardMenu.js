import React, { useState, useEffect } from 'react';
import './LeaderboardMenu.css';
import LeaderboardGrid from './LeaderboardComponents/LeaderboardGrid';
import IndividualLeaderboard from './IndividualLeaderboard/IndividualLeaderboard';

function LeaderboardMenu(props) {
    const [shouldRefresh, setShouldRefresh] = useState(0);
    const [allMarkets, setAllMarkets] = useState([]);
    const [allUserLeaderboardsWithInviteAccepted, setAllUserLeaderboardsWithInviteAccepted] = useState([]);
    const [leaderboardName, setLeaderboardName] = useState("Fantasy Forecast All-Time");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAllUserLeaderboardsWithInviteAccepted(props.userObject.markets);
        setAllMarkets(props.userObject.markets);
    }, [props.username]);

    const handleLeaderboardChange = (newLBName) => {
        try {
            setLoading(true);
            setLeaderboardName(newLBName);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } catch (err) {
            console.error("Error in handleLeaderboardChange");
            console.error(err);
        };
    };

    return (
        <div className="leaderboard-menu">
            <h1 className="page-header">Leaderboards</h1>
            <LeaderboardGrid 
                user={true} 
                username={props.username} 
                markets={allUserLeaderboardsWithInviteAccepted} 
                // handleLeaderboardChange={setLeaderboardName}
                handleLeaderboardChange={handleLeaderboardChange}
            />
            <IndividualLeaderboard 
                leaderboardName={leaderboardName}
                username={props.username}
                navigationOrderUnsorted={props.markets}
                user={true}
                loading={loading}
            />
        </div>
    )
}

export default LeaderboardMenu;