import React from 'react';
import { Link } from 'react-router-dom';
import './HomeChangeLogPreview.css';

function HomeChangeLogPreview() {
    const changeLogArr = [
        `21.03.2022 Changed the boosting to individual scores from 5% for 2, 6% for 3, 7% for 4 and so on to just a flat 5% boost. This was done to keep the top performers still within touching distance, while still providing a good reward for performance. Infinite scaling might have become unreasonable.`,
        `21.03.2022 Replaced the market name with just "Macron" when the "Articles" button is selected on the weekly problem. Using the market name was causing issues but just "Macron" is working`,
        `15.03.2022 Added the change log!`,
        `14.03.2022 Added a Forecast Analysis page. Now, when a problem closes, users have the ability to see more detailed feedback on their performance based on three dimensions of Reactiveness, Confidence and Timeliness. To see this, select any closed problem and then click the "Open Forecast Analysis Page" button.`,
        `07.03.2022 Backend code fixes.`,
        `04.03.2022 Created and added a new video explaining forecast scoring.`,
        `28.02.2022 Comments made while forecasting are now visible by hovering over the data in the problem's Line Chart - they are still anonymous.`,
        `18.02.2022 Scrapped the old Average Certainty calculator (which calculated and plotted the average of each day) and replaced it with a global average.`,
    ];

    return (
        <div className="home-button-small">
            <h2 className="home-button-small-title">Fantasy Forecast Change Log</h2>
            <div className="change-log-list">
                {changeLogArr.map((item, index) => {
                    if (index <= 2) {
                        if (item.length <= 70) {
                            return (
                                <span key={item} className="list-span">
                                    <h4 style={{ color: "#404d72"}}>{item.slice(0, 10)}</h4>
                                    <h4>{item.slice(11, item.length)}</h4>
                                </span>
                            )
                        } else return (
                            <span key={item} className="list-span">
                                <h4 style={{ color: "#404d72"}}>{item.slice(0, 10)}</h4>
                                <h4>{item.slice(11, 70)}...</h4>
                            </span>
                        )
                    } else return null;
                })}
            </div>
            <Link 
                className="home-button-nav-button"
                to="/change-log">
                    See the full Change Log
            </Link>
        </div>
    )
}

export default HomeChangeLogPreview;