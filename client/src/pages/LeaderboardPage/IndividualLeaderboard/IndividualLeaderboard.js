import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './IndividualLeaderboard.css';
import PropTypes from 'prop-types';
import * as AiIcons from 'react-icons/ai';
import Top3Users from './IndividualLeaderboardComponents/Top3Users';
import LeaderboardSpecificStats from './IndividualLeaderboardComponents/LeaderboardSpecificStats';
import Leaderboard from './IndividualLeaderboardComponents/Leaderboard';
import axios from 'axios';
import ConfirmationModal from '../../../components/ConfirmationModal';

function IndividualLeaderboard(props) {
    const history = useHistory();
    const [currentLeaderboardName, setCurrentLeaderboardName] = useState();
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [isFFLeaderboard, setIsFFLeaderboard] = useState();
    const [userInMarket, setUserInMarket] = useState(false);
    const [memberMenuStatus, setMemberMenuStatus] = useState(false);
    const [inviteList, setInviteList] = useState([]);
    const [kickList, setKickList] = useState([]);
    const [inviteUser, setInviteUser] = useState("");
    const [kickUser, setKickUser] = useState("");
    const [sendResponseText, setSendResponseText] = useState("");
    const [usersPulled, setUsersPulled] = useState(false);
    const [averagePoints, setAveragePoints] = useState(0);
    const [averageBrier, setAverageBrier] = useState(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [ffData, setFFData] = useState([]);
    
    // let index = 0;
    // for (let i = 0; i < navigationOrder.length; i++) {
    //     if (props.location.user === true && navigationOrder[i] === currentLeaderboardName) {
    //         index = i;
    //     } else if (props.location.user === false && navigationOrder[i][0] === currentLeaderboardName) {
    //         index = i;
    //     };
    // };

    useEffect(() => {
        if (props.location.leaderboardName === undefined) {
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(localStorage.getItem('currentLeaderboardName'));
        } else {
            localStorage.setItem('currentLeaderboardName', props.location.leaderboardName);
            setCurrentLeaderboardName(localStorage.getItem('currentLeaderboardName'));
            getLeaderboardData(props.location.leaderboardName);
        }
        // if (props.location.user === false) {
        //     if (props.location.navigationOrderUnsorted === undefined) {
        //         const arrFromLS = localStorage.getItem('navigationOrder').split(",");
        //         let sortedArrFromLS = [];
        //         for (let i = 0; i < arrFromLS.length; i += 2) {
        //             sortedArrFromLS.push([arrFromLS[i], Boolean(arrFromLS[i+1])]);
        //         };
        //         setNavigationOrder(sortedArrFromLS);
        //         return;
        //     } else {
        //         localStorage.setItem('navigationOrder', props.location.navigationOrderUnsorted);
        //         setNavigationOrder(props.location.navigationOrderUnsorted);
        //         return;
        //     }
        // } else if (props.location.user === true) {
        //     if (props.location.navigationOrderUnsorted === undefined) {
        //         setNavigationOrder(localStorage.getItem('navigationOrder').split(","));
        //         return;
        //     } else {
        //         let navOrder = [];
        //         for (let i = 0; i < props.location.navigationOrderUnsorted.length; i++) {
        //             navOrder.push(props.location.navigationOrderUnsorted[i].leaderboardName);
        //         }
        //         localStorage.setItem('navigationOrder', navOrder);
        //         setNavigationOrder(localStorage.getItem('navigationOrder').split(","));
        //         return;
        //     };
        // };
        console.log("Individual Leaderboard UE");
    }, []);

    useEffect(() => {
        if (props.location.user === true) {
            const leaderboardObj = props.location.navigationOrderUnsorted.find(el => el.leaderboardName === localStorage.getItem('currentLeaderboardName'));
            setIsFFLeaderboard(leaderboardObj.isFFLeaderboard);
        } else if (props.location.user === false) {
            const leaderboardObj = props.location.navigationOrderUnsorted.find(el => el[0] === localStorage.getItem('currentLeaderboardName'));
            setIsFFLeaderboard(leaderboardObj[2]);
        }
        console.log("2nd Individual Leaderboard UE");
    }, [currentLeaderboardName, props.location.navigationOrderUnsorted, props.location.user]);

    const filterByInvite = (rankings) => {
        let filteredArr = [];
        for (let i = 0; i < rankings.length; i++) {
            if (rankings[i].acceptedInvite === true) {
                filteredArr.push(rankings[i]);
            };
        };
        return filteredArr;
    }
    
    const getLeaderboardData = async (leaderboard) => {
        try {
            const lbData = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${leaderboard}`);
            const lbRankings = lbData.data.rankings;
            lbRankings.sort((a, b) => b.marketPoints - a.marketPoints);
            const filtered = filterByInvite(lbRankings);
            let total = 0;
            for (let i = 0; i < filtered.length; i++) {
                total += filtered[i].marketPoints;
            };
            setAveragePoints(total / filtered.length);
            setFilteredRankings(filtered);
        } catch (error) {
            console.error("Error occured in getLeaderboardData func in IndividualLeaderboard");
            console.error(error);
        };
    };

    const leaveMarket = async (leaderboard, username) => {
        try {
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/removeUser/${leaderboard}/${username}`);
            let markets = localStorage.getItem("markets").split(",");
            console.log(markets);
            let index = markets.findIndex(market => market === leaderboard);
            markets.splice(index, 1);
            let newMarkets = [];
            for (let i = 0; i < markets.length; i++) {
                if (markets[i] !== "leaderboard") {
                    newMarkets.push(markets[i]);
                };
            };
            localStorage.setItem("markets", newMarkets);
            history.push("/leaderboard-select");
        } catch (error) {
            console.error("Error in IndividualLeaderboard > leaveMarket");
            console.error(error);
        };
    };

    const getAllUsers = async () => {
        if (usersPulled === true) {
            return;
        } else if (usersPulled === false) {
            setUsersPulled(true);
            try {
                let allUsers = await axios.get('https://fantasy-forecast-politics.herokuapp.com/users');
                let inviteList = [];
                let kickList = [];
                for (let i = 0; i < allUsers.data.length; i++) {
                    if (filteredRankings.find(el => el.username === allUsers.data[i].username) === undefined) {
                        if (allUsers.data[i].username !== "admin") {
                            inviteList.push(allUsers.data[i]);
                        };
                    } else {
                        if (allUsers.data[i].username !== "admin") {
                            kickList.push(allUsers.data[i]);
                        };
                    };
                };
                // setUsersArray(allUsers.data);
                setInviteList(inviteList);
                setKickList(kickList);
            } catch (error) {
                console.error("Error in IndividualLeaderboard > openMemberMenu");
                console.error(error);
            };
        };
    };

    const send = async (inviteOrKick, user, market) => {
        try {
            if (inviteOrKick === "invite") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${market}`, { username: user });
                setSendResponseText(`You have invited ${user}.`);
            } else if (inviteOrKick === "kick") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/kick/${market}`, { username: user });
                console.log("user kicked!");
                setSendResponseText(`You have kicked ${user}.`);
            };
        } catch (error) {
            console.error("Error in IndividualLeaderboard > send");
            console.error(error);
        };
    };

    return (
        <div className="individual-leaderboard">
            <ConfirmationModal 
                show={showConfirmationModal} 
                handleClose={() => {
                    leaveMarket(currentLeaderboardName, props.username) 
                    setShowConfirmationModal(false)
                }} 
                justClose={() => setShowConfirmationModal(false)}
            />
            <div className="button-container">
                <button 
                    className="return-to-leaderboard-menu-btn" 
                    onClick={() => history.push("leaderboard-select")}>
                        Return to Leaderboard Menu
                </button>
                {(currentLeaderboardName !== "Fantasy Forecast All-Time" && props.location.user === true) && 
                    <button 
                        className="leave-leaderboard-btn"
                        onClick={() => setShowConfirmationModal(true)}>
                            Leave Market
                    </button>
                }
                {(userInMarket === true && props.location.user === true && isFFLeaderboard === false) &&
                    <button
                        className="members-btn"
                        onClick={() => {setMemberMenuStatus(!memberMenuStatus)}}>
                            Invite / Kick Members
                    </button>
                }
            </div>
            {memberMenuStatus === true &&
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
                                                onClick={() => setInviteUser(item.username)}
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
                            <h3>You have selected: {inviteUser} to <u>invite</u> to your leaderboard. Do you want to send this invite?</h3>
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
            }
            <div className="leaderboard-title-and-navigation">
                <h1>{currentLeaderboardName} Leaderboard</h1>
            </div>
            <div className="leaderboard-spotlight-row">
                <Top3Users 
                    rankings={filteredRankings}
                    ffData={ffData}
                />
                <LeaderboardSpecificStats 
                    numberOfForecasters={filteredRankings.length} 
                    averageBrier={averageBrier}
                    isFFLeaderboard={isFFLeaderboard}
                    leaderboardTitle={currentLeaderboardName}     
                />
            </div>
            <Leaderboard 
                leaderboardTitle={currentLeaderboardName} 
                leaderboardRankings={filteredRankings} 
                username={props.username}
                isFFLeaderboard={isFFLeaderboard}
                setUserInMarket={setUserInMarket}
                setAverageBrier={setAverageBrier}
                setFFData={setFFData}
            />
        </div>
    )
}

export default IndividualLeaderboard;

IndividualLeaderboard.propTypes = {
    leaderboardName: PropTypes.string,
    navigationOrderUnsorted: PropTypes.array
};