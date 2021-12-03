import React from 'react';
import './Calibration.css';
import ProgressBar from './CalibrationComponents/ProgressBar';
import CalibrationPanel from './CalibrationComponents/CalibrationPanel/CalibrationPanel';
import CalibrationResults from './CalibrationComponents/CalibrationResults/CalibrationResults';

function Calibration() {
    return (
        // Make Calibration Panel closeable, like the Onboarding tab on the Home Page
        <div className="calibration">
            <h1>Calibration</h1>
            <p>Welcome to the calibration page. Think of this as an introduction to forecasting and learning
                more about your own ability. Select "Calibration Intro" to begin!
            </p>
            <ProgressBar />
            <CalibrationPanel />
            <CalibrationResults />
        </div>
    )
}

export default Calibration;
