import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ProfileStats from './ProfileStats';
import Modal from '../../components/Modal';
import ProfileRewards from './ProfileRewards';
import ProfileForecasts from './ProfileForecasts';

function Profile(props) {
    const [markets, setMarkets] = useState("");
    const [index, setIndex] = useState(-1);
    const [brierAverage, setBrierAverage] = useState("N/A");
    const [bestForecast, setBestForecast] = useState("N/A");
    const [bestForecastForModal, setBestForecastForModal] = useState("");
    const [fantasyForecastPoints, setFantasyForecastPoints] = useState(0);
    const [brierScoresArr, setBrierScoresArr] = useState([]);
    const [userObj, setUserObj] = useState(props.user);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [level, setLevel] = useState(0);
    const [profileTab, setProfileTab] = useState("my-stats");
    const [forecasterRank, setForecasterRank] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChangeMsg, setPasswordChangeMsg] = useState("");
    const [profilePicStyle, setProfilePicStyle] = useState("none");

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
            const userData = await axios.get(`${process.env.REACT_APP_API_CALL_L}/leaderboard/${lbName}`);
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
            const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/profileData/${username}`);
            if (userDocument.data.userObj === null) {
                setErrorMessage("No profiles were found with this username. Please try again.");
            } else if (userDocument.data.userObj !== null) {
                setUserObj(userDocument.data.userObj);
                setFantasyForecastPoints(userDocument.data.userObj.fantasyForecastPoints);
                setLevel(Math.floor((userDocument.data.userObj.fantasyForecastPoints/100)).toFixed(0));
                setBrierAverage(Number(userDocument.data.averageBrier).toFixed(0));
                setBestForecastForModal(`${(userDocument.data.bestBrier).toFixed(2)} / 110 - ${userDocument.data.bestForecastProblem}`);
                setBestForecast(`${(userDocument.data.bestBrier).toFixed(2)}`);
                setBrierScoresArr(userDocument.data.userObj.brierScoresArr);
                if (userDocument.data.userObj.fantasyForecastPoints < 500) {
                    setForecasterRank("Guesser");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 500 && userDocument.data.userObj.fantasyForecastPoints < 1000) {
                    setForecasterRank("Predictor");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 1000 && userDocument.data.userObj.fantasyForecastPoints < 1500) {
                    setForecasterRank("Forecaster");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 1500 && userDocument.data.userObj.fantasyForecastPoints < 2000) {
                    setForecasterRank("Seer");
                    setProfilePicStyle("7px solid #cd7f32");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 2000 && userDocument.data.userObj.fantasyForecastPoints < 2500) {
                    setForecasterRank("Soothsayer");
                    setProfilePicStyle("7px solid silver");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 2500 && userDocument.data.userObj.fantasyForecastPoints < 3000) {
                    setForecasterRank("Oracle");
                    setProfilePicStyle("7px solid goldenrod");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 3000 && userDocument.data.userObj.fantasyForecastPoints < 3500) {
                    setForecasterRank("Prophet");
                    setProfilePicStyle("7px solid goldenrod");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 3500 && userDocument.data.userObj.fantasyForecastPoints < 4000) {
                    setForecasterRank("Clairvoyant");
                    setProfilePicStyle("7px solid goldenrod");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 4000 && userDocument.data.userObj.fantasyForecastPoints < 4500) {
                    setForecasterRank("Augur");
                    setProfilePicStyle("7px solid goldenrod");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 4500 && userDocument.data.userObj.fantasyForecastPoints < 5000) {
                    setForecasterRank("Omniscient");
                    setProfilePicStyle("7px solid goldenrod");
                } else if (userDocument.data.userObj.fantasyForecastPoints >= 5000) {
                    setForecasterRank("Diviner");
                    setProfilePicStyle("7px solid #383D67");
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
            const updatedUserDocument = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/onboardingTask/${username}`, {
                onboardingTask: "visitProfilePage",
                ffPointsIfFalse: 100,
                ffPointsIfTrue: 0
            });
            if (updatedUserDocument.data.firstTime === true) {
                setShowModal(true);
                setModalContent("You just got 100 Fantasy Forecast Points for visiting your profile for the first time!");
            };
            // Try to redo this so that we don't need to do the GET first 
            // const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            // if (userDocument.data[0].onboarding.visitProfilePage === true) {
            //     return;
            // } else {
            //     userDocument.data[0].onboarding.visitProfilePage = true;
            //     userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 100
            //     await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, 
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
        if (props.username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to change your password.");
            return;
        } else {
            try {
                if (newPW.length < 4) {
                    setPasswordChangeMsg("Your username and password must be at least 5 characters and contain no spaces.");
                    return;
                } else if (/\s/.test(newPW)) {
                    setPasswordChangeMsg("Your username and password must be at least 5 characters and contain no spaces.");
                    return;
                } else {
                    const newDoc = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/newPW/${props.username}`, { password: newPW });
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
                        <img className="profile-profile-pic" src={props.profilePicture} alt="Temporary profile pic" style={{border: profilePicStyle}}/>
                        <div className="profile-summary">
                            {/* <ul className="profile-summary-list">  */}
                                <div key={0} className="profile-summary-list-item">
                                    <h2 className="profile-summary-list-item-value">{fantasyForecastPoints === undefined ? (Math.floor(props.user.fantasyForecastPoints/100)).toFixed(0): level}<h5>{forecasterRank}</h5></h2>
                                    <h3>Forecaster Level</h3>
                                </div>
                                <div key={1} className="profile-summary-list-item">
                                    <h2 className="profile-summary-list-item-value">{fantasyForecastPoints === undefined ? props.user.fantasyForecastPoints.toFixed(0): fantasyForecastPoints.toFixed(0)}</h2>
                                    <h3>Fantasy Forecast Points</h3>
                                </div>
                                <div key={2} className="profile-summary-list-item">
                                    <h2 className="profile-summary-list-item-value">{isNaN(brierAverage) ? "N/A" : brierAverage }</h2>
                                    <h3>Brier Score Average</h3>
                                </div>
                                <div key={3} className="profile-summary-list-item">
                                    <h2 
                                        className="profile-summary-list-item-value"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setModalContent(bestForecastForModal);
                                            setShowModal(true);
                                        }}>
                                            {bestForecast}
                                    </h2>
                                    <h3>Best Forecast</h3>
                                </div>
                                <div key={4} className="profile-summary-list-item">
                                    <h2 className="profile-summary-list-item-value">{index}</h2>
                                    <h3>Fantasy Forecast All-Time Rank</h3>
                                </div>
                                <div key={5} className="profile-summary-list-item">
                                    {/* <h2 className="profile-summary-list-item-value">{markets.split(", ").length}</h2> */}
                                    <h2 
                                        className="profile-summary-list-item-value"
                                        onClick={() => {
                                            setModalContent("This is your net score from truthful and relevant ratings received on your news feed posts. For example, if 3 forecasters said your post was both truthful and relevant, your score would be +6. If a fourth forecaster then rated your post as neither truthful or relevant, your score would drop to +4. This score can be useful for learning more about other forecasters. Submitting ratings on other forecaster's posts for truthfulness and relevance is locked until you reach Level 20.");
                                            setShowModal(true);
                                        }}>
                                            {props.user.ratings > 0 ? "+" + props.user.ratings : props.user.ratings === 0 ? "+/-" + props.user.ratings : "-" + props.user.ratings}
                                    </h2>
                                    <h3>Post Rating</h3>
                                </div>
                            {/* </ul> */}
                        </div>
                    </div>
                    <div className="profile-stats-rewards-container">
                        <div className="profile-nav-menu">
                            <div className="profile-tab" onClick={() => setProfileTab("my-stats")}><h3>My Stats</h3></div>
                            <div className="profile-tab" onClick={() => setProfileTab("my-forecasts")}><h3>My Forecasts</h3></div>
                            <div className="profile-tab" onClick={() => setProfileTab("my-trophies")}><h3>My Trophies</h3></div>
                        </div>
                        {profileTab === "my-stats" && <ProfileStats 
                            username={props.username} 
                            brierScores={brierScoresArr} 
                            userObj={userObj} 
                            profileTab={profileTab}
                            ffPoints={fantasyForecastPoints}
                        />}
                        {profileTab === "my-forecasts" && <ProfileForecasts userObj={userObj} searched={false} />}
                        {profileTab === "my-trophies" && <ProfileRewards userObj={userObj} />}
                    </div>
                    <br />
                    {/* <div className="profile-details-container">
                        <div className="profile-details-sub-container">
                            <h3 className="profile-details-header">Want to change your password?</h3>
                            <label htmlFor="password" className="profile-details-label">Password:</label>
                            <input 
                                className="profile-details-input"
                                type="password" 
                                name="password" 
                                id="password"
                                onChange={(e) => { 
                                    setNewPassword(e.target.value);
                                    setPasswordChangeMsg("");
                                }}
                            />
                            <button onClick={() => changePassword(newPassword)} className="change-pw-btn">Change Password</button>
                            {passwordChangeMsg}
                        </div>
                        <div className="profile-details-sub-container">
                            <h3 className="profile-details-header">Want to delete your account?</h3>
                            <p>Send an email to <b>fantasyforecastcontact@gmail.com</b> and we will delete it for you.</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Profile;
