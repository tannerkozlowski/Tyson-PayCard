import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import history from 'browserHistory';
import './style.scss';

class InfoModal extends Component {
  onClickOK = () => {
    this.props.onClick();
  };

  onClickCancel = () => {
    this.props.onClick();
  };

  render() {
    const { show } = this.props;
    return (
      <Modal show={show} onHide={this.onClickCancel} dialogClassName="info-modal">
        <Modal.Header>
          <Modal.Body>
            <div className="info-modal__content">
              <div className="info-modal__label">
                An active Pay card already exists for the employee
              </div>
              <Button onClick={this.onClickOK} className="info-modal__button">
                Ok
              </Button>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    );
  }
}

InfoModal.propTypes = {
  show: PropTypes.bool
};

InfoModal.defaultProps = {
  show: false
};

export default InfoModal;
