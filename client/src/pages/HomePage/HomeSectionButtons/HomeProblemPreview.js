import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './HomeProblemPreview.css';
import IndividualHomeProblemPreview from './IndividualHomeProblemPreview';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import NewForecastsCallToAction from './NewForecastsCallToAction';


function HomeProblemPreview(props) {
    const [problemData, setProblemData] = useState([]);


    useEffect(() => {
        console.log("HomeProblemPreviewUE");
        getProblemData();
    }, []);

    const getProblemData = async () => {
        try {
            const forecastData = await axios.get(`${process.env.REACT_APP_API_CALL_F}`);
            setProblemData(forecastData.data);
        } catch (error) {
            console.error("Error in HomeProblemPreview > getProblemData");
            console.error(error);
        };
    };

    return (
        <div className="home-problem-preview">
            {/* <NewForecastsCallToAction username={props.username} />  */}
            {/* <h2 className="home-button-large-title">
                Live Forecasts
            </h2> */}
            {/* Need to have a list (use map?) of either say 5-10 problems closest
            to closing. If we don't have enough live ones, maybe have closed ones? 
            Would ideally like a way to show users if the one they're looking at is
            live or not, maybe the live one could be have "live" in green? and closed
            would say "Closed" in red, the live ones having a flashing live button like
            you see on news websites would be amazing */}
            <div className="ticker-wrap">
                <div className="ticker">
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                </div>
            </div>
            {/* <HomeButtonNavButton path={"forecast"}/> */}
        </div>
    )
}

export default HomeProblemPreview;