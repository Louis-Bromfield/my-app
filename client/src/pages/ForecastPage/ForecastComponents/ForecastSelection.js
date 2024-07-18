import React, { useEffect, useState } from 'react';
import './ForecastSelection.css';

function ForecastSelection(props) {


    useEffect(() => {
        console.log(props.allForecasts)
        // Need to sort props.allForecasts by proximity to deadline by default
        // Then provide a button to rotate between sorting by proximity to deadline in
        // ascending or descending order
    }, []);
    
    return (
        <div className="forecast-selection">
            <h3>Forecast Questions</h3>
                {props.allForecasts.map((item, index) => {
                    if (item.isClosed === true) {
                        return (
                            <h4 className="forecast-selection-item" onClick={() => props.handleClick(item)}>
                                <span style={{ color: "red"}}>CLOSED: </span> 
                                {item.problemName}
                            </h4>
                        )
                    } else if (item.isClosed === false) {
                        return (
                            <h4 className="forecast-selection-item" onClick={() => props.handleClick(item)}>
                                <span style={{ color: "green"}}>LIVE: </span> 
                                {item.problemName}
                            </h4>
                        )
                    }
                })}
        </div>
    )
}

export default ForecastSelection;
