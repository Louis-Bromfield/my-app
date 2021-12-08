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

  useEffect(() => {
    formatCertainties(props.selectedForecast, props.updateTodayStats, props.username);
    console.log("Line Chart UE");
  }, [props.selectedForecast, props.refresh]);

  const formatCertainties = (selectedForecast, updateTodayStats, username) => {
    // No forecasts yet submitted
      if (selectedForecast.submittedForecasts.length === 0) {
          setChartData({ label: "All Forecasts", data: [] });
          setUserChartData({ label: "Your Forecasts", data: [] });
          setAverageChartData({ label: "Daily Average Certainty", data: [] });
          createLabelsArray(new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
          return;
      };
    // Forecasts Submitted
        let lastForecastDate = "";
        let newCertainties = selectedForecast.submittedForecasts;
        let userData = {
            label: "Your Forecasts",
            data: [],
            backgroundColor: "green",
            borderColor: "orange",
            showLine: true,
            borderWidth: 7,
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
        if (newCertainties.length > 0 || newCertainties[0] === '') {
            for (let i = 0; i < newCertainties.length; i++) {
                for (let j = 0; j < newCertainties[i].forecasts.length; j++) {
                    if (newCertainties[i].forecasts[j].date.slice(0, 15) !== lastForecastDate) {
                        data.data.push({x: newCertainties[i].forecasts[j].date.slice(0, 15), y: ((newCertainties[i].forecasts[j].certainty)*100)});
                        lastForecastDate = data.data[data.data.length-1].x;
                        if (newCertainties[i].username === username) {
                            userData.data.push({x: newCertainties[i].forecasts[j].date.slice(0, 15), y: ((newCertainties[i].forecasts[j].certainty)*100)});
                        }
                    } else if (newCertainties[i].forecasts[j].date.slice(0, 15) === lastForecastDate) {
                        data.data[data.data.length-1] = ({x: newCertainties[i].forecasts[j].date.slice(0, 15), y: ((newCertainties[i].forecasts[j].certainty)*100)});
                        if (newCertainties[i].username === username) {
                            if (userData.data.length === 0) {
                                userData.data.push({x: newCertainties[i].forecasts[j].date.slice(0, 15), y: ((newCertainties[i].forecasts[j].certainty)*100)});
                            } else if (userData.data.length !== 0) {
                                userData.data[userData.data.length-1] = ({x: newCertainties[i].forecasts[j].date.slice(0, 15), y: ((newCertainties[i].forecasts[j].certainty)*100)});
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
            const dailyAverages = getDailyAverages(data.data);
            updateTodayStats(`${dailyAverages[dailyAverages.length-1].y.toFixed(2)}%`, todayForecasts.length);
            setChartData(data);
            setUserChartData(userData);
            setAverageChartData({
                label: "Daily Average Certainty",
                data: dailyAverages,
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                borderWidth: 4,
                pointRadius: 3
            });
            // Create line for days with no prediction (since the last prediction was made)
            let today = new Date();
            let averageSinceLatestPrediction = [];
            if ((today > new Date(data.data[data.data.length-1].x)) && (today < new Date(selectedForecast.closeDate))) {
                averageSinceLatestPrediction = [dailyAverages[dailyAverages.length-1], {x: today.toString().slice(0, 15), y: dailyAverages[dailyAverages.length-1].y}];
            };
            setAverageSinceLastPredictionData({
                label: "Average Certainty Since Last Prediction",
                data: averageSinceLatestPrediction,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderColor: "rgba(255, 0, 0, 0.5)",
                borderWidth: 4,
                pointRadius: 0
            });
        };
        createLabelsArray(new Date(selectedForecast.startDate), new Date(selectedForecast.closeDate));
    };

  const createLabelsArray = (start, end) => {
      let labelsToReturn = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          let newDate = new Date(d).toString().slice(0, 15);
          labelsToReturn.push(newDate);
        };
        setLabelsArray(labelsToReturn);
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
            label: averageSinceLastPrediction.label,
            data: averageSinceLastPrediction.data,
            backgroundColor: averageSinceLastPrediction.backgroundColor,
            borderColor: averageSinceLastPrediction.borderColor,
            borderWidth: averageSinceLastPrediction.borderWidth,
            showLine: averageSinceLastPrediction.showLine,
            pointRadius: averageSinceLastPrediction.pointRadius  
        }],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltips: {
                enabled: false,
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
                    onClick={() => { setShowModal(true); setModalContent(`Beneath this info button is the main visualisation of all forecasts made for the given problem. The chart displays the most recent prediction made by any user on each day (so if you submit 10 predictions today, only your tenth will show on the chart unless you update it again - in which case, your 11th will show instead). While this may obscure some data, it prevents the chart from becoming unreadable (if I submit 100 predictions today at each integer from 0-100, the chart would have a vertical line of data which is of no use to anybody). The three buttons underneath the problem allow you to alter the chart, enabling you to display any permutation of All Forecasts, the Daily Average Certainty, and the forecasts you yourself have made. Look under the chart for more info and data on the problem and market!`)}}
                />
            </h2>
            <Line data={data} options={options} />
        </div>
    )
}

export default ForecastProblemLineChart;


