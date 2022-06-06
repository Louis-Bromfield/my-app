import React, { useState, useEffect } from 'react';
import './ProfileForecasts.css';

function ProfileForecasts(props) {
    const [brierReverse, setBrierReverse] = useState([{ problemName: "", brierScore: 0}])
    console.log(props);

    useEffect(() => {
        console.log("ProfileForecasts UE");
        setBrierReverse(props.userObj.brierScores.reverse());
    });
  return (
    <div className="profile-forecasts">
        <h1 className="profile-header">My Forecasts</h1>
        <h3># of Problems Attempted: {brierReverse.length}</h3>
        {brierReverse.map((item, index) => {
            return (
                <div index={item.problemName} className="profile-forecasts-individual-result">
                    <div className="problem-header"><h4 style={{ color: "#404d72"}}>Problem:&nbsp;</h4> <h4>{item.problemName}</h4></div>
                    <div className="score-header"><h4 style={{ color: "#404d72"}}>Score:&nbsp;</h4> <h4>{item.brierScore.toFixed(2)} (+/- {brierReverse[index].brierScore - brierReverse[index-1].brierScore}%)</h4></div>
                </div>
            )
        })}
    </div>
  )
}

export default ProfileForecasts