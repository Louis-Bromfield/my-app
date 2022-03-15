import React from 'react';
import './ChangeLog.css';

function ChangeLog() {
    const changeLogArr = [
        `15.03.2022 Added the change log!`,
        `14.03.2022 Added a Forecast Analysis page. Now, when a problem closes, users have the ability to see more detailed feedback on their performance based on three dimensions of Reactiveness, Confidence and Timeliness. To see this, select any closed problem and then click the "Open Forecast Analysis Page" button.`,
        `07.03.2022 Backend code fixes.`,
        `04.03.2022 Created and added a new video explaining forecast scoring.`,
        `28.02.2022 Comments made while forecasting are now visible by hovering over the data in the problem's Line Chart - they are still anonymous.`,
        `18.02.2022 Scrapped the old Average Certainty calculator (which calculated and plotted the average of each day) and replaced it with a global average.`,
    ];

    return (
        <div className="change-log">
            <h1>Change Log</h1>
            <p>Here you'll find a list of short summaries explaining the work that's been going on to update Fantasy Forecast. New additions, removals, tweaks, bug-fixes and much more will be documented here.</p>
            <div className="change-log-full-list">
                {changeLogArr.map((item, index) => {
                    return (
                        <div key={item} className="full-list-item">
                            <h4 style={{ color: "#404d72"}}>{item.slice(0, 10)}</h4>
                            <h4>{item.slice(11, item.length)}</h4>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChangeLog;