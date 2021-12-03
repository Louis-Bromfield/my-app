import React, { useState } from 'react';
import './CalibrationForecastsExplained.css';
import * as AiIcons from 'react-icons/ai';
import IndividualCalibrationForecastExplained from './CalibrationForecastExplained';

function CalibrationForecastsExplained() {
    const [forecast, setForecast] = useState(1);

    const decreaseForecast = (forecast) => {
        if (forecast === 1) setForecast(3);
        else setForecast(forecast - 1);
    }

    const increaseForecast = (forecast) => {
        if (forecast === 3) setForecast(1);
        else setForecast(forecast + 1);
    }

    const forecastTitles = ["Chilean Election", "1950 British Crime Bill", "1995 Swansea Council Election"]

    return (
        <div>
            <div className="forecast-results-navigation">
                <AiIcons.AiOutlineLeft className="navigation-btn" size={30} onClick={() => decreaseForecast(forecast)} />
                <h2>Forecast #{forecast}: {forecastTitles[forecast-1]}</h2>
                <AiIcons.AiOutlineRight className="navigation-btn" size={30} onClick={() => increaseForecast(forecast)} />
            </div>
            {forecast === 1 && <IndividualCalibrationForecastExplained forecastNumber={1} />}
            {forecast === 2 && <IndividualCalibrationForecastExplained forecastNumber={2} />}
            {forecast === 3 && <IndividualCalibrationForecastExplained forecastNumber={3} />}
        </div>
    )
}

export default CalibrationForecastsExplained;
