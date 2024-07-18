import React, { useEffect, useState } from 'react';
import ForecastProblemLineChart from './ForecastProblemLineChart';

function ForecastDataSubmission(props) {
    const [selectedForecast, setSelectedForecast] = useState({});

    useEffect(() => {
        setSelectedForecast(props.selectedForecast);
    }, [props.selectedForecast]);

    // selectedForecastObject={selectedForecastObject} 
    // updateTodayStats={props.updateTodayStats} 
    // username={props.username} 
    // refreshChartAppearance={refreshChartAppearance} 
    // forecastSingleCertainty={forecastSingleCertainty}
    // userPreviousAttemptCertainty={userPreviousAttemptCertainty}
    // userPreviousAttemptComments={userPreviousAttemptComments}
    // previousCertaintyOne={previousCertaintyOne}
    // previousCertaintyTwo={previousCertaintyTwo}
    // previousCertaintyThree={previousCertaintyThree}
    
    return (
        <div>
            {/* See ForecastSubmission for conditional formatting based on if problem */}
            {/* is closed (darkred) or not (theme blue) background color */}
            <h1 className="selected-forecast" style={{ fontSize: "0.95em" }}>{selectedForecast.problemName}</h1>
            <h4>We need:</h4>
            <ul style={{ "marginLeft": "5vw" }}>
                <li>the line chart</li>
                <li>the forecast submission section</li>
                <li>the articles section</li>
            </ul>
            <ForecastProblemLineChart 
                selectedForecastObject={selectedForecast}
            />
        </div> 
    )
}

export default ForecastDataSubmission;
