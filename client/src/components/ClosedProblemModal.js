import React, { useState, useEffect } from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import axios from 'axios';

const ClosedProblemModal = (props) => {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    const layoutClassName = props.userObj.numberOfClosedForecasts > 1 ? "grid-layout" : "non-grid-layout";
    const [brierArr, setBrierArr] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(props.userObj.brierScores[props.userObj.brierScores.length-1]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

    useEffect(() => {
        const arr = [];
        let i = props.userObj.brierScores.length-1;
        while (i >= props.userObj.brierScores.length-(props.userObj.numberOfClosedForecasts)) {
            arr.push(props.userObj.brierScores[i]);
            i--;
        };
        setBrierArr(arr);
        setCurrentProblem(arr[0]);
        setCurrentProblemIndex(0);
        console.log("CPM Modal UE");
    }, [props.userObj.brierScores, props.userObj.numberOfClosedForecasts]);

    const closeModal = async (username) => {
        props.setShowClosedProblemModal(false);
        await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, { numberOfClosedForecasts: 0});
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
            <h3>We've closed some forecast problems! Go to My Forecasts and select the problem for a breakdown of your performance!</h3>
            <h4>You will receive a 5% boost for every problem where you score 75+!</h4>
            <a href="https://youtu.be/0TtfLVADR-I" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}>
                <h4>Want to know more about how your scores are calculated? Click here.</h4>
            </a>
            <button onClick={() => closeModal(props.userObj.username)} className="close-modal-btn">
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
                    <h3>{currentProblem.problemName}</h3>
                    <hr />
                    <h4>{currentProblem.marketName}</h4>
                    <br />
                    <h3>You Scored: <u>{currentProblem.brierScore.toFixed(2)} / 110</u></h3>
                    <h3>You Scored: <u>{currentProblem.brierScore.toFixed(2).slice(0, -3)}</u> Market Points and FFPoints!</h3>
                    <br />
                    {currentProblem.performanceBoost >= 1 &&
                        <h3>
                            As you scored 75 or above on this problem, you received a Boost of <u>5% ({(currentProblem.brierScore - (currentProblem.brierScore / 105) * 100).toFixed(2)} points)</u> on this prediction.
                        </h3>
                    }
                </div>
            </div>
        </section>
        </div>
    );
};

export default ClosedProblemModal;
