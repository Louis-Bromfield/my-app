import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './HomeButtonLarge.css';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import { Line } from 'react-chartjs-2';

function HomeButtonLarge(props) {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        getBrierDataFromDB(props.user.username === undefined ? localStorage.getItem('username') : props.user.username);
        console.log("HBL UE");
    }, [props.user.username]);

    const getBrierDataFromDB = async (username) => {
        try {
            const brierDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (brierDocument.data[0].brierScores.length === 0) {
                setData([]);
                setLabels([]);
                return;
            }
            let brierArray = [null];
            let labelsArray = [""];
            let counter = 0;
            for (let i = brierDocument.data[0].brierScores.length-1; counter < 10 && i >= 0; i--) {
                brierArray.push(brierDocument.data[0].brierScores[i].brierScore);
                labelsArray.push(brierDocument.data[0].brierScores[i].problemName);
                counter++;
            };
            brierArray.push(null);
            labelsArray.push("");
            setData(brierArray.reverse());
            setLabels(labelsArray.reverse());
            // getChartLabels(brierDocument.data[0].brierScores);
        } catch (error) {
            console.error("Error in HomeButtonLarge > getBrierDataFromDB");
            console.error(error);
        };
    };

    const recentForecastData = {
        labels: labels,
        datasets: [
            {
                label: "Recent Forecast Brier Scores",
                data: data,
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)"
            }
        ],
        spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
        redraw: false
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                display: false
            }
        }
    };

    return (
        <div className="home-button-large">
            <h2 className="home-button-large-title">{props.title}</h2>
            <Line data={recentForecastData} options={options}/>
            <HomeButtonNavButton path="my-profile" />
        </div>
    )
}

export default HomeButtonLarge;


HomeButtonLarge.propTypes = {
    title: PropTypes.string.isRequired
};