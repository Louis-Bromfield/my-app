import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Onboarding.css';
import ReactLoading from 'react-loading';

function Onboarding(props) {
    const [onboardingBooleans, setOnboardingBooleans] = useState([]);
    const [onboardingLoading, setOnboardingLoading] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    useEffect(() => {
        getAllOnboardingBooleans(props.username);
    }, [props.username]);

    const getAllOnboardingBooleans = async (username) => {
        try {
            const allOnboardingBooleans = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            setOnboardingLoading(true)
            setTimeout(() => {
                setOnboardingLoading(false);
                setOnboardingBooleans(allOnboardingBooleans.data[0].onboarding);
                let complete = true;
                Object.entries(allOnboardingBooleans.data[0].onboarding).forEach(ele => {
                    if (typeof ele[1] === "boolean" && ele[1] === false) {
                        complete = false;
                        props.setOnboardingClassName("onboarding-div");
                    };
                });
                setOnboardingComplete(complete);
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="conditional-div">
            {onboardingComplete === true && 
                <div></div>
            }
            {(onboardingComplete === false && props.isHidden) && <div className="onboarding-incomplete">
                <div className="onboarding-title-div">
                    <h2 className="onboarding-title">Onboarding</h2>
                    <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button>
                </div>
            </div>}
            {(onboardingComplete === false && (!props.isHidden && onboardingLoading === true)) &&
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h2 className="onboarding-title">Onboarding</h2>
                        <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button>
                    </div>
                    <div className="loading-div">
                        <ReactLoading type="bars" color="#404d72" height="30%" width="30%"/>
                    </div>
                </div>
            }
            {(onboardingComplete === false && (!props.isHidden && onboardingLoading === false)) && 
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h2 className="onboarding-title">Onboarding</h2>
                        <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button>
                    </div>
                    <ul className="onboarding-list">
                    <li 
                            className="onboarding-list-item" 
                            style={{ backgroundColor: onboardingBooleans.visitProfilePage ? "lightgreen" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("This can be done by clicking on your username in the top right of the screen!")}}>
                                <h4>Visit your profile page</h4>
                                <h4>Reward: 100pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ backgroundColor: onboardingBooleans.joinAMarket ? "lightgreen" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("You can't submit any forecasts until you join a market. To do this, select Leaderboards from the top of the screen, then press the Join A Market button!")}}>
                                <h4>Join a market</h4>
                                <h4>Reward: 150pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ backgroundColor: onboardingBooleans.submitAForecast ? "lightgreen" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("Once you've joined a market, the dropdown menu at the top of the My Forecasts page will contain problems you are able to tackle based on the markets you have joined. Submit a forecast to any problem to complete this onboarding task!")}}>
                                <h4>Submit a forecast</h4>
                                <h4>Reward: 300pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ backgroundColor: onboardingBooleans.submitAPost ? "lightgreen" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("This can be done by pressing the Post to your Feed button at the top of the News Feed!")}}>
                                <h4>Submit a post</h4>
                                <h4>Reward: 200pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ backgroundColor: onboardingBooleans.completeALearnQuiz ? "lightgreen" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("All of the topics found on the Learn page (apart from Fantasy Forecast Points) contain a quiz at the end of their information page!")}}>
                                <h4>Complete a Learn Quiz</h4>
                                <h4>Reward: 250pts</h4>
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default Onboarding;
