import React, { useState, useEffect } from 'react';
import './HomeProfilePreview.css';
import axios from 'axios';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function HomeProfilePreview(props) {
    const [progressBarWidth, setProgressBarWidth] = useState();
    const [oppositeProgressBarWidth, setOppositeProgressBarWidth] = useState();
    const [ffPoints, setFFPoints] = useState(0);
    const [forecasterRank, setForecasterRank] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        console.log("HomeProfilePreviewUE");
        if (props.user.fantasyForecastPoints === undefined) {
            getUserDetails(localStorage.getItem("username"));
        } else {
            setFFPoints(props.user.fantasyForecastPoints);
        };
        // Need to add checks for if the user has below 100 points (100 would be level 1 (fine), but 60 points would be level 0.6 (not fine))
        const targetRounded = Math.ceil(ffPoints/100) * 100;
        const progressPercentage = (targetRounded - ffPoints);
        setProgressBarWidth(`${100 - progressPercentage.toFixed(0)}%`);
        setOppositeProgressBarWidth(`${progressPercentage.toFixed(0)}%`)
        if (props.user.fantasyForecastPoints < 500) {
            setForecasterRank("Guesser");
        } else if (props.user.fantasyForecastPoints >= 500 && props.user.fantasyForecastPoints < 1000) {
            setForecasterRank("Predictor");
        } else if (props.user.fantasyForecastPoints >= 1000 && props.user.fantasyForecastPoints < 1500) {
            setForecasterRank("Forecaster");
        } else if (props.user.fantasyForecastPoints >= 1500 && props.user.fantasyForecastPoints < 2000) {
            setForecasterRank("Seer");
        } else if (props.user.fantasyForecastPoints >= 2000 && props.user.fantasyForecastPoints < 2500) {
            setForecasterRank("Soothsayer");
        } else if (props.user.fantasyForecastPoints >= 2500 && props.user.fantasyForecastPoints < 3000) {
            setForecasterRank("Oracle");
        } else if (props.user.fantasyForecastPoints >= 3000 && props.user.fantasyForecastPoints < 3500) {
            setForecasterRank("Prophet");
        } else if (props.user.fantasyForecastPoints >= 3500 && props.user.fantasyForecastPoints < 4000) {
            setForecasterRank("Clairvoyant");
        } else if (props.user.fantasyForecastPoints >= 4000 && props.user.fantasyForecastPoints < 4500) {
            setForecasterRank("Augur");
        } else if (props.user.fantasyForecastPoints >= 4500 && props.user.fantasyForecastPoints < 5000) {
            setForecasterRank("Omniscient");
        } else if (props.user.fantasyForecastPoints >= 5000) {
            setForecasterRank("Diviner");
        };
    }, [props.user.fantasyForecastPoints, ffPoints]);

    // I'm fine with leaving this one here because it's wrapped in an undefined checker in the useEffect hook
    // so it won't fire everytime, only if we've lost that user prop
    const getUserDetails = async (username) => {
        try {
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            setFFPoints(userDocument.data[0].fantasyForecastPoints);
        } catch (error) {
            console.error("Error in HomeProfilePreview > getUserDetails");
            console.error(error);
        };
    };

    return (
        <div className="home-profile-preview">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2 className="home-button-large-title">My Profile Preview</h2>
            <div className="home-profile-preview-container">
                <img className="home-profile-preview-img" src={props.user.profilePicture} alt="" />
                <h2>{props.user.username}</h2>
                <h3>Level {Math.floor((ffPoints/100)).toFixed(0)} {forecasterRank}</h3>
                <h3>
                    {ffPoints.toFixed(0)} Fantasy Forecast Points
                    <FaInfoCircle 
                        color={"orange"} 
                        className="modal-i-btn"
                        onClick={() => { setShowModal(true); setModalContent(`Fantasy Forecast Points are earned through the majority of your interactions with the site. Submitting a forecast (you'll also get points when a problem closes and you receive a score based on how accurate you were), posting to the news feed, completing the Onboarding tasks, attempting the quizzes found on the Learn page and more! Head to the Learn page and select the "Fantasy Forecast Points" topic for more info!`)}}
                    />
                    </h3>
                <br />
                <h3>Progress To Next Level:</h3>
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
                            borderTopLeftRadius: "10px",
                            borderBottomLeftRadius: "10px"
                        }}>
                                <p>{progressBarWidth}</p>
                        </div>
                        <div 
                        className="progress-bar" 
                        style={{ 
                            backgroundColor: "orange", 
                            color: "white",
                            width: `${oppositeProgressBarWidth}`,
                            borderTopRightRadius: "10px",
                            borderBottomRightRadius: "10px"
                        }}>
                                <p>{oppositeProgressBarWidth}</p>
                        </div>
                    </div>
                </div>
            </div>
            <HomeButtonNavButton path="my-profile" />
        </div>
    )
}

export default HomeProfilePreview;