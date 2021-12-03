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
            const allOnboardingBooleans = await axios.get(`http://localhost:5000/users/${username}`);
            setOnboardingLoading(true)
            setTimeout(() => {
                setOnboardingLoading(false);
                setOnboardingBooleans(allOnboardingBooleans.data[0].onboarding);
                let complete = true;
                Object.values(allOnboardingBooleans.data[0].onboarding).forEach(ele => {
                    if (typeof ele === "boolean" && ele === false) {
                        complete = false;
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
            {(onboardingComplete === true && props.isHidden) && 
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h2 className="onboarding-title">Onboarding - Complete</h2>
                        <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button>
                    </div>
                </div>
            }
            {(onboardingComplete === true && (!props.isHidden && onboardingLoading === false)) && 
                <div className="onboarding">
                    <div className="onboarding-title-div">
                        <h2 className="onboarding-title">Onboarding - Complete</h2>
                        <button className="show-hide-onboarding-btn" onClick={props.handleClick}>{props.buttonText}</button>
                    </div>
                    <ul className="onboarding-list">
                    {onboardingBooleans.visitProfilePage ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Visit your profile page</h4>
                            <h4>Reward: 100pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Visit your profile page</h4>
                            <h4>Reward: 100pts</h4>
                        </li>

                    }
                    {onboardingBooleans.completeCalibration ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Complete the Calibraton</h4>
                            <h4>Reward: 400pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Complete the Calibraton</h4>
                            <h4>Reward: 400pts</h4>
                        </li>

                    }
                    {onboardingBooleans.joinAMarket ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Join a market</h4>
                            <h4>Reward: 150pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Join a market</h4>
                            <h4>Reward: 150pts</h4>
                        </li>

                    }
                    {onboardingBooleans.submitAPost ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Submit a post</h4>
                            <h4>Reward: 200pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Submit a post</h4>
                            <h4>Reward: 200pts</h4>
                        </li>

                    }
                    {onboardingBooleans.submitAForecast ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Submit a forecast</h4>
                            <h4>Reward: 300pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Submit a forecast</h4>
                            <h4>Reward: 300pts</h4>
                        </li>

                    }
                    {onboardingBooleans.completeALearnQuiz ?
                        <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                            <h4>Complete a Learn Quiz</h4>
                            <h4>Reward: 250pts</h4>
                        </li>
                    :
                        <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                            <h4>Complete a Learn Quiz</h4>
                            <h4>Reward: 250pts</h4>
                        </li>

                    }
                </ul>
                </div>
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
                        {onboardingBooleans.visitProfilePage ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Visit your profile page</h4>
                                <h4>Reward: 100pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Visit your profile page</h4>
                                <h4>Reward: 100pts</h4>
                            </li>

                        }
                        {onboardingBooleans.completeCalibration ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Complete the Calibraton</h4>
                                <h4>Reward: 400pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Complete the Calibraton</h4>
                                <h4>Reward: 400pts</h4>
                            </li>

                        }
                        {onboardingBooleans.joinAMarket ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Join a market</h4>
                                <h4>Reward: 150pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Join a market</h4>
                                <h4>Reward: 150pts</h4>
                            </li>

                        }
                        {onboardingBooleans.submitAPost ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Submit a post</h4>
                                <h4>Reward: 200pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Submit a post</h4>
                                <h4>Reward: 200pts</h4>
                            </li>

                        }
                        {onboardingBooleans.submitAForecast ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Submit a forecast</h4>
                                <h4>Reward: 300pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Submit a forecast</h4>
                                <h4>Reward: 300pts</h4>
                            </li>

                        }
                        {onboardingBooleans.completeALearnQuiz ?
                            <li className="onboarding-list-item" style={{ backgroundColor: "lightgreen" }}>
                                <h4>Complete a Learn Quiz</h4>
                                <h4>Reward: 250pts</h4>
                            </li>
                        :
                            <li className="onboarding-list-item" style={{ backgroundColor: "none" }}>
                                <h4>Complete a Learn Quiz</h4>
                                <h4>Reward: 250pts</h4>
                            </li>

                        }
                    </ul>
                </div>
            }
        </div>
    )
}

export default Onboarding;
