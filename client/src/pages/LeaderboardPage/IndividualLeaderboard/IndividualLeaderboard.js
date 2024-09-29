import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './IndividualLeaderboard.css';
import PropTypes from 'prop-types';
import Top3Users from './IndividualLeaderboardComponents/Top3Users';
import Leaderboard from './IndividualLeaderboardComponents/Leaderboard';
import axios from 'axios';

function IndividualLeaderboard(props) {
    const [currentLeaderboardName, setCurrentLeaderboardName] = useState();
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [isFFLeaderboard, setIsFFLeaderboard] = useState();
    const [userInMarket, setUserInMarket] = useState(false);
    const [memberMenuStatus, setMemberMenuStatus] = useState(false);
    const [rankingsForTop3, setRankingsForTop3] = useState([]);
    const [leaderboardFilter, setLeaderboardFilter] = useState("all");

    useEffect(() => {
        if (props.leaderboardName === undefined) {
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(localStorage.getItem('currentLeaderboardName'));
        } else {
            localStorage.setItem('currentLeaderboardName', props.leaderboardName);
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(props.leaderboardName);
        }
        console.log("Individual Leaderboard UE");
    }, [props.leaderboardName]);

    useEffect(() => {
        // if (props.user === true) {
        //     const leaderboardObj = props.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
        //     setIsFFLeaderboard(true);
        // } else if (props.user === false) {
        //     const leaderboardObj = props.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
        //     setIsFFLeaderboard(true);
        // }
        props.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
        setIsFFLeaderboard(true);
        console.log("2nd Individual Leaderboard UE");
    }, [props.leaderboardName, props.navigationOrderUnsorted, props.user]);
    
    const getLeaderboardData = async (leaderboard) => {
        try {
            // const lbData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/`);
            const lbData = await axios.get(`http://localhost:8000/users`);
            setFilteredRankings(lbData.data);
        } catch (error) {
            console.error("Error occured in getLeaderboardData func in IndividualLeaderboard");
            console.error(error);
        };
    };

    return (
        <div className="individual-leaderboard">
            <div className="button-container">
                {(userInMarket === true && props.user === true && isFFLeaderboard === false) &&
                    <button
                        className="members-btn"
                        onClick={() => {setMemberMenuStatus(!memberMenuStatus)}}>
                            Invite / Kick Members
                    </button>
                }
            </div>
            <div className="leaderboard-title-and-navigation">
                <h2>{currentLeaderboardName} Leaderboard</h2>
            </div>
            <div className="leaderboard-spotlight-row">
                <Top3Users 
                    rankingsForTop3={rankingsForTop3}
                />
            </div>
            <div className="leaderboard-filter-select">
            </div>
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