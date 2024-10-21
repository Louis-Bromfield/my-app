import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './HomeProblemPreview.css';
import IndividualHomeProblemPreview from './IndividualHomeProblemPreview';


function HomeProblemPreview(props) {
    const [openRaces, setOpenRaces] = useState([]);
    const [closedRaces, setClosedRaces] = useState([]);

    useEffect(() => {
        console.log("HomeProblemPreviewUE");
        getProblemData();
    }, []);

    const getProblemData = async () => {
        try {
            // const forecastData = await axios.get(`${process.env.REACT_APP_API_CALL_F}`);
            const forecastData = await axios.get(`http://localhost:8000/forecasts`);
            let openRaces = [];
            let closedRaces = [];
            for (let i = 0; i < forecastData.data.length; i++) {
                if (forecastData.data[i].isClosed === false) {
                    openRaces.push(forecastData.data[i]);
                } else if (forecastData.data[i].isClosed === true) {
                    closedRaces.push(forecastData.data[i]);
                };
            };
            setOpenRaces(openRaces.reverse());
            setClosedRaces(closedRaces.reverse());
        } catch (error) {
            console.error("Error in HomeProblemPreview > getProblemData");
            console.error(error);
        };
    };

    // Moving row design
    // return (
    //     <div className="home-problem-preview">
    //         <div className="ticker-wrap">
    //             <div className="ticker">
    //                 {problemData.length !== 0 ? problemData.map((item, index) => {
    //                     return (
    //                         <div className="ticker-item">
    //                             <IndividualHomeProblemPreview 
    //                                 data={item}
    //                                 index={index}
    //                             />
    //                         </div>
    //                     )
    //                 }) : null}
    //                 {problemData.length !== 0 ? problemData.map((item, index) => {
    //                     return (
    //                         <div className="ticker-item">
    //                             <IndividualHomeProblemPreview 
    //                                 data={item}
    //                                 index={index}
    //                             />
    //                         </div>
    //                     )
    //                 }) : null}
    //                 {problemData.length !== 0 ? problemData.map((item, index) => {
    //                     return (
    //                         <div className="ticker-item">
    //                             <IndividualHomeProblemPreview 
    //                                 data={item}
    //                                 index={index}
    //                             />
    //                         </div>
    //                     )
    //                 }) : null}
    //             </div>
    //         </div>
    //     </div>
    // )

    // Column design
    return (
        <div className="home-problem-preview">
            <h2 className="home-button-large-title">{props.isTop === true ? "Live Races" : "Closed Races"}</h2>
            <div className="ticker-wrap">
                <div className="ticker">
                    {(props.isTop === true && openRaces.length !== 0) ? openRaces.map((item, index) => {
                        // if (new Date() > new Date(item.closeDate)) {
                            return (
                                <div className="ticker-item">
                                    <IndividualHomeProblemPreview 
                                        data={item}
                                        index={index}
                                    />
                                </div>
                            )
                        // }
                    }) : null}
                    {(props.isTop === false && closedRaces.length !== 0) ? closedRaces.map((item, index) => {
                        // if (new Date() > new Date(item.closeDate)) {
                            return (
                                <div className="ticker-item">
                                    <IndividualHomeProblemPreview 
                                        data={item}
                                        index={index}
                                    />
                                </div>
                            )
                        // }
                    }) : null}
                    </div>
                </div>
        </div>
    )
}

export default HomeProblemPreview;