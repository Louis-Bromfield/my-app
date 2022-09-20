import React, { useState, useEffect } from 'react';
import './ProfileForecasts.css';

function ProfileForecasts(props) {
    const [brierReverse, setBrierReverse] = useState([{ problemName: null, brierScore: null}])

    useEffect(() => {
        console.log("ProfileForecasts UE");
        if (props.userObj === {} || props.userObj.brierScores.length === 0 ||props.userObj.brierScores === undefined) {
            return;
        } else {
            setBrierReverse(props.userObj.brierScores.reverse());
        };
    });
    return (
        <div className="profile-forecasts">
            <h2 className="profile-header">{props.searched === true ? `${props.playerUsername}'s Forecasts` : `My Forecasts`}</h2>
            {(brierReverse[0].problemName === null || props.userObj.brierScores.length === 0) &&
                <h3>No scores here; scores achieved for forecasting a problem found on the "My Forecasts" page will be shown here.</h3>
            }
            {brierReverse[0].problemName !== null &&
                <div>
                    <h3># of Problems Attempted: {brierReverse.length}</h3>
                    {brierReverse.map((item, index) => {
                        return (
                            <div key={item.problemName+index} index={item.problemName} className="profile-forecasts-individual-result">
                                <div className="problem-header"><h4 style={{ color: "#404d72"}}>Problem:&nbsp;</h4> <h4>{item.problemName}</h4></div>
                                <div className="score-header"><h4 style={{ color: "#404d72"}}>Score:&nbsp;</h4> <h4>{item.brierScore.toFixed(2)}</h4></div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default ProfileForecasts;