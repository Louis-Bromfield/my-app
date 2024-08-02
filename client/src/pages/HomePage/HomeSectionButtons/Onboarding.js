import React, { useState, useEffect } from 'react';
import './Onboarding.css';
import ReactLoading from 'react-loading';

function Onboarding(props) {
    const [onboardingBooleans, setOnboardingBooleans] = useState([]);
    const [onboardingLoading, setOnboardingLoading] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    useEffect(() => {
        if (props.userOnboarding !== undefined) {
        getAllOnboardingBooleans(props.userOnboarding);
        };
    }, [props.userOnboarding]);

    // Using props version
    const getAllOnboardingBooleans = (userOnboarding) => {
        try {
            const allOnboardingBooleans = userOnboarding;
            setOnboardingLoading(true)
            setTimeout(() => {
                setOnboardingLoading(false);
                setOnboardingBooleans(allOnboardingBooleans);
                let complete = true;
                Object.entries(allOnboardingBooleans).forEach(ele => {
                    if (typeof ele[1] === "boolean" && ele[1] === false) {
                        complete = false;
                        props.setOnboardingClassName("onboarding-div");
                    };
                });
                setOnboardingComplete(complete);
            }, 1000);
        } catch (error) {
            console.error("Error in getAllOnboardingBooleans");
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
                    <h3 className="onboarding-title">Onboarding</h3>
                    {/* <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button> */}
                </div>
            </div>}
            {(onboardingComplete === false && (!props.isHidden && onboardingLoading === true)) &&
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h3 className="onboarding-title">Onboarding</h3>
                        {/* <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button> */}
                    </div>
                    <div className="loading-div">
                        <ReactLoading type="bars" color="#404d72" height="30%" width="30%"/>
                    </div>
                </div>
            }
            {(onboardingComplete === false && (!props.isHidden && onboardingLoading === false)) && 
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h3 className="onboarding-title">Onboarding</h3>
                        {/* <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button> */}
                    </div>
                    <ul className="onboarding-list">
                    <li 
                            className="onboarding-list-item" 
                            style={{ color: onboardingBooleans.visitProfilePage ? "green" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("This can be done by clicking on the Profile button at the top of the page, then selecting Go to my Profile, or by clicking Go to My Profile on the Home Page's Profile Preview!")}}>
                                <h4>Visit your profile page: 100pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ color: onboardingBooleans.submitAForecast ? "green" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("On the Forecasts page, select a Problem from the dropdown menu at the top. Submit a forecast to any problem to complete this onboarding task!")}}>
                                <h4>Submit a forecast: 300pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ color: onboardingBooleans.submitAPost ? "green" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("This can be done by pressing the Post to your Feed button at the top of the News Feed!")}}>
                                <h4>Submit a post: 200pts</h4>
                        </li>
                        <li 
                            className="onboarding-list-item" 
                            style={{ color: onboardingBooleans.completeALearnQuiz ? "green" : "none" }}
                            onClick={() => { props.setShowModal(true); props.setModalContent("Three of the topics found on the Learn page contain a quiz at the end of their information page!")}}>
                                <h4>Complete a Learn Quiz: 250pts</h4>
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default Onboarding;
