import React, { useState } from 'react';
import './HistoricForecast.css';

function HistoricForecast(props) {
    //Had to use strings for initial state setting as using 0.00 and 2.00 as numbers 
    //would display them as 0 and 2 respectively. Luckily, JS isn't strict on type
    let [prediction, setPrediction] = useState("0.00");
    let [oppositePrediction, setOppositePrediction] = useState("2.00");

    const calculateScore = (currentValue) => {
        if (currentValue > 100) {
            setPrediction("Error: Certainty over 100");
            setOppositePrediction("Error: Certainty over 100");
            return;
        } else if (currentValue < 0) {
            setPrediction("Error: Certainty under 0");
            setOppositePrediction("Error: Certainty under 0");
            return;
        }
        let currentPrediction = currentValue/100;

        //Correct Forecast
        let correctBrier = Math.pow((1-currentPrediction), 2);
        let incorrectBrier = Math.pow((0-(1-currentPrediction)), 2);
        let brierScore = (correctBrier + incorrectBrier).toFixed(2);
        setPrediction(brierScore);

        //Incorrect Forecast
        let correctBrier2 = Math.pow(1-(1-currentPrediction), 2);
        let incorrectBrier2 = Math.pow((0-currentPrediction), 2);
        let incorrectBrierScore = (correctBrier2 + incorrectBrier2).toFixed(2);
        setOppositePrediction(incorrectBrierScore);
    }

    return (
        <div className="container">
            <h1 className="section-title">Forecast #{props.forecastNum - 1}</h1>
            <div className="historic-forecast-div">
                {/* Outcome Dropdown */}
                <div className="prediction-div">
                    <div className="outcome-div">
                        <h4 className="outcome-div-problem-name">Forecast Problem: <span className="forecast-problem">Pedro Aguirre Cerda will be elected as President of Chile.</span></h4>
                        {/* <label htmlFor="outcomes">Predicted Outcome:</label>
                        <br />
                        <select name="outcomes" id="outcomes">
                            <option value="Outcome A">Outcome A</option>
                            <option value="Outcome B">Outcome B</option>
                        </select> */}
                    </div>
                    {/* Certainty % */}
                    <div className="certainty-div">
                        <div className="certainty-input-div">
                            <h4>Certainty % (0-100)</h4>
                            {/* Stop scrolling the page when scrolling up/down certainty input */}
                            <input 
                                className="certainty-input" 
                                type="number" 
                                min="0" 
                                max="100" 
                                step="0.05" 
                                required={true} 
                                onChange={(e) => calculateScore(e.target.value)} />
                        </div>
                        {/* Brier Score if Correct */}
                        {/* The "Cerda" stuff is specific to this forecast for PREVIEW ONLY */}
                        <div className="score-preview-div">
                            <h4>If Cerda <span className="correctStyle">is elected</span>, you will score:</h4>
                            <h4>{prediction}</h4>
                            <h4>If Cerda <span className="incorrectStyle">is not elected</span>, you will score:</h4>
                            <h4>{oppositePrediction}</h4>
                        </div>
                    </div>
                </div>
                {/* Forecast Phase Information */}
                <div className="forecast-phase-information-div">
                    <h3>Forecast Information</h3>
                    <div className="forecast-div-highlight">
                        <h4>test</h4>
                    </div>
                </div>
            </div>
            {/* Next Button */}
        </div>
    )
}

export default HistoricForecast;
