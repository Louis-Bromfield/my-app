import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './ForecastProblemLineChart.css';
import Modal from '../../../components/Modal';

function ForecastProblemLineChart(props) {
  const [chartData, setChartData] = useState([]);
  const [userChartData, setUserChartData] = useState([]);
  const [averageChartData, setAverageChartData] = useState([]);
  const [oppositeAverageChartData, setOppositeAverageChartData] = useState({ datasets: [] });
  const [labelsArray, setLabelsArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState("");
//   const [modalContent2, setModalContent2] = useState("");
  const [outcomeOneChartData, setOutcomeOneChartData] = useState([]);
  const [outcomeTwoChartData, setOutcomeTwoChartData] = useState([]);
  const [outcomeThreeChartData, setOutcomeThreeChartData] = useState([]);
  const [userOutcomeOneChartData, setUserOutcomeOneChartData] = useState([]);
  const [userOutcomeTwoChartData, setUserOutcomeTwoChartData] = useState([]);
  const [userOutcomeThreeChartData, setUserOutcomeThreeChartData] = useState([]);      
  const [allChartData, setAllChartData] = useState([]);
  const [simulatedUserData, setSimulatedUserData] = useState([]);

  useEffect(() => {
    console.log("UE Fired here Louis+++++++++++++++++");
      if (props.selectedForecastObject === {} || props.forecastSingleCertainty === undefined) {
            return;
        } else {
            formatCertainties(props.selectedForecastObject, props.updateTodayStats, props.username);
        } 
        if (props.refreshChartAppearance !== 0) {
            if (props.selectedForecastObject.singleCertainty === true) {
                let newUserChartData = userChartData.data;
                if (newUserChartData.length >= 1) {
                    newUserChartData[newUserChartData.length-1] = {
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.userPreviousAttemptCertainty,
                        description: props.userPreviousAttemptComments
                    };
                } else {
                    newUserChartData.push({
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.userPreviousAttemptCertainty,
                        description: props.userPreviousAttemptComments
                    });
                };
                let userData = {
                    label: "Your Forecasts",
                    data: newUserChartData,
                    backgroundColor: "green",
                    borderColor: "orange",
                    showLine: true,
                    borderWidth: 4,
                    pointRadius: 4
                }
                setUserChartData(userData);
            } else if (props.selectedForecastObject.singleCertainty === false) {
                let newUserOutcomeOneData = userOutcomeOneChartData.length === 0 ? userOutcomeOneChartData : userOutcomeOneChartData.data;
                let newUserOutcomeTwoData = userOutcomeTwoChartData.length === 0 ? userOutcomeTwoChartData : userOutcomeTwoChartData.data;
                let newUserOutcomeThreeData = userOutcomeThreeChartData.length === 0 ? userOutcomeThreeChartData : userOutcomeThreeChartData.data;
                if (newUserOutcomeOneData.length >= 1) {
                    newUserOutcomeOneData[newUserOutcomeOneData.length-1] = {
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyOne*100,
                        description: props.userPreviousAttemptComments
                    };
                    newUserOutcomeTwoData[newUserOutcomeTwoData.length-1] = {
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyTwo*100,
                        description: props.userPreviousAttemptComments
                    };
                    newUserOutcomeThreeData[newUserOutcomeThreeData.length-1] = {
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyThree*100,
                        description: props.userPreviousAttemptComments
                    };
                } else {
                    newUserOutcomeOneData.push({
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyOne*100,
                        description: props.userPreviousAttemptComments
                    });
                    newUserOutcomeTwoData.push({
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyTwo*100,
                        description: props.userPreviousAttemptComments
                    });
                    newUserOutcomeThreeData.push({
                        username: props.username,
                        x: new Date().toString().slice(0, 15),
                        y: props.previousCertaintyThree*100,
                        description: props.userPreviousAttemptComments
                    });
                }
                let userOutcomeOneChData = {
                    label: `${props.selectedForecastObject.potentialOutcomes[0]} (Me)`,
                    data: newUserOutcomeOneData,
                    backgroundColor: "lightblue",
                    borderColor: "lightblue",
                    showLine: true,
                    borderWidth: 3,
                    pointRadius: 2
                };
                let userOutcomeTwoChData = {
                    label: `${props.selectedForecastObject.potentialOutcomes[1]} (Me)`,
                    data: newUserOutcomeTwoData,
                    backgroundColor: "pink",
                    borderColor: "pink",
                    showLine: true,
                    borderWidth: 3,
                    pointRadius: 2
                };
                let userOutcomeThreeChData = {
                    label: `${props.selectedForecastObject.potentialOutcomes[2]} (Me)`,
                    data: newUserOutcomeThreeData,
                    backgroundColor: "lightgreen",
                    borderColor: "lightgreen",
                    showLine: true,
                    borderWidth: 3,
                    pointRadius: 2
                };
                setUserOutcomeOneChartData(userOutcomeOneChData);
                setUserOutcomeTwoChartData(userOutcomeTwoChData);
                setUserOutcomeThreeChartData(userOutcomeThreeChData);
            };
            createLabelsArray(new Date(props.selectedForecastObject.startDate), new Date(props.selectedForecastObject.closeDate));
        } else {
            console.log("here no");
        };
    }, [props.selectedForecastObject, props.refreshChartAppearance]);

const formatCertainties = (selectedForecastObject, updateTodayStats, username) => {
    if (selectedForecastObject.submittedForecasts.length === 0) {
        setChartData({ label: "All Forecasts", data: [] });
        setUserChartData({ label: "Your Forecasts", data: [] });
        setAverageChartData({ label: "Daily Average Certainty", data: [] });
        return;
    };
    if (props.forecastSingleCertainty === true) {
        let lastForecastDate = "";
        let newCertainties = selectedForecastObject.submittedForecasts;
        let userData = {
            label: "Your Forecasts",
            data: [],
            backgroundColor: "green",
            borderColor: "orange",
            showLine: true,
            borderWidth: 4,
            pointRadius: 4
        }
        let data = {
            label: `${selectedForecastObject.potentialOutcomes[0]} %`, 
            data: [], 
            backgroundColor: "green", 
            borderColor: "green", 
            showLine: false,
            pointRadius: 4
        };
        let sliceIndex = 15;
        if (newCertainties.length > 0 || newCertainties[0] === '') {
            for (let i = 0; i < newCertainties.length; i++) {
                for (let j = 0; j < newCertainties[i].forecasts.length; j++) {
                    // if it's on a new day to the one before, keep that one and add this one in as a new data point
                    if (newCertainties[i].forecasts[j].date.slice(0, sliceIndex) !== lastForecastDate) {
                        data.data.push({
                            username: newCertainties[i].username,
                            x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex),
                            y: ((newCertainties[i].forecasts[j].certainty)*100),
                            description: newCertainties[i].forecasts[j].comments
                        });
                        // set the lastForecastDate for comparing the next forecast
                        lastForecastDate = data.data[data.data.length-1].x;
                        // if it's from the logged in user, also add to a separate dataset
                        if (newCertainties[i].username === username) {
                            userData.data.push({
                                username: newCertainties[i].username,
                                x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex), 
                                y: ((newCertainties[i].forecasts[j].certainty)*100),
                                description: newCertainties[i].forecasts[j].comments
                            });
                        }
                    // else if it is from the same day as the last forecast, replace the last forecast with this newer one
                    } else if (newCertainties[i].forecasts[j].date.slice(0, sliceIndex) === lastForecastDate) {
                        // if current forecast object username === last forecast stored in chart data, replace
                        if (newCertainties[i].username === data.data[data.data.length-1].username) {
                            data.data[data.data.length-1] = ({
                                username: newCertainties[i].username,
                                x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex), 
                                y: ((newCertainties[i].forecasts[j].certainty)*100),
                                description: newCertainties[i].forecasts[j].comments
                            });
                        } else {
                        // else, just push it as it's a different user
                            data.data.push({
                                username: newCertainties[i].username,
                                x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex), 
                                y: ((newCertainties[i].forecasts[j].certainty)*100),
                                description: newCertainties[i].forecasts[j].comments
                            });
                        };
                        if (newCertainties[i].username === username) {
                            if (userData.data.length === 0) {
                                userData.data.push({
                                    username: newCertainties[i].username,
                                    x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex), 
                                    y: ((newCertainties[i].forecasts[j].certainty)*100),
                                    description: newCertainties[i].forecasts[j].comments
                                });
                            } else if (userData.data.length !== 0) {
                                userData.data[userData.data.length-1] = ({
                                    username: newCertainties[i].username,
                                    x: new Date(newCertainties[i].forecasts[j].date).toString().slice(0, sliceIndex), 
                                    y: ((newCertainties[i].forecasts[j].certainty)*100),
                                    description: newCertainties[i].forecasts[j].comments
                                });
                            };
                        };
                    };
                };
            };
            let todayForecasts = ["Jan 01 0000"];
            for (let i = 0; i < data.data.length; i++) {
                if (new Date(data.data[i].x) > new Date(todayForecasts[0])) {
                    todayForecasts = [data.data[i].x];
                } else if (new Date(data.data[i].x).getTime() === new Date(todayForecasts[0]).getTime()) {
                    todayForecasts.push(data.data[i].x);
                };
            };
            const dailyAverages = getNewDailyAverages(data.data, new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate), selectedForecastObject.isClosed, false);
            const dailyOppositeAverages = getNewDailyAverages(data.data, new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate), selectedForecastObject.isClosed, true);

            updateTodayStats(`${dailyAverages[dailyAverages.length-1].y.toFixed(2)}%`, todayForecasts.length);

            let simulatedUserData = {
                label: "Your Most Recent Prediction",
                data: [],
                backgroundColor: "green",
                borderColor: "orange",
                showLine: true,
                borderWidth: 4,
                pointRadius: 0
            };
            if ((userData.data.length > 0) && (userData.data[userData.data.length-1].x < new Date().toString().slice(0, 15))) {
                simulatedUserData.data.push(
                    {
                        y: userData.data[userData.data.length-1].y,
                        x: userData.data[userData.data.length-1].x,
                        description: userData.data[userData.data.length-1].description
                    }
                );
                // Check if current date is later than the close date
                // if true, the x value in the 2nd object to push should be the close date
                // if false, the x value should be the current day
                if (new Date() < new Date(selectedForecastObject.closeDate)) {
                    simulatedUserData.data.push(
                        {
                            y: userData.data[userData.data.length-1].y,
                            x: new Date().toString().slice(0, 15),
                            description: userData.data[userData.data.length-1].description
                        }
                    );
                } else {
                    simulatedUserData.data.push(
                        {
                            y: userData.data[userData.data.length-1].y,
                            x: new Date(selectedForecastObject.closeDate).toString().slice(0, 15),
                            description: userData.data[userData.data.length-1].description
                        }
                    );
                }
            };
            setChartData(data);
            setUserChartData(userData);
            setSimulatedUserData(simulatedUserData);
            setAverageChartData({
                label: `Average ${selectedForecastObject.potentialOutcomes[0]} %`,
                data: ((new Date(selectedForecastObject.closeDate) - new Date(selectedForecastObject.startDate))/1000 >= 0) ? dailyAverages : [],
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                borderWidth: 4,
                pointRadius: 0
            });
            setOppositeAverageChartData({
                label: `Average ${selectedForecastObject.potentialOutcomes[1]} %`,
                data: ((new Date(data.closeDate) - new Date(data.startDate))/1000 >= 0) ? dailyOppositeAverages : [],
                backgroundColor: "darkred",
                borderColor: "darkred",
                borderWidth: 4,
                pointRadius: 0
            });
        };
        createLabelsArray(new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate));
    } else if (props.forecastSingleCertainty === false) {
        let allData = [];
        let outcomeOneData = [];
        let outcomeTwoData = [];
        let outcomeThreeData = [];
        let userOutcomeOneData = [];
        let userOutcomeTwoData = [];
        let userOutcomeThreeData = [];
        for (let i = 0; i < selectedForecastObject.submittedForecasts.length; i++) {
            for (let j = 0; j < selectedForecastObject.submittedForecasts[i].forecasts.length; j++) {
                // No data date to compare to
                if (outcomeOneData.length === 0) {
                    outcomeOneData.push({ 
                        username: selectedForecastObject.submittedForecasts[i].username,
                        y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                        x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                        description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                    });
                    outcomeTwoData.push({ 
                        username: selectedForecastObject.submittedForecasts[i].username,
                        y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                        x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                        description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                    });
                    outcomeThreeData.push({ 
                        username: selectedForecastObject.submittedForecasts[i].username,
                        y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                        x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                        description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                    });
                } else if (outcomeOneData.length > 0) {
                    if (selectedForecastObject.submittedForecasts[i].forecasts[j].date.slice(0, 15) !== outcomeOneData[outcomeOneData.length-1].x) {
                        // Different days - add to entries (doesn't matter if it's same user or not)
                        outcomeOneData.push({ 
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                        outcomeTwoData.push({ 
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                        outcomeThreeData.push({ 
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                    // Same day - so we need to check if it's from the same user as the last forecast (replace) or not (append)
                    } else if (selectedForecastObject.submittedForecasts[i].forecasts[j].date.slice(0, 15) === outcomeOneData[outcomeOneData.length-1].x) {
                        // Same user - replace last entry
                        if (selectedForecastObject.submittedForecasts[i].username === outcomeOneData[outcomeOneData.length-1].username) {
                            outcomeOneData[outcomeOneData.length-1] = { 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            };
                            outcomeTwoData[outcomeTwoData.length-1] = { 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            };
                            outcomeThreeData[outcomeThreeData.length-1] = { 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            };
                        // Different User - add to entries
                        } else if (selectedForecastObject.submittedForecasts[i].username !== outcomeOneData[outcomeOneData.length-1].username) {
                            outcomeOneData.push({ 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                            outcomeTwoData.push({ 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                            outcomeThreeData.push({ 
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                        };
                    };
                };
                // If the forecast was made by the logged in user, add to user array but check if date is same (replace) or different (append)
                if (selectedForecastObject.submittedForecasts[i].username === username) {
                    // Same date as last forecast, so replace
                    if (userOutcomeOneData.length === 0) {
                        userOutcomeOneData.push({
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                        userOutcomeTwoData.push({
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                        userOutcomeThreeData.push({
                            username: selectedForecastObject.submittedForecasts[i].username,
                            y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                            x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                            description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                        });
                    } else if (userOutcomeOneData.length > 0) {
                        if (selectedForecastObject.submittedForecasts[i].forecasts[j].date.slice(0, 15) === userOutcomeOneData[userOutcomeOneData.length-1].x) {
                            userOutcomeOneData[userOutcomeOneData.length-1] = {
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments
                            };
                            userOutcomeTwoData[userOutcomeTwoData.length-1] = {
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments
                            };
                            userOutcomeThreeData[userOutcomeThreeData.length-1] = {
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments
                            };
                        // Different date as last forecast so append
                        } else if (selectedForecastObject.submittedForecasts[i].forecasts[j].date.slice(0, 15) !== userOutcomeOneData[userOutcomeOneData.length-1].x) {
                            // Different date, append
                            userOutcomeOneData.push({
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty1*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                            userOutcomeTwoData.push({
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty2*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                            userOutcomeThreeData.push({
                                username: selectedForecastObject.submittedForecasts[i].username,
                                y: selectedForecastObject.submittedForecasts[i].forecasts[j].certainties.certainty3*100, 
                                x: new Date(selectedForecastObject.submittedForecasts[i].forecasts[j].date).toString().slice(0, 15),
                                description: selectedForecastObject.submittedForecasts[i].forecasts[j].comments 
                            });
                        };
                    };
                };
            };
        };

        allData = outcomeOneData.concat(outcomeTwoData, outcomeThreeData);
        allData.sort((a, b) => a.x < b.x);
        let avgOutcomeOneArr = getNewDailyAverages(outcomeOneData, new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate), selectedForecastObject.isClosed, false);
        let avgOutcomeTwoArr = getNewDailyAverages(outcomeTwoData, new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate), selectedForecastObject.isClosed, false);
        let avgOutcomeThreeArr = getNewDailyAverages(outcomeThreeData, new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate), selectedForecastObject.isClosed, false);

        // Adding in simulated data for days with no predictions (copying last data over to all days) - for AVERAGE
        if ((avgOutcomeOneArr.length > 0) && (avgOutcomeOneArr[avgOutcomeOneArr.length-1].x !== new Date().toString().slice(0, 15))) {
            // We need to not use the data.length-1.x value, this is just copying over the 
            // last prediction, we want it to copy over the average from the day before
            let outcomeOneY = avgOutcomeOneArr[avgOutcomeOneArr.length-1].y;
            let outcomeTwoY = avgOutcomeTwoArr[avgOutcomeTwoArr.length-1].y;
            let outcomeThreeY = avgOutcomeThreeArr[avgOutcomeThreeArr.length-1].y;
            let comments = avgOutcomeOneArr[avgOutcomeOneArr.length-1].description;
            let lastDayWithData = new Date(avgOutcomeOneArr[avgOutcomeOneArr.length-1].x);
            lastDayWithData.setDate(lastDayWithData.getDate() + 1);
            let lastDay;
            if (new Date() < selectedForecastObject.closeDate) {
                lastDay = new Date().toString().slice(0, 15)
            } else {
                lastDay = selectedForecastObject.closeDate.slice(0, 15);
            };
            for (let d = lastDayWithData; d <= lastDay; d.setDate(d.getDate() + 1)) {
                let newDate = new Date(d).toString().slice(0, 15);

                avgOutcomeOneArr.push({
                    y: outcomeOneY,
                    x: newDate,
                    description: comments
                });
                avgOutcomeTwoArr.push({
                    y: outcomeTwoY,
                    x: newDate,
                    description: comments
                });
                avgOutcomeThreeArr.push({
                    y: outcomeThreeY,
                    x: newDate,
                    description: comments
                });
            };
        };
        // Adding in simulated data for days with no predictions (copying last data over to all days) - for SPECIFIC PREDICTIONS
        if ((userOutcomeOneData.length > 0) && (userOutcomeOneData[userOutcomeOneData.length-1].x !== new Date().toString().slice(0, 15))) {
            let outcomeOneY = userOutcomeOneData[userOutcomeOneData.length-1].y;
            let outcomeTwoY = userOutcomeTwoData[userOutcomeTwoData.length-1].y;
            let outcomeThreeY = userOutcomeThreeData[userOutcomeThreeData.length-1].y;
            let comments = userOutcomeOneData[userOutcomeOneData.length-1].description;
            let newDate;
            if (selectedForecastObject.isClosed === false) {
                newDate = new Date().toString().slice(0, 15);
            } else if (selectedForecastObject.isClosed === true) {
                newDate = selectedForecastObject.closeDate.slice(0, 15);
            }
            userOutcomeOneData.push({
                y: outcomeOneY,
                x: newDate,
                description: comments
            });
            userOutcomeTwoData.push({
                y: outcomeTwoY,
                x: newDate,
                description: comments
            });
            userOutcomeThreeData.push({
                y: outcomeThreeY,
                x: newDate,
                description: comments
            });
        };

        let allChData = {
            label: "All Data",
            data: allData,
            backgroundColor: "lightgray",
            borderColor: "lightgray",
            showLine: true,
            borderWidth: 0,
            pointRadius: 3
        }
        let outcomeOneChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[0]} (Avg)`, //JOB AFTER DINNER: RENAME THESE LABELS
            data: avgOutcomeOneArr,
            backgroundColor: "darkblue",
            borderColor: "darkblue",
            showLine: true,
            borderWidth: 4,
            pointRadius: 1
        };
        let outcomeTwoChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[1]} (Avg)`,
            data: avgOutcomeTwoArr,
            backgroundColor: "red",
            borderColor: "red",
            showLine: true,
            borderWidth: 4,
            pointRadius: 1
        };
        let outcomeThreeChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[2]} (Avg)`,
            data: avgOutcomeThreeArr,
            backgroundColor: "green",
            borderColor: "green",
            showLine: true,
            borderWidth: 4,
            pointRadius: 1
        };
        let userOutcomeOneChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[0]} (Me)`,
            data: userOutcomeOneData,
            backgroundColor: "lightblue",
            borderColor: "lightblue",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        let userOutcomeTwoChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[1]} (Me)`,
            data: userOutcomeTwoData,
            backgroundColor: "pink",
            borderColor: "pink",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        let userOutcomeThreeChData = {
            label: `${props.selectedForecastObject.potentialOutcomes[2]} (Me)`,
            data: userOutcomeThreeData,
            backgroundColor: "lightgreen",
            borderColor: "lightgreen",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        createLabelsArray(new Date(selectedForecastObject.startDate), new Date(selectedForecastObject.closeDate));
        setAllChartData(allChData);
        setOutcomeOneChartData(outcomeOneChData);
        setOutcomeTwoChartData(outcomeTwoChData);
        setOutcomeThreeChartData(outcomeThreeChData);
        setUserOutcomeOneChartData(userOutcomeOneChData);
        setUserOutcomeTwoChartData(userOutcomeTwoChData);
        setUserOutcomeThreeChartData(userOutcomeThreeChData);
    };
};

  const createLabelsArray = (start, end) => {
      let labelsToReturn = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          let newDate = new Date(d).toString().slice(0, 15);
          labelsToReturn.push(newDate);
      };
      setLabelsArray(labelsToReturn);
    };

    const createNewLabelsArray = (start, end, isClosed) => {
        let labelsToReturn = [];
        // I think the reason why the blue line is stopping a day early is because it might be going to the minute 
        // If the start date is 8am and we're at 7.30am, it might not think we are on the same day
        let finalDay = isClosed === true ? end : new Date();
        for (let d = new Date(start.toString().slice(0, 15)); d <= finalDay; d.setDate(d.getDate() + 1)) {
            let newDate = new Date(d).toString().slice(0, 15);
            labelsToReturn.push(newDate);
        };
        return labelsToReturn;
    };

    const getNewDailyAverages = (certainties, start, end, isClosed, opposite) => {
        console.log("daily average");
        console.log(opposite);
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
                    if (opposite !== undefined && opposite === true) {
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
        return averageArr;
    };

    const data = {
        labels: labelsArray,
        datasets: [{
            label: chartData.label,
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
            borderColor: chartData.borderColor,
            borderWidth: chartData.borderWidth,
            showLine: chartData.showLine,
            pointRadius: chartData.pointRadius
        }, {
            label: averageChartData.label,
            data: averageChartData.data,
            backgroundColor: averageChartData.backgroundColor,
            borderColor: averageChartData.borderColor,
            borderWidth: averageChartData.borderWidth,
            pointRadius: averageChartData.pointRadius
        }, {
            label: oppositeAverageChartData.label,
            data: oppositeAverageChartData.data,
            backgroundColor: oppositeAverageChartData.backgroundColor,
            borderColor: oppositeAverageChartData.borderColor,
            borderWidth: oppositeAverageChartData.borderWidth,
            pointRadius: oppositeAverageChartData.pointRadius
        }, {
            label: userChartData.label,
            data: userChartData.data,
            backgroundColor: userChartData.backgroundColor,
            borderColor: userChartData.borderColor,
            borderWidth: userChartData.borderWidth,
            showLine: userChartData.showLine,
            pointRadius: userChartData.pointRadius
        }, {
            label: simulatedUserData.label,
            data: simulatedUserData.data,
            backgroundColor: simulatedUserData.backgroundColor,
            borderColor: simulatedUserData.borderColor,
            borderWidth: simulatedUserData.borderWidth,
            showLine: simulatedUserData.showLine,
            pointRadius: simulatedUserData.pointRadius
        }],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: true
    };

    const multiOutcomeData = {
        labels: labelsArray,
        datasets: [{
            label: outcomeOneChartData.label,
            data: outcomeOneChartData.data,
            backgroundColor: outcomeOneChartData.backgroundColor,
            borderColor: outcomeOneChartData.borderColor,
            borderWidth: outcomeOneChartData.borderWidth,
            showLine: outcomeOneChartData.showLine,
            pointRadius: outcomeOneChartData.pointRadius
        }, {
            label: userOutcomeOneChartData.label,
            data: userOutcomeOneChartData.data,
            backgroundColor: userOutcomeOneChartData.backgroundColor,
            borderColor: userOutcomeOneChartData.borderColor,
            borderWidth: userOutcomeOneChartData.borderWidth,
            showLine: userOutcomeOneChartData.showLine,
            pointRadius: userOutcomeOneChartData.pointRadius  
        }, {
            label: outcomeTwoChartData.label,
            data: outcomeTwoChartData.data,
            backgroundColor: outcomeTwoChartData.backgroundColor,
            borderColor: outcomeTwoChartData.borderColor,
            borderWidth: outcomeTwoChartData.borderWidth,
            pointRadius: outcomeTwoChartData.pointRadius
        }, {
            label: userOutcomeTwoChartData.label,
            data: userOutcomeTwoChartData.data,
            backgroundColor: userOutcomeTwoChartData.backgroundColor,
            borderColor: userOutcomeTwoChartData.borderColor,
            borderWidth: userOutcomeTwoChartData.borderWidth,
            showLine: userOutcomeTwoChartData.showLine,
            pointRadius: userOutcomeTwoChartData.pointRadius  
        }, {
            label: outcomeThreeChartData.label,
            data: outcomeThreeChartData.data,
            backgroundColor: outcomeThreeChartData.backgroundColor,
            borderColor: outcomeThreeChartData.borderColor,
            borderWidth: outcomeThreeChartData.borderWidth,
            showLine: outcomeThreeChartData.showLine,
            pointRadius: outcomeThreeChartData.pointRadius
        }, {
            label: userOutcomeThreeChartData.label,
            data: userOutcomeThreeChartData.data,
            backgroundColor: userOutcomeThreeChartData.backgroundColor,
            borderColor: userOutcomeThreeChartData.borderColor,
            borderWidth: userOutcomeThreeChartData.borderWidth,
            showLine: userOutcomeThreeChartData.showLine,
            pointRadius: userOutcomeThreeChartData.pointRadius  
        }, {
            label: allChartData.label,
            data: allChartData.data,
            backgroundColor: allChartData.backgroundColor,
            borderColor: allChartData.borderColor,
            borderWidth: allChartData.borderWidth,
            showLine: allChartData.showLine,
            pointRadius: allChartData.pointRadius
        }],
        spanGaps: false,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "bottom"
            },
            tooltips: {
                enabled: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        // Need handling for hovering over average lines, it currently crashes
                        if (context.dataset.label === "Average Certainty" || context.dataset.label.includes("(Avg)") || context.raw.description === undefined) {
                            return `${context.dataset.label}: ${context.formattedValue}%`;
                        }
                        // Need handling for undefined
                        let label = context.dataset.label || '';
                        if (label) {
                            label += `: ${context.formattedValue}% -${context.raw.description.includes("~") ? context.raw.description.split("~")[1] : ` ${context.raw.description}`}`;
                        }
                        return label;
                    }
                }
            }
        }
    };
    return (
        <div className="forecast-problem-line-chart">
            {/* {console.log("Line Chart Markup")} */}
            {/* <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
                <p>{modalContent2}</p>
            </Modal> */}
            {/* Copy this and make one just for mobile (like if width) */}
            <div className="chart-container" style={{ position: "relative", margin: "auto", width: "100%", height: "60vh" }}>
                <Line 
                    data={props.forecastSingleCertainty === true ? data : multiOutcomeData} 
                    options={options} 
                    height={"100%"} 
                />
            </div>
        </div>
    )
}

export default ForecastProblemLineChart;


