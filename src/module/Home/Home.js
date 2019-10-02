import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import InfoRow from 'components/InfoRow';
import InfoModal from 'components/InfoModal';
import magnifyingGlass from 'assets/images/magnifying_glass.png';

import './style.scss';

class App extends Component {
  constructor() {
    super();

    this.state = {
      employeeID: '',
      employeeInfo: {},
      paymentOption: 'replace', // it can be "replace" or "add"
      fixedAmount: '',
      expanded: null,
      isModal: false
    };
  }

  handleEmployeeId = evt => {
    this.setState({ employeeID: evt.target.value });
  };

  handleSearchClick = () => {
    axios
      .get('https://api.myjson.com/bins/18r471')
      // .get(`https://getWorkDayPayCardDetailsForEmployee?Employee_Id=${this.state.employeeID}`)
      .then(response => {
        this.setState({
          expanded: response.data.activePayCardExists === 'Y' ? false : true,
          employeeInfo: response.data
        });
      })
      .catch(err => {
        console.error('api error: ', err);
      });
  };

  onSwitchPaymentOption = evt => {
    this.setState({ paymentOption: evt.target.value });
  };

  onChangeFixedAmount = evt => {
    this.setState({ fixedAmount: evt.target.value });
  };

  renderEmployeeSearch() {
    const { employeeID } = this.state;

    return (
      <div className="home-paycardbox__searchbox">
        <p className="home-paycardbox__searchbox-label">Employee ID</p>
        <input
          className="home-paycardbox__searchbox-input"
          type="text"
          onChange={this.handleEmployeeId}
          value={employeeID}
          name="paycardID"
        />
        <Button
          className="home-paycardbox__searchbox-button"
          onClick={this.handleSearchClick}
          style={{ backgroundImage: `url(${magnifyingGlass}` }}
        />
      </div>
    );
  }

  renderPaymentOptions() {
    const { paymentOption, fixedAmount } = this.state;

    return (
      <div className="pb-3">
        <div className="pb-2">There is an existing payment method assigned to this employee.</div>
        <div>
          <label>
            <input
              type="radio"
              value="replace"
              checked={paymentOption === 'replace'}
              onChange={this.onSwitchPaymentOption}
            />
            <span className="pl-2">Replace existing payment method with Pay Card</span>
          </label>
          <label>
            <input
              type="radio"
              value="add"
              checked={paymentOption === 'add'}
              onChange={this.onSwitchPaymentOption}
            />
            <span className="px-2">Add fixed amount to Pay Card</span>
            <input
              className="inforow__input"
              type="number"
              value={fixedAmount}
              onChange={this.onChangeFixedAmount}
              placeholder="$0"
              disabled={paymentOption === 'replace'}
            />
          </label>
        </div>
      </div>
    );
  }

  renderEmployeeInfo() {
    const {
      firstName,
      lastName,
      middleInitial,
      homeAddress1,
      homeAddress2,
      city,
      state,
      country,
      postalCode,
      dob,
      homePhone,
      ssn,
      paymentMethodExisting
    } = this.state.employeeInfo;

    return (
      <div>
        <InfoRow keyValue="Paycard ID" objectValue="9999" userInput={true} />
        {paymentMethodExisting && this.renderPaymentOptions()}
        <InfoRow keyValue="Employee ID" objectValue="00251277" />
        <InfoRow keyValue="Cert Card ID" objectValue="********6389" />
        <InfoRow keyValue="Full Name" objectValue={`${firstName} ${middleInitial} ${lastName}`} />
        <InfoRow keyValue="Country/Region" objectValue={country} />
        <InfoRow keyValue="Home Address" objectValue={homeAddress1} />
        <InfoRow keyValue="Home Address 2" objectValue={homeAddress2} />
        <InfoRow keyValue="City" objectValue={city} />
        <InfoRow keyValue="State" objectValue={state} />
        <InfoRow keyValue="ZIP/Postal Code" objectValue={postalCode} />
        <InfoRow
          keyValue="Date of Birth"
          objectValue={`${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6, 8)}`}
        />
        <InfoRow keyValue="SSN" objectValue={`*** ** ${ssn.slice(5, 9)}`} />
        <InfoRow keyValue="Home Phone" objectValue={`${homePhone.slice(2)}`} />
        <InfoRow keyValue="Work State from 208" objectValue="Arkansas" />
        <div className="home-paycardbox__bottom">
          <Button className="home-paycardbox__button">CANCEL</Button>
          <Button className="home-paycardbox__button">SUBMIT</Button>
        </div>
      </div>
    );
  }

  onCloseModal = () => {
    this.setState({ expanded: null });
  };

  renderInfoModal() {
    return <InfoModal show={!this.state.expanded} onClick={this.onCloseModal} />;
  }

  render() {
    const { expanded } = this.state;

    return (
      <div className="home-paycardbox">
        <h1 className="home-paycardbox__title">Pay Card</h1>
        {expanded === null && this.renderEmployeeSearch()}
        {expanded === true && this.renderEmployeeInfo()}
        {expanded === false && this.renderInfoModal()}
      </div>
    );
  }
}

export default App;
