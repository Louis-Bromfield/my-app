import React, { useState, useEffect } from 'react';
import './ProfileForecasts.css';

function ProfileForecasts(props) {
    const [brierReverse, setBrierReverse] = useState([{ problemName: "", brierScore: 0}])
    const [changeFromPrev, setChangeFromPrev] = useState();
    const [changeFromPrevColour, setChangeFromPrevColour] = useState();
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
            if (index > 0) {
                let diff = brierReverse[index].brierScore - brierReverse[index-1].brierScore;
                setChangeFromPrev(diff > 0 ? `+${diff}%` : diff === 0 ? `+/-${diff}%` : `-${diff}%`);
                setChangeFromPrevColour(diff > 0 ? "green" : diff === 0 ? "yellow" : "red")
            }
            return (
                <div index={item.problemName} className="profile-forecasts-individual-result">
                    <div className="problem-header"><h4 style={{ color: "#404d72"}}>Problem:&nbsp;</h4> <h4>{item.problemName}</h4></div>
                    <div className="score-header"><h4 style={{ color: "#404d72"}}>Score:&nbsp;</h4> <h4>{item.brierScore.toFixed(2)}</h4>&nbsp;<h4 style={{ color: {changeFromPrevColour} }}>({changeFromPrev}%)</h4></div>
                </div>
            )
        })}
    </div>
  )
}

export default ProfileForecasts