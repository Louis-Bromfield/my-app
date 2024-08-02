import React from 'react';
import './TopicsMenu.css';
import PropTypes from 'prop-types';

function TopicsMenu(props) {
    return (
        <div className="topics-menu">
            <h2>Topics</h2>
            <ul className="topics-list">
                {props.topic === props.topicsArray[0] && <li className="selected-topic" onClick={() => props.handleClick(props.topicsArray[0])}><h4>{props.topicsArray[0]}</h4></li>}
                {props.topic !== props.topicsArray[0] && <li onClick={() => props.handleClick(props.topicsArray[0])}><h4>{props.topicsArray[0]}</h4></li>}
                {props.topic === props.topicsArray[1] && <li className="selected-topic" onClick={() => props.handleClick(props.topicsArray[1])}><h4>{props.topicsArray[1]}</h4></li>}
                {props.topic !== props.topicsArray[1] && <li onClick={() => props.handleClick(props.topicsArray[1])}><h4>{props.topicsArray[1]}</h4></li>}
                {props.topic === props.topicsArray[2] && <li className="selected-topic" onClick={() => props.handleClick(props.topicsArray[2])}><h4>{props.topicsArray[2]}</h4></li>}
                {props.topic !== props.topicsArray[2] && <li onClick={() => props.handleClick(props.topicsArray[2])}><h4>{props.topicsArray[2]}</h4></li>}
                {props.topic === props.topicsArray[3] && <li className="selected-topic" onClick={() => props.handleClick(props.topicsArray[3])}><h4>{props.topicsArray[3]}</h4></li>}
                {props.topic !== props.topicsArray[3] && <li onClick={() => props.handleClick(props.topicsArray[3])}><h4>{props.topicsArray[3]}</h4></li>}
                {props.topic === props.topicsArray[4] && <li className="selected-topic" onClick={() => props.handleClick(props.topicsArray[4])}><h4>{props.topicsArray[3]}</h4></li>}
                {props.topic !== props.topicsArray[4] && <li onClick={() => props.handleClick(props.topicsArray[3])}><h4>{props.topicsArray[4]}</h4></li>}
            </ul>
        </div>
    )
}

export default TopicsMenu;


TopicsMenu.propTypes = {
    handleClick: PropTypes.func.isRequired
};