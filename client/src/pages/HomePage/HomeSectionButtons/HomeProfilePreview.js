import React, { useState, useEffect } from 'react';
import './HomeProfilePreview.css';
import axios from 'axios';
import { HomeButtonNavButton } from './HomeButtonNavButton';

function HomeProfilePreview(props) {
    const [progressBarWidth, setProgressBarWidth] = useState();
    const [oppositeProgressBarWidth, setOppositeProgressBarWidth] = useState();
    const [ffPoints, setFFPoints] = useState(0);

    useEffect(() => {
        console.log(props.user.fantasyForecastPoints);
        if (props.user.fantasyForecastPoints === undefined) {
            getUserDetails(localStorage.getItem("username"));
        } else {
            setFFPoints(props.user.fantasyForecastPoints);
        };
        console.log("HomeProfilePreviewUE");
        const targetRounded = Math.ceil(ffPoints/100) * 100;
        console.log(targetRounded);
        const progressPercentage = (targetRounded - ffPoints);
        setProgressBarWidth(`${100 - progressPercentage.toFixed(0)}%`);
        setOppositeProgressBarWidth(`${progressPercentage.toFixed(0)}%`)
    }, [props.user.fantasyForecastPoints, ffPoints]);

    const getUserDetails = async (username) => {
        console.log("came here!");
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
            <h2 className="home-button-large-title">My Profile Preview</h2>
            <div className="home-profile-preview-container">
                <img className="home-profile-preview-img" src={props.user.profilePicture} alt="" />
                <h2>{props.user.username}</h2>
                <h3>Level {Math.floor((ffPoints/100)).toFixed(0)} Forecaster</h3>
                <h3>{ffPoints.toFixed(0)} Fantasy Forecast Points</h3>
                <br />
                <h3>Progress To Next Level:</h3>
                <div className="home-profile-preview-level-and-xp">
                    <div className="home-profile-preview-level">
                        <h2>{Math.floor((ffPoints/100)).toFixed(0)}</h2>
                    </div>
                    <div className="home-profile-preview-xp">
                        <div className="progress-bar" style={{ backgroundColor: "#404d72", color: "white", width: `${progressBarWidth}`}}><p>{progressBarWidth}</p></div>
                        <div className="progress-bar" style={{ backgroundColor: "orange", color: "white", width: `${oppositeProgressBarWidth}`}}><p>{oppositeProgressBarWidth}</p></div>
                    </div>
                </div>
            </div>
            <HomeButtonNavButton path="my-profile" />
        </div>
    )
}

export default HomeProfilePreview;