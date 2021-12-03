import React from 'react';
import './CalibrationForecastExplained.css';
import { Line } from 'react-chartjs-2';

function CalibrationForecastExplained(props) {
    const forecast1Data = {
        labels: ["", "Phase 1", "Phase 2", "Phase 3", ""],
        datasets: [
            {
                label: "Forecast #1 Brier Scores",
                data: [null, 1.08, 0.13, 0.32, null],
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false
    }
    const forecast2Data = {
        labels: ["", "Phase 1", "Phase 2", "Phase 3", ""],
        datasets: [
            {
                label: "Forecast #2 Brier Scores",
                data: [null, 0.08, 0.32, 0.12, null],
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false
    }
    const forecast3Data = {
        labels: ["", "Phase 1", "Phase 2", "Phase 3", ""],
        datasets: [
            {
                label: "Forecast #3 Brier Scores",
                data: [null, 0.08, 1.09, 1.42, null],
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false
    }

    return (
        <div>
            {props.forecastNumber === 1 &&
                <div className="forecast-explanation">
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Historical Context</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 80%</h4>
                            <h4>Brier Score: 0.08</h4>
                            <h4>Change: N/A</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Polling Data</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 60%</h4>
                            <h4>Brier Score: 0.32</h4>
                            <h4>Change: +0.24</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Close To Forecast Horizon News</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 75%</h4>
                            <h4>Brier Score: 0.12</h4>
                            <h4>Change: -0.20</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="line-chart-container">
                        <Line data={forecast1Data} />
                    </div>
                </div>
            }
            {props.forecastNumber === 2 &&
                <div className="forecast-explanation">
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Historical Context</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 80%</h4>
                            <h4>Brier Score: 0.08</h4>
                            <h4>Change: N/A</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Polling Data</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 60%</h4>
                            <h4>Brier Score: 0.32</h4>
                            <h4>Change: +0.24</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Close To Forecast Horizon News</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 75%</h4>
                            <h4>Brier Score: 0.12</h4>
                            <h4>Change: -0.20</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="line-chart-container">
                        <Line data={forecast2Data} />
                    </div>
                </div>
            }
            {props.forecastNumber === 3 &&
                <div className="forecast-explanation">
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Historical Context</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 80%</h4>
                            <h4>Brier Score: 0.08</h4>
                            <h4>Change: N/A</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Polling Data</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 60%</h4>
                            <h4>Brier Score: 0.32</h4>
                            <h4>Change: +0.24</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="explanation-and-stats">
                        <div className="explanation">
                            <h3 className="phase">Phase: Close To Forecast Horizon News</h3>
                            <p className="forecast-explanation">Information Provided: Here, a small breakdown of the information that was given 
                            to the user will be given. It will provide a recap of the historical information they were provided at this phase,
                            and so will allow them to see a snapshot of the information they used to make their prediction. To the right of this
                            will be a short breakdown of their forecast certainty, their Brier if they kept that score, and how it changed from
                            their previous prediction.</p>
                        </div>
                        <div className="stats">
                            <h3>Your Forecast</h3>
                            <h4>Certainty: 75%</h4>
                            <h4>Brier Score: 0.12</h4>
                            <h4>Change: -0.20</h4>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="line-chart-container">
                        <Line data={forecast3Data} />
                    </div>
                </div>
            }
        </div>
    )
}

export default CalibrationForecastExplained;
