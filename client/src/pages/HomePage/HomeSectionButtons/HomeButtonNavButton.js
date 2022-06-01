import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeButtonNavButton.css';
import PropTypes from 'prop-types';

export const HomeButtonNavButton = (props) => {
    const history = useNavigate();
    let buttonDestination;
    let localStoragePageName;

    switch (props.path) {
        case ("forecast"):
            buttonDestination = "My Forecasts";
            localStoragePageName = "My Forecasts"
            break;
        case ("leaderboard"):
            buttonDestination = "the Leaderboards";
            localStoragePageName = "Leaderboards"
            break;
        case ("leaderboard-select"):
            buttonDestination = "the Leaderboards";
            localStoragePageName = "Leaderboards"
            break;
        case ("learn"):
            buttonDestination = "the Learn section";
            localStoragePageName = "Learn"
            break;
        case ("my-profile"):
            buttonDestination = "My Profile";
            localStoragePageName = "My Profile"
            break;
        default:
            buttonDestination = "Home";
            localStoragePageName = "Home"
            break;
    }
    return (
        <button 
            className="home-button-nav-button" 
            onClick={() => {
                navigate(props.path);
                localStorage.setItem("selectedPage", localStoragePageName);
            }}>
                Go to {buttonDestination}
        </button>
    )
}

HomeButtonNavButton.propTypes = {
    path: PropTypes.string.isRequired
};