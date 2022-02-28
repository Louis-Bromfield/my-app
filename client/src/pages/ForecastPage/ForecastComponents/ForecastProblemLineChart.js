import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './ForecastProblemLineChart.css';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../../../components/Modal';

function ForecastProblemLineChart(props) {
  const [chartData, setChartData] = useState([]);
  const [userChartData, setUserChartData] = useState([]);
  const [averageChartData, setAverageChartData] = useState([]);
  const [averageSinceLastPrediction, setAverageSinceLastPredictionData] = useState([]);
  const [labelsArray, setLabelsArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [increaseChartData, setIncreaseChartData] = useState([]);
  const [sameChartData, setSameChartData] = useState([]);
  const [decreaseChartData, setDecreaseChartData] = useState([]);
  const [userIncreaseChartData, setUserIncreaseChartData] = useState([]);
  const [userSameChartData, setUserSameChartData] = useState([]);
  const [userDecreaseChartData, setUserDecreaseChartData] = useState([]);      
  const [allChartData, setAllChartData] = useState([]);
  const [simulatedUserData, setSimulatedUserData] = useState([]);

  useEffect(() => {
    formatCertainties(props.selectedForecast, props.updateTodayStats, props.username);
    // console.log(props.selectedForecast);
    console.log("Line Chart UE");
  }, [props.selectedForecast, props.refresh]);

  const formatCertainties = (selectedForecast, updateTodayStats, username) => {
    // No forecasts yet submitted
    if (selectedForecast.submittedForecasts.length === 0) {
        setChartData({ label: "All Forecasts", data: [] });
        setUserChartData({ label: "Your Forecasts", data: [] });
        setAverageChartData({ label: "Daily Average Certainty", data: [] });
      //   createLabelsArray(new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
        return;
    };
    if (props.forecastSingleCertainty === true) {
        // Forecasts Submitted
        let lastForecastDate = "";
        let newCertainties = selectedForecast.submittedForecasts;
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
            label: "All Forecasts", 
            data: [], 
            backgroundColor: "green", 
            borderColor: "green", 
            showLine: false,
            pointRadius: 4
        };
        let sliceIndex = 0;
        if ((new Date(selectedForecast.closeDate) - new Date(selectedForecast.startDate))/1000 < 604800) {
            sliceIndex = 18;
        } else {
            sliceIndex = 15;
        }
        if (newCertainties.length > 0 || newCertainties[0] === '') {
            for (let i = 0; i < newCertainties.length; i++) {
                for (let j = 0; j < newCertainties[i].forecasts.length; j++) {
                    if (newCertainties[i].forecasts[j].date.slice(0, sliceIndex) !== lastForecastDate) {
                        data.data.push({
                            x: newCertainties[i].forecasts[j].date.slice(0, sliceIndex),
                            y: ((newCertainties[i].forecasts[j].certainty)*100),
                            description: newCertainties[i].forecasts[j].comments
                        });
                        lastForecastDate = data.data[data.data.length-1].x;
                        if (newCertainties[i].username === username) {
                            userData.data.push({
                                x: newCertainties[i].forecasts[j].date.slice(0, sliceIndex), 
                                y: ((newCertainties[i].forecasts[j].certainty)*100),
                                description: newCertainties[i].forecasts[j].comments
                            });
                        }
                    } else if (newCertainties[i].forecasts[j].date.slice(0, sliceIndex) === lastForecastDate) {
                        data.data[data.data.length-1] = ({
                            x: newCertainties[i].forecasts[j].date.slice(0, sliceIndex), 
                            y: ((newCertainties[i].forecasts[j].certainty)*100),
                            description: newCertainties[i].forecasts[j].comments
                        });
                        if (newCertainties[i].username === username) {
                            if (userData.data.length === 0) {
                                userData.data.push({
                                    x: newCertainties[i].forecasts[j].date.slice(0, sliceIndex), 
                                    y: ((newCertainties[i].forecasts[j].certainty)*100),
                                    description: newCertainties[i].forecasts[j].comments
                                });
                            } else if (userData.data.length !== 0) {
                                userData.data[userData.data.length-1] = ({
                                    x: newCertainties[i].forecasts[j].date.slice(0, sliceIndex), 
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
            const dailyAverages = getNewDailyAverages(data.data, new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
            updateTodayStats(`${dailyAverages[dailyAverages.length-1].y.toFixed(2)}%`, todayForecasts.length);
            // Simulate data for days with no predictions
            let simulatedUserData = {
                label: "Your Certainty Since Last Forecast",
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
                    }, {
                        y: userData.data[userData.data.length-1].y,
                        x: new Date().toString().slice(0, 15),
                        description: userData.data[userData.data.length-1].description
                    }
                );
            };
            setChartData(data);
            setUserChartData(userData);
            setSimulatedUserData(simulatedUserData);
            setAverageChartData({
                label: "Average Certainty",
                data: ((new Date(selectedForecast.closeDate) - new Date(selectedForecast.startDate))/1000 >= 0) ? dailyAverages : [],
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                borderWidth: 4,
                pointRadius: 0
            });
            // console.log(dailyAverages);
            // Create line for days with no prediction (since the last prediction was made)
            // let today = new Date();
            // let averageSinceLatestPrediction = [];
            // if ((today > new Date(data.data[data.data.length-1].x)) && (today < new Date(selectedForecast.closeDate))) {
            //     averageSinceLatestPrediction = [dailyAverages[dailyAverages.length-1], {x: today.toString().slice(0, 15), y: dailyAverages[dailyAverages.length-1].y}];
            // };
            // setAverageSinceLastPredictionData({
            //     label: "Average Certainty Since Last Prediction",
            //     data: averageSinceLatestPrediction,
            //     backgroundColor: "rgba(255, 0, 0, 0.5)",
            //     borderColor: "rgba(255, 0, 0, 0.5)",
            //     borderWidth: 4,
            //     pointRadius: 0
            // });
        };
        createLabelsArray(new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
    } else if (props.forecastSingleCertainty === false) {
        let allData = [];
        let increaseData = [];
        let sameData = [];
        let decreaseData = [];
        let userIncreaseData = [];
        let userSameData = [];
        let userDecreaseData = [];
        for (let i = 0; i < selectedForecast.submittedForecasts.length; i++) {
            for (let j = 0; j < selectedForecast.submittedForecasts[i].forecasts.length; j++) {
                // No data date to compare to
                if (increaseData.length === 0) {
                    increaseData.push({ 
                        username: selectedForecast.submittedForecasts[i].username,
                        y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                        x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                        description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                    });
                    sameData.push({ 
                        username: selectedForecast.submittedForecasts[i].username,
                        y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                        x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                        description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                    });
                    decreaseData.push({ 
                        username: selectedForecast.submittedForecasts[i].username,
                        y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                        x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                        description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                    });
                } else if (increaseData.length > 0) {
                    if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) !== increaseData[increaseData.length-1].x) {
                        // Different days - add to entries (doesn't matter if it's same user or not)
                        increaseData.push({ 
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                        sameData.push({ 
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                        decreaseData.push({ 
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                    // Same day - so we need to check if it's from the same user as the last forecast (replace) or not (append)
                    } else if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) === increaseData[increaseData.length-1].x) {
                        // Same user - replace last entry
                        if (selectedForecast.submittedForecasts[i].username === increaseData[increaseData.length-1].username) {
                            increaseData[increaseData.length-1] = { 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            };
                            sameData[sameData.length-1] = { 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            };
                            decreaseData[decreaseData.length-1] = { 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            };
                        // Different User - add to entries
                        } else if (selectedForecast.submittedForecasts[i].username !== increaseData[increaseData.length-1].username) {
                            increaseData.push({ 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                            sameData.push({ 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                            decreaseData.push({ 
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                        };
                    };
                };
                // Here
                // If the forecast was made by the logged in user, add to user array but check if date is same (replace) or different (append)
                if (selectedForecast.submittedForecasts[i].username === username) {
                    // Same date as last forecast, so replace
                    if (userIncreaseData.length === 0) {
                        userIncreaseData.push({
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                        userSameData.push({
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                        userDecreaseData.push({
                            username: selectedForecast.submittedForecasts[i].username,
                            y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                            x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                            description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                        });
                    } else if (userIncreaseData.length > 0) {
                        if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) === userIncreaseData[userIncreaseData.length-1].x) {
                            userIncreaseData[userIncreaseData.length-1] = {
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments
                            };
                            userSameData[userSameData.length-1] = {
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments
                            };
                            userDecreaseData[userDecreaseData.length-1] = {
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments
                            };
                        // Different date as last forecast so append
                        } else if (selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15) !== userIncreaseData[userIncreaseData.length-1].x) {
                            // Different date, append
                            userIncreaseData.push({
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyHigher*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                            userSameData.push({
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintySame*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                            userDecreaseData.push({
                                username: selectedForecast.submittedForecasts[i].username,
                                y: selectedForecast.submittedForecasts[i].forecasts[j].certainties.certaintyLower*100, 
                                x: selectedForecast.submittedForecasts[i].forecasts[j].date.slice(0, 15),
                                description: selectedForecast.submittedForecasts[i].forecasts[j].comments 
                            });
                        };
                    };
                };
            };
        };

        allData = increaseData.concat(sameData, decreaseData);
        allData.sort((a, b) => a.x < b.x);
        let avgIncreaseArr = getNewDailyAverages(increaseData, new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
        let avgSameArr = getNewDailyAverages(sameData, new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
        let avgDecreaseArr = getNewDailyAverages(decreaseData, new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));

        // Adding in simulated data for days with no predictions (copying last data over to all days) - for AVERAGE
        if ((avgIncreaseArr.length > 0) && (avgIncreaseArr[avgIncreaseArr.length-1].x !== new Date().toString().slice(0, 15))) {
            // We need to not use the data.length-1.x value, this is just copying over the 
            // last prediction, we want it to copy over the average from the day before
            let increaseY = avgIncreaseArr[avgIncreaseArr.length-1].y;
            let sameY = avgSameArr[avgSameArr.length-1].y;
            let decreaseY = avgDecreaseArr[avgDecreaseArr.length-1].y;
            let comments = avgIncreaseArr[avgIncreaseArr.length-1].description;
            let lastDayWithData = new Date(avgIncreaseArr[avgIncreaseArr.length-1].x);
            lastDayWithData.setDate(lastDayWithData.getDate() + 1);
            for (let d = lastDayWithData; d <= new Date(); d.setDate(d.getDate() + 1)) {
                let newDate = new Date(d).toString().slice(0, 15);

                avgIncreaseArr.push({
                    y: increaseY,
                    x: newDate,
                    description: comments
                });
                avgSameArr.push({
                    y: sameY,
                    x: newDate,
                    description: comments
                });
                avgDecreaseArr.push({
                    y: decreaseY,
                    x: newDate,
                    description: comments
                });
            };
        };

        // Adding in simulated data for days with no predictions (copying last data over to all days) - for SPECIFIC PREDICTIONS
        // if (increaseData[increaseData.length-1].x !== new Date().toString().slice(0, 15)) {
        //     let increaseY = increaseData[increaseData.length-1].y;
        //     let sameY = sameData[sameData.length-1].y;
        //     let decreaseY = decreaseData[decreaseData.length-1].y;
        //     let newDate = new Date().toString().slice(0, 15);
        //     increaseData.push({
        //         y: increaseY,
        //         x: newDate
        //     });
        //     sameData.push({
        //         y: sameY,
        //         x: newDate
        //     });
        //     decreaseData.push({
        //         y: decreaseY,
        //         x: newDate
        //     });
        // };

        // Adding in simulated data for days with no predictions (copying last data over to all days) - for SPECIFIC PREDICTIONS
        if ((userIncreaseData.length > 0) && (userIncreaseData[userIncreaseData.length-1].x !== new Date().toString().slice(0, 15))) {
            let increaseY = userIncreaseData[userIncreaseData.length-1].y;
            let sameY = userSameData[userSameData.length-1].y;
            let decreaseY = userDecreaseData[userDecreaseData.length-1].y;
            let comments = avgIncreaseArr[avgIncreaseArr.length-1].description;
            let newDate = new Date().toString().slice(0, 15);
            userIncreaseData.push({
                y: increaseY,
                x: newDate,
                description: comments
            });
            userSameData.push({
                y: sameY,
                x: newDate,
                description: comments
            });
            userDecreaseData.push({
                y: decreaseY,
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
        let increaseChData = {
            label: "Increased (Avg)",
            data: avgIncreaseArr,
            backgroundColor: "darkblue",
            borderColor: "darkblue",
            showLine: true,
            borderWidth: 4,
            pointRadius: 3
        };
        let sameChData = {
            label: "Stayed The Same (Avg)",
            data: avgSameArr,
            backgroundColor: "red",
            borderColor: "red",
            showLine: true,
            borderWidth: 4,
            pointRadius: 3
        };
        let decreaseChData = {
            label: "Decreased (Avg)",
            data: avgDecreaseArr,
            backgroundColor: "green",
            borderColor: "green",
            showLine: true,
            borderWidth: 4,
            pointRadius: 3
        };
        let userIncreaseChData = {
            label: "Increased (Me)",
            data: userIncreaseData,
            backgroundColor: "lightblue",
            borderColor: "lightblue",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        let userSameChData = {
            label: "Stayed Same (Me)",
            data: userSameData,
            backgroundColor: "pink",
            borderColor: "pink",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        let userDecreaseChData = {
            label: "Decreased (Me)",
            data: userDecreaseData,
            backgroundColor: "lightgreen",
            borderColor: "lightgreen",
            showLine: true,
            borderWidth: 3,
            pointRadius: 2
        };
        createLabelsArray(new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
        setAllChartData(allChData);
        setIncreaseChartData(increaseChData);
        setSameChartData(sameChData);
        setDecreaseChartData(decreaseChData);
        setUserIncreaseChartData(userIncreaseChData);
        setUserSameChartData(userSameChData);
        setUserDecreaseChartData(userDecreaseChData);
    };
};

  const createLabelsArray = (start, end) => {
      let labelsToReturn = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          let newDate = new Date(d).toString().slice(0, 15);
          labelsToReturn.push(newDate);
      };
      setLabelsArray(labelsToReturn);
    //   console.log((end - start)/1000)
    //   let labelsToReturn = [];
    // // Problem is live for 48 hours or less - 1 tick per hour
    //   if ((end - start)/1000 <= 172800) {
    //     for (let d = start; d <= end; d = new Date(d.getTime()+1000*60*60)) {
    //         let newDate = new Date(d).toString().slice(0, 18); 
    //         labelsToReturn.push(newDate);
    //     };
    //     // Problem is live for 2-7 days
    //   } else if ((end-start)/1000 < 604800) {
    //     for (let d = start; d <= end; d = new Date(d.getTime()+1000*60*60)) {
    //         let newDate = new Date(d).toString().slice(0, 18); 
    //         labelsToReturn.push(newDate);
    //     };
    //   } else {
    //     for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    //         let newDate = new Date(d).toString().slice(0, 15);
    //         labelsToReturn.push(newDate);
    //     };
    //   }
    //   setLabelsArray(labelsToReturn);
    };

    const createNewLabelsArray = (start, end) => {
        let labelsToReturn = [];
        // I think the reason why the blue line is stopping a day early is because it might be going to the minute 
        // If the start date is 8am and we're at 7.30am, it might not think we are on the same day
        for (let d = new Date(start.toString().slice(0, 15)); d <= new Date(new Date().toString().slice(0, 15)); d.setDate(d.getDate() + 1)) {
            let newDate = new Date(d).toString().slice(0, 15);
            labelsToReturn.push(newDate);
        };
        return labelsToReturn;
    };

    const getNewDailyAverages = (certainties, start, end) => {
        // Create labels array
        let days = createNewLabelsArray(start, end);
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
                    arrOfAllForecastValues.push(sortedCertainties[j].y);
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

    const getDailyAverages = (certainties) => {
        // Sort main array by date
        let sortedCertainties = certainties.sort((a, b) => new Date(a.x) - new Date(b.x));
        let arr = [[sortedCertainties[0]]];
        // Sort that array into an array of date "bins"
        for (let i = 1; i < sortedCertainties.length; i++) {
            if (sortedCertainties[i].x === arr[arr.length-1][0].x) {
                arr[arr.length-1].push(sortedCertainties[i]);
            } else if (sortedCertainties[i].x !== arr[arr.length-1][0].x) {
                arr.push([sortedCertainties[i]]);
            };
        };
        let finalArr = [];
        // Loop through "bin" array and work out averages by date/bin
        for (let i = 0; i < arr.length; i++) {
            let avg = 0;
            let date = arr[i][0].x;
            for (let j = 0; j < arr[i].length; j++) {
                avg = avg + arr[i][j].y;
            };
            avg = avg / arr[i].length;
            finalArr.push({x: date, y: avg});
        };
        return finalArr;
    };

    const data = {
        labels: labelsArray,
        // datasets: [chartData, averageChartData],
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
        // }, {
        //     label: averageSinceLastPrediction.label,
        //     data: averageSinceLastPrediction.data,
        //     backgroundColor: averageSinceLastPrediction.backgroundColor,
        //     borderColor: averageSinceLastPrediction.borderColor,
        //     borderWidth: averageSinceLastPrediction.borderWidth,
        //     showLine: averageSinceLastPrediction.showLine,
        //     pointRadius: averageSinceLastPrediction.pointRadius  
        }],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: true
    };

    const multiOutcomeData = {
        labels: labelsArray,
        // datasets: [chartData, averageChartData],
        datasets: [{
            label: allChartData.label,
            data: allChartData.data,
            backgroundColor: allChartData.backgroundColor,
            borderColor: allChartData.borderColor,
            borderWidth: allChartData.borderWidth,
            showLine: allChartData.showLine,
            pointRadius: allChartData.pointRadius
        }, {
            label: increaseChartData.label,
            data: increaseChartData.data,
            backgroundColor: increaseChartData.backgroundColor,
            borderColor: increaseChartData.borderColor,
            borderWidth: increaseChartData.borderWidth,
            showLine: increaseChartData.showLine,
            pointRadius: increaseChartData.pointRadius
        }, {
            label: sameChartData.label,
            data: sameChartData.data,
            backgroundColor: sameChartData.backgroundColor,
            borderColor: sameChartData.borderColor,
            borderWidth: sameChartData.borderWidth,
            pointRadius: sameChartData.pointRadius
        }, {
            label: decreaseChartData.label,
            data: decreaseChartData.data,
            backgroundColor: decreaseChartData.backgroundColor,
            borderColor: decreaseChartData.borderColor,
            borderWidth: decreaseChartData.borderWidth,
            showLine: decreaseChartData.showLine,
            pointRadius: decreaseChartData.pointRadius
        }, {
            label: userIncreaseChartData.label,
            data: userIncreaseChartData.data,
            backgroundColor: userIncreaseChartData.backgroundColor,
            borderColor: userIncreaseChartData.borderColor,
            borderWidth: userIncreaseChartData.borderWidth,
            showLine: userIncreaseChartData.showLine,
            pointRadius: userIncreaseChartData.pointRadius  
        }, {
            label: userSameChartData.label,
            data: userSameChartData.data,
            backgroundColor: userSameChartData.backgroundColor,
            borderColor: userSameChartData.borderColor,
            borderWidth: userSameChartData.borderWidth,
            showLine: userSameChartData.showLine,
            pointRadius: userSameChartData.pointRadius  
        }, {
            label: userDecreaseChartData.label,
            data: userDecreaseChartData.data,
            backgroundColor: userDecreaseChartData.backgroundColor,
            borderColor: userDecreaseChartData.borderColor,
            borderWidth: userDecreaseChartData.borderWidth,
            showLine: userDecreaseChartData.showLine,
            pointRadius: userDecreaseChartData.pointRadius  
        }],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: true
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            },
        },
        plugins: {
            legend: {
                display: true
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
                        // console.log(context);
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
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2>
                <u>{props.selectedForecast.problemName}</u>
                <FaInfoCircle 
                    color={"orange"} 
                    className="modal-i-btn"
                    onClick={() => {
                        setShowModal(true);
                        setModalContent(props.forecastSingleCertainty === true ? `Beneath this info button is the main visualisation of all forecasts made for the given problem. The chart displays the most recent prediction made by any user on each day (so if you submit 10 predictions today, only your tenth will show on the chart unless you update it again - in which case, your 11th will show instead). While this may obscure some data, it prevents the chart from becoming unreadable (if I submit 100 predictions today at each integer from 0-100, the chart would have a vertical line of data which is of no use to anybody). The three buttons underneath the problem allow you to alter the chart, enabling you to display any permutation of All Forecasts, the Daily Average Certainty, and the forecasts you yourself have made. Look under the chart for more info and data on the problem and market!` : `This is the chart for showing each day's average forecasts for the three possible outcomes, as well as your own scores.`)}}
                />
            </h2>
            <div className="chart-container" style={{ position: "relative", margin: "auto", width: "100%" }}>
                <Line data={props.forecastSingleCertainty === true ? data : multiOutcomeData} options={options} height={"100%"}/>
            </div>
        </div>
    )
}

export default ForecastProblemLineChart;


