import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ProfileStats from './ProfileStats';
import Modal from '../../components/Modal';
import ProfileRewards from './ProfileRewards';
import ProfileForecasts from './ProfileForecasts';

function Profile(props) {
    const [markets, setMarkets] = useState("");
    const [index, setIndex] = useState();
    const [brierAverage, setBrierAverage] = useState("N/A");
    const [bestForecast, setBestForecast] = useState("N/A");
    const [fantasyForecastPoints, setFantasyForecastPoints] = useState(0);
    const [brierScoresArr, setBrierScoresArr] = useState([]);
    const [userObj, setUserObj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [level, setLevel] = useState(0);
    const [profileTab, setProfileTab] = useState("my-stats");
    const [forecasterRank, setForecasterRank] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChangeMsg, setPasswordChangeMsg] = useState("");

    useEffect(() => {
        if (props.user.markets === undefined) {
            // CHARMANDER
            const markets = localStorage.getItem('markets').split(",");
            formatMarketsString(markets);
        } else {
            formatMarketsString(props.user.markets);
        }
        if (props.username === undefined) {
            // this should change tbh as it would mean anyone could get anyone's user info
            // CHARMANDER
            const username = localStorage.getItem('username');
            retrieveUserInfoFromDB(username);
            updateOnboarding(username);
        } else {
            retrieveUserInfoFromDB(props.username);
            updateOnboarding(props.username);
        };
console.log("Profile.js UE");
    }, [props.username, props.user.markets]);

    const retrieveUserInfoFromDB = async (username) => {
        try {
            setErrorMessage("");
            const lbName = "Fantasy Forecast All-Time"
            const userData = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${lbName}`);
            // const lbRankings = userData.data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
            for (let i = 0; i < userData.data.length; i++) {
                if (userData.data[i].username === username) {
                    let k = i+1 % 10;
                    let l = i+1 % 100;
                    if (k === 1 && l !== 11) {
                        setIndex(i+1+"st");
                    } else if (k === 2 && l !== 12) {
                        setIndex(i+1+"nd");
                    } else if (k === 3 && l !== 13) {
                        setIndex(i+1+"rd");
                    } else {
                        setIndex(i+1+"th");
                    };      
                };
            };
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/profileData/${username}`);
            if (userDocument.data.userObj === null) {
                setErrorMessage("No profiles were found with this username. Please try again.");
            } else if (userDocument.data.userObj !== null) {
                setUserObj(userDocument.data.userObj);
                setFantasyForecastPoints(userDocument.data.userObj.fantasyForecastPoints);
                setLevel(Math.floor((userDocument.data.userObj.fantasyForecastPoints/100)).toFixed(0));
                setBrierAverage(Number(userDocument.data.averageBrier).toFixed(0));
                setBestForecast(`${(userDocument.data.bestBrier).toFixed(2)} / 110 - ${userDocument.data.bestForecastProblem}`);
                setBrierScoresArr(userDocument.data.userObj.brierScoresArr);
                if (userDocument.data.userObj.fantasyForecastPoints < 500) {
                    setForecasterRank("Guesser");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 500 && userDocument.data.userObj.fantasyForecastPoints < 1000) {
                    setForecasterRank("Predictor");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 1000 && userDocument.data.userObj.fantasyForecastPoints < 1500) {
                    setForecasterRank("Forecaster");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 1500 && userDocument.data.userObj.fantasyForecastPoints < 2000) {
                    setForecasterRank("Seer");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 2000 && userDocument.data.userObj.fantasyForecastPoints < 2500) {
                    setForecasterRank("Soothsayer");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 2500 && userDocument.data.userObj.fantasyForecastPoints < 3000) {
                    setForecasterRank("Oracle");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 3000 && userDocument.data.userObj.fantasyForecastPoints < 3500) {
                    setForecasterRank("Prophet");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 3500 && userDocument.data.userObj.fantasyForecastPoints < 4000) {
                    setForecasterRank("Clairvoyant");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 4000 && userDocument.data.userObj.fantasyForecastPoints < 4500) {
                    setForecasterRank("Augur");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 4500 && userDocument.data.userObj.fantasyForecastPoints < 5000) {
                    setForecasterRank("Omniscient");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 5000) {
                    setForecasterRank("Diviner");
                };
            };
        } catch (error) {
            console.error("Error in Profile.js > retrieveUserInfoFromDB");
            console.error(error);
        };
    };

    const formatMarketsString = (markets) => {
        let string = "";
        for (let i = 0; i < markets.length; i++) {
            if (markets[i] !== '"Fantasy Forecast All-Time"') {
                string += `${markets[i]}, `;
            };
        };
        // Remove the last comma from the final market in the list
        string = string.slice(0, string.length-2);
        setMarkets(string);
    };

    const updateOnboarding = async (username) => {
        try {
            const updatedUserDocument = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/onboardingTask/${username}`, {
                onboardingTask: "visitProfilePage",
                ffPointsIfFalse: 100,
                ffPointsIfTrue: 0
            });
            console.log(updatedUserDocument);
            if (updatedUserDocument.data.firstTime === true) {
                setShowModal(true);
                setModalContent("You just got 100 Fantasy Forecast Points for visiting your profile for the first time! If you forget your password, log back in using your Reset Code and then set your new password at the bottom of this page.");
            };
            // Try to redo this so that we don't need to do the GET first 
            // const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            // if (userDocument.data[0].onboarding.visitProfilePage === true) {
            //     return;
            // } else {
            //     userDocument.data[0].onboarding.visitProfilePage = true;
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 100
            //     await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
            //         { 
            //             onboarding: userDocument.data[0].onboarding,
            //             fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
            //         }
            //     );
            //     setShowModal(true);
            //     setModalContent("You just got 100 Fantasy Forecast Points for visiting your profile for the first time! If you forget your password, log back in using your Reset Code and then set your new password at the bottom of this page.");
            // };
        } catch (error) {
            console.error(error);
        };
    };

    const changePassword = async (newPW) => {
        try {
            if (newPW.length < 4) {
                setPasswordChangeMsg("Your username and password must be at least 5 characters and contain no spaces.");
                return;
            } else if (/\s/.test(newPW)) {
                setPasswordChangeMsg("Your username and password must be at least 5 characters and contain no spaces.");
                return;
            } else {
                console.log(newPW);
                const newDoc = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/newPW/${props.username}`, { password: newPW });
                console.log(newDoc);
                if (newDoc) {
                    setPasswordChangeMsg("Password succesfully changed.");
                } else {
                    setPasswordChangeMsg("There was an error, please try again later.");
                };
            }
        } catch (error) {
            console.error(error);
            console.error("Error in change PW");
        };
    };
    
    return (
        <div className="profile">
            <h1>My Profile</h1>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <div className="main-profile-grid">
                <div className="profile-grid">
                    <h1 className="profile-header">{errorMessage === "" ? props.username : errorMessage}</h1>
                    <div className="profile-main-info">
                        {/* CHARMANDER */}
                        {/* <img className="profile-profile-pic" src={props.profilePicture || localStorage.getItem("profilePicture")} alt="Temporary profile pic"/> */}
                        <img className="profile-profile-pic" src={props.profilePicture} alt="Temporary profile pic"/>
                        <div className="profile-summary">
                            <ul className="profile-summary-list"> 
                                <li key={0} className="profile-summary-list-item">
                                    <h3>Forecaster Level:</h3>
                                    <h4>{fantasyForecastPoints === undefined ? (Math.floor(props.user.fantasyForecastPoints/100)).toFixed(0): level} - {forecasterRank}</h4>
                                </li>
                                <li key={1} className="profile-summary-list-item">
                                    <h3>Fantasy Forecast Points:</h3>
                                    <h4>{fantasyForecastPoints === undefined ? props.user.fantasyForecastPoints.toFixed(0): fantasyForecastPoints.toFixed(0)}</h4>
                                </li>
                                <li key={2} className="profile-summary-list-item">
                                    <h3>Brier Score Average:</h3>
                                    <h4>{isNaN(brierAverage) ? "N/A" : brierAverage }</h4>
                                </li>
                                <li key={3} className="profile-summary-list-item">
                                    <h3>Best Forecast:</h3>
                                    <h4>{bestForecast}</h4>
                                </li>
                                <li key={4} className="profile-summary-list-item">
                                    <h3>Fantasy Forecast All-Time Rank:</h3>
                                    <h4>{index}</h4>
                                </li>
                                <li key={5} className="profile-summary-list-item">
                                    <h3>Markets</h3>
                                    <h4>{markets}</h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="profile-stats-rewards-container">
                        <div className="profile-nav-menu">
                            <div className="profile-tab" onClick={() => setProfileTab("my-stats")}><h3>My Stats</h3></div>
                            <div className="profile-tab" onClick={() => setProfileTab("my-forecasts")}><h3>My Forecasts</h3></div>
                            <div className="profile-tab" onClick={() => setProfileTab("my-rewards")}><h3>My Rewards</h3></div>
                        </div>
                        {profileTab === "my-stats" && <ProfileStats 
                            username={props.username} 
                            brierScores={brierScoresArr} 
                            userObj={userObj} 
                            profileTab={profileTab}
                            ffPoints={fantasyForecastPoints}
                        />}
                        {profileTab === "my-forecasts" && <ProfileForecasts userObj={userObj} searched={false} />}
                        {profileTab === "my-rewards" && <ProfileRewards />}
                    </div>
                    <br />
                    <div className="profile-details-container">
                        <h3 classname="profile-details-header">Want to change your password?</h3>
                        <label htmlFor="password" classname="profile-details-label">Password:</label>
                        <input 
                            classname="profile-details-input"
                            type="password" 
                            name="password" 
                            id="password" 
                            maxLength={15}
                            onChange={(e) => { 
                                setNewPassword(e.target.value);
                                setPasswordChangeMsg("");
                            }}
                        />
                        <button onClick={() => changePassword(newPassword)} className="change-pw-btn">Change Password</button>
                        {passwordChangeMsg}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
