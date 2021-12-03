import React, { useState } from 'react';
import './CalibrationResults.css';
import CalibrationResultsSummary from './CalibrationResultsSummary';
import CalibrationResultsRadarChart from './CalibrationResultsRadarChart';
import CalibrationResultsExplanation from './CalibrationResultsExplanation';

function CalibrationResults() {
    // Conditionally render results component based on calibration completion (only show if complete)
    // useEffect to pull this from the DB
    // use ReactLoading while we pull all the CalibrationResults from DB
    // Maybe use setTimeout() after completing it for the first time to simulate a long load?
    const [calibrationComplete, setCalibrationComplete] = useState(true);
    
    return (
        <div className="container">
            <h1>Calibration Results</h1>
            {calibrationComplete &&
                <div className="calibration-results">
                    <div className="summary-and-chart">
                        <CalibrationResultsSummary />
                        <CalibrationResultsRadarChart />
                    </div>
                    <CalibrationResultsExplanation />
                </div>
            }
            {!calibrationComplete &&
            <div>
                <h2 className="results-not-available">Results will be shown upon completion of the calibration.</h2>
            </div>
            }
        </div>
    )
}

export default CalibrationResults;
