import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './HomeButtonLarge.css';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import { Line } from 'react-chartjs-2';
import Modal from '../../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function HomeButtonLarge(props) {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [averageData, setAverageData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        if (props.user.fantasyForecastPoints >= 600) {
            // Querying Server 
                // getBrierDataFromDB(props.user.username === undefined ? localStorage.getItem('username') : props.user.username);
            // Using props
            getBrierDataFromDB(props.user);
        };
        console.log("HBL UE");
    }, [props.user]);

    // Not querying server, using props
    const getBrierDataFromDB = (user) => {
        try {
            if (user.brierScores.length === 0) {
                setData([]);
                setLabels([]);
                return;
            }
            let brierArray = [null];
            let labelsArray = [""];
            let averageArray = [null];
            let counter = 0;
            for (let i = user.brierScores.length-1; counter < 10 && i >= 0; i--) {
                brierArray.push(user.brierScores[i].brierScore);
                labelsArray.push(user.brierScores[i].problemName);
                averageArray.push(user.brierScores[i].averageScore);
                counter++;
            };
            brierArray.push(null);
            labelsArray.push("");
            averageArray.push(null);
            setData(brierArray.reverse());
            setLabels(labelsArray.reverse());
            setAverageData(averageArray.reverse());
        } catch (error) {
            console.error("Error in HomeButtonLarge > getBrierDataFromDB");
            console.error(error);
        };
    };

    // Querying Server - not needed with props
    // const getBrierDataFromDB = async (username) => {
    //     try {
    //         const brierDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
    //         if (brierDocument.data[0].brierScores.length === 0) {
    //             setData([]);
    //             setLabels([]);
    //             return;
    //         }
    //         let brierArray = [null];
    //         let labelsArray = [""];
    //         let averageArray = [null];
    //         let counter = 0;
    //         for (let i = brierDocument.data[0].brierScores.length-1; counter < 10 && i >= 0; i--) {
    //             brierArray.push(brierDocument.data[0].brierScores[i].brierScore);
    //             labelsArray.push(brierDocument.data[0].brierScores[i].problemName);
    //             averageArray.push(brierDocument.data[0].brierScores[i].averageScore);
    //             counter++;
    //         };
    //         brierArray.push(null);
    //         labelsArray.push("");
    //         averageArray.push(null);
    //         setData(brierArray.reverse());
    //         setLabels(labelsArray.reverse());
    //         setAverageData(averageArray.reverse());
    //         // getChartLabels(brierDocument.data[0].brierScores);
    //     } catch (error) {
    //         console.error("Error in HomeButtonLarge > getBrierDataFromDB");
    //         console.error(error);
    //     };
    // };

    const recentForecastData = {
        labels: labels,
        datasets: [
            {
                label: "My Recent Brier Scores",
                data: data,
                fill: false,
                backgroundColor: "#404d72",
                borderColor: "#404d72",
                pointRadius: 3,
                borderWidth: 3
            }, {
                label: "Average Scores (All Players)",
                data: averageData,
                fill: false,
                backgroundColor: "orange",
                borderColor: "orange",
                pointRadius: 3,
                borderWidth: 3
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
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2 className="home-button-large-title">
                {props.title}
                {props.user.fantasyForecastPoints < 600 &&
                    <FaInfoCircle 
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(`This preview of your forecasting performance will be unlocked when you reach Level 6. This can be easily achieved by completing all Onboarding tasks above! You can submit posts to the feed, submit forecasts, complete learn quizzes, and much more to earn points.`)
                        }}
                        style={{ "color": "orange", "cursor": "pointer" }}
                    />
                }
            </h2>
            {props.user.fantasyForecastPoints >= 1000 && 
                <Line data={recentForecastData} options={options}/>
            }
            <HomeButtonNavButton path="my-profile" />
        </div>
    )
}

export default HomeButtonLarge;


HomeButtonLarge.propTypes = {
    title: PropTypes.string.isRequired
};