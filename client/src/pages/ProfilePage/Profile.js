import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ProfileStats from './ProfileStats';
import Modal from '../../components/Modal';
import ProfileRewards from './ProfileRewards';
import ProfileForecasts from './ProfileForecasts';
import ProfilePictureChooserModal from '../../components/ProfilePictureChooserModal';

function Profile(props) {
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
    const [forecasterRank, setForecasterRank] = useState("Player");
    const [errorMessage, setErrorMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChangeMsg, setPasswordChangeMsg] = useState("");
    const [profilePicStyle, setProfilePicStyle] = useState("none");
    const [teamData, setTeamData] = useState();
    const [isTeam, setIsTeam] = useState(false);
    const [openProfilePicChooser, setOpenProfilePicChooser] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);

    useEffect(() => {
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
            // const userData = await axios.get(`http://localhost:8000/leaderboards/leaderboard/${lbName}`);
            for (let i = 0; i < userData.data.length; i++) {
                if (userData.data[i].username === username) {
                    setIndex(`${i+1}/${userData.data.length}`)
                };
            };
            const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/profileData/${username}`);
            // const userDocument = await axios.get(`http://localhost:8000/users/profileData/${username}`);
            
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
                if (userDocument.data.userObj.isTeam === true) {
                    setIsTeam(true);
                } else {
                    setIsTeam(false);
                }
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
            if (userDocument.data.userObj.inTeam === true) {
                const teamDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/profileData/${userDocument.data.userObj.teamName}`);    
                setTeamData(teamDocument.data);
            }
        } catch (error) {
            console.error("Error in Profile.js > retrieveUserInfoFromDB");
            console.error(error);
        };
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
                setModalContent("You just got 100 Horse Race Points for visiting your profile for the first time!");
            };
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

    const changeProfilePic = (newPic) => {
        console.log("called profile > changeProfilePic");
        if (newPic !== null && newPic !== "") {
            setNewProfilePic(newPic);
        };
    };
    
    return (
        <div className="profile">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <ProfilePictureChooserModal 
                show={openProfilePicChooser} 
                justClose={() => setOpenProfilePicChooser(false)}
                username={props.username}
                changeProfilePic={changeProfilePic}
            />
            <div className="main-profile-grid">
                <div className="profile-grid">
                    {/* <h1 className="profile-header">{errorMessage === "" ? `${props.username} - Level ${(Math.floor(props.user.fantasyForecastPoints/100)).toFixed(0)} ${forecasterRank}`: errorMessage}</h1>  */}
                    <h1 className="page-header">{errorMessage === "" ? `${props.username} - Level ${(Math.floor(props.user.fantasyForecastPoints/100)).toFixed(0)} ${forecasterRank}`: errorMessage}</h1> 
                    <br />
                    <div className="profile-main-info">
                        <img 
                            className="profile-profile-pic"
                            src={newProfilePic === null ? props.profilePicture : newProfilePic} 
                            alt="Temporary profile pic" 
                            style={{ border: profilePicStyle, cursor: "pointer" }}
                            onClick={() => setOpenProfilePicChooser(true)}
                            
                        />
                        <div className="profile-summary">
                            <div key={0} className="profile-summary-list-item">
                                <h2 
                                    className="profile-summary-list-item-value"
                                    onClick={() => {
                                        setModalContent("This is determined as your FF Points divided by 100. Earning more points = higher level, and these levels come with rewards.");
                                        setShowModal(true);
                                    }}>
                                        {fantasyForecastPoints === undefined ? (Math.floor(props.user.fantasyForecastPoints/100)).toFixed(0): level}
                                        <h5>{forecasterRank}</h5>
                                </h2>
                                <h3>Jockey Level</h3>
                            </div>
                            <div key={1} className="profile-summary-list-item"
                                onClick={() => {
                                    setModalContent("Horse Race Points are earned by submitting forecasts, posting to your feed, completing learn quizzes, and more. If you haven't already, check out the Onboarding menu on the Home page for tips on getting started.");
                                    setShowModal(true);
                                }}>
                                <h2 className="profile-summary-list-item-value">{fantasyForecastPoints === undefined ? props.user.fantasyForecastPoints.toFixed(0): fantasyForecastPoints.toFixed(0)}</h2>
                                <h3>Horse Race Points</h3>
                            </div>
                            <div key={2} className="profile-summary-list-item"
                                onClick={() => {
                                    setModalContent("This is the average score you've received for every problem you have submitted at least one forecast to.");
                                    setShowModal(true);
                                }}>
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
                            <div key={4} className="profile-summary-list-item"
                                onClick={() => {
                                    setModalContent("This is your placement in the Horse Race Politics All-Time leaderboard, which is determined solely by Horse Race Politics Points. To see it in full, go the Leaderboards page and select the Fantasy Forecast All-Time leaderboard.");
                                    setShowModal(true);
                                }}>
                                    <h2 className="profile-summary-list-item-value">{index}</h2>
                                    <h3>Horse Race Politics All-Time Rank</h3>
                            </div>
                            <div key={5} className="profile-summary-list-item">
                                <h2 
                                    className="profile-summary-list-item-value"
                                    onClick={() => {
                                        setModalContent("This is your net score from truthful and relevant ratings received on your news feed posts. For example, if 3 forecasters said your post was both truthful and relevant, your score would be +6. If a fourth forecaster then rated your post as neither truthful or relevant, your score would drop to +4. This score can be useful for learning more about other forecasters. Submitting ratings on other forecaster's posts for truthfulness and relevance is locked until you reach Level 4 (400 Fantasy Forecast Points).");
                                        setShowModal(true);
                                    }}>
                                        {props.user.ratings > 0 ? "+" + props.user.ratings : props.user.ratings === 0 ? "+/-" + props.user.ratings : "-" + props.user.ratings}
                                </h2>
                                <h3>Post Rating</h3>
                            </div>
                        </div>
                    </div>
                    <div className="profile-stats-rewards-container">
                        <div className="profile-nav-menu">
                            <div style={{ borderLeft: "0px solid #fff" }} className={profileTab === "my-stats" ? "profile-tab-selected" : "profile-tab"} onClick={() => setProfileTab("my-stats")}><h3>My Stats</h3></div>
                            <div style={{borderLeft: "0px solid #fff" }} className={profileTab === "my-forecasts" ? "profile-tab-selected" : "profile-tab"} onClick={() => setProfileTab("my-forecasts")}><h3>My Races</h3></div>
                            {isTeam === false && <div style={{borderLeft: "0px solid #fff" }} className={profileTab === "my-trophies" ? "profile-tab-selected" : "profile-tab"} onClick={() => setProfileTab("my-trophies")}><h3>My Trophies</h3></div>}
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
                </div>
            </div>
        </div>
    )
}

export default Profile;
