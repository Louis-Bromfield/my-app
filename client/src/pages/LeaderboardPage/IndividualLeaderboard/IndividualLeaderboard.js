import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './IndividualLeaderboard.css';
import PropTypes from 'prop-types';
// import * as AiIcons from 'react-icons/ai';
import Top3Users from './IndividualLeaderboardComponents/Top3Users';
// import LeaderboardSpecificStats from './IndividualLeaderboardComponents/LeaderboardSpecificStats';
import Leaderboard from './IndividualLeaderboardComponents/Leaderboard';
import axios from 'axios';
// import ConfirmationModal from '../../../components/ConfirmationModal';
// import req from 'express/lib/request';

function IndividualLeaderboard(props) {
    const history = useHistory();
    const [currentLeaderboardName, setCurrentLeaderboardName] = useState();
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [isFFLeaderboard, setIsFFLeaderboard] = useState();
    const [userInMarket, setUserInMarket] = useState(false);
    const [memberMenuStatus, setMemberMenuStatus] = useState(false);
    // const [inviteList, setInviteList] = useState([]);
    // const [kickList, setKickList] = useState([]);
    // const [inviteUser, setInviteUser] = useState("");
    // const [kickUser, setKickUser] = useState("");
    // const [sendResponseText, setSendResponseText] = useState("");
    // const [usersPulled, setUsersPulled] = useState(false);
    // const [averagePoints, setAveragePoints] = useState(0);
    // const [averageBrier, setAverageBrier] = useState(0);
    // const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [ffData, setFFData] = useState([]);
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
            // setIsFFLeaderboard(leaderboardObj.isFFLeaderboard);
            setIsFFLeaderboard(true);
        } else if (props.location.user === false) {
            const leaderboardObj = props.location.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
            // setIsFFLeaderboard(leaderboardObj.isFFLeaderboard);
            setIsFFLeaderboard(true);
        }
        console.log("2nd Individual Leaderboard UE");
    }, [currentLeaderboardName, props.location.navigationOrderUnsorted, props.location.user]);

    // const filterByInvite = (rankings) => {
    //     let filteredArr = [];
    //     for (let i = 0; i < rankings.length; i++) {
    //         if (rankings[i].acceptedInvite === true) {
    //             filteredArr.push(rankings[i]);
    //         };
    //     };
    //     return filteredArr;
    // }
    
    const getLeaderboardData = async (leaderboard) => {
        try {
            // const lbData = await axios.get(`${process.env.REACT_APP_API_CALL_L}/leaderboard/${leaderboard}`);
            // const lbRankings = lbData.data;
            // const lbData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/`);
            const lbData = await axios.get(`${process.env.REACT_APP_API_CALL_U}/`);
            
            // let lbRankings = [];
            // for (let i = 0; i < lbData.data.length; i++) {
            //     if (lbData.data[i].markets.includes(leaderboard)) {
            //         lbRankings.push(lbData.data[i]);
            //     };
            // };
            // lbRankings.sort((a, b) => b.marketPoints - a.marketPoints);indexOf
            // Removed line below as we have removed creating leagues for now, so no invites needed as all are default true for FFLeaderboards
            // const filtered = filterByInvite(lbRankings);
            // let total = 0;
            // Removed this as we have removed Leaderboard Specific Stats for now
            // for (let i = 0; i < lbRankings.length; i++) {
            //     total += lbRankings[i].marketPoints;
            // };
            // setAveragePoints(total / lbRankings.length);
            // setFilteredRankings(lbRankings);
            setFilteredRankings(lbData.data);
        } catch (error) {
            console.error("Error occured in getLeaderboardData func in IndividualLeaderboard");
            console.error(error);
        };
    };

    // const leaveMarket = async (leaderboard, username) => {
    //     try {
    //         // CHARMANDER
    //         let markets = localStorage.getItem("markets").split(",");
    //         let index = markets.findIndex(market => market === leaderboard);
    //         markets.splice(index, 1);
    //         let newMarkets = [];
    //         for (let i = 0; i < markets.length; i++) {
    //             if (markets[i] !== leaderboard) {
    //                 newMarkets.push(markets[i]);
    //             };
    //         };
    //         localStorage.setItem("markets", newMarkets);
    //         history.push("/leaderboard-select");
    //         await axios.patch(`${process.env.REACT_APP_API_CALL_L}/removeUser/${leaderboard}/${username}`);
    //     } catch (error) {
    //         console.error("Error in IndividualLeaderboard > leaveMarket");
    //         console.error(error);
    //     };
    // };

    // const getAllUsers = async () => {
    //     if (usersPulled === true) {
    //         return;
    //     } else if (usersPulled === false) {
    //         setUsersPulled(true);
    //         try {
    //             let allUsers = await axios.get('${process.env.REACT_APP_API_CALL_U}');
    //             let inviteList = [];
    //             let kickList = [];
    //             for (let i = 0; i < allUsers.data.length; i++) {
    //                 if (filteredRankings.find(el => el.username === allUsers.data[i].username) === undefined) {
    //                     if (allUsers.data[i].username !== "admin") {
    //                         inviteList.push(allUsers.data[i]);
    //                     };
    //                 } else {
    //                     if (allUsers.data[i].username !== "admin") {
    //                         kickList.push(allUsers.data[i]);
    //                     };
    //                 };
    //             };
    //             // setUsersArray(allUsers.data);
    //             setInviteList(inviteList);
    //             setKickList(kickList);
    //         } catch (error) {
    //             console.error("Error in IndividualLeaderboard > openMemberMenu");
    //             console.error(error);
    //         };
    //     };
    // };

    // const send = async (inviteOrKick, user, market) => {
    //     try {
    //         if (inviteOrKick === "invite") {
    //             await axios.patch(`${process.env.REACT_APP_API_CALL_L}/${market}`, { username: user.username, isGroup: user.isGroup });
    //             setSendResponseText(`You have invited ${user.username}.`);
    //         } else if (inviteOrKick === "kick") {
    //             await axios.patch(`${process.env.REACT_APP_API_CALL_L}/kick/${market}`, { username: user });
    //             setSendResponseText(`You have kicked ${user}.`);
    //         };
    //     } catch (error) {
    //         console.error("Error in IndividualLeaderboard > send");
    //         console.error(error);
    //     };
    // };

    return (
        <div className="individual-leaderboard">
            {/* <ConfirmationModal 
                show={showConfirmationModal} 
                handleClose={() => {
                    leaveMarket(currentLeaderboardName, props.username) 
                    setShowConfirmationModal(false)
                }} 
                justClose={() => setShowConfirmationModal(false)}
                children={<h4>If you click "Yes" you will lose all of your market points!</h4>}
            /> */}
            <div className="button-container">
                <button 
                    className="return-to-leaderboard-menu-btn" 
                    onClick={() => history.push("leaderboard-select")}>
                        Return to Leaderboard Menu
                </button>
                {/* {(currentLeaderboardName !== "Fantasy Forecast All-Time" && props.location.user === true) && 
                    <button 
                        className="leave-leaderboard-btn"
                        onClick={() => setShowConfirmationModal(true)}>
                            Leave Market
                    </button>
                } */}
                {(userInMarket === true && props.location.user === true && isFFLeaderboard === false) &&
                    <button
                        className="members-btn"
                        onClick={() => {setMemberMenuStatus(!memberMenuStatus)}}>
                            Invite / Kick Members
                    </button>
                }
            </div>
            {/* {memberMenuStatus === true &&
                <div className="member-menu-container">
                    <h2 style={{ color: "#404d72"}}>Invite / Kick Members</h2>
                    <button className="get-all-users-btn" onClick={() => {setUsersPulled(true); getAllUsers()}}>Show All Users</button>
                    <div className="list-container">
                        <div className="invite-container">
                            <h3>Users You Can Invite:</h3>
                            <ul>
                                {inviteList.map((item, index) => {
                                    if (item.username !== props.username) {
                                        return (
                                            <li 
                                                key={index} 
                                                className="user-li" 
                                                onClick={() => setInviteUser({ username: item.username, isGroup: item.isGroup})}
                                            >
                                                <h3>{item.username}</h3>
                                            </li>
                                        )
                                    }
                                    else return null;
                                })}
                            </ul>
                        </div>
                        <div className="kick-container">
                            <h3>Users You Can Kick:</h3>
                            <ul>
                                {kickList.map((item, index) => {
                                    if (item.username !== props.username) {
                                        return (
                                            <li 
                                                key={index} 
                                                className="user-li" 
                                                onClick={() => setKickUser(item.username)}
                                            >
                                                <h3>{item.username}</h3>
                                            </li>
                                        )
                                    }
                                    else return null;
                                })}
                            </ul>
                        </div>
                    </div>
                    {inviteUser !== "" && 
                        <div className="submit-container">
                            <h3>You have selected: {inviteUser.username} to <u>invite</u> to your leaderboard. Do you want to send this invite?</h3>
                            <button className="send-btn" onClick={() => send("invite", inviteUser, currentLeaderboardName)}>Send</button>
                        </div>
                    }
                    {kickUser !== "" && 
                        <div className="submit-container">
                            <h3>You have selected: {kickUser} to <u>kick</u> from your leaderboard. Do you want to kick them?</h3>
                            <button className="send-btn" onClick={() => send("kick", kickUser, currentLeaderboardName)}>Kick</button>
                        </div>
                    }
                    {sendResponseText !== "" && <h3>{sendResponseText}</h3>}
                </div>
            } */}
            <div className="leaderboard-title-and-navigation">
                <h1>{currentLeaderboardName} Leaderboard</h1>
            </div>
            <div className="leaderboard-spotlight-row">
                <Top3Users 
                    // rankings={filteredRankings}
                    rankingsForTop3={rankingsForTop3}
                    // ffData={ffData}
                />
                {/* <LeaderboardSpecificStats 
                    numberOfForecasters={filteredRankings.length} 
                    averageBrier={averageBrier}
                    isFFLeaderboard={isFFLeaderboard}
                    leaderboardTitle={currentLeaderboardName}     
                /> */}
            </div>
            <div className="leaderboard-filter-select">
                {/* <select name="leaderboard-filter" id="" onChange={(e) => setLeaderboardFilter(e.target.value)}>
                    <option 
                        value="all">
                            All
                    </option>
                    <option 
                        value="solo">
                            Solo Forecasters
                    </option>
                    <option 
                        value="teams">
                            Teams
                    </option>
                </select> */}
            </div>
            <Leaderboard 
                leaderboardTitle={currentLeaderboardName} 
                leaderboardRankings={filteredRankings} 
                username={props.username}
                isFFLeaderboard={isFFLeaderboard}
                setUserInMarket={setUserInMarket}
                setRankingsForTop3={setRankingsForTop3}
                // setAverageBrier={setAverageBrier}
                // setFFData={setFFData}
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