import React from 'react'

function ForecastResultsBreakdown(props) {
    console.log(`the forecastClosed prop is currently = ${props.forecastClosed}`);
    return (
        <div>
            {props.forecastClosed === true &&
                <div>
                    <h2 style={{ color: "#404d72"}}>Combined Brier Score: <u>{props.totalScore.toFixed(2)} / 100</u></h2>
                    <h2 style={{ color: "#404d72"}}>Time Score: <u>{props.tScore.toFixed(2)} / 10</u></h2>
                    <h2 style={{ color: "#404d72"}}>Final Score For This Problem: <u>{(props.totalScore + props.tScore).toFixed(2)} / 110</u></h2>
                </div>
            }
            {props.forecastClosed === false &&
                <div>
                <h2 style={{ color: "#404d72" }}>As things stand, what will I score?</h2>
                <div className="hypothetical-results-container">
                    <div className="hypothetical-results-subcontainer">
                        <h3>If the Problem DOES Happen, and I don't use Boost</h3>
                        <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfHappenedNoBoost.toFixed(2)} / 100</h4>
                        <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                        <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfHappenedNoBoost + props.tScore).toFixed(2)} / 110</h4>
                    </div>
                    <div className="hypothetical-results-subcontainer">
                        <h3>If the Problem DOES Happen, and I do use Boost</h3>
                        <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfHappenedAndBoost.toFixed(2)} / 100</h4>
                        <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                        <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfHappenedAndBoost + props.tScore).toFixed(2)} / 210</h4>
                    </div>
                    <div className="hypothetical-results-subcontainer">
                        <h3>If the Problem Does NOT Happen, and I don't use Boost</h3>
                        <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfNotHappenedNoBoost.toFixed(2)} / 100</h4>
                        <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                        <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfNotHappenedNoBoost + props.tScore).toFixed(2)} / 110</h4>
                    </div>
                    <div className="hypothetical-results-subcontainer">
                        <h3>If the Problem Does NOT Happen, and I do use Boost</h3>
                        <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfNotHappenedAndBoost.toFixed(2)} / 100</h4>
                        <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                        <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfNotHappenedAndBoost + props.tScore).toFixed(2)} / 210</h4>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default ForecastResultsBreakdown
