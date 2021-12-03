import React from 'react';
import './ForecastTabPaneMenu.css';

function ForecastTabPaneMenu(props) {
    return (
        <div className="forecast-tab-pane-menu">
            <div className="tab-pane-selector" onClick={() => props.setTab("articles")}>
                {props.chosenTab === "articles" && <h2 className="selected-tab">Articles</h2>}
                {props.chosenTab !== "articles" && <h2 className="unselected-tab">Articles</h2>}
            </div>
            <div className="tab-pane-selector" onClick={() => props.setTab("forecastStats")}>
                {props.chosenTab === "forecastStats" && <h2 className="selected-tab">Forecast Stats</h2>}
                {props.chosenTab !== "forecastStats" && <h2 className="unselected-tab">Forecast Stats</h2>}
            </div>
        </div>
    )
}

export default ForecastTabPaneMenu;
