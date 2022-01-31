import React, { useState, useEffect } from 'react';
import './ForecastStatistics.css';

function ForecastStatistics(props) {
    const [highestCertainty, setHighestCertainty] = useState(0);
    const [lowestCertainty, setLowestCertainty] = useState(0);
    const [currentAverageCertainty, setCurrentAverageCertainty] = useState(0);
    const [numberOfForecasts, setNumberOfForecasts] = useState(0);
    const [avgHigher, setAvgHigher] = useState(0);
    const [avgSame, setAvgSame] = useState(0);
    const [avgLower, setAvgLower] = useState(0);

    useEffect(() => {
        getForecastInfo(props.today, props.selectedForecast);
        console.log("Forecast Statistics UE");
    }, [props.selectedForecast]);

    const getForecastInfo = (today, selectedForecast) => {
        if (props.forecastSingleCertainty === true) {
            if (selectedForecast.submittedForecasts.length === 0) {
                setHighestCertainty("N/A");
                setLowestCertainty("N/A");
                setCurrentAverageCertainty("N/A");
                setNumberOfForecasts("N/A");
            } else {
                if (today === true) {
                    let highestCertaintySoFar = 0.00;
                    let highestChanged = false;
                    let lowestCertaintySoFar = 1.00;
                    let lowestChanged = false;
                    let totalCertainty = 0.00;
                    let numbOfForecasts = 0;
                        for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                            let index = selectedForecast.submittedForecasts[i].forecasts.length-1;
                            if (selectedForecast.submittedForecasts[i].forecasts[index].date.slice(0, 15) === new Date().toString().slice(0, 15)) {
                                if (selectedForecast.submittedForecasts[i].forecasts[index].certainty >= highestCertaintySoFar) {
                                    highestCertaintySoFar = selectedForecast.submittedForecasts[i].forecasts[index].certainty;
                                    highestChanged = true;
                                };
                                if (selectedForecast.submittedForecasts[i].forecasts[index].certainty <= lowestCertaintySoFar) {
                                    lowestCertaintySoFar = selectedForecast.submittedForecasts[i].forecasts[index].certainty;
                                    lowestChanged = true;
                                };
                                totalCertainty += selectedForecast.submittedForecasts[i].forecasts[index].certainty;
                                numbOfForecasts += 1;
                            };
                        };
                        if (highestChanged === true) {
                            setHighestCertainty(`${(highestCertaintySoFar*100).toFixed(2)}%`);
                        } else {
                            setHighestCertainty("N/A");
                        };
                        if (lowestChanged === true) {
                            setLowestCertainty(`${(lowestCertaintySoFar*100).toFixed(2)}%`);
                        } else {
                            setLowestCertainty("N/A");
                        };
                        if (highestChanged === true && lowestChanged === true) {
                            setCurrentAverageCertainty(`${((totalCertainty / numbOfForecasts)*100).toFixed(2)}%`)   
                        } else {
                            setCurrentAverageCertainty("N/A");
                        };
                        setNumberOfForecasts(numbOfForecasts);
                } else if (today === false) {
                    let highestCertaintySoFar = 0.00;
                    let highestChanged = false;
                    let lowestCertaintySoFar = 1.00;
                    let lowestChanged = false;
                    let totalCertainty = 0.00;
                    let numbOfForecasts = 0;

                    for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                        numbOfForecasts = numbOfForecasts + selectedForecast.submittedForecasts[i].forecasts.length;
                        for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                            if (selectedForecast.submittedForecasts[i].forecasts[j].certainty > highestCertaintySoFar) {
                                highestCertaintySoFar = selectedForecast.submittedForecasts[i].forecasts[j].certainty;
                                highestChanged = true;
                            };
                            if (selectedForecast.submittedForecasts[i].forecasts[j].certainty < lowestCertaintySoFar) {
                                lowestCertaintySoFar = selectedForecast.submittedForecasts[i].forecasts[j].certainty;
                                lowestChanged = true;
                            };
                            totalCertainty += selectedForecast.submittedForecasts[i].forecasts[j].certainty;
                        };
                    };
                    if (highestChanged === true) {
                        setHighestCertainty(`${(highestCertaintySoFar*100).toFixed(2)}%`);
                    } else {
                        setHighestCertainty("N/A");
                    };
                    if (lowestChanged === true) {
                        setLowestCertainty(`${(lowestCertaintySoFar*100).toFixed(2)}%`);
                    } else {
                        setLowestCertainty("N/A");
                    };
                    if (highestChanged === true && lowestChanged === true) {
                        setCurrentAverageCertainty(`${((totalCertainty / numbOfForecasts)*100).toFixed(2)}%`);  
                    } else {
                        setCurrentAverageCertainty("N/A");
                    };
                    setNumberOfForecasts(numbOfForecasts);
                };
            };
        } else if (props.forecastSingleCertainty === false) {
            if (selectedForecast.submittedForecasts.length === 0) {
                setHighestCertainty("N/A");
                setLowestCertainty("N/A");
                setCurrentAverageCertainty("N/A");
                setNumberOfForecasts("N/A");
            } else {
                if (today === true) {
                    let totalHighest = 0.00;
                    let totalSame = 0.00;
                    let totalLowest = 0.00;
                    let numbOfForecasts = 0;
                        for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                            for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                                if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) === new Date().toString().slice(0, 15)) {
                                    totalHighest += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100;
                                    totalSame += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100;
                                    totalLowest += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100;
                                    numbOfForecasts += 1;
                                };
                            };
                        };
                        setAvgHigher((totalHighest / numbOfForecasts).toFixed(2));
                        setAvgSame((totalSame / numbOfForecasts).toFixed(2));
                        setAvgLower((totalLowest / numbOfForecasts).toFixed(2));
                        setNumberOfForecasts(numbOfForecasts);
                } else if (today === false) {
                    let totalHighest = 0.00;
                    let totalSame = 0.00;
                    let totalLowest = 0.00;
                    let numbOfForecasts = 0;

                    for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                        numbOfForecasts = numbOfForecasts + selectedForecast.submittedForecasts[i].forecasts.length;
                        for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                            totalHighest += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100;
                            totalSame += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100;
                            totalLowest += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100;
                        };
                    };
                    setAvgHigher((totalHighest / numbOfForecasts).toFixed(2));
                    setAvgSame((totalSame / numbOfForecasts).toFixed(2));
                    setAvgLower((totalLowest / numbOfForecasts).toFixed(2));
                    setNumberOfForecasts(numbOfForecasts);
                };
            };
        };
    };

    return (
        <div className="forecast-statistics">
            {props.today === true && <h2 className="forecast-statistics-title">Forecast Statistics - Today</h2>}
            {props.today === false && <h2 className="forecast-statistics-title">Forecast Statistics - All</h2>}
            {props.forecastSingleCertainty === true &&
                <div className="forecast-statistics-grid">
                    <div className="forecast-statistics-grid-row-odd">
                        <h3>Average Certainty:</h3>
                        <h3>{currentAverageCertainty}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-even">
                        <h3>Highest Certainty:</h3>
                        <h3>{highestCertainty}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-odd">
                        <h3>Lowest Certainty:</h3>
                        <h3>{lowestCertainty}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-even">
                        <h3>Number of Forecasts:</h3>
                        <h3>{numberOfForecasts}</h3>
                    </div>
                </div>
            }
            {props.forecastSingleCertainty === false &&
                <div className="forecast-statistics-grid">
                    <div className="forecast-statistics-grid-row-odd">
                        <h3>Average Increase:</h3>
                        <h3>{isNaN(avgHigher) ? "N/A" : `${avgHigher}%`}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-even">
                        <h3>Average Same</h3>
                        <h3>{isNaN(avgSame) ? "N/A" : `${avgSame}%`}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-odd">
                        <h3>Average Lower</h3>
                        <h3>{isNaN(avgLower) ? "N/A" : `${avgLower}%`}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-even">
                        <h3>Number of Forecasts:</h3>
                        <h3>{numberOfForecasts}</h3>
                    </div>
                </div>
            }
        </div>
    )
}

export default ForecastStatistics;
