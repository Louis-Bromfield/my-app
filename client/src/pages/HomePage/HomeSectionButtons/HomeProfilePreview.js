import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeProfilePreview.css';
import axios from 'axios';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';
import ProfilePictureChooserModal from '../../../components/ProfilePictureChooserModal';

function HomeProfilePreview(props) {
    const [progressBarWidth, setProgressBarWidth] = useState();
    const [oppositeProgressBarWidth, setOppositeProgressBarWidth] = useState();
    const [ffPoints, setFFPoints] = useState(0.00);
    const [forecasterRank, setForecasterRank] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [profilePicStyle, setProfilePicStyle] = useState("none");
    const [openProfilePicChooser, setOpenProfilePicChooser] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [learnProgress, setLearnProgress] = useState(0);
    const [totalQuizCount, setTotalQuizCount] = useState(0);
    const [completeTrophyCount, setCompleteTrophyCount] = useState(0);

    useEffect(() => {
        console.log("HomeProfilePreviewUE");
        if (props.userObj === undefined || props.userObj === {}) {
            getUserDetails(props.username);
        } else {
            setFFPoints(props.userObj.fantasyForecastPoints);
        };
        
        const targetRounded = Math.ceil(ffPoints/100) * 100;
        const progressPercentage = (targetRounded - ffPoints);
        setProgressBarWidth(`${100 - progressPercentage.toFixed(0)}%`);
        setOppositeProgressBarWidth(`${progressPercentage.toFixed(0)}%`)
        if (props.userObj.fantasyForecastPoints < 500) {
            setForecasterRank("Guesser");
        } else if (props.userObj.fantasyForecastPoints >= 500 && props.userObj.fantasyForecastPoints < 1000) {
            setForecasterRank("Predictor");
        } else if (props.userObj.fantasyForecastPoints >= 1000 && props.userObj.fantasyForecastPoints < 1500) {
            setForecasterRank("Forecaster");
        } else if (props.userObj.fantasyForecastPoints >= 1500 && props.userObj.fantasyForecastPoints < 2000) {
            setForecasterRank("Seer");
            setProfilePicStyle("5px solid #cd7f32");
        } else if (props.userObj.fantasyForecastPoints >= 2000 && props.userObj.fantasyForecastPoints < 2500) {
            setForecasterRank("Soothsayer");
            setProfilePicStyle("5px solid silver");
        } else if (props.userObj.fantasyForecastPoints >= 2500 && props.userObj.fantasyForecastPoints < 3000) {
            setForecasterRank("Oracle");
            setProfilePicStyle("5px solid goldenrod");
        } else if (props.userObj.fantasyForecastPoints >= 3000 && props.userObj.fantasyForecastPoints < 3500) {
            setForecasterRank("Prophet");
            setProfilePicStyle("5px solid goldenrod");
        } else if (props.userObj.fantasyForecastPoints >= 3500 && props.userObj.fantasyForecastPoints < 4000) {
            setForecasterRank("Clairvoyant");
            setProfilePicStyle("5px solid goldenrod");
        } else if (props.userObj.fantasyForecastPoints >= 4000 && props.userObj.fantasyForecastPoints < 4500) {
            setForecasterRank("Augur");
            setProfilePicStyle("5px solid goldenrod");
        } else if (props.userObj.fantasyForecastPoints >= 4500 && props.userObj.fantasyForecastPoints < 5000) {
            setForecasterRank("Omniscient");
            setProfilePicStyle("5px solid goldenrod");
        } else if (props.userObj.fantasyForecastPoints >= 5000) {
            setForecasterRank("Diviner");
            setProfilePicStyle("5px solid #383D67");
        };
        let totalQuizzes = 0;
        let completeQuizzes = 0;
        for (let i = 0; i < Object.values(props.userLearnQuizzes).length; i++) {
            if (Object.values(props.userLearnQuizzes)[i] === true || Object.values(props.userLearnQuizzes)[i] === false) {
                totalQuizzes++;
                if (Object.values(props.userLearnQuizzes)[i] === true) {
                    completeQuizzes++;
                };
            };
        };
        setLearnProgress(completeQuizzes);
        setTotalQuizCount(totalQuizzes);
        let trophyCount = 0;
        if (props.userObj.trophies !== undefined) {
            for (let i = 0; i < props.userObj.trophies.length; i++) {
                if (props.userObj.trophies[i].obtained === true) {
                    trophyCount++;
                };
            };
            setCompleteTrophyCount(trophyCount);
        }
    }, [props.userObj.fantasyForecastPoints, ffPoints]);

    const getUserDetails = async (username) => {
        try {
            const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            setFFPoints(userDocument.data[0].fantasyForecastPoints);
        } catch (error) {
            console.error("Error in HomeProfilePreview > getUserDetails");
            console.error(error);
        };
    };

    const changeProfilePic = (newPic) => {
        console.log("called profile > changeProfilePic");
        if (newPic !== null && newPic !== "") {
            setNewProfilePic(newPic);
        };
    };

    return (
        <div className="home-profile-preview">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <ProfilePictureChooserModal
                show={openProfilePicChooser} 
                justClose={() => setOpenProfilePicChooser(false)}
                username={props.username}
                changeProfilePic={changeProfilePic}
            />
            <h2 className="home-button-large-title">Profile</h2>
            <div className="home-profile-preview-container">
                <img className="home-profile-preview-img" src={newProfilePic === null ? props.userObj.profilePicture : newProfilePic} alt="" style={{border: profilePicStyle}} onClick={() => setOpenProfilePicChooser(true) }/>
                            <Link to="/my-profile" style={{ textDecoration: "none", color: "#404d72" }}><h2>{props.userObj.username}</h2></Link>
                            <p>Level {Math.floor((ffPoints/100)).toFixed(0)} {forecasterRank}</p>
                            <br />
                <div className="home-profile-preview-level-and-xp">
                    <div className="home-profile-preview-level">
                        <h2>{Math.floor((ffPoints/100)).toFixed(0)}</h2>
                    </div>
                    <div className="home-profile-preview-xp">
                        <div 
                            className="progress-bar" 
                            style={{ 
                                backgroundColor: "#404d72", 
                                color: "white", 
                                width: `${progressBarWidth}`,
                                borderTopLeftRadius: "5px",
                                borderBottomLeftRadius: "5px"
                            }}>
                                <p>{progressBarWidth}</p>
                            </div>
                        <div 
                        className="progress-bar" 
                        style={{ 
                            backgroundColor: "orange", 
                            color: "white",
                            width: `${oppositeProgressBarWidth}`,
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px"
                        }}>
                            <p>{oppositeProgressBarWidth}</p>
                        </div>
                    </div>
                </div>
                <div className="home-profile-preview-stats-list-container">
                    <div className="home-profile-preview-stats-list-left">
                        <h4>
                            Fantasy Forecast Points
                            <FaInfoCircle 
                                color={"orange"} 
                                className="modal-i-btn"
                                onClick={() => { setShowModal(true); setModalContent(`Fantasy Forecast Points are earned through the majority of your interactions with the site. Submitting a forecast (you'll also get points when a problem closes and you receive a score based on how accurate you were), posting to the news feed, completing the Onboarding tasks, attempting the quizzes found on the Learn page and more! Head to the Learn page and select the "Fantasy Forecast Points" topic for more info!`)}}
                            />
                        </h4>
                        <h4>Quiz Completion</h4>
                        <h4>Average Score</h4>
                        <h4>Trophies Earned</h4>
                    </div>
                    <div className="home-profile-preview-stats-list-right">
                        <h4><strong>{ffPoints === undefined ? 0 : ffPoints.toFixed(0)}</strong></h4>
                        <h4><strong>{learnProgress} / {totalQuizCount}</strong></h4>
                        <h4><strong>108.11</strong></h4>
                        <h4><strong>{completeTrophyCount} / 12</strong></h4>
                    </div>
                </div>
            </div>
            <HomeButtonNavButton path="my-profile" />
        </div>
    )
}

export default HomeProfilePreview;