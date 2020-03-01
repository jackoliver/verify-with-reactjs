import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AuthService from '../Authentication/AuthService';
import { LOGIN_OPTIONS } from '../Authentication/LoginOptionsConfig';

export class LoginModal extends React.Component {
  componentDidUpdate(){
    if(this.props.show){
      new AuthService(LOGIN_OPTIONS[this.props.loginOption].AcrValues, "LoginIframe").signinPopup();
    }
  }

  render(){
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Loig in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe width="100%" height="500px" name="LoginIframe" title="Login" frameBorder="0" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
          </Modal.Footer> 
        </Modal>
      </>
    );
  }
}