import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaderboardMenu.css';
import LeaderboardGrid from './LeaderboardComponents/LeaderboardGrid';
import ReactLoading from 'react-loading';
import UserToInvite from './LeaderboardComponents/UserToInvite';
import Modal from '../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';


function LeaderboardMenu(props) {
    const [createLeague, setCreateLeague] = useState(false);
    const [leagueSetupConfirmation, setLeagueSetupConfirmation] = useState(false);
    const [usersArray, setUsersArray] = useState(["empty array"]);
    const [leagueName, setLeagueName] = useState("");
    const [shouldRefresh, setShouldRefresh] = useState(0);
    const [userInNoMarkets, setUserInNoMarkets] = useState(false);
    const [joinAMarketMenu, setJoinAMarketMenu] = useState(false);
    const [manageYourInvitesMenu, setManageYourInvitesMenu] = useState(false);
    const [allMarkets, setAllMarkets] = useState([]);
    const [marketsForSignUp, setMarketsForSignUp] = useState([]);
    const [allUserLeaderboardsWithInviteAccepted, setAllUserLeaderboardsWithInviteAccepted] = useState([]);
    const [allUserLeaderboardsWithInviteNotYetAccepted, setAllUserLeaderboardsWithInviteNotYetAccepted] = useState([]);
    const [marketChoiceErrorMessage, setMarketChoiceErrorMessage] = useState("");
    const [marketChoiceSuccessMessage, setMarketChoiceSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [causeRefresh, setCauseRefresh] = useState(0);
    const [isPublic, setIsPublic] = useState();
    const [isPublicChecked, setIsPublicChecked] = useState(false);
    const [isPrivateChecked, setIsPrivateChecked] = useState(false);
    const [usersToInviteToNewLeague, setUsersToInviteToNewLeague] = useState([{username: props.username, marketPoints: 0, isGroup: false, acceptedInvite: true}]);
    const [leagueCreationError, setLeagueCreationError] = useState("");
    const [inviteAlert, setInviteAlert] = useState("No message");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        checkIfUserIsInMarkets(props.username);
        pullAllMarketsFromDB(props.username);
        if (userInNoMarkets === true) {
            setJoinAMarketMenu(true);
        };
    }, [causeRefresh, joinAMarketMenu, props.username, userInNoMarkets]);

    // For private leaderboards, their ranking is determined by FantasyForecast Points, or no?
    const toggleInviteUserToLeague = (username, isGroup) => {
        let found = false;
        let index = 0;
        for (let i = 0; i < usersToInviteToNewLeague.length; i++) {
            if (usersToInviteToNewLeague[i].username === username) {
                found = true;
                index = i;
                return;
            };
        };
        if (found === true) {
            usersToInviteToNewLeague.splice(index, 1);
            let updatedArray = usersToInviteToNewLeague;
            setUsersToInviteToNewLeague(updatedArray);
        } else if (found === false) {
            let updatedArray = usersToInviteToNewLeague;
            updatedArray.push({ username: username, marketPoints: 0, isGroup: isGroup, acceptedInvite: false});
            setUsersToInviteToNewLeague(updatedArray);
        };
    };

    const handleLeagueNameChange = (e) => {
        setLeagueCreationError("");
        setLeagueName(e.target.value);
    };

    const persistLeagueToDB = async (league, usersToInvite, publicStatus, username) => {
        if (/^\s*$/.test(league)) {
            setLeagueCreationError("Your league name is only spaces. Please use letters and numbers.");
            return;
        };
        let found = false;
        for (let i = 0; i < allMarkets.length; i++) {
            if (allMarkets[i][0] === league) {
                setLeagueCreationError("This league name has already been taken. Please choose another one.");
                found = true;
                return;
            };
        };
        if (found === true) {
            return;
        } else {
            setLeagueCreationError("");
            try {
                await axios.post('https://fantasy-forecast-politics.herokuapp.com/leaderboards', {
                    leaderboardName: league,
                    rankings: usersToInvite,
                    isPublic: publicStatus,
                    isFFLeaderboard: false,
                    leagueCreator: username
                });
                setLeagueName("");
                setCreateLeague(false);
                setLeagueSetupConfirmation(true);
                setTimeout(() => {
                    setLeagueSetupConfirmation(false);
                }, 1500);
                setCauseRefresh(causeRefresh+1);
            } catch (error) {
                console.error("Error occured in LeaderboardMenu.js > persistLeagueToDB");
                console.error(error);
            };
        };
    };

    const checkIfUserIsInMarkets = async (username) => {
        try {
            const allUserLeaderboardsFromDB = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${username}`);
            if (allUserLeaderboardsFromDB.data[0].length === 0) {
                setUserInNoMarkets(true)
            } else {
                setUserInNoMarkets(false);
                let marketsFilteredByInviteAccepted = filterLeaderboardsByInvite(allUserLeaderboardsFromDB.data, username, true);
                let marketsFilteredByInviteNotYetAccepted = filterLeaderboardsByInvite(allUserLeaderboardsFromDB.data, username, false);
                setAllUserLeaderboardsWithInviteAccepted(marketsFilteredByInviteAccepted);
                setAllUserLeaderboardsWithInviteNotYetAccepted(marketsFilteredByInviteNotYetAccepted);
            }
        } catch (error) {
            console.error("Error occured in LeaderboardMenu.js > checkIfUserIsInMarkets");
            console.error(error);
        };
    };

    const pullAllMarketsFromDB = async (username) => {
        const leaderboardDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/justNames/${username}`);
        setAllMarkets(leaderboardDocument.data);
    };

    // Filter out the leaderboards where the user has not responded to an invite
    const filterLeaderboardsByInvite = (markets, username, accepted) => {
        if (accepted === true) {
            let filteredMarkets = [];
            for (let i = 0; i < markets.length; i++) {
                if (markets[i].isFFLeaderboard === true) {
                    filteredMarkets.push(markets[i]);
                    continue;
                }
                for (let j = 0; j < markets[i].rankings.length; j++) {
                    if (markets[i].rankings[j].username === username && markets[i].rankings[j].acceptedInvite === true) {
                        filteredMarkets.push(markets[i]);
                    };
                };
            };
            return filteredMarkets;
        } else if (accepted === false) {
            let filteredMarkets = [];
            for (let i = 0; i < markets.length; i++) {
                if (markets[i].isFFLeaderboard === true) {
                    continue;
                }
                for (let j = 0; j < markets[i].rankings.length; j++) {
                    if (markets[i].rankings[j].username === username && markets[i].rankings[j].acceptedInvite === false) {
                        filteredMarkets.push(markets[i]);
                    };
                };
            };
            return filteredMarkets;
        };
    };

    const leagueCreationMenu = async (openStatus, username) => {
        try {
            if (usersArray !== ["empty array"]) {
                let allUsers = await axios.get('https://fantasy-forecast-politics.herokuapp.com/users');
                let filteredUsers = [];
                for (let i = 0; i < allUsers.data.length; i++) {
                    if (allUsers.data[i].username === username) {
                        setUsersToInviteToNewLeague([{username: username, marketPoints: 0, isGroup: allUsers.data[i].isGroup, acceptedInvite: true}]);
                    }
                    if (allUsers.data[i].username !== username) {
                        filteredUsers.push(allUsers.data[i]);
                    };
                };
                setUsersArray(filteredUsers);   
            };
            setCreateLeague(openStatus);
        } catch (error) {
            console.error("Error in LeaderboardMenu.js > leagueCreationMenu");
            console.error(error);
        }
    };

    const editMarketChoices = (item, marketsForSignUp) => {
        setMarketChoiceErrorMessage("");
        let markets = marketsForSignUp;
        if (marketsForSignUp.includes(item)) {
            marketsForSignUp.splice(marketsForSignUp.indexOf(item), 1);
        } else if (!marketsForSignUp.includes(item)) {
            marketsForSignUp.push(item);
        };
        setMarketsForSignUp(markets);
    };

    const submitMarketChoices = async (markets, username) => {
        persistMarketChoicesToDB(markets, username);
        updateOnboardingAndUserMarkets(markets, username);
        const marketsForLS = [localStorage.getItem('markets').split(","), ...markets];
        localStorage.removeItem('markets');
        localStorage.setItem('markets', marketsForLS);
        setTimeout(() => {
            setLoading(false);
            if (markets.length === 1) {
                setMarketChoiceSuccessMessage("You have successfully joined this market!");
            } else if (markets.length > 1) {
                setMarketChoiceSuccessMessage("You have successfully joined these markets!");
            }
            setTimeout(() => {
                setMarketChoiceSuccessMessage("");
                setCauseRefresh(causeRefresh+1);
            }, 1500);
        }, 1000);
    };

    const persistMarketChoicesToDB = async (markets, username) => {
        if (markets.length === 0) {
            setMarketChoiceErrorMessage("You must select at least one market to join.");
            return;
        }
        try {
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            setLoading(true);
            for (let i = 0; i < markets.length; i++) {
                const leaderboardUpdate = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/marketSignUp/${markets[i]}`, {
                    username: username,
                    profilePicture: userDocument.data[0].profilePicture,
                    isGroup: userDocument.data[0].isGroup
                });
            };
        } catch (error) {
            console.error("Error in LeaderboardMenu.js > submitMarketChoices")
            console.error(error);
            setMarketChoiceErrorMessage("Something went wrong. Please try again later.");
        }
    };

    const updateOnboardingAndUserMarkets = async (markets, username) => {
        try {
            // Try to redo this so that we don't need to do the GET first 
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (userDocument.data[0].onboarding.joinAMarket === true) {
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 5;
                userDocument.data[0].markets = [...userDocument.data[0].markets, ...markets];
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints,
                        markets: userDocument.data[0].markets
                    }
                );
                setShowModal(true);
                setModalContent("You just got 5 points for joining a market!");
            } else {
                userDocument.data[0].onboarding.joinAMarket = true;
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 150;
                userDocument.data[0].markets = [...userDocument.data[0].markets, ...markets];
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints,
                        markets: userDocument.data[0].markets
                    }
                );
                setShowModal(true);
                setModalContent("You just got 150 Fantasy Forecast Points for joining your first market! Every time you join a market you'll earn 5 points.");
            }
        } catch (error) {
            console.error("Error in LeaderboardMenu > updateOnboarding")
            console.error(error);
            setMarketChoiceErrorMessage("Something went wrong. Please try again later.");
        };
    };

    const respondToInvite = async (market, response, username) => {
        try {
            if (response === "accept") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${market}/acceptInvite/${username}`);
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/addMarket/${market}`);
                setInviteAlert(`Congratulations, you have now joined the ${market} market!`);
                setTimeout(() => {
                    setInviteAlert("No message");
                }, 1500);
            } else if (response === "reject") {
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${market}/removeUser/${username}`)
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/removeMarket/${market}`);
                setInviteAlert(`You have rejected this invitation to join ${market}.`);
                setTimeout(() => {
                    setInviteAlert("No message");
                }, 1500);
            };
            setCauseRefresh(causeRefresh+1);
        } catch (error) {
            console.error("Error in LeaderboardMenu > respondToInvite");
            console.error(error);
        }
    }

    return (
        <div className="leaderboard-menu">
            <h1>
                Leaderboards
                <FaInfoCircle 
                    color={"orange"} 
                    className="modal-i-btn"
                    onClick={() => { 
                        setShowModal(true); 
                        setModalContent(`If you're here for the first time, it's likely that you aren't signed up to any markets aside from "Fantasy Forecast All-Time". To get forecasting, you need to join a market, which you can do by pressing the "Join A Market" button. Your invites to markets are managed by clicking on the "Your Invites" button, and you can create your own league using the, you guessed it, "Create a League" button. Leagues made by users and the Fantasy Forecast All-Time league will not have forecasts, instead using Fantasy Forecast Points to determine rankings. All the other markets will have forecasts generated by us that will return Market Points to determine your rankings.`)
                    }}
                />
            </h1>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <div className="your-markets-button-div">
                <div></div>
                {joinAMarketMenu === false &&
                    <button 
                        className="join-a-market-btn" 
                        onClick={() => setJoinAMarketMenu(true)}>
                            Join A Market
                    </button>
                }
                {joinAMarketMenu === true &&
                    <button 
                        className="close-btn" 
                        onClick={() => {setJoinAMarketMenu(false); setMarketsForSignUp([])}}>
                            Close Market Sign Up
                    </button>
                }
                {manageYourInvitesMenu === false &&
                    <button 
                        className="manage-your-invites-btn" 
                        onClick={() => setManageYourInvitesMenu(true)}>
                            Your Invites ({allUserLeaderboardsWithInviteNotYetAccepted.length})
                    </button>
                }
                {manageYourInvitesMenu === true &&
                    <button 
                        className="close-btn" 
                        onClick={() => setManageYourInvitesMenu(false)}>
                            Close Your Invites
                    </button>
                }
                {createLeague === false &&
                    <button 
                        className="create-a-league-btn" 
                        onClick={() => leagueCreationMenu(true, props.username)}>
                            Create a League
                    </button>
                }
                {createLeague === true &&
                    <button 
                        className="close-btn" 
                        onClick={() => leagueCreationMenu(false, props.username)}>
                            Close League Creation
                    </button>
                }
            </div>
            {(userInNoMarkets === true || joinAMarketMenu === true) &&
                <div className="market-sign-up-div">
                    <h2 className="market-list-title">Welcome to the Market Sign Up!</h2>
                    {userInNoMarkets === true && 
                        <h4>You're not currently in any markets (apart from our Fantasy Forecast All-Time leaderboard). Below is a 
                        list of all the public markets available for you to join. You can join simply by checking the box and 
                        pressing "Confirm Market Choices".</h4>
                    }
                    {userInNoMarkets === false && 
                        <h4>Below is a list of all the public markets available for you to join. You can join simply by 
                        checking the box and pressing "Confirm Market Choices".</h4>
                    }
                    <div className="markets-list">
                        <h2 className="market-list-title">Markets</h2>
                        <ul className="markets-list-ul">
                            {allMarkets.map((item, index) => {
                                if (item[0] === "Fantasy Forecast All-Time") {
                                    return null;
                                } 
                                else if (item[2] === true && item[3] === false) return (
                                    <li className="market-selector" key={index}>
                                        <input type="checkbox" className="market-selector-checkbox" onClick={() => editMarketChoices(item[0], marketsForSignUp)} />
                                        <h3>{item}</h3>
                                    </li>
                                )
                                else return null;
                            })}
                        </ul>
                        {marketChoiceErrorMessage !== "" && <h3 style={{ color: "red" }}>{marketChoiceErrorMessage}</h3>}
                        {marketChoiceSuccessMessage !== "" && <h3 style={{ color: "green" }}>{marketChoiceSuccessMessage}</h3>}
                        <button 
                            className="submit-markets-btn" 
                            onClick={() => submitMarketChoices(marketsForSignUp, props.username)}>
                                Confirm Market Choices
                        </button>
                        {loading === true && 
                            <div className="loading-div">
                                <ReactLoading type="bubbles" color="#404d72" height="30%" width="30%"/>
                            </div>
                        }
                    </div>
                </div>
            }
            {manageYourInvitesMenu === true &&
                <div className="manage-your-invites-div">
                    <h2 className="market-list-title">Your Invites</h2>
                    <h4>Here you can see all of the leagues you have been invited to!</h4>
                    {allUserLeaderboardsWithInviteNotYetAccepted.map((item, index) => {
                        return (
                            <div key={index} className="market-div">
                                <h2 style={{ color: "#404d72" }}>{item.leaderboardName}</h2>
                                {/* -1 to account for the current invitee */}
                                <ul><h3>Number of Players/Invitees: {item.rankings.length-1}</h3>
                                {item.rankings.map((item, index) => {
                                    if (item.acceptedInvite === true) {
                                        return (
                                            <li key={index} className="player-li">{item.username}</li>
                                        )
                                    } else return null;
                                })}
                                </ul>
                                <div className="response-div">
                                    <button 
                                        className="accept-btn" 
                                        onClick={() => respondToInvite(item.leaderboardName, "accept", props.username)}>
                                            Accept Invite
                                    </button>
                                    <button 
                                        className="reject-btn" 
                                        onClick={() => respondToInvite(item.leaderboardName, "reject", props.username)}>
                                            Reject Invite
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {inviteAlert !== "No message" && <h3 style={{ color: "green" }}>{inviteAlert}</h3>}
                </div>
            }
            {createLeague === true &&
                <div className="create-a-league-div">
                    <h2 className="market-list-title">Create a League</h2>
                    <h4>Create your own league, invite friends, and see who's the best!</h4>
                    <br />
                    <form action="" className="create-a-league-form">
                        <label htmlFor="leagueName">League Name:</label>
                        <input 
                            type="text" 
                            id="leagueName" 
                            name="leagueName" 
                            className="team-name-input" 
                            maxLength="20" 
                            onChange={(e) => handleLeagueNameChange(e)}
                        />
                        {leagueCreationError !== "" && <h3 style={{ color: "red" }}>{leagueCreationError}</h3>}
                        <br />
                        <label htmlFor="initialInvites">Initial Invites:</label>
                        <div className="friends-invite-list">
                            {usersArray.map((user, index) => {
                                return (
                                    <UserToInvite 
                                        key={index}
                                        username={user.username} 
                                        ProfileP={user.profilePicture} 
                                        userInGroup={user.isGroup}
                                        toggleInviteUserToLeague={() => toggleInviteUserToLeague(user.username, user.isGroup)}
                                    />
                                )
                            })}
                        </div>
                        <br />
                        <h3>Public or Private?</h3>
                        <h4 className="public-private-explainer">A public leaderboard means it will be visible for all users in the section below labelled "All Markets offered by Fantasy Forecast".
                            A private leaderboard is one that is only visible to members of the leaderboard, who will be able to see it in the section labelled "Your Markets".
                            Regardless of public or private, other players will still need to request to join or accept an invite from a current member.
                        </h4>
                        <div className="public-private-container">
                            <label htmlFor="public">Public Leaderboard</label>
                            <input 
                                type="checkbox" 
                                checked={isPublicChecked} 
                                onChange={() => { 
                                    setIsPublic(true); 
                                    setIsPublicChecked(true); 
                                    setIsPrivateChecked(false)
                                }} 
                            />
                            <label htmlFor="private">Private Leaderboard</label>
                            <input 
                                type="checkbox" 
                                checked={isPrivateChecked} 
                                onChange={() => { 
                                    setIsPublic(false); 
                                    setIsPrivateChecked(true); 
                                    setIsPublicChecked(false)
                                }} 
                            />
                        </div>
                    </form>
                    <div className="submit-div">
                        <button 
                            className="confirm-create-league-btn" 
                            onClick={() => persistLeagueToDB(leagueName, usersToInviteToNewLeague, isPublic, props.username)}>
                                Create League
                        </button>
                    </div>
                </div>
            }
            {leagueSetupConfirmation === true && <h2 style={{ "color": "green" }}>League Successfully Created</h2>}
            <h3>Your Markets:</h3>
            <LeaderboardGrid 
                user={true} 
                username={props.username} 
                markets={allUserLeaderboardsWithInviteAccepted} 
                shouldRefresh={shouldRefresh}
            />
            <hr/>
            <h3>All markets offered by Fantasy Forecast:</h3>
            <span 
                className="markets-legend">
                <h4 style={{color: "#404d72"}}> Blue</h4>
                <h4> = Fantasy Forecast Leaderboard, no invite needed to join (Use the Join a Market button at the top of the page).</h4>
            </span>
            <span className="markets-legend">
                <h4 style={{color: "#993131"}}>Red</h4>
                <h4> = User-created Leaderboard, requires an invite to join.</h4>
            </span>
            <LeaderboardGrid 
                user={false} 
                username={props.username} 
                markets={allMarkets} 
                shouldRefresh={shouldRefresh} 
            />
        </div>
    )
}

export default LeaderboardMenu;