import React, { useState, useEffect } from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import axios from 'axios';

const ClosedProblemModal = (props) => {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    // const layoutClassName = props.userObj.numberOfClosedForecasts > 1 ? "grid-layout" : "non-grid-layout";
    const [brierArr, setBrierArr] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(props.userBrierScores === undefined ? { problemName: "", brierScore: 0.00 } : props.userBrierScores[props.userBrierScores.length-1]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

    useEffect(() => {
        if (props.userBrierScores.length === 0 || props.userClosedForecastCount === null || props.userClosedForecastCount === undefined) {
            return;
        } else {
            let userClosedForecastCount = props.userClosedForecastCount;
            if (props.userClosedForecastCount > props.userBrierScores.length) {
                userClosedForecastCount = props.userBrierScores.length;
            };
            const arr = [];
            let i = props.userBrierScores.length-1;
            // while (i >= props.userBrierScores.length-(props.userClosedForecastCount)) {
            while (i >= props.userBrierScores.length-(userClosedForecastCount)) {
                arr.push(props.userBrierScores[i]);
                i--;
            };
            setBrierArr(arr);
            setCurrentProblem(arr[0]);
            setCurrentProblemIndex(0);
        };
        console.log("CPM Modal UE");
    }, [props.userBrierScores, props.userClosedForecastCount]);

    const closeModal = async (username) => {
        props.setShowClosedProblemModal(false);
        await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, { numberOfClosedForecasts: 0});
        props.setUserClosedForecastCount(0);
    };

    const setNewProblem = () => {
        if (currentProblemIndex === brierArr.length-1) {
            setCurrentProblem(brierArr[0]);
            setCurrentProblemIndex(0);
        } else {
            setCurrentProblem(brierArr[currentProblemIndex+1])
            setCurrentProblemIndex(currentProblemIndex+1);
        }
    }

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <img src={FFLogo} alt="" />
                <p>We've closed some forecast problems! Go to Forecasts and select the problem for a breakdown of your performance!</p>
                <a href="https://youtu.be/OkLP72O3hmo" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}>
                    <p>Want to know more about how your scores are calculated? Click here.</p>
                </a>
                <button onClick={() => closeModal(props.username)} className="close-modal-btn">
                    Close
                </button>
                {brierArr.length > 1 &&
                    <button onClick={setNewProblem} className="next-problem-btn">
                        Next Problem
                    </button>
                }
                <br />
                <div className="non-grid-layout">
                    <div className="closed-forecast-container">
                        <p>{currentProblem.problemName}</p>
                        <hr />
                        <p>{currentProblem.marketName}</p>
                        <br />
                        <p>You Scored: <u>{currentProblem.brierScore.toFixed(2)} / 110</u></p>
                        <p>You Scored: <u>{currentProblem.brierScore.toFixed(0)}</u> Market Points and FFPoints!</p>
                        <br />
                        {currentProblem.brierScore >= 100 && <p>If this was your first 100+ score or your third in a row, you will have received the "Gold Standard" or "Triple Gold Standard" trophies respectively!</p>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClosedProblemModal;
