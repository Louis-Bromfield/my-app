import React, { useState, useEffect } from 'react';
import './ForecastStatistics.css';

function ForecastStatistics(props) {
    const [highestCertainty, setHighestCertainty] = useState(0);
    const [lowestCertainty, setLowestCertainty] = useState(0);
    const [currentAverageCertainty, setCurrentAverageCertainty] = useState(0);
    const [numberOfForecasts, setNumberOfForecasts] = useState(0);
    const [avgOutcomeOne, setAvgOutcomeOne] = useState(0);
    const [avgOutcomeTwo, setAvgOutcomeTwo] = useState(0);
    const [avgOutcomeThree, setAvgOutcomeThree] = useState(0);

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
                    let totalOutcomeOne = 0.00;
                    let totalOutcomeTwo = 0.00;
                    let totalOutcomeThree = 0.00;
                    let numbOfForecasts = 0;
                        for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                            for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                                if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) === new Date().toString().slice(0, 15)) {
                                    totalOutcomeOne += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty1*100;
                                    totalOutcomeTwo += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty2*100;
                                    totalOutcomeThree += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty3*100;
                                    numbOfForecasts += 1;
                                };
                            };
                        };
                        setAvgOutcomeOne((totalOutcomeOne / numbOfForecasts).toFixed(2));
                        setAvgOutcomeTwo((totalOutcomeTwo / numbOfForecasts).toFixed(2));
                        setAvgOutcomeThree((totalOutcomeThree / numbOfForecasts).toFixed(2));
                        setNumberOfForecasts(numbOfForecasts);
                } else if (today === false) {
                    let totalOutcomeOne = 0.00;
                    let totalOutcomeTwo = 0.00;
                    let totalOutcomeThree = 0.00;
                    let numbOfForecasts = 0;

                    for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
                        numbOfForecasts = numbOfForecasts + selectedForecast.submittedForecasts[i].forecasts.length;
                        for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                            totalOutcomeOne += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty1*100;
                            totalOutcomeTwo += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty2*100;
                            totalOutcomeThree += selectedForecast.submittedForecasts[i].forecasts[j].certainties.certainty3*100;
                        };
                    };
                    setAvgOutcomeOne((totalOutcomeOne / numbOfForecasts).toFixed(2));
                    setAvgOutcomeTwo((totalOutcomeTwo / numbOfForecasts).toFixed(2));
                    setAvgOutcomeThree((totalOutcomeThree / numbOfForecasts).toFixed(2));
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
                        <h3>Average {props.selectedForecast.potentialOutcomes[0]}:</h3>
                        <h3>{isNaN(avgOutcomeOne) ? "N/A" : `${avgOutcomeOne}%`}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-even">
                        <h3>Average {props.selectedForecast.potentialOutcomes[1]}</h3>
                        <h3>{isNaN(avgOutcomeTwo) ? "N/A" : `${avgOutcomeTwo}%`}</h3>
                    </div>
                    <div className="forecast-statistics-grid-row-odd">
                        <h3>Average {props.selectedForecast.potentialOutcomes[2]}</h3>
                        <h3>{isNaN(avgOutcomeThree) ? "N/A" : `${avgOutcomeThree}%`}</h3>
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
