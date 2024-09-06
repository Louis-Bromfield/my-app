import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './HomeProblemPreview.css';
import IndividualHomeProblemPreview from './IndividualHomeProblemPreview';


function HomeProblemPreview(props) {
    const [problemData, setProblemData] = useState([]);


    useEffect(() => {
        console.log("HomeProblemPreviewUE");
        getProblemData();
    }, []);

    const getProblemData = async () => {
        try {
            const forecastData = await axios.get(`${process.env.REACT_APP_API_CALL_F}`);
            // const forecastData = await axios.get(`http://localhost:8000/forecasts`);
            setProblemData(forecastData.data);
        } catch (error) {
            console.error("Error in HomeProblemPreview > getProblemData");
            console.error(error);
        };
    };

    return (
        <div className="home-problem-preview">
            <div className="ticker-wrap">
                <div className="ticker">
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                    {problemData.length !== 0 ? problemData.map((item, index) => {
                        return (
                            <div className="ticker-item">
                                <IndividualHomeProblemPreview 
                                    data={item}
                                    index={index}
                                />
                            </div>
                        )
                    }) : null}
                </div>
            </div>
        </div>
    )
}

export default HomeProblemPreview;