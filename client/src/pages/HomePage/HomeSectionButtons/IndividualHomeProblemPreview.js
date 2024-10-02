import React, { useState, useEffect } from 'react';
// import "chart.js/auto";
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {Chart as ChartJS} from 'chart.js/auto'
import './IndividualHomeProblemPreview.css';

function IndividualHomeProblemPreview(props) {
    const [data, setData] = useState([]);
    const [averageChartData, setAverageChartData] = useState({ datasets: [] });
    const [oppositeAverageChartData, setOppositeAverageChartData] = useState({ datasets: [] });
    const [multiOutcomeChartData, setMultiOutcomeChartData] = useState({ datasets: [] });

    useEffect(() => {
        console.log(props.data.submittedForecasts);
        formatForecastData(props.data);
    }, [props.data]);

    const formatForecastData = (data) => {
        console.log(data);
        if (data.submittedForecasts !== undefined && data.submittedForecasts.length > 0) {
            if (data.singleCertainty === true) {
                let lastForecastDate = "";
                let newCertainties = data.submittedForecasts;
                let allData = {
                    label: "All Data",
                    data: [],
                    backgrounColor: "red",
                    borderColor: "red",
                    showLine: false,
                    pointRadius: 4
                };
                if (newCertainties.length > 0 || newCertainties[0] === "") {
                    for (let i = 0; i < newCertainties.length; i++) {
                        for (let j = 0; j < newCertainties[i].forecasts.length; j++) {
                            // If new forecast is from a different date to the one before
                            if (newCertainties[i].forecasts[j].date.slice(0, 15) !== lastForecastDate) {
                                allData.data.push({
                                    username: newCertainties[i].username,
                                    x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, 15),
                                    y: ((newCertainties[i].forecasts[j].certainty)*100),
                                    description: newCertainties[i].forecasts[j].comments
                                });
                                lastForecastDate = allData.data[allData.data.length-1].x;
                                //If the new forecast is from the same day as the one before (only want to show newest one from each day)
                            } else {
                                //If it is the same user as the one before, erase previous
                                if (newCertainties[i].username === allData.data[allData.data.length-1].username) {
                                    allData.data[allData.data.length-1] = ({
                                        username: newCertainties[i].username,
                                        x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, 15), 
                                        y: ((newCertainties[i].forecasts[j].certainty)*100),
                                        description: newCertainties[i].forecasts[j].comments
                                    });
                                } else {
                                // else, just push it as it's a different user
                                    allData.data.push({
                                        username: newCertainties[i].username,
                                        x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, 15), 
                                        y: ((newCertainties[i].forecasts[j].certainty)*100),
                                        description: newCertainties[i].forecasts[j].comments
                                    });
                                };
                            };
                        };
                    };
                    const dailyAverages = getNewDailyAverages(allData.data, new Date(data.startDate), new Date(data.closeDate), data.isClosed, false);
                    const dailyOppositeAverages = getNewDailyAverages(allData.data, new Date(data.startDate), new Date(data.closeDate), data.isClosed, true);
                    
                    setAverageChartData({
                        label: `${props.data.potentialOutcomes[0]}`,
                        data: ((new Date(data.closeDate) - new Date(data.startDate))/1000 >= 0) ? dailyAverages : [],
                        backgroundColor: "#404d72",
                        borderColor: "#404d72",
                        borderWidth: 4,
                        pointRadius: 0
                    });
                    setOppositeAverageChartData({
                        label: `${props.data.potentialOutcomes[1]}`,
                        data: ((new Date(data.closeDate) - new Date(data.startDate))/1000 >= 0) ? dailyOppositeAverages : [],
                        backgroundColor: "orange",
                        borderColor: "orange",
                        borderWidth: 4,
                        pointRadius: 0
                    });
                }
            } else {
                let allData = [];
                let outcomeOneData = [];
                let outcomeTwoData = [];
                let outcomeThreeData = [];
                for (let i = 0; i < data.submittedForecasts.length; i++) {
                    for (let j = 0; j < data.submittedForecasts[i].forecasts.length; j++) {
                        if (outcomeOneData.length === 0) {
                            outcomeOneData.push({ 
                                username: data.submittedForecasts[i].username,
                                y: data.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: data.submittedForecasts[i].forecasts[j].comments 
                            });
                            outcomeTwoData.push({ 
                                username: data.submittedForecasts[i].username,
                                y: data.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: data.submittedForecasts[i].forecasts[j].comments 
                            });
                            outcomeThreeData.push({ 
                                username: data.submittedForecasts[i].username,
                                y: data.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: data.submittedForecasts[i].forecasts[j].comments 
                            });
                        } else if (outcomeOneData.length > 0) {
                            if (data.submittedForecasts[i].forecasts[j].date.slice(0, 15) !== outcomeOneData[outcomeOneData.length-1].x) {
                                // Different days - add to entries (doesn't matter if it's same user or not)
                                outcomeOneData.push({ 
                                    username: data.submittedForecasts[i].username,
                                    y: data.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                    x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                    description: data.submittedForecasts[i].forecasts[j].comments 
                                });
                                outcomeTwoData.push({ 
                                    username: data.submittedForecasts[i].username,
                                    y: data.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                    x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                    description: data.submittedForecasts[i].forecasts[j].comments 
                                });
                                outcomeThreeData.push({ 
                                    username: data.submittedForecasts[i].username,
                                    y: data.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                    x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                    description: data.submittedForecasts[i].forecasts[j].comments 
                                });
                            // Same day - so we need to check if it's from the same user as the last forecast (replace) or not (append)
                            } else if (data.submittedForecasts[i].forecasts[j].date.slice(0, 15) === outcomeOneData[outcomeOneData.length-1].x) {
                                // Same user - replace last entry
                                if (data.submittedForecasts[i].username === outcomeOneData[outcomeOneData.length-1].username) {
                                    outcomeOneData[outcomeOneData.length-1] = { 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    };
                                    outcomeTwoData[outcomeTwoData.length-1] = { 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    };
                                    outcomeThreeData[outcomeThreeData.length-1] = { 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    };
                                // Different User - add to entries
                                } else if (data.submittedForecasts[i].username !== outcomeOneData[outcomeOneData.length-1].username) {
                                    outcomeOneData.push({ 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    });
                                    outcomeTwoData.push({ 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    });
                                    outcomeThreeData.push({ 
                                        username: data.submittedForecasts[i].username,
                                        y: data.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                        x: new Date(data.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                        description: data.submittedForecasts[i].forecasts[j].comments 
                                    });
                                };
                            };
                        }; 
                    }
                }
                allData = outcomeOneData.concat(outcomeTwoData, outcomeThreeData);
                allData.sort((a, b) => a.x < b.x);
                let avgOutcomeOneArr = getNewDailyAverages(outcomeOneData, new Date(data.startDate), new Date(outcomeOneData[outcomeOneData.length-1].x), data.isClosed);
                let avgOutcomeTwoArr = getNewDailyAverages(outcomeTwoData, new Date(data.startDate), new Date(outcomeTwoData[outcomeTwoData.length-1].x), data.isClosed);
                let avgOutcomeThreeArr = getNewDailyAverages(outcomeThreeData, new Date(data.startDate), new Date(outcomeThreeData[outcomeThreeData.length-1].x), data.isClosed);

                let outcomeOneChData = {
                    label: `${props.data.potentialOutcomes[0]} (Avg)`,
                    data: avgOutcomeOneArr,
                    backgroundColor: "darkblue",
                    borderColor: "darkblue",
                    showLine: true,
                    borderWidth: 4,
                    pointRadius: 0
                };
                let outcomeTwoChData = {
                    label: `${props.data.potentialOutcomes[1]} (Avg)`,
                    data: avgOutcomeTwoArr,
                    backgroundColor: "red",
                    borderColor: "red",
                    showLine: true,
                    borderWidth: 4,
                    pointRadius: 0
                };
                let outcomeThreeChData = {
                    label: `${props.data.potentialOutcomes[2]} (Avg)`,
                    data: avgOutcomeThreeArr,
                    backgroundColor: "green",
                    borderColor: "green",
                    showLine: true,
                    borderWidth: 4,
                    pointRadius: 0
                };
                const multiOutcomeData = {
                    datasets: [{
                        label: outcomeOneChData.label,
                        data: outcomeOneChData.data,
                        backgroundColor: outcomeOneChData.backgroundColor,
                        borderColor: outcomeOneChData.borderColor,
                        borderWidth: outcomeOneChData.borderWidth,
                        showLine: outcomeOneChData.showLine,
                        pointRadius: outcomeOneChData.pointRadius
                    }, {
                        label: outcomeTwoChData.label,
                        data: outcomeTwoChData.data,
                        backgroundColor: outcomeTwoChData.backgroundColor,
                        borderColor: outcomeTwoChData.borderColor,
                        borderWidth: outcomeTwoChData.borderWidth,
                        pointRadius: outcomeTwoChData.pointRadius
                    }, {
                        label: outcomeThreeChData.label,
                        data: outcomeThreeChData.data,
                        backgroundColor: outcomeThreeChData.backgroundColor,
                        borderColor: outcomeThreeChData.borderColor,
                        borderWidth: outcomeThreeChData.borderWidth,
                        showLine: outcomeThreeChData.showLine,
                        pointRadius: outcomeThreeChData.pointRadius
                    }],
                    spanGaps: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    redraw: false
                };
                setMultiOutcomeChartData(multiOutcomeData);
            };
        };
    };

    const getNewDailyAverages = (certainties, start, end, isClosed, opposite) => {
        // Create labels array
        let days = createNewLabelsArray(start, end, isClosed);
        // Sort main array by date
        let sortedCertainties = certainties.sort((a, b) => new Date(a.x) - new Date(b.x));
        let averageArr = [];   
        for (let i = 0; i < days.length; i++) {
            // formatting array of dates into objects containing said dates
            averageArr[i] = { x: days[i], y: null };
        };
        let arrOfAllForecastValues = [];
        for (let i = 0; i < days.length; i++) {
            for (let j = 0; j < sortedCertainties.length; j++) {
                // If the forecast we're looking at right now is EARLIER than the date we want
                
                // If the forecast we're looking at right now is EXACTLY the date we want
                if (days[i] === sortedCertainties[j].x) {
                    if (opposite === true) {
                        arrOfAllForecastValues.push(100 - sortedCertainties[j].y);
                    } else {
                        arrOfAllForecastValues.push(sortedCertainties[j].y);
                    }
                };
                // If the forecast we're looking at right now is LATER than the date we want
                if (days[i] > sortedCertainties[j].x || j === sortedCertainties.length-1) {
                    averageArr[i].y = (arrOfAllForecastValues.reduce((partialSum, a) => partialSum + a, 0) / arrOfAllForecastValues.length);
                };
            };
            if (averageArr[i].y === null && i > 0) {
                averageArr[i].y = averageArr[i-1].y;
            }
        };
        if (props.isSummaryPage === true && props.data.singleCertainty === true) {
            console.log(averageArr[averageArr.length-1].y)
            props.handleNewStatToShow(averageArr[averageArr.length-1].y);
        };
        if (opposite === true) {
            console.log(averageArr);
        }
        return averageArr;
    };

    const createNewLabelsArray = (start, end, isClosed) => {
        let labelsToReturn = [];
        let finalDay = isClosed === true ? end : new Date();
        for (let d = new Date(start.toString().slice(0, 15)); d <= finalDay; d.setDate(d.getDate() + 1)) {
            let newDate = new Date(d).toString().slice(0, 15);
            labelsToReturn.push(newDate);
        };
        return labelsToReturn;
    };

    const chartDataToViz = {
        datasets: [{
            label: averageChartData.label,
            data: averageChartData.data,
            backgroundColor: averageChartData.backgroundColor,
            borderColor: averageChartData.borderColor,
            borderWidth: averageChartData.borderWidth,
            pointRadius: averageChartData.pointRadius
        },
        {
            label: oppositeAverageChartData.label,
            data: oppositeAverageChartData.data,
            backgroundColor: oppositeAverageChartData.backgroundColor,
            borderColor: oppositeAverageChartData.borderColor,
            borderWidth: oppositeAverageChartData.borderWidth,
            pointRadius: oppositeAverageChartData.pointRadius 
        }
    ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
        redraw: false
    };

    const options = {
        plugins: {
            legend: {
                display: props.isSummaryPage === true ? true : false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 100,
                stepSize: 5,
            },
            x: {
                display: true
            }
        }
    };


    return (
        <div className="individual-home-problem-preview">
            {props.isSummaryPage !== true && <h4 className="individual-home-problem-preview-question" style={{ "padding-bottom": "1vh" }}>
                {props.data.isClosed === false ? `LIVE: ${props.data.problemName}` : `CLOSED: ${props.data.problemName}`}
            </h4>}
            {/* Add a setProblemToPreview local storage variable which then gets called on Forecasts page */}
            <div>
            {/* <div style={{ width: "90%" }}> */}
                <Link to={{pathname: "/races"}}>
                    <Line 
                        data={props.data.singleCertainty === true ? chartDataToViz : multiOutcomeChartData} 
                        options={options}
                    />
                </Link>
            </div>
        </div>
    )
}

export default IndividualHomeProblemPreview;