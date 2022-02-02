import React from 'react';

function ForecastResultsBreakdown(props) {
    // console.log(`the forecastClosed prop is currently = ${props.forecastClosed}`);
    return (
        <div>
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
                <h2 style={{ color: "#404d72" }}>As things stand, what will I score?</h2>
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
                            <h3>If Increase:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfIncrease.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfIncrease + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                        <div className="hypothetical-results-subcontainer">
                            <h3>If Same:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfSame.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfSame + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                        <div className="hypothetical-results-subcontainer">
                            <h3>If Decrease:</h3>
                            <h4 style={{ color: "#404d72"}}>Aggregate Score: {props.totalIfDecrease.toFixed(2)} / 100</h4>
                            <h4 style={{ color: "#404d72"}}>Time Score: {props.tScore.toFixed(2)} / 10</h4>
                            <h4 style={{ color: "#404d72"}}>Final Score For This Problem: {(props.totalIfDecrease + props.tScore).toFixed(2)} / 110</h4>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
    )
}

export default ForecastResultsBreakdown
