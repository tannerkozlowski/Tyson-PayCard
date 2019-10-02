import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import paycardBackground from 'assets/images/paycardBackground.jpg';
import tysonLogo from 'assets/images/Tyson_Logo_H_White.svg';

import './style.scss';

class Header extends Component {
  handleLogOutClick() {
    console.log('LOG OUT button clicked');
  }

  render() {
    return (
      <div className="main-header" style={{ backgroundImage: `url(${paycardBackground}` }}>
        <div className="main-header__wrapper">
          <img src={tysonLogo} className="main-header__image" alt="logoImage" />
          <Button className="main-header__button" onClick={this.handleLogOutClick} variant="link">
            LOG OUT
          </Button>
        </div>
      </div>
    );
  }
}

export default Header;
