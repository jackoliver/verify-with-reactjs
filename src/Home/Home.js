import React from 'react';
import './Home.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropDown from '../Shared/CustomDropDown';
import AuthService from '../Authentication/AuthService';
import { AuthConsumer } from '../Authentication/AuthProvider';
import { LOGIN_OPTIONS } from '../Authentication/LoginOptionsConfig';
import { LoginModal } from './LoginModal';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenOption: -1,
      loginDisplayOption: "redirect",
      showLogin: false
    };
  }

  onSelect = (eventKey) => {
    this.setState({ chosenOption: eventKey });
  }

  onIframeLoginSuccess = () => {
    this.setState({ showLogin: false });
    window.removeEventListener("LoginSuccess", this.onIframeLoginSuccess);
  }

  onPopupLoginSuccess = () => {
    this.forceUpdate();
    window.removeEventListener("LoginSuccess", this.onPopupLoginSuccess);
  }

  onLoginClick = () => {
    if(this.state.loginDisplayOption === "redirect"){
      new AuthService(LOGIN_OPTIONS[this.state.chosenOption].AcrValues).signinRedirect();
    } else if(this.state.loginDisplayOption === "iframe"){
      this.setState({ showLogin: true });
      window.addEventListener("LoginSuccess", this.onIframeLoginSuccess);
    } else if(this.state.loginDisplayOption === "popup"){
      new AuthService(LOGIN_OPTIONS[this.state.chosenOption].AcrValues, "_blank").signinPopup();
      window.addEventListener("LoginSuccess", this.onPopupLoginSuccess);
    }
  }

  handleCloseLoginModal = () => {
    this.setState({ showLogin: false });
  }

  loadUserDetails = () => {
    window.location.replace("/UserDetails");
  }

  setLoginDisplayOption = (loginDisplayOption) => {
    this.setState({ loginDisplayOption: loginDisplayOption });
  }

  render() {
    return (
      <AuthConsumer>
        {({ isAuthenticated, logout }) => {
          return(
            isAuthenticated() ?
            <div className="Home">
              <h1 className="welcome">
                Hello { 
                        JSON.parse(
                          sessionStorage.getItem(
                            `oidc.user:${ process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY }:${ process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID }`
                          )
                        ).profile.name 
                      }!
              </h1>
              <Button variant="outline-primary" className="button" onClick={ this.loadUserDetails }>User Details</Button>
              <Button variant="primary" className="button" onClick={ logout }>Log out</Button>
            </div>
            :
            <div className="Home">
              <h1 className="welcome">Welcome to Criipto Demo App for React</h1>
              <div>
                <DropDown chosenOption={ this.state.chosenOption } onSelect={ this.onSelect } />
                <ButtonGroup className="buttonGroup">
                  <Button 
                    variant="outline-secondary"
                    active={ this.state.loginDisplayOption === "redirect" ? true : false }
                    disabled={ this.state.chosenOption === -1 }
                    onClick={ () => { this.setLoginDisplayOption("redirect") }}
                  >
                    Redirect
                  </Button>
                  <Button
                    variant="outline-secondary"
                    active={ this.state.loginDisplayOption === "popup" ? true : false }
                    disabled={ this.state.chosenOption !== -1 ? !LOGIN_OPTIONS[this.state.chosenOption].isForIFrame : true }
                    onClick={ () => { this.setLoginDisplayOption("popup") }} 
                  >
                    Popup
                  </Button>
                  <Button
                    variant="outline-secondary"
                    active={ this.state.loginDisplayOption === "iframe" ? true : false }
                    disabled={ this.state.chosenOption !== -1 ? !LOGIN_OPTIONS[this.state.chosenOption].isForIFrame : true }
                    onClick={ () => { this.setLoginDisplayOption("iframe") }} 
                  >
                    iframe
                  </Button>
                </ButtonGroup><br/>
                <Button 
                  variant="outline-primary"
                  className="button"
                  onClick={ this.onLoginClick }
                  disabled={ this.state.chosenOption === -1 }
                >
                  Log in
                </Button>
              </div>
              <LoginModal 
                show={ this.state.showLogin }
                handleClose={ this.handleCloseLoginModal }
                loginOption={ this.state.chosenOption } 
              />
            </div>
          );
        }}
      </AuthConsumer>
    );
  }
}

export default Home;