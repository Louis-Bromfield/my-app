import React, { useState, useEffect } from "react";
import "./RaceSummary.css";
import { Line } from 'react-chartjs-2';
import IndividualHomeProblemPreview from "../HomePage/HomeSectionButtons/IndividualHomeProblemPreview";
import axios from "axios";

function RaceSummary(props) {
    const [allForecastData, setAllForecastData] = useState([]);
    const [overallWinnerAvg, setOverallWinnerAvg] = useState(0);

    const getData = async () => {
        try {
            let forecastData = await axios.get(`http://localhost:8000/forecasts`);
            // Placeholder
            for (let i = 0; i < forecastData.data.length; i++) {
                if (forecastData.data[i].problemName === "Who will win the 2024 US Presidential Election?") {
                    console.log("bingo");
                    console.log(forecastData.data[i]);
                    setAllForecastData(forecastData.data[i]);
                }
            }
            // setAllForecastData(forecastData.data);
        } catch (err) {
            console.log(err);
        };
    };

    const handleNewStatToShow = (newData) => {
        setOverallWinnerAvg(newData);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="race-summary">
            <h1 className="page-header">The 2024 US Presidential Election</h1>
            <p>According to our Jockeys</p>
            <div className="main-results-container">
                <div className="vis-one">
                    <IndividualHomeProblemPreview 
                        data={allForecastData}
                        handleNewStatToShow={handleNewStatToShow}
                        isSummaryPage={true}
                    />
                    <div className="individual-summary-container">
                        {overallWinnerAvg > 50 && <h2>Our Jockeys believe Donald Trump has a <u style={{ color: "#404d72"}}>{overallWinnerAvg}%</u> chance to win the White House in November, compared to a <u style={{ color: "#404d72"}}>{100-overallWinnerAvg}%</u> chance for VP Kamala Harris.</h2>}
                        {overallWinnerAvg === 50 && <h2>Our Jockeys believe Donald Trump and Kamala Harris are tied at <u style={{ color: "#404d72"}}>{overallWinnerAvg}%-{overallWinnerAvg}%</u> chances to win the White House in November</h2>}
                        {overallWinnerAvg < 50 && <h2>Our Jockeys believe Kamala Harris is favourite to win the White House in November, at a <u style={{ color: "#404d72"}}>{100-overallWinnerAvg}%</u> chance, compared to a <u style={{ color: "#404d72"}}>{overallWinnerAvg}%</u> chance for Donald Trump.</h2>}
                        <p><i>These scores are derived as the average of all predictions submitted to this Race.</i></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaceSummary;