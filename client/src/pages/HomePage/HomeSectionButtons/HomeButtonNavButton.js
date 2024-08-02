import React from 'react';
import { useHistory } from 'react-router-dom';
import './HomeButtonNavButton.css';
import PropTypes from 'prop-types';

export const HomeButtonNavButton = (props) => {
    const history = useHistory();
    let buttonDestination;
    let localStoragePageName;

    switch (props.path) {
        case ("forecast"):
            buttonDestination = "Forecasts";
            localStoragePageName = "Forecasts"
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
            buttonDestination = "Profile";
            localStoragePageName = "Profile"
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
                history.push(props.path);
                localStorage.setItem("selectedPage", localStoragePageName);
            }}>
                Go to {buttonDestination}
        </button>
    )
}

HomeButtonNavButton.propTypes = {
    path: PropTypes.string.isRequired
};