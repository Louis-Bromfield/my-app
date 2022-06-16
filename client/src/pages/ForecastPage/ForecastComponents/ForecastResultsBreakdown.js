import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../../../components/Modal';

function ForecastResultsBreakdown(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    
    return (
        <div>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {props.forecastClosed === true &&
                <div>
                    <h2 style={{ color: "#404d72"}}>Combined Brier Score: <u>{props.totalScore.toFixed(2)} / 100</u></h2>
                    <h2 style={{ color: "#404d72"}}>Time Score: <u>{props.tScore.toFixed(2)} / 10</u></h2>
                    <h2 style={{ color: "#404d72"}}>Total: <u>{(props.totalScore + props.tScore).toFixed(2)} / 110</u></h2>
                    {Number(localStorage.getItem("closedForecastScore")) > (props.totalScore + props.tScore) && <h2 style={{ color: "#404d72"}}>Performance Bonus: {(Number(localStorage.getItem("closedForecastScore")) - (props.totalScore + props.tScore)).toFixed(2)}</h2>}
                    {Number(localStorage.getItem("closedForecastScore")) > (props.totalScore + props.tScore) && <h2 style={{ color: "#404d72"}}>Final Score: {(Number(localStorage.getItem("closedForecastScore")).toFixed(2))}</h2>}
                </div>
            }
            {props.forecastClosed === false &&
                <div>
                <h2 style={{ color: "#404d72" }}>
                    As things stand, what will I score?
                    <FaInfoCircle 
                        color={"orange"} 
                        className="modal-i-btn"
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(<a href="https://youtu.be/0TtfLVADR-I" target="_blank" rel="noreferrer nofollow" style={{ color: "#fff" }}><h4>Want to know more about how your scores are calculated? Click here, or visit the Learn page and select the Brier Scores tab.</h4></a>)
                        }}
                    />
                </h2>
                {props.singleCertainty === true &&
                    <div className="hypothetical-results-container">
                        <div className="hypothetical-results-subcontainer">
                            <h3>If the Problem DOES Happen:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfHappenedNoBoost.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfHappenedNoBoost + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                        <div className="hypothetical-results-subcontainer">
                            <h3>If the Problem Does NOT Happen:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfNotHappenedNoBoost.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfNotHappenedNoBoost + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                    </div>
                }
                {props.singleCertainty === false &&
                    <div className="hypothetical-results-container">
                        <div className="hypothetical-results-subcontainer">
                            <h3>If {props.forecastPotentialOutcomes[0]}:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfOutcomeOne.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfOutcomeOne + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                        <div className="hypothetical-results-subcontainer">
                            <h3>If {props.forecastPotentialOutcomes[1]}:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfOutcomeTwo.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfOutcomeTwo + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                        <div className="hypothetical-results-subcontainer">
                            <h3>If {props.forecastPotentialOutcomes[2]}:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfOutcomeThree.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfOutcomeThree + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
    )
}

export default ForecastResultsBreakdown
