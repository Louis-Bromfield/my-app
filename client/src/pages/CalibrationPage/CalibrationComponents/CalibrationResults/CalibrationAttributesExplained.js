import React from 'react';
import './CalibrationAttributesExplained.css';

function CalibrationAttributesExplained() {
    return (
        <div>
            <h2 className="attribute">Reactiveness</h2>
            <h3>You: 9.05 | Global Average: 6.32</h3>
            <p className="attribute-explanation">This paragraph will contain information about what Reactiveness is, as well as a detailed breakdown of 
                what the user's own score means. So we will have one explanation if it's 0-3, one for 4-6, and one for 7-10 for example. E.g. If they 
                scored 10, it would say "you scored very highly here, meaning that you shifted your predictions quite a lot whenever you received new 
                information. While updating is good, being too reactive can be a sign of an inability to properly weigh the impact of new information, 
                you may be overreacting."
            </p>
            <hr className="divider" />
            <h2 className="attribute">Consistency</h2>
            <h3>You: 7.89 | Global Average: 1.20</h3>
            <p className="attribute-explanation">This paragraph will contain information about what Consistency is, as well as a detailed breakdown of 
                what the user's own score means. So we will have one explanation if it's 0-3, one for 4-6, and one for 7-10 for example. E.g. If they 
                scored 10, it would say "you scored very highly here, meaning that you shifted your predictions quite a lot whenever you received new 
                information. While updating is good, being too reactive can be a sign of an inability to properly weigh the impact of new information, 
                you may be overreacting."
            </p>
            <hr className="divider" />
            <h2 className="attribute">Assertiveness</h2>
            <h3>You: 2.42 | Global Average: 5.99</h3>
            <p className="attribute-explanation">This paragraph will contain information about what Assertiveness is, as well as a detailed breakdown of 
                what the user's own score means. So we will have one explanation if it's 0-3, one for 4-6, and one for 7-10 for example. E.g. If they 
                scored 10, it would say "you scored very highly here, meaning that you shifted your predictions quite a lot whenever you received new 
                information. While updating is good, being too reactive can be a sign of an inability to properly weigh the impact of new information, 
                you may be overreacting."
            </p>
        </div>
    )
}

export default CalibrationAttributesExplained;
