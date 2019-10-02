import React from 'react';
import './style.scss';

const InfoRow = props => {
  if (props.userInput) {
    return (
      <div className="inforow">
        <p className="inforow__label">{props.keyValue}</p>
        <input
          className="inforow__input"
          type="text"
          defaultValue={props.objectValue}
          name="paycardID"
        />
      </div>
    );
  }

  return (
    <div className="inforow">
      <p className="inforow__label">{props.keyValue}</p>
      <p className="inforow__value">{props.objectValue}</p>
    </div>
  );
};

export default InfoRow;
