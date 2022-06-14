import React, { useState, useEffect } from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import axios from 'axios';

const ClosedProblemModal = (props) => {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    // const layoutClassName = props.userObj.numberOfClosedForecasts > 1 ? "grid-layout" : "non-grid-layout";
    const [brierArr, setBrierArr] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(props.user.brierScores[props.user.brierScores.length-1] === undefined ? { problemName: "", brierScore: 0.00 } : props.user.brierScores[props.user.brierScores.length-1]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

    useEffect(() => {
console.log(props.user);
console.log(props.userClosedForecastCount);
        const arr = [];
        let i = props.user.brierScores.length-1;
        while (i >= props.user.brierScores.length-(props.userClosedForecastCount)) {
            arr.push(props.user.brierScores[i]);
            i--;
        };
        setBrierArr(arr);
        setCurrentProblem(arr[0]);
        setCurrentProblemIndex(0);
        console.log("CPM Modal UE");
    }, [props.userBrierScores, props.userClosedForecastCount]);

    const closeModal = async (username) => {
        props.setShowClosedProblemModal(false);
        await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, { numberOfClosedForecasts: 0});
        props.setUserClosedForecastCount(0);
    };

    const setNewProblem = () => {
        console.log("clicked")
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
                <p>We've closed some forecast problems! Go to My Forecasts and select the problem for a breakdown of your performance!</p>
                {/* <p>You will receive a 5% boost for every problem where you score 75+!</p> */}
                <a href="https://youtu.be/1fJG4NHDmVY" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}>
                    <p>Want to know more about how your scores are calculated? Click here.</p>
                </a>
                <button onClick={() => closeModal(props.username)} className="close-modal-btn">
                    Close
                </button>
                {/* Add condition to only render this if there is another problem to show */}
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
                        {/* {(currentProblem.performanceBoost >= 1 && currentProblem.brierScore >= 75) &&
                            <p>
                                As you scored 75 or above on this problem, you received a Boost of <u>5% ({(currentProblem.brierScore - (currentProblem.brierScore / 105) * 100).toFixed(2)} points)</u> on this prediction.
                            </p>
                        } */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClosedProblemModal;
