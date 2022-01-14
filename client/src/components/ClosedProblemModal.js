import React, { useState, useEffect } from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import axios from 'axios';

const ClosedProblemModal = (props) => {
  const showHideClassName = props.show ? "modal display-block" : "modal display-none";
  const layoutClassName = props.userObj.numberOfClosedForecasts > 1 ? "grid-layout" : "non-grid-layout";
  const [brierArr, setBrierArr] = useState([]);

  useEffect(() => {
      const arr = [];
      let i = props.userObj.brierScores.length-1;
      while (i >= props.userObj.brierScores.length-(props.userObj.numberOfClosedForecasts)) {
          arr.push(props.userObj.brierScores[i]);
          i--;
      };
      setBrierArr(arr);
      console.log("CPM Modal UE");
  }, [props.userObj.brierScores, props.userObj.numberOfClosedForecasts]);

    const closeModal = async (username) => {
        props.setShowClosedProblemModal(false);
        await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, { numberOfClosedForecasts: 0});
    };

    return (
        <div className={showHideClassName}>
          <section className="modal-main">
            <img src={FFLogo} alt="" />
            <h3>We've closed some forecast problems! Go to My Forecasts and select the problem for a breakdown of your performance!</h3>
            <h4>You will receive boosts for every consecutive problem where you score 75+. 2 predictions in a row = 5% bonus, 3 prediction = 6%, and so on.</h4>
            <button type="button" onClick={() => closeModal(props.userObj.username)} className="close-modal-btn">
                Close
            </button>
            <br />
            <div className={layoutClassName}>
                {brierArr.map((item, index) => {
                    if (item.captainedStatus === true) {
                        return (
                            <div className="closed-forecast-container-boosted" key={index}>
                                <h3 style={{ color: "gold" }}>Boosted: {item.problemName}</h3>
                                <hr />
                                <h4>{item.marketName}</h4>
                                <br />
                                <span className="one-line-span">
                                    <h3>
                                        You Scored:&nbsp;&nbsp;
                                    </h3>
                                    <h3 style={{ color: "orange"}}>
                                        {item.brierScore.toFixed(2)}
                                    </h3>
                                    <h3>
                                        &nbsp;/ 110
                                    </h3>
                                </span>
                                <span className="one-line-span">
                                    <h3>
                                        You Earned&nbsp;
                                    </h3>
                                    <h3 style={{ color: "orange"}}>
                                        {item.brierScore.toFixed(2).slice(0, -3)}
                                    </h3>
                                    <h3>
                                        &nbsp;Market Points and FFPoints!
                                    </h3>
                                </span>
                                <br />
                                {item.performanceBoost > 1 &&
                                    <div className="boost-div">
                                        <h3>
                                            As you are on a {item.performanceBoost}x streak of scoring 75 or above in this market, you received a Boost of&nbsp;
                                        </h3>
                                        <h3 style={{ color: "orange"}}>
                                            {3+item.performanceBoost}% ({(item.brierScore - (item.brierScore / (100 + (3+item.performanceBoost)) * 100)).toFixed(2)} points)
                                        </h3>
                                        <h3>
                                            &nbsp;on this prediction.
                                        </h3>
                                    </div>
                                }
                            </div>
                        );
                    } else if (item.captainedStatus === false) {
                        return (
                            <div className="closed-forecast-container" key={index}>
                                <h3>{item.problemName}</h3>
                                <hr />
                                <h4>{item.marketName}</h4>
                                <br />
                                <span className="one-line-span">
                                    <h3>
                                        You Scored:&nbsp;&nbsp;
                                    </h3>
                                    <h3 style={{ color: "orange"}}>{
                                        item.brierScore.toFixed(2)}
                                    </h3>
                                    <h3>
                                        &nbsp;/ 110
                                    </h3>
                                </span>
                                <span className="one-line-span">
                                    <h3>
                                        You Earned&nbsp;
                                    </h3>
                                    <h3 style={{ color: "orange"}}>
                                        {item.brierScore.toFixed(2).slice(0, -3)}
                                    </h3>
                                    <h3>
                                        &nbsp;Market Points and FFPoints!
                                    </h3>
                                </span>
                                <br />
                                {item.performanceBoost > 1 &&
                                    <div className="boost-div">
                                        <h3>
                                            As you are on a {item.performanceBoost}x streak of scoring 75 or above in this market, you received a Boost of&nbsp;
                                        </h3>
                                        <h3 style={{ color: "orange"}}>
                                            {3+item.performanceBoost}% ({(item.brierScore - (item.brierScore / (100 + (3+item.performanceBoost)) * 100)).toFixed(2)} points)
                                        </h3>
                                        <h3>
                                            &nbsp;on this prediction.
                                        </h3>
                                    </div>
                                }
                            </div>
                        );
                    } else return null;
                })}
            </div>
          </section>
        </div>
      );
};

export default ClosedProblemModal;
