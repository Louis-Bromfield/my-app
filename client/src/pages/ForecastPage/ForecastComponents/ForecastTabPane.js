import React, { useState } from 'react';
import ForecastTabPaneMenu from './ForecastTabPaneMenu';
import ForecastTabPaneDisplay from './ForecastTabPaneDisplay';
import './ForecastTabPane.css';

function ForecastTabPane(props) {
    const [selectedTab, setSelectedTab] = useState("default");

    const changeTab = (newTab) => {
        setSelectedTab(newTab);
    };
    
    return (
        <div className="forecast-tab-pane">
            <ForecastTabPaneMenu 
                setTab={changeTab} 
                chosenTab={selectedTab}
                username={props.username}
            />
            <ForecastTabPaneDisplay 
                chosenTab={selectedTab} 
                selectedForecast={props.selectedForecast} 
                username={props.username} 
                leaderboard={props.leaderboard}
                refresh={props.refresh}
                forecastSingleCertainty={props.forecastSingleCertainty}
            />
        </div>
    )
}

export default ForecastTabPane;
