import React from 'react';
import './CalibrationResultsRadarChart.css';
import { Radar } from 'react-chartjs-2';

function CalibrationResultsRadarChart() {
    const data = {
        labels: ["Reactiveness", "Assertiveness", "Consistency"],
        datasets: [
            {
                label: "Your Performance",
                backgroundColor: "rgba(30, 100, 255, 0.4)",
                data: [9.05, 2.42, 7.89],
            },
            {
                label: "Global Average Performance",
                backgroundColor: "rgba(0, 200, 0, 0.2)",
                data: [6.32, 5.99, 1.20]
            }
        ]
    };

    const options = {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: "Your Forecasting Performance Visualised"
        },
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderColor: "gray",
        responsive: true,
        maintainAspectRatio: false
    }

    return (
        <div className="radar-chart-div">
            <h3>Your Performance Visualised</h3>
            <Radar data={data} options={options} />
        </div>
    )
}

export default CalibrationResultsRadarChart;
