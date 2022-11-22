import axios from 'axios';
import React from 'react';
import './ForecastTabPaneMenu.css';

function ForecastTabPaneMenu(props) {

    const updateArticleTabVisits = async (username) => {
        try {
            // const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            // let increasedVisits = userDocument.data[0].articleVisits + 1;
            let increasedVisits = props.userObject.articleVisits + 1;
            await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, { 
                articleVisits: increasedVisits
            });
        } catch (error) {
            console.log("Error in ForecastTabPaneMenu > updateArticleTabVisits");
            console.log(error);
        };
    };

    return (
        <div className="forecast-tab-pane-menu">
            <div className="tab-pane-selector" onClick={() => { props.setTab("articles"); updateArticleTabVisits(props.username) }}>
                {props.chosenTab === "articles" && <h2 className="selected-tab">Articles</h2>}
                {props.chosenTab !== "articles" && <h2 className="unselected-tab">Articles</h2>}
            </div>
            <div className="tab-pane-selector" onClick={() => props.setTab("forecastStats")}>
                {props.chosenTab === "forecastStats" && <h2 className="selected-tab">Forecast Stats</h2>}
                {props.chosenTab !== "forecastStats" && <h2 className="unselected-tab">Forecast Stats</h2>}
            </div>
            <div className="tab-pane-selector" onClick={() => props.setTab("results")}>
                {props.chosenTab === "results" && <h2 className="selected-tab">Results</h2>}
                {props.chosenTab !== "results" && <h2 className="unselected-tab">Results</h2>}
            </div>
        </div>
    )
}

export default ForecastTabPaneMenu;
