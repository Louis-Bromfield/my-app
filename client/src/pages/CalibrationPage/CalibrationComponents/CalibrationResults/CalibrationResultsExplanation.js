import React, { useState } from 'react';
import './CalibrationResultsExplanation.css';
import CalibrationAttributesExplained from './CalibrationAttributesExplained';
import CalibrationForecastsExplained from './CalibrationForecastsExplained';

function CalibrationResultsExplanation() {
    const [resultsPanel, setResultsPanel] = useState("Attributes");

    return (
        <div className="calibration-results-explained">
            <div className="calibration-results-explained-tab-menu">
                <h3 className="calibration-results-explained-tab-option" onClick={() => setResultsPanel("Attributes")}>Forecaster Attributes Explained</h3>
                <h3 className="calibration-results-explained-tab-option" onClick={() => setResultsPanel("Results")}>Historical Forecast Results</h3>
            </div>
            <div className="calibration-results-panel">
                {resultsPanel === "Attributes" &&
                    <CalibrationAttributesExplained />
                }
                {resultsPanel === "Results" &&
                    <CalibrationForecastsExplained />
                }
            </div>
        </div>
    )
}

export default CalibrationResultsExplanation;
