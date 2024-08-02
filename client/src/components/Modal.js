import React from 'react';
import './Modal.css';
import FFLogo from '../media/Icon.png';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <img src={FFLogo} alt="" />
        <h3>{children}</h3>
        <button type="button" onClick={handleClose} className="close-modal-btn">
            Close
        </button>
      </section>
    </div>
  );
};

export default Modal;
