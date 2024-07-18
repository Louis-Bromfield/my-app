import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './IndividualLeaderboard.css';
import PropTypes from 'prop-types';
import Top3Users from './IndividualLeaderboardComponents/Top3Users';
import Leaderboard from './IndividualLeaderboardComponents/Leaderboard';
import axios from 'axios';

function IndividualLeaderboard(props) {
    const history = useHistory();
    const [currentLeaderboardName, setCurrentLeaderboardName] = useState();
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [isFFLeaderboard, setIsFFLeaderboard] = useState();
    const [userInMarket, setUserInMarket] = useState(false);
    const [memberMenuStatus, setMemberMenuStatus] = useState(false);
    const [rankingsForTop3, setRankingsForTop3] = useState([]);
    const [leaderboardFilter, setLeaderboardFilter] = useState("all");

    useEffect(() => {
        if (props.location.leaderboardName === undefined) {
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(localStorage.getItem('currentLeaderboardName'));
        } else {
            localStorage.setItem('currentLeaderboardName', props.location.leaderboardName);
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(props.location.leaderboardName);
        }
        console.log("Individual Leaderboard UE");
    }, []);

    useEffect(() => {
        if (props.location.user === true) {
            const leaderboardObj = props.location.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
            setIsFFLeaderboard(true);
        } else if (props.location.user === false) {
            const leaderboardObj = props.location.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
            setIsFFLeaderboard(true);
        }
        console.log("2nd Individual Leaderboard UE");
    }, [currentLeaderboardName, props.location.navigationOrderUnsorted, props.location.user]);
    
    const getLeaderboardData = async (leaderboard) => {
        try {
            const lbData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/`);
            setFilteredRankings(lbData.data);
        } catch (error) {
            console.error("Error occured in getLeaderboardData func in IndividualLeaderboard");
            console.error(error);
        };
    };

    return (
        <div className="individual-leaderboard">
            <div className="button-container">
                <button 
                    className="return-to-leaderboard-menu-btn" 
                    onClick={() => history.push("leaderboard-select")}>
                        Return to Leaderboard Menu
                </button>
                {(userInMarket === true && props.location.user === true && isFFLeaderboard === false) &&
                    <button
                        className="members-btn"
                        onClick={() => {setMemberMenuStatus(!memberMenuStatus)}}>
                            Invite / Kick Members
                    </button>
                }
            </div>
            <div className="leaderboard-title-and-navigation">
                <h1>{currentLeaderboardName} Leaderboard</h1>
            </div>
            <div className="leaderboard-spotlight-row">
                <Top3Users 
                    rankingsForTop3={rankingsForTop3}
                />
            </div>
            <div className="leaderboard-filter-select">
            </div>
            {currentLeaderboardName === "UK Local Elections 2023" && <div className="leaderboard-prize-container" style={{ margin: "0 auto", textAlign: "center" }}>
                <h3>Prizes:</h3>
                <p>This leaderboard will be used to determine who wins our prizes</p>
                <p><strong>1st:</strong>&nbsp;£25</p>
                <p><strong>2nd-10th:</strong>&nbsp;£20</p>
                <p><strong>11th-15th:</strong>&nbsp;£15</p>
                <p><strong>16th-24th:</strong>&nbsp;£10</p>
                <p><strong>25th-50th:</strong>&nbsp;£5</p>
                <p>If LouisB or MattW are in the top 50, the prize will go to the next user in the list.</p>
                <br />
            </div>}

            <Leaderboard 
                leaderboardTitle={currentLeaderboardName} 
                leaderboardRankings={filteredRankings} 
                username={props.username}
                isFFLeaderboard={isFFLeaderboard}
                setUserInMarket={setUserInMarket}
                setRankingsForTop3={setRankingsForTop3}
                leaderboardFilter={leaderboardFilter}
            />
        </div>
    )
}

export default IndividualLeaderboard;

IndividualLeaderboard.propTypes = {
    leaderboardName: PropTypes.string,
    navigationOrderUnsorted: PropTypes.array
};